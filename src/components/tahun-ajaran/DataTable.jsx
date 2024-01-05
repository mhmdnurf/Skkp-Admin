import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const DataTable = ({
  data,
  startIndex,
  handleDelete,
  handlePrev,
  handleNext,
}) => {
  return (
    <div className="overflow-x-auto flex flex-col px-4 mt-2">
      <table className="w-full bg-white rounded-t-lg text-slate-700 drop-shadow-md">
        <thead className="shadow-sm font-extralight text-sm">
          <tr>
            <th className="p-2 px-6">No</th>
            <th className="p-2 px-6">Tahun Ajaran</th>
            <th className="p-2 px-6">Action</th>
          </tr>
        </thead>
        <tbody className="rounded-b-md text-sm">
          {data.map((item, index) => (
            <tr
              key={item.id}
              className="hover:bg-slate-100 border-b border-t border-slate-300"
            >
              <td className="text-center">{startIndex + index}</td>
              <td className="text-center">{item.tahun}</td>
              <td className="text-center p-4">
                <div className="flex items-center justify-center">
                  <Link
                    to={`/tahun-ajaran/edit/${item.id}`}
                    className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1"
                  >
                    Ubah
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-200 rounded-md hover:bg-red-300"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-end items-center bg-white drop-shadow-md rounded-b-lg p-2">
        <div className="flex">
          <button
            className="px-3 py-2 text-xs bg-slate-300 text-slate-600 rounded-md hover:bg-slate-400 mr-1"
            onClick={() => handlePrev({ item: data[0] })}
          >
            Previous
          </button>
          <button
            className="px-3 py-2 text-xs text-slate-600 bg-slate-300 rounded-md hover:bg-slate-400"
            onClick={() => handleNext({ item: data[data.length - 1] })}
          >
            Next
          </button>
        </div>
      </div>
      <div className="mb-10" />
    </div>
  );
};

export default DataTable;

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  startIndex: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
};
