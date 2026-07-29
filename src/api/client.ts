import { API_BASE_URL } from "../config/env";

type HealthResponse = {
  status: "ok";
  message: string;
  timestamp: string;
};

export async function checkApiHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}
