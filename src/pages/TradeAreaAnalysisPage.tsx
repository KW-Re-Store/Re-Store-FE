import { Link } from "react-router-dom";

import chevronDownIcon from "../assets/icons/chevron-down.svg";
import dataExportIcon from "../assets/icons/data-export.svg";
import buildingIcon from "../assets/icons/lucide/building.svg";
import rocketIcon from "../assets/icons/lucide/rocket.svg";
import storeIcon from "../assets/icons/lucide/store.svg";
import trendingDownIcon from "../assets/icons/lucide/trending-down.svg";
import usersIcon from "../assets/icons/lucide/users.svg";
import pdfDownloadIcon from "../assets/icons/pdf-download.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import { fetchTradeArea, type TradeAreaResponse } from "../api/client";
import ApiStatus from "../components/ApiStatus";
import FilterDisplay from "../components/FilterDisplay";
import GlyphIcon from "../components/GlyphIcon";
import Icon from "../components/Icon";
import LineChart from "../components/LineChart";
import NowonRiskMap from "../components/NowonRiskMap";
import { useFilters } from "../context/FilterContext";
import { useApi } from "../hooks/useApi";
import { useRiskAreas } from "../hooks/useRiskAreas";
import { arrow, formatNumber, niceTicks, toneOf } from "../utils/format";
import { downloadCsv } from "../utils/download";

const DEFAULT_DISTRICT = "상계10동";

const seriesColors: Record<string, string> = {
  closureRate: "#fa342c",
  salesChangeRate: "#217cf9",
  footTrafficChangeRate: "#42c593",
  startupChangeRate: "#a855f7"
};

const industryColors = ["#217cf9", "#ff6600", "#42c593", "#a855f7", "#64748b"];

const causeStyles: Record<string, { icon: string; color: string }> = {
  footTraffic: { icon: usersIcon, color: "#fa342c" },
  sales: { icon: trendingDownIcon, color: "#ff6600" },
  vacancy: { icon: buildingIcon, color: "#eab308" },
  startup: { icon: rocketIcon, color: "#217cf9" },
  overcrowding: { icon: storeIcon, color: "#a855f7" }
};

const commercialTypeColors: Record<string, string> = {
  "주거지 상권": "#42c593",
  "골목 상권": "#ff6600",
  "역세권 상권": "#217cf9"
};

function industryGradient(industries: TradeAreaResponse["industries"]) {
  let acc = 0;
  const stops = industries.map((item, index) => {
    const start = acc;
    acc += item.share;
    return `${industryColors[index % industryColors.length]} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

function TradeAreaAnalysisPage() {
  const { dong, setDong } = useFilters();
  const district = !dong || dong === "전체 행정동" ? DEFAULT_DISTRICT : dong;
  const riskAreas = useRiskAreas();
  const { data, error, loading } = useApi((signal) => fetchTradeArea(district, signal), [district]);

  const overview = data?.overview;
  const trendValues = data?.trend.series.flatMap((series) => series.values) ?? [0];

  const exportCsv = () => {
    if (!data) return;
    const rows: (string | number)[][] = [
      ["구분", "항목", "값"],
      ["개요", "행정동", data.overview.districtName],
      ["개요", "위험등급", data.overview.riskGrade],
      ["개요", "위험지수", data.overview.riskScore],
      ...data.overview.indicators.map((item) => ["지표", item.label, `${item.value}${item.unit}`]),
      ["현황", "점포 수", data.status.storeCount],
      ["현황", "유동인구(일평균)", data.status.dailyFootTraffic],
      ...data.industries.map((item) => ["업종", item.label, `${item.storeCount}개 (${item.share}%)`]),
      ...data.causes.map((item) => ["원인 기여도", item.label, item.score])
    ];
    downloadCsv(`상권분석_${data.overview.districtName}.csv`, rows);
  };

  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>상권 분석</h1>
          <p>선택한 행정동의 상권 현황과 폐업 원인을 분석하고 인사이트를 제공합니다.</p>
          <ApiStatus loading={loading} error={error} />
        </div>
        <div className="filters">
          <FilterDisplay editable />
          <button className="profile" type="button">
            <span>
              <Icon src={userHomeIcon} alt="" />
            </span>
            <span>
              <b>노원구청</b>
            </span>
            <Icon src={chevronDownIcon} alt="" />
          </button>
        </div>
      </header>

      {!data ? (
        <div className="empty-state">{error ? `상권 분석 데이터를 불러오지 못했습니다. (${error})` : "상권 분석 데이터를 불러오는 중…"}</div>
      ) : (
        <div className="ta-body">
          <div className="ta-row">
            <article className="ta-card ta-card--fit">
              <div className="ta-overview-head">
                <div className="ta-overview-title">
                  <h3>{overview!.districtName} 상권 개요</h3>
                  <span className={`ta-badge-risk grade-${overview!.riskGrade}`}>{overview!.riskGrade}</span>
                </div>
                <span className="ta-overview-sub">
                  노원구 내 위험도 {overview!.rank}위 ({overview!.totalDistricts}개 동 중)
                </span>
              </div>
              <div className="ta-overview-body">
                <div className={`ta-risk-block grade-${overview!.riskGrade}`}>
                  <span className="label">상권 위험지수</span>
                  <div className="value">
                    {overview!.riskScore}
                    <small>/100</small>
                  </div>
                  <span className="delta">전년도 대비 {arrow(overview!.riskScoreChange, "점")}</span>
                </div>
                <div className="ta-stat-grid">
                  {overview!.indicators.map((stat) => (
                    <div className="ta-stat-cell" key={stat.key}>
                      <span>{stat.label}</span>
                      <strong>
                        {stat.value}
                        {stat.unit}
                      </strong>
                      <small className={toneOf(stat.change)}>{arrow(stat.change, stat.changeUnit)}</small>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="ta-card ta-card--flush ta-card--fit">
              <div className="ta-card-header">상권 현황</div>
              <div className="ta-status-body">
                <div className="ta-status-map">
                  <NowonRiskMap
                    key={district}
                    areas={riskAreas}
                    initialSelected={district}
                    showDetail={false}
                    onSelect={setDong}
                  />
                  <div className="ta-status-legend">
                    <strong>위험등급</strong>
                    <div>
                      <i style={{ background: "#fc6a66" }} /> 고위험
                    </div>
                    <div>
                      <i style={{ background: "#ff9364" }} /> 주의
                    </div>
                    <div>
                      <i style={{ background: "#eeeff1" }} /> 데이터 없음
                    </div>
                  </div>
                </div>
                <div className="ta-status-stats">
                  <div>
                    <span>상권 유형</span>
                    <strong className="ta-type">
                      <i style={{ background: commercialTypeColors[data.status.commercialType] ?? "#94a3b8" }} />
                      {data.status.commercialType}
                    </strong>
                  </div>
                  <div>
                    <span>면적</span>
                    <strong>{data.status.areaKm2}km²</strong>
                  </div>
                  <div>
                    <span>점포 수</span>
                    <strong>{formatNumber(data.status.storeCount)}개</strong>
                  </div>
                  <div>
                    <span>유동인구 (일평균)</span>
                    <strong>{formatNumber(data.status.dailyFootTraffic)}명</strong>
                  </div>
                  <div>
                    <span>주요 업종</span>
                    <strong>{data.status.mainIndustries.join(", ")}</strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="ta-card">
              <h3 className="ta-trend-title">주요 지표 추이</h3>
              <LineChart
                series={data.trend.series.map((series) => ({
                  label: series.label,
                  color: seriesColors[series.key] ?? "#64748b",
                  values: series.values
                }))}
                xLabels={data.trend.quarters}
                yTicks={niceTicks(trendValues)}
                height={354}
              />
            </article>
          </div>

          <div className="ta-row">
            <article className="ta-card ta-card--fit">
              <div className="ta-card-title-row">
                <h3>업종 분석</h3>
                <span className="ta-select">
                  업종 대분류 기준 <Icon src={chevronDownIcon} alt="" />
                </span>
              </div>
              <div className="ta-industry-body">
                <div className="ta-donut" style={{ background: industryGradient(data.industries) }}>
                  <div className="ta-donut-inner">
                    <strong>전체 점포</strong>
                    <span>{formatNumber(data.status.storeCount)}개</span>
                  </div>
                </div>
                <div className="ta-industry-legend">
                  {data.industries.map((item, index) => (
                    <div className="ta-industry-row" key={item.label}>
                      <span className="name">
                        <i className="dot" style={{ background: industryColors[index % industryColors.length] }} /> {item.label}
                      </span>
                      <span>{formatNumber(item.storeCount)}개</span>
                      <span>{item.share}%</span>
                      <span className={toneOf(item.changeRate)}>{arrow(item.changeRate, "%")}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn-block-outline" type="button" onClick={exportCsv}>
                업종 데이터 내려받기 ›
              </button>
            </article>

            <article className="ta-card ta-card--fit">
              <h3>
                원인 분석 <span className="ta-muted">(상위 주요 요인)</span>
              </h3>
              <div className="ta-cause-list">
                {data.causes.map((cause) => {
                  const style = causeStyles[cause.key] ?? { icon: usersIcon, color: "#64748b" };
                  return (
                    <div className="ta-cause-row" key={cause.key}>
                      <span className="ta-cause-icon" style={{ background: `${style.color}1a` }}>
                        <GlyphIcon src={style.icon} color={style.color} size={20} />
                      </span>
                      <div className="ta-cause-main">
                        <div className="ta-cause-top">
                          <strong>{cause.label}</strong>
                          <span style={{ color: style.color }}>{cause.score}점</span>
                        </div>
                        <div className="ta-cause-bar">
                          <i style={{ width: `${cause.score}%`, background: style.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="note">* 영향도는 상권 위험지수에 미치는 기여도를 100점 기준으로 산정</p>
            </article>

            <article className="ta-card ta-insight-card">
              <h3>인사이트 요약</h3>
              <div className="ta-insight-list">
                {data.insights.map((insight) => (
                  <div className="ta-insight-item" key={insight}>
                    <span className="ta-check">✓</span>
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
              <Link className="btn-primary-block" to="/정책추천">
                {overview!.districtName} 정책 추천 보기 →
              </Link>
            </article>
          </div>

          <div className="action-row action-row--bottom">
            <button className="btn-outline" type="button" onClick={() => window.print()}>
              <Icon src={pdfDownloadIcon} alt="" /> PDF 보고서 다운로드
            </button>
            <button className="btn-outline" type="button" onClick={exportCsv}>
              <Icon src={dataExportIcon} alt="" /> 데이터 내보내기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default TradeAreaAnalysisPage;
