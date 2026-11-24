import { useEffect, useState } from "react";

import { fetchRiskAreas, type RiskArea } from "../api/client";

/** 행정동별 위험 상권 목록을 BE(/dashboard/areas)에서 가져옵니다. 실패 시 빈 배열. */
export function useRiskAreas() {
  const [areas, setAreas] = useState<RiskArea[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchRiskAreas(controller.signal)
      .then(setAreas)
      .catch(() => setAreas([]));
    return () => controller.abort();
  }, []);

  return areas;
}
