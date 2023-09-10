import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../../../utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const HomeJadwalSidang = () => {
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 5;
  // const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "jadwalSidang"), orderBy("tanggalSidang", "desc")),
      async (snapshot) => {
        const promises = snapshot.docs.map(async (doc) => {
          const data = doc.data();

          if (
            data.periodePendaftaran.tanggalTutup &&
            data.periodePendaftaran.tanggalTutup.toDate() < new Date() &&
            !data.manualStatus // Tambahkan pengecekan manualStatus di sini
          ) {
            const docRef = doc.ref;
            await updateDoc(docRef, {
              status: "Tidak Aktif",
            });
          }

          return {
            id: doc.id,
            ...data,
          };
        });

        const fetchedData = await Promise.all(promises);
        setData(fetchedData);
        setIsLoading(false);
      }
    );
    if (loading) return;
    if (!user) return navigate("/login");

    // Membersihkan langganan saat komponen di-unmount
    return () => unsubscribe();
  }, [loading, user, navigate]);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "jadwalSidang", id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const pengajuanSnapshot = await getDocs(collection(db, "sidang"));

        let isUsedInPengajuan = false;

        pengajuanSnapshot.forEach((doc) => {
          const pengajuanData = doc.data();
          if (docRef.id === pengajuanData.jadwalSidang_uid) {
            isUsedInPengajuan = true;
          }
        });

        if (isUsedInPengajuan) {
          Swal.fire(
            "Error",
            "Periode pendaftaran sudah digunakan di data pengajuan!",
            "error"
          );
        } else {
          const result = await Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Data akan hilang permanen ketika dihapus",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#334155",
            cancelButtonColor: "#94a3b8",
            cancelButtonText: "Batal",
            confirmButtonText: "Confirm",
          });

          if (result.isConfirmed) {
            await deleteDoc(docRef);
            Swal.fire("Success", "Data Berhasil dihapus!", "success");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = currentPage * itemsPerPage;

  return (
    <>
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center h-screen bg-slate-100">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <>
          <div className="flex bg-slate-100 h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 bg-slate-600">
                Kelola Jadwal Sidang
              </h1>
              <div className="flex justify-between mt-16">
                <div className="flex items-center ml-4 ">
                  <Link
                    to={"/kelola-jadwal/sidang/create"}
                    className="px-4 py-2 border w-[200px] rounded-md drop-shadow-lg bg-slate-600 text-white font-bold hover:bg-slate-700 text-center"
                  >
                    Buka Jadwal Sidang
                  </Link>
                </div>
                <div className="flex items-center mr-4">
                  <input
                    type="text"
                    className="px-4 py-2 border w-[400px] rounded-md drop-shadow-sm"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabel Data */}
              <div className="overflow-x-auto flex flex-col px-4 mt-2">
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
                    {data.slice(startIdx, endIdx).map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-2 px-6">{startIdx + index + 1}</td>
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
                            new Date(
                              item.tanggalSidang.toDate()
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
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
                {/* Pagination */}
                <div className="flex justify-between items-center bg-white drop-shadow-md rounded-b-lg p-2">
                  <p className="text-xs text-slate-600 ml-2">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      data.length
                    )}{" "}
                    to {Math.min(currentPage * itemsPerPage, data.length)} of{" "}
                    {data.length} results
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
                      disabled={
                        currentPage === Math.ceil(data.length / itemsPerPage)
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="mb-10" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
