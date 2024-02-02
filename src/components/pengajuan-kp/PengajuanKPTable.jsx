import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PengajuanKPTable = ({ data, startIndex, handleDelete }) => {
  return (
    <table className="overflow-x-auto block bg-white rounded-t-lg text-slate-700 drop-shadow-md uppercase">
      <thead className=" shadow-sm font-extralight text-sm">
        <tr className="">
          <th className="p-2 px-6">No</th>
          <th className="p-2 px-6 whitespace-nowrap">Tanggal Daftar</th>
          <th className="p-2 px-6">NIM</th>
          <th className="p-2 px-6">Nama</th>
          <th className="p-2 px-6">Jurusan</th>
          <th className="p-2 px-6">Judul</th>
          <th className="p-2 px-6">Status</th>
          <th className="p-2 px-6">Catatan</th>
          <th className="p-2 px-6">Pembimbing</th>
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
            <td className="text-center whitespace-nowrap px-8">
              {item.createdAt &&
                new Date(item.createdAt.seconds * 1000).toLocaleDateString(
                  "id-ID",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
            </td>
            <td className="text-center whitespace-nowrap px-8">{item.nim}</td>
            <td className="text-center whitespace-nowrap px-8">{item.nama}</td>
            <td className="text-center whitespace-nowrap px-8">{item.prodi}</td>
            <td className="text-center px-8 whitespace-nowrap">{item.judul}</td>
            <td className="text-center whitespace-nowrap px-8">
              {item.status}
            </td>
            <td className="text-center px-8 whitespace-nowrap">
              {item.catatan ? item.catatan : "-"}
            </td>
            <td className="text-center px-8 whitespace-nowrap">
              {item.namaPembimbing ? item.namaPembimbing : "-"}
            </td>
            <td className="text-center p-4 normal-case">
              <div className="flex">
                <Link
                  to={`/pengajuan-kp/detail/${item.id}`}
                  className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1"
                >
                  Detail
                </Link>
                <button
                  className="p-2 bg-red-200 rounded-md hover:bg-red-300"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

PengajuanKPTable.propTypes = {
  data: PropTypes.array.isRequired,
  startIndex: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default PengajuanKPTable;
