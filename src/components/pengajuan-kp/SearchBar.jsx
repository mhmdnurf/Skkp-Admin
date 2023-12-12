import PropTypes from "prop-types";

const SearchBar = ({ searchText, setSearchText }) => {
  return (
    <>
      <div className="flex-grow">
        <input
          type="text"
          className="px-4 py-2 border rounded-md shadow-sm w-[500px]"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </>
  );
};

SearchBar.propTypes = {
  searchText: PropTypes.string,
  setSearchText: PropTypes.func,
};

export default SearchBar;
