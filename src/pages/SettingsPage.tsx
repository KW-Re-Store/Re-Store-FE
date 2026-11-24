import chevronDownIcon from "../assets/icons/chevron-down.svg";
import userHomeIcon from "../assets/icons/user-home.svg";
import { checkApiHealth } from "../api/client";
import ApiStatus from "../components/ApiStatus";
import Icon from "../components/Icon";
import { API_BASE_URL } from "../config/env";
import { useApi } from "../hooks/useApi";

function SettingsPage() {
  const health = useApi((signal) => checkApiHealth(signal), []);

  return (
    <section className="workspace">
      <header className="topbar">
        <div>
          <h1>설정</h1>
          <p>시스템 연결 상태와 데이터 기준을 확인합니다.</p>
          <ApiStatus loading={health.loading} error={health.error} />
        </div>
        <div className="filters">
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

      <div className="settings-grid">
        <article className="pm-panel">
          <div className="pm-panel-head">
            <h3>API 연결</h3>
          </div>
          <dl className="settings-list">
            <div>
              <dt>API 주소</dt>
              <dd>{API_BASE_URL}</dd>
            </div>
            <div>
              <dt>상태</dt>
              <dd>{health.data ? `${health.data.status.toUpperCase()} · ${health.data.message}` : health.error ?? "확인 중…"}</dd>
            </div>
            <div>
              <dt>마지막 확인</dt>
              <dd>{health.data ? new Date(health.data.timestamp).toLocaleString("ko-KR") : "-"}</dd>
            </div>
          </dl>
          <button className="btn-outline" type="button" onClick={health.reload}>
            다시 확인
          </button>
        </article>

        <article className="pm-panel">
          <div className="pm-panel-head">
            <h3>데이터 기준</h3>
          </div>
          <dl className="settings-list">
            <div>
              <dt>대상 지역</dt>
              <dd>서울특별시 노원구 (19개 행정동)</dd>
            </div>
            <div>
              <dt>분석 기간</dt>
              <dd>2024 Q1 ~ 2025 Q4</dd>
            </div>
            <div>
              <dt>원천 데이터</dt>
              <dd>점포/개폐업, 추정매출, 유동인구 추정, 공실률 추정</dd>
            </div>
            <div>
              <dt>행정동 경계</dt>
              <dd>행정안전부 행정동 경계 (GeoJSON)</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}

export default SettingsPage;
