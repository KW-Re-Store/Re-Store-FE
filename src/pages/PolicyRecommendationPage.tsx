import { useEffect, useMemo, useState } from "react";

import chevronDownIcon from "../assets/icons/chevron-down.svg";
import chartColumnIcon from "../assets/icons/lucide/chart-column.svg";
import clipboardListIcon from "../assets/icons/lucide/clipboard-list.svg";
import handshakeIcon from "../assets/icons/lucide/handshake.svg";
import hardHatIcon from "../assets/icons/lucide/hard-hat.svg";
import laptopIcon from "../assets/icons/lucide/laptop.svg";
import megaphoneIcon from "../assets/icons/lucide/megaphone.svg";
import storeIcon from "../assets/icons/lucide/store.svg";
import usersIcon from "../assets/icons/lucide/users.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import { fetchRecommendations, fetchSimulation, type RecommendedPolicy } from "../api/client";
import ApiStatus from "../components/ApiStatus";
import FilterDisplay from "../components/FilterDisplay";
import GlyphIcon from "../components/GlyphIcon";
import Icon from "../components/Icon";
import LineChart from "../components/LineChart";
import { useFilters } from "../context/FilterContext";
import { useApi } from "../hooks/useApi";
import { formatNumber, niceTicks, signed } from "../utils/format";

const DEFAULT_DISTRICT = "상계10동";

const policyIcons: Record<string, string> = {
  megaphone: megaphoneIcon,
  users: usersIcon,
  "hard-hat": hardHatIcon,
  laptop: laptopIcon,
  handshake: handshakeIcon,
  "clipboard-list": clipboardListIcon,
  store: storeIcon,
  "chart-column": chartColumnIcon
};

const rankColors = ["#217cf9", "#42c593", "#ff6600", "#0ea5e9", "#a855f7", "#64748b", "#64748b", "#64748b"];

const relatedIcons = [clipboardListIcon, storeIcon, handshakeIcon];

const simulationColors: Record<string, string> = {
  salesIncreaseRate: "#42c593",
  footTrafficIncreaseRate: "#217cf9",
  survivalRateImprovement: "#a855f7",
  closureRate: "#fa342c"
};

/** 감소가 좋은 지표(폐업률·공실률)는 파란색으로 강조 */
const isReduction = (key: string) => key === "closureRate" || key === "vacancyRate";

function renderStars(rating: number) {
  const filled = Math.round(rating);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

function comboOptions(policies: RecommendedPolicy[]) {
  const top = policies.slice(0, 4);
  const options: { label: string; ids: string[] }[] = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      options.push({ label: `TOP ${i + 1} + TOP ${j + 1} 조합`, ids: [top[i].id, top[j].id] });
    }
  }
  top.forEach((policy, index) => options.push({ label: `TOP ${index + 1} 단독`, ids: [policy.id] }));
  if (top.length > 2) options.push({ label: `TOP 1~${top.length} 전체`, ids: top.map((policy) => policy.id) });
  return options;
}

function PolicyRecommendationPage() {
  const { dong } = useFilters();
  const district = !dong || dong === "전체 행정동" ? DEFAULT_DISTRICT : dong;
  const [limit, setLimit] = useState(4);
  const [comboKey, setComboKey] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const recommendation = useApi((signal) => fetchRecommendations(district, limit, signal), [district, limit]);
  const policies = recommendation.data?.recommendations ?? [];
  const combos = useMemo(() => comboOptions(policies), [policies]);

  // 행정동이 바뀌면 기본 조합(TOP1 + TOP2)으로 되돌린다
  useEffect(() => setComboKey(""), [district]);

  const selectedIds = combos.find((combo) => combo.ids.join(",") === comboKey)?.ids ?? combos[0]?.ids ?? [];
  const simulationApi = useApi(
    (signal) => (selectedIds.length ? fetchSimulation(selectedIds, signal) : Promise.resolve(null)),
    [selectedIds.join(",")]
  );
  const simulation = simulationApi.data ?? recommendation.data?.simulation ?? null;
  const simValues = simulation?.series.flatMap((series) => series.values) ?? [0];

  const error = recommendation.error ?? simulationApi.error;

  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>정책 추천</h1>
          <p>분석 결과를 기반으로 상권의 문제를 해결하기 위한 맞춤형 정책을 추천합니다.</p>
          <ApiStatus loading={recommendation.loading} error={error} />
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

      {!recommendation.data ? (
        <div className="empty-state">{error ? `정책 추천 데이터를 불러오지 못했습니다. (${error})` : "정책 추천을 계산하는 중…"}</div>
      ) : (
        <div className="pr-layout">
          <div className="pr-left">
            <article className="pr-sim-card">
              <div className="pr-sim-head">
                <h3>
                  추천 정책 효과 시뮬레이션 <span>(추정치)</span>
                </h3>
                <span className="pr-sim-target">
                  {recommendation.data.districtName} · {recommendation.data.causeType}
                </span>
              </div>
              <div className="pr-sim-combo">
                <div className="pr-sim-combo-left">
                  <span className="pr-sim-combo-label">추천 정책 조합</span>
                  <label className="pr-sim-combo-select">
                    <select
                      value={selectedIds.join(",")}
                      onChange={(event) => setComboKey(event.target.value)}
                      aria-label="추천 정책 조합 선택"
                    >
                      {combos.map((combo) => (
                        <option key={combo.label} value={combo.ids.join(",")}>
                          {combo.label}
                        </option>
                      ))}
                    </select>
                    <Icon src={chevronDownIcon} alt="" />
                  </label>
                </div>
                {simulation && (
                  <span className="pr-sim-combo-meta">
                    총 예산 {formatNumber(simulation.totalBudgetMillionWon)}백만원 | 사업 기간 {simulation.durationMonths}개월
                  </span>
                )}
              </div>
              {simulation && (
                <>
                  <div className="pr-sim-stats">
                    {simulation.summary.map((metric) => (
                      <div className="pr-sim-stat" key={metric.key}>
                        <span>{metric.label}</span>
                        <strong className={isReduction(metric.key) ? "reduction" : ""}>{signed(metric.value, metric.unit)}</strong>
                      </div>
                    ))}
                  </div>
                  <LineChart
                    series={simulation.series.map((series) => ({
                      label: series.label,
                      color: simulationColors[series.key] ?? "#64748b",
                      values: series.values
                    }))}
                    xLabels={simulation.quarters}
                    yTicks={niceTicks(simValues, 4)}
                    height={190}
                  />
                </>
              )}
              <p className="pr-sim-note">※ 시뮬레이션은 과거 유사 사업 효과를 기반으로 추정한 값으로 실제 결과와 다를 수 있습니다.</p>
            </article>

            <article className="pr-related-card">
              <h3>관련 지원 사업 연계</h3>
              <div className="pr-related-list">
                {recommendation.data.relatedPrograms.map((program, index) => (
                  <div className="pr-related-item" key={program.id}>
                    <span className="pr-related-icon">
                      <GlyphIcon src={relatedIcons[index % relatedIcons.length]} color="#217cf9" size={18} />
                    </span>
                    <div className="pr-related-main">
                      <div className="pr-related-title-row">
                        <strong>{program.title}</strong>
                        <span className={`pr-related-status ${program.status === "연계 가능" ? "ok" : "review"}`}>{program.status}</span>
                      </div>
                      <p className="pr-related-desc">{program.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="pr-top-panel">
            <div className="pr-top-head">
              <h3>
                {recommendation.data.districtName} 맞춤 정책 추천 TOP {policies.length}
              </h3>
            </div>
            <div className="pr-card-list">
              {policies.map((policy) => {
                const color = rankColors[(policy.rank - 1) % rankColors.length];
                const inCombo = selectedIds.includes(policy.id);
                const isExpanded = expanded === policy.id;
                return (
                  <article className={`pr-policy-card${inCombo ? " in-combo" : ""}`} key={policy.id}>
                    <div className="pr-policy-icon" style={{ background: `${color}14` }}>
                      <GlyphIcon src={policyIcons[policy.icon] ?? megaphoneIcon} color={color} size={28} />
                      <span className="pr-policy-rank" style={{ background: color }}>
                        {policy.rank}
                      </span>
                    </div>
                    <div className="pr-policy-main">
                      <div className="pr-policy-top">
                        <div>
                          <span className="pr-policy-category" style={{ color }}>
                            {policy.category}
                            {policy.matchesCause && <em className="pr-match">원인 맞춤</em>}
                            {inCombo && <em className="pr-in-combo">시뮬레이션 포함</em>}
                          </span>
                          <h4 className="pr-policy-title">{policy.title}</h4>
                        </div>
                        <div className="pr-policy-rating">
                          <span className="rating-label">정책 효과 기대도</span>
                          <span className="stars">{renderStars(policy.rating)}</span>
                          <span className="score">({policy.rating.toFixed(1)}/5)</span>
                        </div>
                      </div>
                      <p className="pr-policy-desc">{policy.description}</p>
                      {isExpanded && (
                        <p className="pr-policy-extra">
                          정책 ID {policy.id} · {recommendation.data!.causeType} 대응
                          {policy.matchesCause ? " (원인 유형과 직접 매칭)" : " (보완 정책)"} · 월 평균 예산{" "}
                          {Math.round(policy.budgetMillionWon / policy.durationMonths)}백만원
                        </p>
                      )}
                      <div className="pr-policy-foot">
                        {policy.metrics.map((metric) => (
                          <div className="pr-policy-metric" key={metric.key}>
                            <span>{metric.label}</span>
                            <strong className={isReduction(metric.key) ? "reduction" : ""}>{signed(metric.value, metric.unit)}</strong>
                          </div>
                        ))}
                        <div className="pr-policy-divider" />
                        <div className="pr-policy-period">
                          <div>
                            <span>사업 기간 / 예산(안)</span>
                            <strong>
                              {policy.durationMonths}개월 / {formatNumber(policy.budgetMillionWon)}백만원
                            </strong>
                          </div>
                          <button className="pr-detail-btn" type="button" onClick={() => setExpanded(isExpanded ? null : policy.id)}>
                            {isExpanded ? "접기 ‹" : "자세히 보기 ›"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <button className="pr-more-btn" type="button" onClick={() => setLimit(limit === 4 ? 8 : 4)}>
              {limit === 4 ? "더 많은 정책 보기 ⌄" : "TOP 4만 보기 ⌃"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default PolicyRecommendationPage;
