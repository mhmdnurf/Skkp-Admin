import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const JadwalSidangTable = ({ data, startIndex, handleDelete }) => {
  return (
    <>
      <table className="w-full bg-white rounded-t-lg text-slate-700 drop-shadow-md">
        <thead className="shadow-sm font-extralight text-sm">
          <tr>
            <th className="p-2 px-6 text-center">No</th>
            <th className="p-2 px-6 text-center">Tanggal Periode</th>
            <th className="p-2 px-6 text-center">Tanggal Sidang</th>
            <th className="p-2 px-6 text-center">Jenis Sidang</th>
            <th className="p-2 px-6 text-center">Status</th>
            <th className="p-2 px-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="rounded-b-md text-sm text-center">
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="p-2 px-6">{startIndex + index}</td>
              <td className="p-2 px-6">
                {item.periodePendaftaran.tanggalBuka &&
                  new Date(
                    item.periodePendaftaran.tanggalBuka.toDate()
                  ).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                -{" "}
                {item.periodePendaftaran.tanggalTutup &&
                  new Date(
                    item.periodePendaftaran.tanggalTutup.toDate()
                  ).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
              </td>
              <td className="p-2 px-6">
                {item.tanggalSidang &&
                  new Date(item.tanggalSidang.toDate()).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
              </td>
              <td className="p-2 px-6">
                <ul className="list-none">
                  {item.jenisSidang.map((jenis) => (
                    <li key={jenis}>{jenis}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2 px-6">{item.status}</td>

              <td className="p-2 px-6">
                <div className="flex items-center justify-center">
                  <Link
                    to={`/kelola-jadwal/sidang/edit/${item.id}`}
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
    </>
  );
};

JadwalSidangTable.propTypes = {
  data: PropTypes.array.isRequired,
  startIndex: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default JadwalSidangTable;
