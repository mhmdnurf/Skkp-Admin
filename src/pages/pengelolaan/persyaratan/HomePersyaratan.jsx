import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { auth, db } from "../../../utils/firebase";
import {
  collection,
  query,
  deleteDoc,
  doc,
  orderBy,
  limit,
  getDocs,
  startAfter,
  endBefore,
  limitToLast,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import TableHeader from "../../../components/persyaratan/TableHeader";
import TableData from "../../../components/persyaratan/TableData";

const HomePersyaratan = () => {
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
    fetchData();
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "persyaratan"),
        orderBy("jenisPersyaratan", "asc"),
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
      setStartIndex(1);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "persyaratan"),
        orderBy("jenisPersyaratan", "asc"),
        where("berkasPersyaratan", "array-contains", searchText)
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

  const handleNext = async ({ item }) => {
    try {
      if (data.length === 0) {
        console.log("No more next documents!");
        setIsLoading(false);
      }
      setIsLoading(true);
      const q = query(
        collection(db, "persyaratan"),
        orderBy("jenisPersyaratan", "asc"),
        startAfter(item.jenisPersyaratan),
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
        collection(db, "persyaratan"),
        orderBy("jenisPersyaratan", "asc"),
        endBefore(item.jenisPersyaratan),
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
        const docRef = doc(db, "persyaratan", id);
        await deleteDoc(docRef);
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
        setData(data.filter((item) => item.id !== id));
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
                Data Persyaratan
              </h1>
              {/* Search Field */}
              <TableHeader
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={handleSearch}
                onClickReset={fetchData}
              />

              <TableData
                data={data}
                handleDelete={() => handleDelete(data[0].id)}
                startIndex={startIndex}
                handleNext={() => handleNext({ item: data[data.length - 1] })}
                handlePrev={() => handlePrev({ item: data[0] })}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePersyaratan;
