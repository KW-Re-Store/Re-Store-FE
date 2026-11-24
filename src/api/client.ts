import { API_BASE_URL } from "../config/env";

type HealthResponse = {
  status: "ok";
  message: string;
  timestamp: string;
};

export type SummaryMetric = {
  key: string;
  label: string;
  value: number;
  unit: string;
  note: string;
  trend: "up" | "down" | "flat";
};

export type TopRiskArea = {
  rank: number;
  districtName: string;
  riskGrade: string;
  riskScore: number;
};

export type CauseSummary = {
  label: string;
  value: string;
  tag: string;
};

export type PolicyRecommendation = {
  districtName: string;
  causeType: string;
  policies: string[];
  priority: string;
  expectedClosureRateImprovementPoint: number;
  expectedSalesImprovementRate: number;
};

export type RiskArea = {
  rank: number;
  districtCode: string;
  districtName: string;
  riskGrade: string;
  riskScore: number;
  closureRate: number;
  closureRateChangePoint: number;
  salesChangeRate: number;
  footTrafficChangeRate: number;
  storeChangeRate: number;
  startupClosureRatio: number;
  overcrowdingRate: number;
  vacancyRate: number;
  causeType: string;
  causeSummary: string;
  recommendedPolicies: string[];
};

export type DashboardResponse = {
  model: {
    name: string;
    period: string;
    area: string;
    dataSource: string[];
    note: string;
  };
  summary: SummaryMetric[];
  averageRiskScore: { value: number; changePoint: number };
  topRiskAreas: TopRiskArea[];
  causes: CauseSummary[];
  indicators: SummaryMetric[];
  policyRecommendations: PolicyRecommendation[];
  areas: RiskArea[];
};

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });

  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function checkApiHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return getJson<HealthResponse>("/health", signal);
}

export function fetchDashboard(signal?: AbortSignal): Promise<DashboardResponse> {
  return getJson<DashboardResponse>("/dashboard", signal);
}

export async function fetchRiskAreas(signal?: AbortSignal): Promise<RiskArea[]> {
  const data = await getJson<{ areas: RiskArea[] }>("/dashboard/areas", signal);
  return data.areas;
}

async function sendJson<T>(method: "POST" | "PATCH", path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message ?? `${method} ${path} failed: ${response.status}`);
  }
  return data;
}

const enc = encodeURIComponent;

/* ---------- 상권 분석 ---------- */

export type ChangeIndicator = {
  key: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  changeUnit: string;
  trend: "up" | "down";
};

export type ChartSeries = { key: string; label: string; values: number[] };

export type TradeAreaResponse = {
  overview: {
    districtCode: string;
    districtName: string;
    riskGrade: string;
    riskScore: number;
    riskScoreChange: number;
    rank: number;
    totalDistricts: number;
    indicators: ChangeIndicator[];
  };
  status: {
    commercialType: string;
    areaKm2: number;
    storeCount: number;
    dailyFootTraffic: number;
    mainIndustries: string[];
  };
  trend: { quarters: string[]; series: ChartSeries[] };
  industries: { label: string; storeCount: number; share: number; changeRate: number }[];
  causes: { key: string; label: string; score: number }[];
  insights: string[];
};

export function fetchTradeArea(districtName: string, signal?: AbortSignal) {
  return getJson<TradeAreaResponse>(`/trade-areas/${enc(districtName)}`, signal);
}

export async function fetchTradeAreaDistricts(signal?: AbortSignal) {
  const data = await getJson<{ districts: string[] }>("/trade-areas", signal);
  return data.districts;
}

/* ---------- 정책 추천 ---------- */

export type PolicyMetric = { key: string; label: string; value: number; unit: string };

export type RecommendedPolicy = {
  rank: number;
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  rating: number;
  matchesCause: boolean;
  metrics: PolicyMetric[];
  durationMonths: number;
  budgetMillionWon: number;
};

export type PolicySimulation = {
  policyIds: string[];
  totalBudgetMillionWon: number;
  durationMonths: number;
  summary: PolicyMetric[];
  quarters: string[];
  series: ChartSeries[];
};

export type RecommendationResponse = {
  districtName: string;
  riskGrade: string;
  causeType: string;
  recommendations: RecommendedPolicy[];
  relatedPrograms: { id: string; title: string; description: string; status: string }[];
  simulation: PolicySimulation;
};

export function fetchRecommendations(districtName: string, limit: number, signal?: AbortSignal) {
  return getJson<RecommendationResponse>(`/policies/recommendations?district=${enc(districtName)}&limit=${limit}`, signal);
}

export function fetchSimulation(policyIds: string[], signal?: AbortSignal) {
  return getJson<PolicySimulation>(`/policies/simulation?policyIds=${policyIds.map(enc).join(",")}`, signal);
}

/* ---------- 정책 관리 ---------- */

export type ProgramStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

export const programStatusLabel: Record<ProgramStatus, string> = {
  PLANNED: "계획",
  IN_PROGRESS: "추진 중",
  COMPLETED: "완료"
};

export type PolicyProgram = {
  id: string;
  name: string;
  category: string;
  districtName: string;
  status: ProgramStatus;
  budgetMillionWon: number;
  executedMillionWon: number;
  targetAchievementRate: number;
  keyResult: string;
};

export type ManagementOverview = {
  kpis: ChangeIndicator[];
  quarters: string[];
  trend: ChartSeries[];
  topPrograms: {
    rank: number;
    id: string;
    name: string;
    budgetMillionWon: number;
    executionRate: number;
    targetAchievementRate: number;
    keyResult: string;
  }[];
  regions: { districtName: string; score: number; yearOverYear: number }[];
  progress: {
    inProgress: number;
    completed: number;
    planned: number;
    total: number;
    executedMillionWon: number;
    budgetMillionWon: number;
    executionRate: number;
  };
  beforePeriod: string;
  afterPeriod: string;
  beforeAfter: { key: string; label: string; before: number; after: number; change: number; unit: string; changeUnit: string }[];
};

export function fetchManagementOverview(signal?: AbortSignal) {
  return getJson<ManagementOverview>("/policy-programs/overview", signal);
}

export async function fetchPrograms(signal?: AbortSignal) {
  const data = await getJson<{ programs: PolicyProgram[] }>("/policy-programs", signal);
  return data.programs;
}

export type ProgramInput = {
  name: string;
  category: string;
  districtName: string;
  budgetMillionWon: number;
};

export function createProgram(input: ProgramInput) {
  return sendJson<PolicyProgram>("POST", "/policy-programs", input);
}

export function updateProgram(id: string, patch: { status?: ProgramStatus; executedMillionWon?: number }) {
  return sendJson<PolicyProgram>("PATCH", `/policy-programs/${enc(id)}`, patch);
}
