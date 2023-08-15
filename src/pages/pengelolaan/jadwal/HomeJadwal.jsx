import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";

export const HomeJadwal = () => {
  const data = [
    {
      no: 1,
      tahunAjaran: "2022/2023",
    },
    {
      no: 2,
      tahunAjaran: "2023/2024",
    },
    {
      no: 3,
      tahunAjaran: "2022/2023",
    },
    {
      no: 4,
      tahunAjaran: "2023/2024",
    },
    {
      no: 5,
      tahunAjaran: "2022/2023",
    },
    {
      no: 6,
      tahunAjaran: "2023/2024",
    },
  ];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 1000);
  }, [isLoading]);
  return (
    <div className="flex bg-slate-100 h-screen">
      <Sidebar />
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <>
          <div className="flex flex-col w-full">
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 w-1/2 bg-slate-600">
              Kelola Jadwal
            </h1>
            <div className="flex items-center mt-16 mx-4 justify-end">
              <input
                type="text"
                className="px-4 py-2 border w-[400px] rounded-md drop-shadow-sm"
                placeholder="Search..."
              />
            </div>

            {/* Tabel Data */}
            <div className="overflow-x-auto flex flex-col px-4 mt-2">
              <table className="w-full bg-white rounded-lg text-slate-700 drop-shadow-md">
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
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.tahunAjaran}</td>
                      <td className="text-center p-4">
                        <div className="flex items-center justify-center">
                          <button className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1">
                            Ubah
                          </button>
                          <button className="p-2 bg-red-200 rounded-md hover:bg-red-300">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
