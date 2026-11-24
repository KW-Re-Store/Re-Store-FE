type Props = {
  loading: boolean;
  error: string | null;
};

/** 페이지 상단의 API 연결 상태 표시. */
function ApiStatus({ loading, error }: Props) {
  if (error) return <span className="api-status offline">● API 오프라인 · {error}</span>;
  if (loading) return <span className="api-status loading">● API 불러오는 중…</span>;
  return <span className="api-status connected">● API 연결됨</span>;
}

export default ApiStatus;
