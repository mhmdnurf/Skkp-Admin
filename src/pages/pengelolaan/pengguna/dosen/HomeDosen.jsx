import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { auth, db } from "../../../../utils/firebase";
import {
  collection,
  query,
  deleteDoc,
  doc,
  where,
  orderBy,
  getDocs,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../../../../components/pengguna/Header";
import TopTable from "../../../../components/pengguna/TopTable";
import DosenTable from "../../../../components/pengguna/DosenTable";
import Loader from "../../../../components/Loader";

export const HomeDosen = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [page, setPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    const getUserAuthorization = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          console.log(userData);
          if (userData.role !== "prodi") {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user data");
      }
    };

    fetchData();
    getUserAuthorization();
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "users"),
        orderBy("nidn", "asc"),
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
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
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
        collection(db, "users"),
        orderBy("nidn", "asc"),
        startAfter(item.nidn),
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
        collection(db, "users"),
        orderBy("nidn", "asc"),
        endBefore(item.nidn),
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

  const cekDosenTerikat = async (id) => {
    try {
      // Buat kueri untuk mengambil pengajuan yang terkait dengan dosenId
      const pengajuanQuery = query(
        collection(db, "pengajuan"),
        where("pembimbing_uid", "==", id)
      );
      const pengajuanSnapshot = await getDocs(pengajuanQuery);

      // Buat kueri untuk mengambil sidang yang terkait dengan dosenId
      const sidangQuerySatu = query(
        collection(db, "sidang"),
        where("penguji.pengujiSatu", "==", id)
      );
      const sidangQueryDua = query(
        collection(db, "sidang"),
        where("penguji.pengujiDua", "==", id)
      );

      const sidangSnapshotSatu = await getDocs(sidangQuerySatu);
      const sidangSnapshotDua = await getDocs(sidangQueryDua);

      // Jika ada pengajuan atau sidang yang terkait, kembalikan true
      return (
        !pengajuanSnapshot.empty ||
        !sidangSnapshotSatu.empty ||
        !sidangSnapshotDua.empty
      );
    } catch (error) {
      console.error("Error checking data: ", error);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      const isDosenTerikat = await cekDosenTerikat(id);
      // console.log(id);
      if (isDosenTerikat) {
        Swal.fire(
          "Error",
          "Dosen terkait dengan pengajuan atau sidang. Tidak dapat dihapus.",
          "error"
        );
        return;
      }
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
        const docRef = doc(db, "users", id);
        await deleteDoc(docRef);
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "users"),
        orderBy("nidn", "asc"),
        where("nidn", "==", searchText)
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex bg-slate-100 min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <Header title="Dosen" />
              <TopTable
                onClick={handleSearch}
                onClickReset={() => {
                  setSearchText("");
                  fetchData();
                }}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <DosenTable
                data={data}
                handlePrev={() => handlePrev({ item: data[0] })}
                handleNext={() => handleNext({ item: data[data.length - 1] })}
                handleDelete={() => handleDelete(data[0].id)}
                startIndex={startIndex}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
