import { useCallback, useEffect, useState } from "react";

export type ApiState<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  reload: () => void;
};

/** fetcher(signal)를 deps가 바뀔 때마다 호출합니다. 실패하면 error에 메시지를 담고 data는 마지막 값을 유지합니다. */
export function useApi<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: unknown[]): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const reload = useCallback(() => setVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetcher(controller.signal)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  return { data, error, loading, reload };
}
