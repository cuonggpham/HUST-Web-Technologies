// State Lifting: Component nay khong quan ly state,
// ma lift gia tri len component cha thong qua onChangeValue
function SearchForm({ onChangeValue }) {
  return (
    // Controlled Component: moi khi input thay doi,
    // gia tri duoc gui len component cha (App) thong qua onChangeValue
    <input
      type="text"
      placeholder="Tìm theo name, username"
      onChange={(e) => onChangeValue(e.target.value)}
    />
  );
}

export default SearchForm;