import { useState, type FormEvent } from "react";

import chevronDownIcon from "../assets/icons/chevron-down.svg";
import chartColumnIcon from "../assets/icons/lucide/chart-column.svg";
import folderIcon from "../assets/icons/lucide/folder.svg";
import trendingDownIcon from "../assets/icons/lucide/trending-down.svg";
import usersIcon from "../assets/icons/lucide/users.svg";
import walletIcon from "../assets/icons/lucide/wallet.svg";
import reportIcon from "../assets/icons/report.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import {
  createProgram,
  fetchManagementOverview,
  fetchPrograms,
  programStatusLabel,
  updateProgram,
  type ProgramStatus
} from "../api/client";
import ApiStatus from "../components/ApiStatus";
import FilterDisplay from "../components/FilterDisplay";
import GlyphIcon from "../components/GlyphIcon";
import Icon from "../components/Icon";
import LineChart from "../components/LineChart";
import NowonRiskMap from "../components/NowonRiskMap";
import { useApi } from "../hooks/useApi";
import { useRiskAreas } from "../hooks/useRiskAreas";
import { arrow, formatNumber, niceTicks, signed, toneOf } from "../utils/format";
import { downloadCsv } from "../utils/download";

const kpiStyles: Record<string, { icon: string; color: string; bg: string }> = {
  programs: { icon: folderIcon, color: "#4f46e5", bg: "#eef2ff" },
  budget: { icon: walletIcon, color: "#16a34a", bg: "#eef8ee" },
  closureRate: { icon: trendingDownIcon, color: "#ff6600", bg: "#fff2e5" },
  salesChangeRate: { icon: chartColumnIcon, color: "#2b7fff", bg: "#eff6fe" },
  footTrafficChangeRate: { icon: usersIcon, color: "#16a34a", bg: "#eef8ee" }
};

const trendColors: Record<string, string> = {
  survivalRate: "#217cf9",
  closureRate: "#fa342c",
  salesChangeRate: "#42c593"
};

const statusOrder: ProgramStatus[] = ["PLANNED", "IN_PROGRESS", "COMPLETED"];
const categories = ["상권 활성화", "경영 지원", "환경 개선", "디지털 전환", "업종 전환", "창업 정보", "특화 거리", "모니터링"];
const districts = ["노원구 전체", "상계10동", "상계9동", "하계1동", "상계6·7동", "월계2동", "월계1동"];

function PolicyManagementPage() {
  const riskAreas = useRiskAreas();
  const overview = useApi((signal) => fetchManagementOverview(signal), []);
  const programs = useApi((signal) => fetchPrograms(signal), []);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: categories[0], districtName: districts[1], budgetMillionWon: "" });

  const refresh = () => {
    overview.reload();
    programs.reload();
  };

  const notify = (tone: "ok" | "error", text: string) => {
    setMessage({ tone, text });
    window.setTimeout(() => setMessage(null), 2500);
  };

  const changeStatus = async (id: string, status: ProgramStatus) => {
    try {
      const updated = await updateProgram(id, { status });
      notify("ok", `'${updated.name}' 상태를 ${programStatusLabel[status]}(으)로 변경했습니다.`);
      refresh();
    } catch (err) {
      notify("error", (err as Error).message);
    }
  };

  const changeExecuted = async (id: string, value: string) => {
    const executed = Number(value);
    if (!Number.isFinite(executed)) return;
    try {
      await updateProgram(id, { executedMillionWon: executed });
      notify("ok", "집행액을 저장했습니다.");
      refresh();
    } catch (err) {
      notify("error", (err as Error).message);
      programs.reload();
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const created = await createProgram({
        name: form.name,
        category: form.category,
        districtName: form.districtName,
        budgetMillionWon: Number(form.budgetMillionWon)
      });
      notify("ok", `'${created.name}' 사업을 등록했습니다. (${created.id})`);
      setForm({ ...form, name: "", budgetMillionWon: "" });
      setShowForm(false);
      refresh();
    } catch (err) {
      notify("error", (err as Error).message);
    }
  };

  const data = overview.data;
  const trendValues = data?.trend.flatMap((series) => series.values) ?? [0];

  const exportReport = () => {
    if (!data || !programs.data) return;
    downloadCsv("정책_성과_보고서.csv", [
      ["사업ID", "사업명", "분야", "행정동", "상태", "예산(백만원)", "집행액(백만원)", "집행률(%)", "목표 대비(%)", "주요 성과"],
      ...programs.data.map((program) => [
        program.id,
        program.name,
        program.category,
        program.districtName,
        programStatusLabel[program.status],
        program.budgetMillionWon,
        program.executedMillionWon,
        Math.round((program.executedMillionWon * 100) / program.budgetMillionWon),
        program.targetAchievementRate,
        program.keyResult
      ])
    ]);
  };

  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>정책 관리</h1>
          <p>정책 사업의 추진 현황과 성과를 모니터링하고, 효과를 분석하여 개선 방향을 제시합니다.</p>
          <ApiStatus loading={overview.loading} error={overview.error ?? programs.error} />
        </div>
        <div className="filters">
          <FilterDisplay />
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

      {message && <div className={`toast ${message.tone}`}>{message.text}</div>}

      {!data ? (
        <div className="empty-state">
          {overview.error ? `정책 관리 데이터를 불러오지 못했습니다. (${overview.error})` : "정책 관리 데이터를 불러오는 중…"}
        </div>
      ) : (
        <>
          <div className="pm-kpi-row">
            {data.kpis.map((kpi) => {
              const style = kpiStyles[kpi.key] ?? kpiStyles.programs;
              return (
                <div className="pm-kpi-card" key={kpi.key}>
                  <span className="pm-kpi-icon" style={{ background: style.bg }}>
                    <GlyphIcon src={style.icon} color={style.color} size={20} />
                  </span>
                  <div>
                    <span className="label">{kpi.label}</span>
                    <div className="pm-kpi-value">
                      <strong>{kpi.key === "budget" ? formatNumber(kpi.value) : kpi.key === "footTrafficChangeRate" ? signed(kpi.value) : kpi.value}</strong>
                      <small>{kpi.unit}</small>
                    </div>
                    <span className={`pm-kpi-change ${toneOf(kpi.change)}`}>{arrow(kpi.change, kpi.changeUnit)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pm-grid">
            <div className="pm-grid-row">
              <article className="pm-panel">
                <div className="pm-panel-head">
                  <h3>주요 지표 추이</h3>
                </div>
                <LineChart
                  series={data.trend.map((series) => ({
                    label: series.label,
                    color: trendColors[series.key] ?? "#64748b",
                    values: series.values
                  }))}
                  xLabels={data.quarters}
                  yTicks={niceTicks(trendValues)}
                  height={209}
                />
              </article>

              <article className="pm-panel">
                <div className="pm-panel-head">
                  <h3>사업별 성과 TOP 5</h3>
                </div>
                <table className="pm-table">
                  <thead>
                    <tr>
                      <th>순위</th>
                      <th>사업명</th>
                      <th className="center">예산</th>
                      <th className="center">집행률</th>
                      <th className="center">목표 대비</th>
                      <th>주요 성과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topPrograms.map((program) => (
                      <tr key={program.id}>
                        <td>{program.rank}</td>
                        <td>{program.name}</td>
                        <td className="center">{formatNumber(program.budgetMillionWon)}</td>
                        <td className="center">{program.executionRate}%</td>
                        <td className="center pm-percent-value">{program.targetAchievementRate}%</td>
                        <td className="pm-highlight">{program.keyResult}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </div>

            <div className="pm-grid-row">
              <article className="pm-panel">
                <div className="pm-panel-head">
                  <h3>지역별 성과 비교</h3>
                </div>
                <div className="pm-map-row">
                  <div className="pm-map-box">
                    <NowonRiskMap areas={riskAreas} showDetail={false} />
                    <div className="pm-map-legend">
                      <strong>위험등급</strong>
                      <div>
                        <i style={{ background: "#fa342c" }} /> 고위험
                      </div>
                      <div>
                        <i style={{ background: "#ff6600" }} /> 주의
                      </div>
                      <div>
                        <i style={{ background: "#eeeff1" }} /> 데이터 없음
                      </div>
                    </div>
                  </div>
                  <div className="pm-region-list">
                    <div className="pm-region-head">
                      <span>행정동</span>
                      <span>위험지수</span>
                      <span>전년</span>
                    </div>
                    {data.regions.map((region) => (
                      <div className="pm-region-row" key={region.districtName}>
                        <span className="name">{region.districtName}</span>
                        <span className="score">{region.score}</span>
                        <span className={`yoy ${toneOf(region.yearOverYear)}`}>{arrow(region.yearOverYear)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article className="pm-panel">
                <div className="pm-panel-head">
                  <h3>정책 효과 분석 (지원 전·후 비교)</h3>
                </div>
                <div className="pm-effect-summary">
                  <span>
                    추진 중 사업 <strong>{data.progress.inProgress}개</strong>{" "}
                    <span className="pm-percent-value">{Math.round((data.progress.inProgress * 100) / data.progress.total)}%</span>
                  </span>
                  <span>
                    완료 사업 <strong>{data.progress.completed}개</strong>{" "}
                    <span className="pm-percent-value">{Math.round((data.progress.completed * 100) / data.progress.total)}%</span>
                  </span>
                  <span>
                    예산 집행률 <strong>{data.progress.executionRate}%</strong>({formatNumber(data.progress.executedMillionWon)} /{" "}
                    {formatNumber(data.progress.budgetMillionWon)}백만원)
                  </span>
                </div>
                <table className="pm-effect-table">
                  <thead>
                    <tr>
                      <th>항목</th>
                      <th>지원 전 ({data.beforePeriod})</th>
                      <th>
                        <span className="pm-effect-arrow">≫</span>지원 후 ({data.afterPeriod})
                      </th>
                      <th>개선 효과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.beforeAfter.map((item) => (
                      <tr key={item.key}>
                        <td>{item.label}</td>
                        <td>
                          {item.before}
                          {item.unit}
                        </td>
                        <td>
                          {item.after}
                          {item.unit}
                        </td>
                        <td className={`val ${toneOf(item.change)}`}>{arrow(item.change, item.changeUnit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </div>

            <article className="pm-panel pm-programs">
              <div className="pm-panel-head pm-programs-head">
                <h3>
                  사업 관리 <span className="pm-count">{programs.data?.length ?? 0}건</span>
                </h3>
                <button className="btn-primary btn-small" type="button" onClick={() => setShowForm(!showForm)}>
                  {showForm ? "닫기" : "+ 신규 사업 등록"}
                </button>
              </div>

              {showForm && (
                <form className="pm-form" onSubmit={submit}>
                  <input
                    required
                    placeholder="사업명"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                  <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                  <select value={form.districtName} onChange={(event) => setForm({ ...form, districtName: event.target.value })}>
                    {districts.map((district) => (
                      <option key={district}>{district}</option>
                    ))}
                  </select>
                  <input
                    required
                    type="number"
                    min={1}
                    placeholder="예산(백만원)"
                    value={form.budgetMillionWon}
                    onChange={(event) => setForm({ ...form, budgetMillionWon: event.target.value })}
                  />
                  <button className="btn-primary btn-small" type="submit">
                    등록
                  </button>
                </form>
              )}

              <table className="pm-table pm-program-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>사업명</th>
                    <th>분야</th>
                    <th>행정동</th>
                    <th className="center">예산</th>
                    <th className="center">집행액</th>
                    <th className="center">집행률</th>
                    <th className="center">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {(programs.data ?? []).map((program) => {
                    const rate = Math.round((program.executedMillionWon * 100) / program.budgetMillionWon);
                    return (
                      <tr key={program.id}>
                        <td className="muted">{program.id}</td>
                        <td>{program.name}</td>
                        <td>{program.category}</td>
                        <td>{program.districtName}</td>
                        <td className="center">{formatNumber(program.budgetMillionWon)}</td>
                        <td className="center">
                          <input
                            key={`${program.id}-${program.executedMillionWon}`}
                            className="pm-exec-input"
                            type="number"
                            min={0}
                            max={program.budgetMillionWon}
                            defaultValue={program.executedMillionWon}
                            aria-label={`${program.name} 집행액`}
                            onBlur={(event) => {
                              if (Number(event.target.value) !== program.executedMillionWon) changeExecuted(program.id, event.target.value);
                            }}
                          />
                        </td>
                        <td className="center">
                          <div className="pm-rate">
                            <i style={{ width: `${Math.min(rate, 100)}%` }} />
                            <span>{rate}%</span>
                          </div>
                        </td>
                        <td className="center">
                          <select
                            className={`pm-status ${program.status}`}
                            value={program.status}
                            onChange={(event) => changeStatus(program.id, event.target.value as ProgramStatus)}
                            aria-label={`${program.name} 상태`}
                          >
                            {statusOrder.map((status) => (
                              <option key={status} value={status}>
                                {programStatusLabel[status]}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </article>
          </div>

          <div className="action-row action-row--bottom">
            <button className="btn-primary" type="button" onClick={exportReport}>
              <Icon src={reportIcon} alt="" /> 성과 보고서 생성
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default PolicyManagementPage;
