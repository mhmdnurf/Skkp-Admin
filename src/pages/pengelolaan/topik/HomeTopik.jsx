import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { auth, db } from "../../../utils/firebase";
import {
  collection,
  query,
  deleteDoc,
  doc,
  getDoc,
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
import Loader from "../../../components/Loader";
import Header from "../../../components/topik/Header";
import TopTable from "../../../components/topik/TopTable";
import DataTable from "../../../components/topik/DataTable";

export const HomeTopik = () => {
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
    getUserAuthorization();
    fetchData();
  }, [user, loading, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "topikPenelitian"),
        orderBy("namaTopik", "asc"),
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

  const handleNext = async ({ item }) => {
    try {
      if (data.length === 0) {
        console.log("No more next documents!");
        setIsLoading(false);
      }
      setIsLoading(true);
      const q = query(
        collection(db, "topikPenelitian"),
        orderBy("namaTopik", "asc"),
        startAfter(item.namaTopik),
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
        collection(db, "topikPenelitian"),
        orderBy("namaTopik", "asc"),
        endBefore(item.namaTopik),
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
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Batal",
        confirmButtonText: "Confirm",
      });

      if (result.isConfirmed) {
        const docRef = doc(db, "topikPenelitian", id);
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
        collection(db, "topikPenelitian"),
        orderBy("prodiTopik", "asc"),
        where("prodiTopik", "array-contains", searchText)
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
              <Header />
              <TopTable
                onClick={handleSearch}
                onClickReset={() => {
                  setSearchText("");
                  fetchData();
                }}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />

              <DataTable
                data={data}
                startIndex={startIndex}
                handleDelete={() => handleDelete(data[0].id)}
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
