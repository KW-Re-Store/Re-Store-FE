import { Link, useLocation } from "react-router-dom";

import guideIcon from "../assets/icons/guide.svg";
import navAnalysisIcon from "../assets/icons/nav-analysis.svg";
import navDashboardIcon from "../assets/icons/nav-dashboard.svg";
import navPolicyIcon from "../assets/icons/nav-policy.svg";
import navRecommendIcon from "../assets/icons/nav-policy-recommendation.svg";
import navSettingsIcon from "../assets/icons/nav-settings.svg";
import policyBuildingIcon from "../assets/icons/policy-building.svg";
import Icon from "./Icon";

const navItems = [
  { label: "대시보드", path: "/대시보드", icon: navDashboardIcon },
  { label: "상권 분석", path: "/상권분석", icon: navAnalysisIcon },
  { label: "정책 추천", path: "/정책추천", icon: navRecommendIcon },
  { label: "정책 관리", path: "/정책관리", icon: navPolicyIcon },
  { label: "설정", path: "/설정", icon: navSettingsIcon }
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-mark" src={policyBuildingIcon} alt="" />
        <div>
          <strong>상권정책</strong>
          <span>의사결정 지원 시스템</span>
        </div>
      </div>

      <nav className="nav-menu" aria-label="주요 메뉴">
        {navItems.map((item) => (
          <Link key={item.path} className={location.pathname === item.path ? "active" : ""} to={item.path}>
            <Icon src={item.icon} alt="" /> {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="guide-button" type="button">
          <span>
            <Icon src={guideIcon} alt="" />
          </span>
          사용자 가이드 <b>›</b>
        </button>
        <div className="contact">
          <strong>상권정책 문의</strong>
          <span>☎ 02-1234-5678</span>
          <span>help@nowon.go.kr</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
