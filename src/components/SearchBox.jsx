function SearchBox({
  keyword,
  setKeyword,
  onSearch
}) {
  return (
    <div className="search-box">
      <h2>🔍 作品を検索</h2>

      <input
        type="text"
        placeholder="見たい作品名を入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />

      <button onClick={onSearch}>
        検索
      </button>
    </div>
  );
}

export default SearchBox;