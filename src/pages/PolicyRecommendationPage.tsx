import chevronDownIcon from "../assets/icons/chevron-down.svg";
import infoCircleIcon from "../assets/icons/info-circle.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import Icon from "../components/Icon";
import LineChart from "../components/LineChart";

const recommendedPolicies = [
  {
    rank: 1,
    icon: "📢",
    iconBg: "#eff6ff",
    rankColor: "#155dfc",
    category: "상권 활성화",
    categoryColor: "#a855f7",
    title: "공동 마케팅 및 상권 활성화 지원",
    description: "상권 축제, 공동 할인 이벤트, 홍보 마케팅을 지원하여 방문객 유입을 확대하고 매출 증대를 도모합니다.",
    rating: 4.3,
    metrics: [
      { label: "매출 증대율", value: "+8.7%" },
      { label: "유동인구 증대율", value: "+9.3%" },
      { label: "폐업률 감소", value: "-2.6%p", tone: "down" }
    ],
    period: "6개월 / 500백만원"
  },
  {
    rank: 2,
    icon: "👥",
    iconBg: "#f0fdf4",
    rankColor: "#22c55e",
    category: "경영 지원",
    categoryColor: "#22c55e",
    title: "초기 사업자 맞춤 경영 지원",
    description: "신규 창업자의 사업 안정화를 위해 경영 컨설팅, 멘토링, 교육, 임대료·마케팅 지원 등을 제공합니다.",
    rating: 4.0,
    metrics: [
      { label: "생존율 개선", value: "+6.3%p" },
      { label: "폐업률 감소", value: "-1.9%p", tone: "down" },
      { label: "매출 증대율", value: "+5.2%" }
    ],
    period: "8개월 / 300백만원"
  },
  {
    rank: 3,
    icon: "🏗️",
    iconBg: "#fff7ed",
    rankColor: "#f97316",
    category: "환경 개선",
    categoryColor: "#f97316",
    title: "임대료 및 점포 환경 개선",
    description: "노후 점포 시설 개선과 임대료 부담 완화를 지원하여 공실률을 낮추고 영업 환경을 안정화합니다.",
    rating: 3.8,
    metrics: [
      { label: "공실률 감소", value: "-1.5%p", tone: "down" },
      { label: "매출 증대율", value: "+3.1%" },
      { label: "유동인구 증대율", value: "+2.0%" }
    ],
    period: "12개월 / 450백만원"
  },
  {
    rank: 4,
    icon: "💻",
    iconBg: "#eff6ff",
    rankColor: "#0ea5e9",
    category: "디지털 전환",
    categoryColor: "#0ea5e9",
    title: "온라인 판로 및 디지털 전환 지원",
    description: "온라인 스토어 구축, 배달 플랫폼 입점, 디지털 결제 도입을 지원해 새로운 판매 채널을 확보합니다.",
    rating: 3.6,
    metrics: [
      { label: "온라인 매출", value: "+9.3%" },
      { label: "신규 고객 유입", value: "+4.2%" },
      { label: "폐업률 감소", value: "-1.1%p", tone: "down" }
    ],
    period: "9개월 / 250백만원"
  }
];

const relatedPrograms = [
  {
    icon: "📋",
    title: "소상공인 경영환경 개선 사업",
    description: "시설 개선, 시스템 지원 등",
    status: "연계 가능",
    statusTone: "ok"
  },
  {
    icon: "🏪",
    title: "전통시장 및 상점가 활성화 사업",
    description: "공동마케팅, 이벤트, 환경개선 지원",
    status: "연계 가능",
    statusTone: "ok"
  },
  {
    icon: "🤝",
    title: "지역 상권 상생 협력 지원 사업",
    description: "상권 협의체 운영 및 상생 모델 지원",
    status: "검토 필요",
    statusTone: "review"
  }
];

const simulationSeries = [
  { label: "매출 증대율", color: "#22c55e", values: [0, 2.4, 5.1, 7.6, 9.8] },
  { label: "유동인구 증대", color: "#3b82f6", values: [0, 2.9, 5.8, 8.6, 11.1] },
  { label: "생존율 개선", color: "#a855f7", values: [0, 1.6, 3.2, 4.9, 6.5] },
  { label: "폐업률", color: "#ef4444", values: [0, -0.9, -1.7, -2.5, -3.2] }
];

function renderStars(rating: number) {
  const filled = Math.round(rating);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}

function PolicyRecommendationPage() {
  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>
            정책 추천 <Icon src={infoCircleIcon} alt="" />
          </h1>
          <p>분석 결과를 기반으로 상권의 문제를 해결하기 위한 맞춤형 정책을 추천합니다.</p>
        </div>
        <div className="filters">
          <button className="profile" type="button">
            <span>
              <Icon src={userHomeIcon} alt="" />
            </span>
            <span>
              <b>노원구청</b>
              <small>상권정책 담당자</small>
            </span>
            <Icon src={chevronDownIcon} alt="" />
          </button>
        </div>
      </header>

      <div className="pr-layout">
        <div className="pr-left">
          <div className="pr-summary-card">
            <div className="pr-summary-title">
              <h3>상계10동 분석 요약</h3>
              <span className="ta-badge-risk">고위험</span>
            </div>
            <div className="risk-strip">
              <span className="risk-strip-label">위험도</span>
              <span className="risk-strip-value">
                82.4<small>/100</small>
              </span>
              <span className="risk-strip-delta">▲ 12.6점</span>
            </div>
          </div>

          <article className="pr-sim-card">
            <div className="pr-sim-head">
              <h3>
                추천 정책 효과 시뮬레이션 <span>(추정치)</span>
              </h3>
              <span className="pr-sim-info-link">시뮬레이션 안내 ›</span>
            </div>
            <div className="pr-sim-combo">
              <div className="pr-sim-combo-left">
                <span className="pr-sim-combo-label">추천 정책 조합</span>
                <span className="pr-sim-combo-select">
                  TOP 1 + TOP 2 조합 <Icon src={chevronDownIcon} alt="" />
                </span>
              </div>
              <span className="pr-sim-combo-meta">총 예산 800백만원 | 사업 기간 14개월</span>
            </div>
            <div className="pr-sim-stats">
              <div className="pr-sim-stat">
                <span>폐업률</span>
                <strong>-3.2%p</strong>
              </div>
              <div className="pr-sim-stat">
                <span>매출 증대율</span>
                <strong>+9.8%</strong>
              </div>
              <div className="pr-sim-stat">
                <span>유동인구 증대</span>
                <strong>+11.1%</strong>
              </div>
              <div className="pr-sim-stat">
                <span>생존율 개선</span>
                <strong>+6.5%p</strong>
              </div>
            </div>
            <LineChart
              series={simulationSeries}
              xLabels={["'24.1Q (기존)", "'24.2Q", "'24.3Q", "'24.4Q", "'25.1Q (예상)"]}
              yTicks={[-10, 0, 10]}
              height={190}
            />
            <p className="pr-sim-note">※ 시뮬레이션은 과거 유사 사업 효과를 기반으로 추정한 값으로 실제 결과와 다를 수 있습니다.</p>
          </article>

          <article className="pr-related-card">
            <h3>관련 지원 사업 연계</h3>
            <div className="pr-related-list">
              {relatedPrograms.map((program) => (
                <div className="pr-related-item" key={program.title}>
                  <span className="pr-related-icon">{program.icon}</span>
                  <div className="pr-related-main">
                    <div className="pr-related-title-row">
                      <strong>{program.title}</strong>
                      <span className={`pr-related-status ${program.statusTone}`}>{program.status}</span>
                    </div>
                    <p className="pr-related-desc">{program.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="pr-related-more" type="button">
              더 보기 ›
            </button>
          </article>
        </div>

        <div className="pr-top-panel">
          <div className="pr-top-head">
            <h3>
              맞춤 정책 추천 TOP 4 <Icon src={infoCircleIcon} alt="" />
            </h3>
            <div className="pr-legend">
              <span>
                <i style={{ background: "#ef4444" }} /> 높음
              </span>
              <span>
                <i style={{ background: "#fb923c" }} /> 보통
              </span>
              <span>
                <i style={{ background: "#22c55e" }} /> 낮음
              </span>
            </div>
          </div>
          <div className="pr-card-list">
            {recommendedPolicies.map((policy) => (
              <article className="pr-policy-card" key={policy.title}>
                <div className="pr-policy-icon" style={{ background: policy.iconBg }}>
                  {policy.icon}
                  <span className="pr-policy-rank" style={{ background: policy.rankColor }}>
                    {policy.rank}
                  </span>
                </div>
                <div className="pr-policy-main">
                  <div className="pr-policy-top">
                    <div>
                      <span className="pr-policy-category" style={{ color: policy.categoryColor }}>
                        {policy.category}
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
                  <div className="pr-policy-foot">
                    {policy.metrics.map((metric) => (
                      <div className="pr-policy-metric" key={metric.label}>
                        <span>{metric.label}</span>
                        <strong style={metric.tone === "down" ? { color: "#2b7fff" } : undefined}>{metric.value}</strong>
                      </div>
                    ))}
                    <div className="pr-policy-divider" />
                    <div className="pr-policy-period">
                      <div>
                        <span>사업 기간 / 예산(안)</span>
                        <strong>{policy.period}</strong>
                      </div>
                      <button className="pr-detail-btn" type="button">
                        자세히 보기 ›
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button className="pr-more-btn" type="button">
            더 많은 정책 보기 ⌄
          </button>
        </div>
      </div>
    </section>
  );
}

export default PolicyRecommendationPage;
