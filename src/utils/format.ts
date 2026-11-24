/** 차트 y축 눈금: 데이터 범위를 감싸는 보기 좋은 간격(1·2·5·10 단위)의 눈금 목록. */
export function niceTicks(values: number[], count = 5): number[] {
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;
  const rawStep = span / (count - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ?? rawStep;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Math.round(value * 100) / 100);
  }
  return ticks;
}

/** 부호를 붙인 수치: +3.1%p / -2.6% */
export function signed(value: number, unit = "") {
  return `${value > 0 ? "+" : ""}${value}${unit}`;
}

/** 변화량 화살표 표기: ▲ 3.1%p / ▼ 2.6%p */
export function arrow(value: number, unit = "") {
  if (value === 0) return "-";
  return `${value > 0 ? "▲" : "▼"} ${Math.abs(value).toLocaleString("ko-KR")}${unit}`;
}

export function toneOf(value: number) {
  return value >= 0 ? "up" : "down";
}

export function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}

/** "전체 행정동" 같은 필터 값을 실제 행정동 이름으로 바꿉니다. */
export function resolveDistrict(dong: string, fallback: string) {
  return !dong || dong === "전체 행정동" ? fallback : dong;
}
