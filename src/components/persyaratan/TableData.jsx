import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const TableData = ({
  data,
  startIndex,
  handlePrev,
  handleNext,
  handleDelete,
}) => {
  return (
    <>
      <div className="overflow-x-auto flex flex-col px-4 mt-2">
        <table className="w-full bg-white rounded-t-lg text-slate-700 drop-shadow-md">
          <thead className="shadow-sm font-extralight text-sm">
            <tr>
              <th className="p-2 px-6">No</th>
              <th className="p-2 px-6">Jenis Persyaratan</th>
              <th className="p-2 px-6">Berkas Persyaratan</th>
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
                <td className="text-center">{item.jenisPersyaratan}</td>
                <td className="text-center">
                  {item.berkasPersyaratan.join(", ")}
                </td>
                <td className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <Link
                      to={`/kelola-persyaratan/edit/${item.id}`}
                      className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1"
                    >
                      Ubah
                    </Link>
                    <button
                      className="p-2 bg-red-200 rounded-md hover:bg-red-300"
                      onClick={handleDelete}
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
        <div className="mb-10" />
      </div>
    </>
  );
};

export default TableData;

TableData.propTypes = {
  data: PropTypes.array,
  startIndex: PropTypes.number,
  handlePrev: PropTypes.func,
  handleNext: PropTypes.func,
  handleDelete: PropTypes.func,
};
