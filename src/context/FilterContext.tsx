import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Filters = {
  region: string;
  dong: string;
  year: string;
};

type FilterContextValue = Filters & {
  setRegion: (value: string) => void;
  setDong: (value: string) => void;
  setYear: (value: string) => void;
};

const defaultFilters: Filters = {
  region: "노원구",
  dong: "전체 행정동",
  year: "2024년"
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState(defaultFilters.region);
  const [dong, setDong] = useState(defaultFilters.dong);
  const [year, setYear] = useState(defaultFilters.year);

  const value = useMemo(
    () => ({ region, dong, year, setRegion, setDong, setYear }),
    [region, dong, year]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
