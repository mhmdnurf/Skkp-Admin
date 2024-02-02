import PropTypes from "prop-types";

const Pagination = ({ handleNext, handlePrev }) => {
  return (
    <div className="flex justify-end items-center bg-white drop-shadow-md rounded-b-lg p-2">
      <div className="flex">
        <button
          className="px-3 py-2 text-xs bg-slate-300 text-slate-600 rounded-md hover:bg-slate-400 mr-1"
          onClick={handlePrev}
        >
          Previous
        </button>
        <button
          className="px-3 py-2 text-xs text-slate-600 bg-slate-300 rounded-md hover:bg-slate-400"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
};

export default Pagination;
