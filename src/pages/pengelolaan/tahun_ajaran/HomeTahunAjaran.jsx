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
  endBefore,
  limitToLast,
  where,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../../../components/tahun-ajaran/Header";
import TopTable from "../../../components/tahun-ajaran/TopTable";
import DataTable from "../../../components/tahun-ajaran/DataTable";

export const HomeTahunAjaran = () => {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const itemsPerPage = 10;
  const [page, setPage] = React.useState(1);
  const [startIndex, setStartIndex] = React.useState(1);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const q = query(
        collection(db, "tahunAjaran"),
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
      console.log("first items", items);
      setData(items);
      setStartIndex(1);
    } catch (error) {
      console.error("Error fetching data: ", error);
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
        const docRef = doc(db, "tahunAjaran", id);
        await deleteDoc(docRef);
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
        setData(data.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "tahunAjaran"),
        orderBy("createdAt", "desc"),
        where("tahun", "==", searchText)
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
        collection(db, "tahunAjaran"),
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
        collection(db, "tahunAjaran"),
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

  React.useEffect(() => {
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
