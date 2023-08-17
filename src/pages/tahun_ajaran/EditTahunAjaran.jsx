import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const EditTahunAjaran = () => {
  const navigate = useNavigate();

  const { itemId } = useParams(); // Mendapatkan itemId dari URL parameter

  const [tahunAjaran, setTahunAjaran] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dataTahunAjaran, setDataTahunAjaran] = useState("");
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "tahunAjaran", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTahunAjaran(data.tahun);
          setDataTahunAjaran(data.tahun);
        } else {
          setError("Data not found");
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
        setIsLoading(false);
      }
    };

    if (loading) return;
    if (!user) return navigate("/login");

    fetchData();
  }, [itemId, user, loading]);

  const handleFormEdit = async (e) => {
    e.preventDefault();

    if (!tahunAjaran) {
      setError("Tahun ajaran harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);

      if (tahunAjaran !== dataTahunAjaran) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "tahunAjaran"),
            where("tahun", "==", tahunAjaran)
          )
        );

        if (!querySnapshot.empty) {
          Swal.fire("Error", "Tahun Ajaran sudah dibuat", "error");
          setError("Tahun ajaran sudah ada");
          setIsSubmitting(false);
          return;
        }
      }

      // Update data pada Firestore
      const docRef = doc(db, "tahunAjaran", itemId);

      await updateDoc(docRef, { tahun: tahunAjaran });
      Swal.fire("Success", "Data Berhasil diubah!", "success");
      setIsSubmitting(false);
      navigate("/tahun-ajaran");
    } catch (error) {
      console.error("Error updating data: ", error);
      setError("Error updating data");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <>
          <Sidebar />
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-1/2 bg-slate-600">
              Ubah Tahun Ajaran
            </h1>
            <form
              onSubmit={handleFormEdit}
              className="w-1/2 px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="2022/2023"
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-600 drop-shadow-lg text-white rounded-md hover:bg-slate-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
                <Link
                  to="/tahun-ajaran"
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 ml-1 drop-shadow-lg"
                >
                  Cancel
                </Link>
              </div>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
          </div>
        </>
      )}
    </div>
  );
};
