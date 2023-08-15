import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";

export const HomePengajuanSkripsi = () => {
  const data = [
    {
      no: 1,
      tanggalDaftar: "2023-06-01",
      judul:
        "Aplikasi Kerja Praktek dan Skripsi Berbasis Android Menggunakan Framework React Native dan Firebase di Sekolah Tinggi Teknologi Indonesia Tanjungpinang",
      status: "Belum Verifikasi",
      catatan: "-",
      dosenPembimbing: "Bawazir Esa Putra",
    },
    {
      no: 2,
      tanggalDaftar: "2023-06-05",
      judul:
        "Sistem Informasi Perpustakaan Berbasis Web dengan Metode Agile di SD Negeri 017 Senayanag",
      status: "Revisi",
      catatan: "Revisi diperlukan",
      dosenPembimbing: "Tarisya",
    },
  ];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 2000);
  }, [isLoading]);

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        <Sidebar />
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <InfinitySpin width="200" color="#475569" />
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-10 w-1/2 bg-slate-600">
                Data Pengajuan Skripsi
              </h1>
              <div className="flex items-center mt-4 mb-2 mx-2 justify-end mr-4">
                <input
                  type="text"
                  className="px-4 py-2 border w-[400px] rounded-md drop-shadow-sm"
                  placeholder="Search..."
                />
              </div>

              {/* Tabel Data */}
              <div className="overflow-x-auto flex flex-col px-4 mt-2">
                <table className="w-full bg-white rounded-lg text-slate-700 drop-shadow-md">
                  <thead className=" shadow-sm font-extralight text-sm">
                    <tr className="">
                      <th className="p-2 px-6">No</th>
                      <th className="p-2 px-6">Tanggal Daftar</th>
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
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{item.tanggalDaftar}</td>
                        <td className="align-middle justify-center items-center p-4">
                          {item.judul}
                        </td>
                        <td className="text-center">{item.status}</td>
                        <td className="text-center p-4">{item.catatan}</td>
                        <td className="text-center p-6">
                          {item.dosenPembimbing}
                        </td>
                        <td className="text-center p-4">
                          <div className="flex">
                            <button className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1">
                              Lihat
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
    </>
  );
};
