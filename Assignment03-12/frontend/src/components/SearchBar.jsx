import './SearchBar.css'

const SearchBar = ({ searchTerm, onSearchChange, sortAsc, onToggleSort }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm theo tên..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button onClick={onToggleSort} className="sort-button">
        {sortAsc ? 'Tên A-Z' : 'Tên Z-A'}
      </button>
    </div>
  )
}

export default SearchBar
