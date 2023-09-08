import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { auth, db } from "../../../../utils/firebase";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  where,
  getDocs,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const HomeMahasiswa = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "users"), where("role", "==", "Mahasiswa")),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredData = fetchedData.filter(
          (item) =>
            item.nama.toLowerCase().includes(searchText.toLowerCase()) ||
            item.email.toLowerCase().includes(searchText.toLowerCase()) ||
            item.nim.toLowerCase().includes(searchText.toLowerCase()) ||
            item.jurusan.toLowerCase().includes(searchText.toLowerCase())
        );
        setData(filteredData);
        setIsLoading(false);
      }
    );

    if (loading) return;
    if (!user) return navigate("/login");

    // Cleanup: unsubscribe when the component unmounts or when the effect re-runs
    return () => unsubscribe();
  }, [user, loading, navigate, searchText]);

  const mahasiswaTerikat = async (id) => {
    try {
      // Buat kueri untuk mengambil pengajuan yang terkait dengan dosenId
      const pengajuanQuery = query(
        collection(db, "pengajuan"),
        where("user_uid", "==", id)
      );
      const pengajuanSnapshot = await getDocs(pengajuanQuery);

      // Buat kueri untuk mengambil sidang yang terkait dengan dosenId
      const sidangQuery = query(
        collection(db, "sidang"),
        where("user_uid", "==", id)
      );
      const sidangSnapshot = await getDocs(sidangQuery);

      // Jika ada pengajuan atau sidang yang terkait, kembalikan true
      return !pengajuanSnapshot.empty || !sidangSnapshot.empty;
    } catch (error) {
      console.error("Error checking data: ", error);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      const isMahasiswaTerikat = await mahasiswaTerikat(id);
      if (isMahasiswaTerikat) {
        Swal.fire(
          "Error",
          "Mahasiswa terkait dengan pengajuan atau sidang. Tidak dapat dihapus.",
          "error"
        );
        return;
      }

      const result = await Swal.fire({
        title: "Apakah Anda Yakin?",
        text: "Data akan hilang permanen ketika dihapus",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Batal",
        confirmButtonText: "Confirm",
      });

      if (result.isConfirmed) {
        const docRef = doc(db, "users", id);
        await deleteDoc(docRef);
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center h-screen bg-slate-100">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <>
          <div className="flex bg-slate-100 min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 bg-slate-600">
                Data Mahasiswa
              </h1>
              <div className="flex justify-between mt-16">
                <div className="flex items-center ml-4 " />
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

              <div className="overflow-x-auto flex flex-col px-4 mt-2">
                <table className="w-full bg-white rounded-t-lg text-slate-700 drop-shadow-md">
                  <thead className="shadow-sm font-extralight text-sm">
                    <tr>
                      <th className="p-2 px-6">No</th>
                      <th className="p-2 px-6">NIM</th>
                      <th className="p-2 px-6">Nama</th>
                      <th className="p-2 px-6">Jurusan</th>
                      <th className="p-2 px-6">Email</th>
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
                        <td className="text-center">{item.nim}</td>
                        <td className="text-center whitespace-nowrap">
                          {item.nama}
                        </td>
                        <td className="text-center">{item.jurusan}</td>
                        <td className="text-center">{item.email}</td>
                        <td className="text-center p-4">
                          <div className="flex justify-center items-center">
                            <Link
                              to={`/kelola-pengguna/mahasiswa/edit/${item.id}`}
                              className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1"
                            >
                              Ubah
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
