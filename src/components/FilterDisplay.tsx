import calendarIcon from "../assets/icons/calendar.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import { useFilters } from "../context/FilterContext";
import Icon from "./Icon";

type FilterDisplayProps = {
  editable?: boolean;
};

const dongOptions = ["전체 행정동", "상계10동", "상계9동", "하계1동", "상계6,7동", "월계2동"];
const yearOptions = ["2024년", "2023년", "2022년"];

function FilterDisplay({ editable = false }: FilterDisplayProps) {
  const { region, dong, year, setRegion, setDong, setYear } = useFilters();

  if (editable) {
    return (
      <>
        <label className="filter-select">
          <span className="sr-only">구 선택</span>
          <span aria-hidden="true">{region}</span>
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            <option>노원구</option>
          </select>
          <Icon src={chevronDownIcon} alt="" />
        </label>
        <label className="filter-select">
          <span className="sr-only">행정동 선택</span>
          <span aria-hidden="true">{dong}</span>
          <select value={dong} onChange={(event) => setDong(event.target.value)}>
            {dongOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <Icon src={chevronDownIcon} alt="" />
        </label>
        <label className="filter-select">
          <span className="sr-only">연도 선택</span>
          <span aria-hidden="true">{year}</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            {yearOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <Icon src={calendarIcon} alt="" />
        </label>
      </>
    );
  }

  return (
    <>
      <span className="filter-static">
        {region}
        <Icon src={chevronDownIcon} alt="" />
      </span>
      <span className="filter-static">
        {dong}
        <Icon src={chevronDownIcon} alt="" />
      </span>
      <span className="filter-static">
        {year}
        <Icon src={calendarIcon} alt="" />
      </span>
    </>
  );
}

export default FilterDisplay;
