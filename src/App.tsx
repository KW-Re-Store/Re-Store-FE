import { Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import PolicyManagementPage from "./pages/PolicyManagementPage";
import PolicyRecommendationPage from "./pages/PolicyRecommendationPage";
import TradeAreaAnalysisPage from "./pages/TradeAreaAnalysisPage";

function App() {
  return (
    <main className="dashboard">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/대시보드" replace />} />
        <Route path="/대시보드" element={<DashboardPage />} />
        <Route path="/상권분석" element={<TradeAreaAnalysisPage />} />
        <Route path="/정책추천" element={<PolicyRecommendationPage />} />
        <Route path="/정책관리" element={<PolicyManagementPage />} />
      </Routes>
    </main>
  );
}

export default App;
