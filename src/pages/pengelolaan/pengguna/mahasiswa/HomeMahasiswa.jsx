import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { auth, db } from "../../../../utils/firebase";
import {
  collection,
  query,
  deleteDoc,
  doc,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../../../../components/Loader";
import Header from "../../../../components/pengguna/Header";
import SearchFieldMhs from "../../../../components/pengguna/SearchFieldMhs";
import useUserAuthorization from "../../../../hooks/useAuthorization";

export const HomeMahasiswa = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { role, isLoading: isAuthLoading } = useUserAuthorization(user);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "users"),
        orderBy("nim", "asc"),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No documents!");
        return;
      }
      let items = [];

      querySnapshot.docs.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log("first items", items);
      setData(items);
      // setStartIndex(1);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loading || isAuthLoading) return;
    if (!user || role !== "prodi") return navigate("/login");

    fetchData();
  }, [user, loading, navigate, role, isAuthLoading]);

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

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "users"),
        orderBy("nim", "asc"),
        where("nim", "==", searchText)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No matching documents!");
        return;
      }
      let items = [];

      querySnapshot.docs.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setData(items);
    } catch (error) {
      console.error("Error searching data: ", error);
    } finally {
      setIsLoading(false);
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
        <Loader />
      ) : (
        <>
          <div className="flex bg-slate-100 min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <Header title="Mahasiswa" />
              {/* Search Field */}
              <SearchFieldMhs
                onClickReset={() => {
                  setSearchText("");
                  fetchData();
                }}
                onClick={handleSearch}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

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
                <div className="flex justify-end items-center bg-white drop-shadow-md rounded-b-lg p-2">
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
