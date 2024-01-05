import { FaHistory, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const TopTable = ({ value, onClick, onChange, onClickReset }) => {
  return (
    <>
      <div className="flex justify-between mt-16">
        <div className="flex items-center ml-4 ">
          <Link
            to={"/tahun-ajaran/create"}
            className="px-4 py-2 border w-[200px] rounded-md drop-shadow-lg bg-slate-600 text-white font-bold hover:bg-slate-700"
          >
            Tambah Tahun Ajaran
          </Link>
        </div>
        <div className="flex items-center mr-4">
          <input
            type="text"
            className="px-4 py-2 border w-[400px] rounded-md drop-shadow-sm"
            placeholder="Search..."
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClick();
              }
            }}
          />
          <button
            className="ml-2 bg-slate-600 p-2 rounded shadow drop-shadow"
            type="button"
            onClick={onClick}
          >
            <FaSearch size={20} color="white" />
          </button>
          <button
            className="ml-2 bg-slate-600 p-2 rounded shadow drop-shadow"
            type="button"
            onClick={onClickReset}
          >
            <FaHistory size={20} color="white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default TopTable;
TopTable.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClickReset: PropTypes.func.isRequired,
};
