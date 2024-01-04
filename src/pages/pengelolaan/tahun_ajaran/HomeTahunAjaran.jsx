import React from "react";
import { Sidebar } from "../../../components/Sidebar";
import { auth, db } from "../../../utils/firebase";
import Loader from "../../../components/Loader";
import {
  collection,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs,
  limit,
  startAfter,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaSearch } from "react-icons/fa";

export const HomeTahunAjaran = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [lastDoc, setLastDoc] = React.useState(null);
  const itemsPerPage = 2;

  // State untuk menyimpan dokumen pertama di setiap halaman
  const [firstDocs, setFirstDocs] = React.useState([]);

  const handleDelete = async (id) => {
    try {
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
        const docRef = doc(db, "tahunAjaran", id);
        await deleteDoc(docRef);
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };
  const handleSearch = async () => {};

  // Modifikasi fetchData untuk menyimpan dokumen pertama
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "tahunAjaran"),
        orderBy("tahun", "asc"),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(fetchedData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Menyimpan dokumen pertama
      setFirstDocs((prevFirstDocs) => [
        ...prevFirstDocs,
        querySnapshot.docs[0],
      ]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setIsLoading(false);
  };

  // Modifikasi handleNext untuk menyimpan dokumen pertama
  const handleNext = async () => {
    const q = query(
      collection(db, "tahunAjaran"),
      orderBy("tahun", "asc"),
      startAfter(lastDoc),
      limit(itemsPerPage)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No more documents!");
      return;
    }

    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(fetchedData);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

    // Menyimpan dokumen pertama
    setFirstDocs((prevFirstDocs) => [...prevFirstDocs, querySnapshot.docs[0]]);
  };

  // Fungsi handlePrev baru
  // Fungsi handlePrev yang sudah disesuaikan
  const handlePrev = async () => {
    try {
      // Periksa jika halaman sebelumnya ada atau tidak
      if (firstDocs.length < 2) {
        console.log("No more previous documents!");
        // Jika halaman sebelumnya adalah halaman pertama, panggil fetchData
        fetchData();
        return;
      }

      // Ambil dan hapus dokumen pertama dari halaman sebelumnya
      const prevFirstDoc = firstDocs[firstDocs.length - 2];
      setFirstDocs((prevFirstDocs) => prevFirstDocs.slice(0, -1));

      // Buat query untuk mendapatkan halaman sebelumnya
      const q = query(
        collection(db, "tahunAjaran"),
        orderBy("tahun", "asc"), // Ubah ke "asc" untuk urutan terbalik
        startAfter(prevFirstDoc), // Gunakan "startAfter" karena kita ingin halaman sebelumnya
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);

      // Ambil data dari hasil query dan perbarui state
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Perbarui state data dan tambahkan dokumen pertama dari halaman sebelumnya
      setData(fetchedData);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setFirstDocs((prevFirstDocs) => [
        ...prevFirstDocs.slice(0, -1), // Hapus dokumen pertama sebelumnya
        querySnapshot.docs[0], // Tambahkan dokumen pertama dari halaman sebelumnya
      ]);
    } catch (error) {
      console.error("Error fetching previous data: ", error);
    }
  };

  React.useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    fetchData();
  }, [user, loading, navigate]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex bg-slate-100 min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 bg-slate-600">
                Tahun Ajaran
              </h1>

              <div className="flex justify-between mt-16">
                <div className="flex items-center ml-4 ">
                  <Link
                    to={"/tahun-ajaran/create"}
                    className="px-4 py-2 border w-[200px] rounded-md drop-shadow-lg bg-slate-600 text-white font-bold hover:bg-slate-700"
                  >
                    Tambah Tahun Ajaran
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
                  <button
                    className="ml-2 bg-slate-600 p-2 rounded shadow drop-shadow"
                    type="button"
                    onClick={handleSearch}
                  >
                    <FaSearch size={20} color="white" />
                  </button>
                </div>
              </div>

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
                        <td className="text-center">{index + 1}</td>
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
            </div>
          </div>
        </>
      )}
    </>
  );
};
