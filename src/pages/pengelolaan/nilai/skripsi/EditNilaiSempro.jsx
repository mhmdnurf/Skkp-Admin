import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { auth, db } from "../../../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const EditNilaiSempro = () => {
  const { itemId } = useParams();
  const [nilaiPengujiSatu, setNilaiPengujiSatu] = useState("");
  const [nilaiPengujiDua, setNilaiPengujiDua] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "pengajuan", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.nilaiSempro) {
            if (data.nilaiSempro.nilaiPengujiSatu !== undefined) {
              setNilaiPengujiSatu(data.nilaiSempro.nilaiPengujiSatu);
            } else {
              setNilaiPengujiSatu(null);
            }

            if (data.nilaiSempro.nilaiPengujiDua !== undefined) {
              setNilaiPengujiDua(data.nilaiSempro.nilaiPengujiDua);
            } else {
              setNilaiPengujiDua(null);
            }
          }
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
  }, [itemId, user, loading, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nilaiPengujiSatuFloat = parseFloat(nilaiPengujiSatu);
      const nilaiPengujiDuaFloat = parseFloat(nilaiPengujiDua);

      const nilaiAkhirSempro = (
        (nilaiPengujiSatuFloat + nilaiPengujiDuaFloat) /
        2
      ).toFixed(2);

      // Get the existing document data
      const itemDocRef = doc(db, "pengajuan", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      const nilaiSempro = {
        nilaiPengujiSatu: nilaiPengujiSatu,
        nilaiPengujiDua: nilaiPengujiDua,
        nilaiAkhirSempro: nilaiAkhirSempro,
      };

      if (itemDocSnapshot.exists()) {
        await updateDoc(itemDocRef, {
          nilaiSempro,
          editedAt: new Date(),
        });

        Swal.fire({
          title: "Success",
          text: "Data berhasil diperbarui",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/kelola-nilai/skripsi/detail/${itemId}`);
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      setError("Error updating document");
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />
      <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <InfinitySpin width="200" color="#475569" />
          </div>
        ) : (
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-full bg-slate-600">
              Nilai Kerja Praktek
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Nilai Penguji 1
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan Nilai"
                  value={nilaiPengujiSatu}
                  onChange={(e) => setNilaiPengujiSatu(e.target.value)}
                  required
                />
                <label className="block text-slate-600 font-bold mb-2">
                  Nilai Penguji 2
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan Nilai"
                  value={nilaiPengujiDua}
                  onChange={(e) => setNilaiPengujiDua(e.target.value)}
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
                  to={`/kelola-nilai/skripsi/detail/${itemId}`}
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 ml-1 drop-shadow-lg"
                >
                  Cancel
                </Link>
              </div>
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
