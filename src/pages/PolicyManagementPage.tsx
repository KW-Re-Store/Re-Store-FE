import chevronDownIcon from "../assets/icons/chevron-down.svg";
import dataExportIcon from "../assets/icons/data-export.svg";
import infoCircleIcon from "../assets/icons/info-circle.svg";
import pdfDownloadIcon from "../assets/icons/pdf-download.svg";
import reportIcon from "../assets/icons/report.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import Icon from "../components/Icon";
import LineChart from "../components/LineChart";

const kpiCards = [
  { icon: "📁", bg: "#eef2ff", label: "지원 사업 수", value: "12", unit: "개", change: "▲ 2개", tone: "up" },
  { icon: "₩", bg: "#eef8ee", label: "총 예산", value: "8,000", unit: "백만원", change: "▲ 1,000백만원", tone: "up" },
  { icon: "📉", bg: "#fff2e5", label: "폐업률", value: "9.1", unit: "%", change: "▼ 1.6%p", tone: "down" },
  { icon: "💚", bg: "#f5f3fe", label: "생존율(2년)", value: "61.3", unit: "%", change: "▲ 4.8%p", tone: "up" },
  { icon: "📊", bg: "#eff6fe", label: "매출액 증감률", value: "-2.1", unit: "%", change: "▲ 1.8%p", tone: "up" },
  { icon: "👥", bg: "#eef8ee", label: "유동인구 증감률", value: "+3.8", unit: "%", change: "▲ 0.7%p", tone: "up" }
];

const trendSeries = [
  { label: "생존율(2년,%)", color: "#3b82f6", values: [39, 42, 44, 46, 48, 50, 52, 54, 56, 57, 59, 61] },
  { label: "폐업률(%)", color: "#ef4444", values: [11.5, 11.2, 11, 10.8, 10.5, 10.2, 9.9, 9.7, 9.5, 9.3, 9.2, 9.1] },
  { label: "매출액 증감률(%)", color: "#22c55e", values: [-6, -5.7, -5.3, -4.9, -4.5, -4.0, -3.6, -3.2, -2.9, -2.6, -2.3, -2.1] }
];

const topPrograms = [
  { rank: 1, name: "공동 마케팅 및 상권 활성화", budget: "2,000", rate: "98%", target: 110, result: "매출액 +6.2%" },
  { rank: 2, name: "창업 초기 경영 지원 사업", budget: "1,500", rate: "95%", target: 108, result: "생존율 +7.1%p" },
  { rank: 3, name: "임대료 및 점포 환경 개선", budget: "1,800", rate: "92%", target: 102, result: "폐업률 -2.3%p" },
  { rank: 4, name: "특화거리 조성 및 콘텐츠", budget: "1,200", rate: "90%", target: 97, result: "유동인구 +3.8%" },
  { rank: 5, name: "온라인 판로 및 디지털 전환", budget: "1,000", rate: "88%", target: 93, result: "온라인매출 +9.3%" }
];

const regionPerformance = [
  { name: "상계10동", score: "82.4", yoy: "▲ 12.6", tone: "up" },
  { name: "공릉2동", score: "71.8", yoy: "▲ 9.3", tone: "up" },
  { name: "중계2.3동", score: "68.5", yoy: "▲ 7.8", tone: "up" },
  { name: "상계3.4동", score: "61.2", yoy: "▲ 4.5", tone: "up" },
  { name: "상계5동", score: "28.3", yoy: "▼ 2.4", tone: "down" },
  { name: "하계1동", score: "21.7", yoy: "▼ 5.6", tone: "down" }
];

const beforeAfter = [
  { label: "폐업률", before: "10.7%", after: "9.1%", change: "▼ 1.6%p", tone: "down" },
  { label: "매출 증감", before: "-3.9%", after: "-2.1%", change: "▲ 1.8%p", tone: "up" },
  { label: "유동인구", before: "-4.1%", after: "-3.4%", change: "▲ 0.7%p", tone: "up" },
  { label: "2년 생존", before: "56.5%", after: "61.3%", change: "▲ 4.8%p", tone: "up" }
];

function ringStyle(percent: number) {
  const clamped = Math.min(percent, 100);
  return { background: `conic-gradient(#155dfc 0% ${clamped}%, #dbeafe ${clamped}% 100%)` };
}

const nowonMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=127.045%2C37.615%2C127.115%2C37.705&layer=mapnik&marker=37.6542%2C127.0568";

function PolicyManagementPage() {
  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>
            정책 성과 관리 <Icon src={infoCircleIcon} alt="" />
          </h1>
          <p>정책 사업의 추진 현황과 성과를 모니터링하고, 효과를 분석하여 개선 방향을 제시합니다.</p>
        </div>
        <div className="filters">
          <button className="btn-outline" type="button">
            <Icon src={pdfDownloadIcon} alt="" /> PDF 다운로드
          </button>
          <button className="btn-outline" type="button">
            <Icon src={dataExportIcon} alt="" /> 데이터 내보내기
          </button>
          <button className="btn-primary" type="button">
            <Icon src={reportIcon} alt="" /> 성과 보고서 생성
          </button>
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

      <div className="pm-kpi-row">
        {kpiCards.map((card) => (
          <div className="pm-kpi-card" key={card.label}>
            <span className="pm-kpi-icon" style={{ background: card.bg }}>
              {card.icon}
            </span>
            <div>
              <span className="label">{card.label}</span>
              <div className="pm-kpi-value">
                <strong>{card.value}</strong>
                <small>{card.unit}</small>
              </div>
              <span className={`pm-kpi-change ${card.tone}`}>{card.change}</span>
            </div>
          </div>
        ))}
        <div className="pm-kpi-card pm-kpi-score">
          <span className="pm-kpi-icon pm-kpi-grade-icon">B+</span>
          <div>
            <span className="label">성과 종합 평가</span>
            <span className="grade-note">지난해 대비 개선 중</span>
            <span className="detail-link">상세보기 ›</span>
          </div>
        </div>
      </div>

      <div className="pm-grid">
        <article className="pm-panel">
          <div className="pm-panel-head">
            <h3>
              주요 지표 추이 <Icon src={infoCircleIcon} alt="" />
            </h3>
            <div className="pm-tab-group">
              <button className="active" type="button">
                분기
              </button>
              <button type="button">반기</button>
              <button type="button">연도</button>
            </div>
          </div>
          <LineChart
            series={trendSeries}
            xLabels={["'22.1Q", "'22.2Q", "'22.3Q", "'22.4Q", "'23.1Q", "'23.2Q", "'23.3Q", "'23.4Q", "'24.1Q", "'24.2Q", "'24.3Q", "'24.4Q"]}
            yTicks={[0, 20, 40, 60]}
            height={130}
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
              {topPrograms.map((program) => (
                <tr key={program.rank}>
                  <td>{program.rank}</td>
                  <td>{program.name}</td>
                  <td className="center">{program.budget}</td>
                  <td className="center">{program.rate}</td>
                  <td className="center">
                    <span className="pm-ring-mini" style={ringStyle(program.target)}>
                      <span className="pm-ring-mini-inner">{program.target}%</span>
                    </span>
                  </td>
                  <td className="pm-highlight">{program.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="pm-panel">
          <div className="pm-panel-head">
            <h3>지역별 성과 비교</h3>
          </div>
          <div className="pm-map-row">
            <div className="pm-map-box">
              <iframe title="지역별 성과 지도" src={nowonMapUrl} loading="lazy" />
              <div className="pm-map-legend">
                <strong>위험등급</strong>
                <div>
                  <i style={{ background: "#ef4444" }} /> 고위험
                </div>
                <div>
                  <i style={{ background: "#f97316" }} /> 주의
                </div>
                <div>
                  <i style={{ background: "#22c55e" }} /> 관심
                </div>
              </div>
            </div>
            <div className="pm-region-list">
              <div className="pm-region-head">
                <span>행정동</span>
                <span>성과</span>
                <span>전년</span>
              </div>
              {regionPerformance.map((region) => (
                <div className="pm-region-row" key={region.name}>
                  <span className="name">{region.name}</span>
                  <span className="score">{region.score}</span>
                  <span className={`yoy ${region.tone}`}>{region.yoy}</span>
                </div>
              ))}
              <a className="pm-more-link" href="/정책관리">
                전체 지역 보기 ›
              </a>
            </div>
          </div>
        </article>

        <article className="pm-panel">
          <div className="pm-panel-head">
            <h3>정책 효과 분석 (지원 전·후 비교)</h3>
            <span className="pm-panel-select">
              전체 사업 평균 <Icon src={chevronDownIcon} alt="" />
            </span>
          </div>
          <div className="pm-effect-summary">
            <span>
              추진 중 사업 <strong>8개</strong>
              <span className="pm-ring-mini" style={ringStyle(67)}>
                <span className="pm-ring-mini-inner">67%</span>
              </span>
            </span>
            <span>
              완료 사업 <strong>3개</strong>
              <span className="pm-ring-mini" style={ringStyle(25)}>
                <span className="pm-ring-mini-inner">25%</span>
              </span>
            </span>
            <span>
              예산 집행률 <strong>92%</strong>(7,360 / 8,000백만원)
            </span>
          </div>
          <table className="pm-effect-table">
            <thead>
              <tr>
                <th>항목</th>
                <th>지원 전 ('23.1Q~'23.4Q)</th>
                <th>
                  <span className="pm-effect-arrow">≫</span>지원 후 ('24.1Q~'24.4Q)
                </th>
                <th>개선 효과</th>
              </tr>
            </thead>
            <tbody>
              {beforeAfter.map((item) => (
                <tr key={item.label}>
                  <td>{item.label}</td>
                  <td>{item.before}</td>
                  <td>{item.after}</td>
                  <td className={`val ${item.tone}`}>{item.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}

export default PolicyManagementPage;
