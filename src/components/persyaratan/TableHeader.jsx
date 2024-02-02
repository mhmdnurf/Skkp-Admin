import PropTypes from "prop-types";
import { FaHistory, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const TableHeader = ({ value, onChange, onClick, onClickReset }) => {
  return (
    <>
      <div className="flex justify-between mt-16">
        <div className="flex items-center ml-4">
          <Link
            to={"/kelola-persyaratan/create"}
            className="px-4 py-2 border rounded-md drop-shadow-lg bg-slate-600 text-white font-bold hover:bg-slate-700"
          >
            Tambah Persyaratan
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

export default TableHeader;

TableHeader.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onClickReset: PropTypes.func,
};
