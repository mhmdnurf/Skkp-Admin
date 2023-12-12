import PropTypes from "prop-types";

const Pagination = ({ currentPage, itemsPerPage, data, setCurrentPage }) => {
  return (
    <div className="flex justify-between items-center bg-white drop-shadow-md rounded-b-lg p-2">
      <p className="text-xs text-slate-600 ml-2">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, data.length)} to{" "}
        {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}{" "}
        results
      </p>

      <div className="flex">
        <button
          className="px-3 py-2 text-xs bg-slate-300 text-slate-600 rounded-md hover:bg-slate-400 mr-1"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-3 py-2 text-xs text-slate-600 bg-slate-300 rounded-md hover:bg-slate-400"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};

export default Pagination;
