import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { auth, db } from "../../../../utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "react-select";

export const DosenPengujiKP = () => {
  const { itemId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [availableDosen, setAvailableDosen] = useState([]);
  const [dosenPengujiSatu, setDosenPengujiSatu] = useState("");
  const [dosenPengujiDua, setDosenPengujiDua] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("role", "==", "Dosen"))
        );
        console.log(querySnapshot);
        const dosenOptions = querySnapshot.docs.map((doc) => ({
          value: doc.id, // Gunakan id sebagai value
          label: doc.data().nama, // Gunakan nama sebagai label
        }));
        console.log(dosenOptions);
        setAvailableDosen(dosenOptions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
        setIsLoading(false);
      }
    };

    if (loading) return;
    if (!user) return navigate("/login");
    fetchDosen();
  }, [user, loading, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the existing document data
      const itemDocRef = doc(db, "sidang", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      const pengujiRoles = {
        pengujiSatu: dosenPengujiSatu ? dosenPengujiSatu.value : null, // Ambil nilai dari selected option
        pengujiDua: dosenPengujiDua ? dosenPengujiDua.value : null, // Ambil nilai dari selected option
      };
      if (itemDocSnapshot.exists()) {
        // Update the document with new status and catatan
        await updateDoc(itemDocRef, {
          penguji: pengujiRoles,
          catatan: "-",
        });

        Swal.fire({
          title: "Success",
          text: "Data berhasil diperbarui",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/sidang-kp/detail/${itemId}`);
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
              Verifikasi Pendaftaran Sidang Kerja Praktek
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Dosen Penguji 1
                </label>
                <Select
                  className="w-full"
                  value={dosenPengujiSatu}
                  options={availableDosen}
                  onChange={(selectedOption) =>
                    setDosenPengujiSatu(selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Pilih Dosen Penguji 1"
                />
                <label className="block text-slate-600 font-bold mb-2 mt-4">
                  Dosen Penguji 2
                </label>
                <Select
                  className="w-full"
                  value={dosenPengujiDua}
                  options={[{ value: "-", label: "-" }, ...availableDosen]}
                  onChange={(selectedOption) =>
                    setDosenPengujiDua(selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Pilih Dosen Penguji 2"
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
                  to={`/sidang-kp/detail/${itemId}`}
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
