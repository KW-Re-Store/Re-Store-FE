import calendarIcon from "../assets/icons/calendar.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import { useFilters } from "../context/FilterContext";
import Icon from "./Icon";

function FilterDisplay() {
  const { region, dong, year } = useFilters();

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
