import React, { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../../../utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import JadwalPengajuanTable from "../../../../components/jadwal/pengajuan/JadwalPengajuanTable";
import Pagination from "../../../../components/jadwal/pengajuan/Pagination";

export const HomeJadwalPengajuan = () => {
  const [user, loading] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const itemsPerPage = 10;
  const [data, setData] = useState([]);
  const [startIndex, setStartIndex] = React.useState(1);
  const [page, setPage] = React.useState(1);

  const navigate = useNavigate();

  const validateUser = React.useCallback(async () => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      if (userData.role !== "prodi") {
        navigate("/login");
      }
    }
  }, [user, navigate]);

  const fetchDataJadwal = React.useCallback(async () => {
    try {
      const q = query(
        collection(db, "jadwalPengajuan"),
        orderBy("createdAt", "desc"),
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
      setData(items);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "jadwalPengajuan", id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const pengajuanSnapshot = await getDocs(collection(db, "pengajuan"));

        let isUsedInPengajuan = false;

        pengajuanSnapshot.forEach((doc) => {
          const pengajuanData = doc.data();
          if (docRef.id === pengajuanData.jadwalPengajuan_uid) {
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
            setData(data.filter((item) => item.id !== id));
          }
        }
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleNext = async ({ item }) => {
    try {
      if (data.length === 0) {
        console.log("No more next documents!");
        setIsLoading(false);
      }
      setIsLoading(true);
      const q = query(
        collection(db, "jadwalPengajuan"),
        orderBy("createdAt", "desc"),
        startAfter(item.createdAt),
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
      setData(items);
      console.log("next items", items);
      setPage(page + 1); // Update page on next
      setStartIndex(page * itemsPerPage + 1);
    } catch (error) {
      console.error("Error fetching next documents: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = async ({ item }) => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "jadwalPengajuan"),
        orderBy("createdAt", "desc"),
        endBefore(item.createdAt),
        limitToLast(itemsPerPage)
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
      setData(items);
      console.log("previous items", items);
      setPage(page - 1); // Update page on next
      setStartIndex((page - 2) * itemsPerPage + 1);
    } catch (error) {
      console.error("Error fetching previous documents: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    validateUser();
    fetchDataJadwal();
  }, [user, loading, data, navigate, validateUser, fetchDataJadwal]);

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
                Kelola Jadwal Pengajuan
              </h1>
              <div className="flex justify-between mt-16">
                <div className="flex items-center ml-4 ">
                  <Link
                    to={"/kelola-jadwal/pengajuan/create"}
                    className="px-4 py-2 border w-[250px] rounded-md drop-shadow-lg bg-slate-600 text-white font-bold hover:bg-slate-700 text-center"
                  >
                    Buka Jadwal Pengajuan
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

              <div className="overflow-x-auto flex flex-col px-4 mt-2">
                {/* Tabel Data */}
                <JadwalPengajuanTable
                  data={data}
                  startIndex={startIndex}
                  handleDelete={handleDelete}
                />
                {/* Pagination */}
                <Pagination
                  handlePrev={() => handlePrev({ item: data[0] })}
                  handleNext={() => handleNext({ item: data[data.length - 1] })}
                />
                <div className="mb-10" />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
