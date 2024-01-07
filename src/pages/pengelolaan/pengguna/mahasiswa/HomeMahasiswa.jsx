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
  getDoc,
  startAfter,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "../../../../components/Loader";
import Header from "../../../../components/pengguna/Header";
import SearchFieldMhs from "../../../../components/pengguna/SearchFieldMhs";
import MhsTable from "../../../../components/pengguna/MhsTable";

export const HomeMahasiswa = () => {
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

  const handleNext = async ({ item }) => {
    try {
      if (data.length === 0) {
        console.log("No more next documents!");
        setIsLoading(false);
      }
      setIsLoading(true);
      const q = query(
        collection(db, "users"),
        orderBy("nim", "asc"),
        startAfter(item.nim),
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
        orderBy("nim", "asc"),
        endBefore(item.nim),
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
              <MhsTable
                data={data}
                startIndex={startIndex}
                handleDelete={() => handleDelete(data[0].id)}
                handlePrev={() => handlePrev({ item: data[0] })}
                handleNext={() => handleNext({ item: data[data.length - 1] })}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};
