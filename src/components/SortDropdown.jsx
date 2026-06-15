import './SortDropdown.css';

function SortDropdown({ sortOption, onSortChange }) {
  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="title">Title (A-Z)</option>
        <option value="release_date">Release Date (Newest)</option>
        <option value="vote_average">Vote Average (Highest)</option>
      </select>
    </div>
  );
}

export default SortDropdown;
