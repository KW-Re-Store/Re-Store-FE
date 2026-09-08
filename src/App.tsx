import { useCallback, useEffect, useState } from "react";

import { checkApiHealth } from "./api/client";

type ApiState = "idle" | "loading" | "online" | "offline";

function App() {
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [apiMessage, setApiMessage] = useState("API 연결을 확인해 주세요.");

  const refreshHealth = useCallback(async () => {
    setApiState("loading");

    try {
      const health = await checkApiHealth();
      setApiState("online");
      setApiMessage(health.message);
    } catch {
      setApiState("offline");
      setApiMessage("백엔드 서버에 연결할 수 없습니다.");
    }
  }, []);

  useEffect(() => {
    void refreshHealth();
  }, [refreshHealth]);

  const statusLabel =
    apiState === "online" ? "Online" : apiState === "offline" ? "Offline" : "Checking";

  return (
    <main className="app">
      <section className="shell" aria-labelledby="app-title">
        <div className="header">
          <span className="kicker">Re-Store</span>
          <h1 id="app-title">React 웹 앱 준비 완료</h1>
          <p>프론트는 Vite 기반 React 웹 앱으로, 백엔드는 Node.js API와 연결되도록 시작점을 잡았습니다.</p>
        </div>

        <div className="status-panel">
          <div className="status-row">
            <span className={`status-dot ${apiState}`} aria-hidden="true" />
            <strong>Backend {statusLabel}</strong>
            {apiState === "loading" ? <span className="spinner" aria-label="확인 중" /> : null}
          </div>
          <p>{apiMessage}</p>
        </div>

        <button type="button" onClick={refreshHealth}>
          API 다시 확인
        </button>
      </section>
    </main>
  );
}

export default App;
