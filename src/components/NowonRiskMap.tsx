import { useMemo, useState } from "react";

import type { RiskArea } from "../api/client";
import dongs from "../data/nowon-dongs.json";

type Dong = {
  name: string;
  code: string;
  rings: [number, number][][];
};

type Props = {
  areas: RiskArea[];
  /** 처음부터 강조할 행정동 (예: 상권 분석 대상 동) */
  initialSelected?: string;
  /** 클릭 안내/상세 카드 표시 여부 */
  showDetail?: boolean;
  onSelect?: (districtName: string) => void;
};

const HEIGHT = 300;
const PADDING = 10;

const gradeColors: Record<string, { fill: string; stroke: string }> = {
  고위험: { fill: "#fc6a66", stroke: "#ca1d13" },
  주의: { fill: "#ff9364", stroke: "#e14d00" },
  관심: { fill: "#7dd47e", stroke: "#079171" }
};

const noDataColor = { fill: "#eeeff1", stroke: "#dcdee3" };

const normalize = (name: string) => name.replace(/\s/g, "").replace(/[,.]/g, "·");

function NowonRiskMap({ areas, initialSelected, showDetail = true, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(initialSelected ?? null);

  const areaByName = useMemo(() => new Map(areas.map((area) => [normalize(area.districtName), area])), [areas]);

  const shapes = useMemo(() => {
    const all = (dongs as Dong[]).flatMap((dong) => dong.rings.flat());
    const lons = all.map(([lon]) => lon);
    const lats = all.map(([, lat]) => lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
    // viewBox를 구 경계에 딱 맞춰서 어떤 크기의 박스에서도 꽉 차게 그린다
    const scale = (HEIGHT - PADDING * 2) / (maxLat - minLat);
    const width = (maxLon - minLon) * kx * scale + PADDING * 2;
    const offsetX = PADDING;
    const offsetY = PADDING;
    const project = ([lon, lat]: [number, number]) => [
      offsetX + (lon - minLon) * kx * scale,
      offsetY + (maxLat - lat) * scale
    ];

    return (dongs as Dong[]).map((dong) => {
      const points = dong.rings.map((ring) => ring.map(project));
      const flat = points.flat();
      const cx = flat.reduce((sum, [x]) => sum + x, 0) / flat.length;
      const cy = flat.reduce((sum, [, y]) => sum + y, 0) / flat.length;
      const d = points
        .map((ring) => `M${ring.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}Z`)
        .join("");
      return { ...dong, d, cx, cy, width };
    });
  }, []);

  const viewWidth = shapes[0]?.width ?? HEIGHT;

  const selectedArea = selected ? areaByName.get(normalize(selected)) : undefined;

  return (
    <div className="risk-map">
      <svg viewBox={`0 0 ${viewWidth.toFixed(0)} ${HEIGHT}`} role="img" aria-label="노원구 행정동별 상권 위험도 지도">
        {shapes.map((shape) => {
          const area = areaByName.get(normalize(shape.name));
          const color = area ? gradeColors[area.riskGrade] ?? noDataColor : noDataColor;
          const isSelected = selected === shape.name;
          return (
            <path
              key={shape.code}
              d={shape.d}
              fill={color.fill}
              fillOpacity={isSelected ? 1 : 0.78}
              stroke={isSelected ? "#1e293b" : "#ffffff"}
              strokeWidth={isSelected ? 2 : 1}
              className="risk-map__dong"
              onClick={() => {
                setSelected(isSelected ? null : shape.name);
                if (!isSelected && area) onSelect?.(area.districtName);
              }}
            >
              <title>
                {area ? `${shape.name} · ${area.riskGrade} · 위험지수 ${area.riskScore}` : `${shape.name} · 데이터 없음`}
              </title>
            </path>
          );
        })}
        {shapes.map((shape) => {
          const area = areaByName.get(normalize(shape.name));
          if (!showDetail && !area) return null;
          return (
            <text
              key={`${shape.code}-label`}
              x={shape.cx}
              y={shape.cy}
              className={`risk-map__label${area ? " has-data" : ""}`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {area ? `${shape.name} ${area.riskScore}` : shape.name}
            </text>
          );
        })}
      </svg>

      {!showDetail ? null : selectedArea ? (
        <div className="risk-map__detail">
          <strong>
            {selectedArea.districtName}
            <span className={selectedArea.riskGrade === "고위험" ? "badge danger" : "badge caution"}>
              {selectedArea.riskGrade}
            </span>
          </strong>
          <p>
            위험지수 <b>{selectedArea.riskScore}</b> · 폐업률 {selectedArea.closureRate}% · 매출 {selectedArea.salesChangeRate}%
          </p>
          <p>{selectedArea.causeType}</p>
        </div>
      ) : (
        <div className="risk-map__hint">행정동을 클릭하면 상세 지표를 볼 수 있어요</div>
      )}
    </div>
  );
}

export default NowonRiskMap;
