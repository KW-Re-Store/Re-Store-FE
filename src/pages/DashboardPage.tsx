import alertTriangleIcon from "../assets/icons/alert-triangle.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import chartUpIcon from "../assets/icons/chart-up.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import folderBlueIcon from "../assets/icons/folder-blue.svg";
import folderGreenIcon from "../assets/icons/folder-green.svg";
import folderOrangeIcon from "../assets/icons/folder-orange.svg";
import folderPurpleIcon from "../assets/icons/folder-purple.svg";
import folderRedIcon from "../assets/icons/folder-red.svg";
import infoCircleIcon from "../assets/icons/info-circle.svg";
import reportIcon from "../assets/icons/report.svg";
import sadFaceIcon from "../assets/icons/sad-face.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import Icon from "../components/Icon";
import PanelTitle from "../components/PanelTitle";

const summaryCards = [
  { label: "전체 행정동 수", value: "19", unit: "개", note: "노원구 행정동 기준", tone: "blue", folderIcon: folderBlueIcon, icon: sadFaceIcon },
  { label: "고위험 상권", value: "4", unit: "개", note: "전분기 대비 ↑ 1개", tone: "red", folderIcon: folderRedIcon, icon: sadFaceIcon },
  { label: "주의 상권", value: "6", unit: "개", note: "전분기 대비 -", tone: "amber", folderIcon: folderOrangeIcon, icon: alertTriangleIcon },
  { label: "고위험 상권", value: "4", unit: "개", note: "전분기 대비 ↓ 1개", tone: "green", folderIcon: folderGreenIcon, icon: infoCircleIcon },
  { label: "고위험 상권", value: "4", unit: "개", note: "전분기 대비 ↓ 3.5개", tone: "violet", folderIcon: folderPurpleIcon, icon: chartUpIcon }
];

const riskRows = [
  ["1", "상계10동", "고위험", "82.4"],
  ["2", "상계9동", "고위험", "76.1"],
  ["3", "하계1동", "주의", "62.3"],
  ["4", "상계6,7동", "주의", "59.2"],
  ["5", "월계2동", "주의", "56.8"]
];

const causes = [
  { icon: "👥", label: "유동인구 감소", value: "-6.3%", tag: "주요 원인 1위" },
  { icon: "📊", label: "매출액 감소", value: "-4.1%", tag: "주요 원인 2위" },
  { icon: "🏪", label: "점포수 감소", value: "-3.8%", tag: "주요 원인 3위" },
  { icon: "🚀", label: "신규 창업 감소", value: "-8.7%", tag: "지속 감소" },
  { icon: "🏢", label: "공실률 증가", value: "+1.8%p", tag: "지속 증가" }
];

const indicators = [
  ["폐업률", "12.4%", "↑ 3.1%"],
  ["매출액 증감률", "-7.6%", "↓ 3.3%"],
  ["유동인구 증감률", "-9.3%", "↓ 4.2%"],
  ["신규 창업 증감률", "-11.2%", "↓ 6.1%"],
  ["공실률", "12.7%", "↑ 1.9%"],
  ["영업 점포 증감률", "12.4%", "↑ 3.1%"]
];

const policyItems = [
  ["👥", "방문객 활성화 지원", "지역축제, 상권 공동마케팅, 관광 연계 지원", "우선"],
  ["💼", "업종전환 컨설팅 지원", "업종 진단 컨설팅, 창업 사전정보 제공", "우선"],
  ["📈", "초기 창업자 성장 지원", "경영교육, 금융지원, 멘토링 프로그램", "일반"]
];

const nowonMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=127.045%2C37.615%2C127.115%2C37.705&layer=mapnik&marker=37.6542%2C127.0568";

function DashboardPage() {
  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>상권 현황 한눈에 보기</h1>
          <p>행정동별 상권 위험도와 주요 지표를 한눈에 확인하고 정책 대상 지역을 선정하세요.</p>
        </div>
        <div className="filters">
          <button type="button">
            노원구
            <Icon src={chevronDownIcon} alt="" />
          </button>
          <button type="button">
            전체 행정동
            <Icon src={chevronDownIcon} alt="" />
          </button>
          <button type="button">
            2024년
            <Icon src={calendarIcon} alt="" />
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

      <div className="content-grid">
        <section className="main-column">
          <div className="summary-row">
            {summaryCards.map((card) => (
              <article className={`summary-card ${card.tone}`} key={`${card.label}-${card.tone}`}>
                <img className="folder-tab" src={card.folderIcon} alt="" />
                <div className="summary-body">
                  <div className="summary-icon">
                    <Icon src={card.icon} alt="" />
                  </div>
                  <div>
                    <span>{card.label}</span>
                    <strong>
                      {card.value}
                      <small>{card.unit}</small>
                    </strong>
                    <p>{card.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="analysis-row">
            <article className="panel map-panel">
              <PanelTitle title="행정동별 상권 위험도 지도" action="전체보기 ›" />
              <div className="legend">
                <span>
                  <i className="risk-red" /> 고위험
                </span>
                <span>
                  <i className="risk-amber" /> 주의
                </span>
                <span>
                  <i className="risk-green" /> 관심
                </span>
              </div>
              <div className="map">
                <iframe title="노원구 지도" src={nowonMapUrl} loading="lazy" />
                <a
                  className="map-link"
                  href="https://www.openstreetmap.org/relation/2297417"
                  target="_blank"
                  rel="noreferrer"
                >
                  노원구 지도 열기
                </a>
              </div>
            </article>

            <article className="panel table-panel">
              <PanelTitle title="위험 상권 TOP 5" action="전체보기 ›" />
              <table>
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>행정동</th>
                    <th>위험등급</th>
                    <th>위험지수</th>
                  </tr>
                </thead>
                <tbody>
                  {riskRows.map(([rank, area, grade, score]) => (
                    <tr key={area}>
                      <td>{rank}</td>
                      <td>{area}</td>
                      <td>
                        <span className={grade === "고위험" ? "badge danger" : "badge caution"}>{grade}</span>
                      </td>
                      <td>{score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </div>

          <article className="panel cause-panel">
            <PanelTitle title="원인 분석 요약" subtitle="노원구 전체" />
            <div className="cause-list">
              {causes.map((cause) => (
                <div className="cause-item" key={cause.label}>
                  <span>{cause.icon}</span>
                  <strong>{cause.label}</strong>
                  <b>{cause.value}</b>
                  <small>{cause.tag}</small>
                </div>
              ))}
            </div>
            <p className="note">원인분석은 폐업률, 매출, 유동인구, 점포수, 신규 창업, 공실률, 업종 과포화를 종합하여 자동 분석합니다.</p>
          </article>
        </section>

        <aside className="side-column">
          <article className="risk-gauge">
            <h2>
              상권 위험지수 <span>노원구 평균</span>
            </h2>
            <div className="gauge">
              <strong>
                56.7<small>/100</small>
              </strong>
            </div>
            <p>
              전분기 대비 <b>↓ 3.5점</b>
            </p>
          </article>

          <article className="panel indicators-panel">
            <PanelTitle title="주요 지표" />
            <div className="indicator-grid">
              {indicators.map(([label, value, change]) => (
                <div className="indicator-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <small>전분기 대비 {change}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="policy-panel">
            <PanelTitle title="정책 추천 TOP 3" action="전체보기 ›" />
            <div className="policy-list">
              {policyItems.map(([icon, title, desc, grade]) => (
                <div className="policy-item" key={title}>
                  <span>{icon}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                  <em className={grade === "우선" ? "primary" : ""}>{grade}</em>
                </div>
              ))}
            </div>
            <button className="report-button" type="button">
              <Icon src={reportIcon} alt="" />
              보고서 생성
            </button>
          </article>
        </aside>
      </div>
    </section>
  );
}

export default DashboardPage;
