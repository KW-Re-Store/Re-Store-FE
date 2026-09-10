import chevronDownIcon from "../assets/icons/chevron-down.svg";
import dataExportIcon from "../assets/icons/data-export.svg";
import pdfDownloadIcon from "../assets/icons/pdf-download.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import Icon from "../components/Icon";
import LineChart from "../components/LineChart";

const overviewStats = [
  { label: "폐업률", value: "12.4%", change: "▲ 3.1%p", tone: "up" },
  { label: "매출액 증감률", value: "-7.6%", change: "▼ 2.8%p", tone: "down" },
  { label: "유동인구 증감률", value: "-9.3%", change: "▼ 4.2%p", tone: "down" },
  { label: "공실률", value: "12.7%", change: "▲ 1.9%p", tone: "up" }
];

const trendSeries = [
  { label: "폐업률(%)", color: "#ef4444", values: [8.2, 8.6, 9.0, 9.6, 10.1, 10.6, 11.0, 11.6, 12.4] },
  { label: "매출액 증감률(%)", color: "#3b82f6", values: [-1.2, -2.6, -3.1, -3.8, -4.5, -5.2, -5.9, -6.8, -7.6] },
  { label: "유동인구 증감률(%)", color: "#22c55e", values: [-2.0, -3.4, -4.1, -5.0, -5.8, -6.6, -7.4, -8.3, -9.3] },
  { label: "신규 창업 증감률(%)", color: "#a855f7", values: [-1.0, -2.8, -4.0, -5.3, -6.6, -7.9, -9.1, -10.2, -11.2] }
];

const causes = [
  { icon: "👥", label: "유동인구 감소", score: 87, color: "#ef4444" },
  { icon: "📉", label: "매출액 감소", score: 76, color: "#f97316" },
  { icon: "🏬", label: "공실 증가", score: 68, color: "#eab308" },
  { icon: "🚀", label: "신규 창업 감소", score: 58, color: "#3b82f6" }
];

const industries = [
  { label: "음식업", count: "1,036개", share: "56.3%", change: "▲ 1.2%", color: "#ef4444", tone: "up" },
  { label: "소매업", count: "412개", share: "22.4%", change: "▼ 0.8%", color: "#3b82f6", tone: "down" },
  { label: "서비스업", count: "258개", share: "14.0%", change: "▼ 0.3%", color: "#22c55e", tone: "down" },
  { label: "기타", count: "136개", share: "7.3%", change: "▼ 0.1%", color: "#a855f7", tone: "down" }
];

const insights = [
  "유동인구 감소가 가장 큰 영향을 주고 있으며, 매출 감소로 이어지고 있습니다.",
  "폐업률 상승과 공실 증가가 동시에 진행되어 상권 활력이 저하되고 있습니다.",
  "음식업 비중이 높아 업종 간 경쟁이 심화된 구조입니다.",
  "신규 창업 감소와 공실 증가로 상권 활력이 저하되고 있습니다."
];

const industryGradient = (() => {
  let acc = 0;
  const stops = industries.map((item) => {
    const share = parseFloat(item.share);
    const start = acc;
    acc += share;
    return `${item.color} ${start}% ${acc}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
})();

const nowonMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=127.045%2C37.615%2C127.115%2C37.705&layer=mapnik&marker=37.6542%2C127.0568";

function TradeAreaAnalysisPage() {
  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>상권 분석</h1>
          <p>선택한 행정동의 상권 현황과 폐업 원인을 분석하고 인사이트를 제공합니다.</p>
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

      <div className="ta-body">
        <div className="action-row">
          <button className="btn-outline" type="button">
            <Icon src={pdfDownloadIcon} alt="" /> PDF 보고서 다운로드
          </button>
          <button className="btn-outline" type="button">
            <Icon src={dataExportIcon} alt="" /> 데이터 내보내기
          </button>
        </div>

        <div className="ta-row">
          <article className="ta-card">
            <div className="ta-overview-head">
              <div className="ta-overview-title">
                <h3>상계10동 상권 개요</h3>
                <span className="ta-badge-risk">고위험</span>
              </div>
              <span className="ta-overview-sub">노원구 내 위험도 1위 (19개 동 중)</span>
            </div>
            <div className="ta-overview-body">
              <div className="ta-risk-block">
                <span className="label">상권 위험지수</span>
                <div className="value">
                  82.4<small>/100</small>
                </div>
                <span className="delta">전분기 대비 ▲ 12.6점</span>
              </div>
              <div className="ta-stat-grid">
                {overviewStats.map((stat) => (
                  <div className="ta-stat-cell" key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small className={stat.tone}>{stat.change}</small>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="ta-card">
            <h3>주요 지표 추이</h3>
            <LineChart
              series={trendSeries}
              xLabels={["'22.1Q", "'22.2Q", "'22.3Q", "'22.4Q", "'23.1Q", "'23.2Q", "'23.3Q", "'23.4Q", "'24.1Q"]}
              yTicks={[-20, -10, 0, 10]}
            />
          </article>
        </div>

        <div className="ta-row">
          <article className="ta-card ta-card--flush">
            <div className="ta-card-header">상권 현황</div>
            <div className="ta-status-body">
              <div className="ta-status-map">
                <iframe title="상권 현황 지도" src={nowonMapUrl} loading="lazy" />
                <div className="ta-status-legend">
                  <strong>상권 유형</strong>
                  <div>
                    <i style={{ background: "#22c55e" }} /> 주거지 상권
                  </div>
                  <div>
                    <i style={{ background: "#f97316" }} /> 골목 상권
                  </div>
                  <div>
                    <i style={{ background: "#3b82f6" }} /> 역세권 상권
                  </div>
                </div>
              </div>
              <div className="ta-status-stats">
                <div>
                  <span>면적</span>
                  <strong>1.21km²</strong>
                </div>
                <div>
                  <span>점포 수</span>
                  <strong>1,842개</strong>
                </div>
                <div>
                  <span>유동인구 (일평균)</span>
                  <strong>29,471명</strong>
                </div>
                <div>
                  <span>주요 업종</span>
                  <strong>음식업, 서비스업, 소매업</strong>
                </div>
              </div>
            </div>
          </article>

          <article className="ta-card">
            <h3>
              원인 분석 <span className="ta-muted">(상위 주요 요인)</span>
            </h3>
            <div className="ta-cause-list">
              {causes.map((cause) => (
                <div className="ta-cause-row" key={cause.label}>
                  <span className="ta-cause-icon" style={{ background: `${cause.color}1a` }}>
                    {cause.icon}
                  </span>
                  <div className="ta-cause-main">
                    <div className="ta-cause-top">
                      <strong>{cause.label}</strong>
                      <span style={{ color: cause.color }}>{cause.score}점</span>
                    </div>
                    <div className="ta-cause-bar">
                      <i style={{ width: `${cause.score}%`, background: cause.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="note">* 영향도는 상권 위험지수에 미치는 기여도를 100점 기준으로 산정</p>
          </article>
        </div>

        <div className="ta-row">
          <article className="ta-card">
            <div className="ta-card-title-row">
              <h3>업종 분석</h3>
              <span className="ta-select">업종 대분류 기준 <Icon src={chevronDownIcon} alt="" /></span>
            </div>
            <div className="ta-industry-body">
              <div className="ta-donut" style={{ background: industryGradient }}>
                <div className="ta-donut-inner">
                  <strong>전체 점포</strong>
                  <span>1,842개</span>
                </div>
              </div>
              <div className="ta-industry-legend">
                {industries.map((item) => (
                  <div className="ta-industry-row" key={item.label}>
                    <span className="name">
                      <i className="dot" style={{ background: item.color }} /> {item.label}
                    </span>
                    <span>{item.count}</span>
                    <span>{item.share}</span>
                    <span className={item.tone}>{item.change}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-block-outline" type="button">
              자세히 보기 ›
            </button>
          </article>

          <article className="ta-card ta-insight-card">
            <h3>인사이트 요약</h3>
            <div className="ta-insight-list">
              {insights.map((insight) => (
                <div className="ta-insight-item" key={insight}>
                  <span className="ta-check">✓</span>
                  <p>{insight}</p>
                </div>
              ))}
            </div>
            <a className="btn-primary-block" href="/정책추천">
              정책 추천 보기 →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

export default TradeAreaAnalysisPage;
