import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { db } from "../../utils/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { utcToZonedTime } from "date-fns-tz";
import format from "date-fns-tz/format";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const CreateTahunAjaran = () => {
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [isLoading]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        // const user = auth.currentUser;

        const currentTimeUTC = new Date();

        // Konversi waktu UTC ke waktu lokal Indonesia (Asia/Jakarta)
        const timezone = "Asia/Jakarta";
        const currentTimeIndonesia = utcToZonedTime(currentTimeUTC, timezone);

        // Format waktu dalam bentuk string sesuai dengan preferensi Anda
        const formattedTime = format(
          currentTimeIndonesia,
          "yyyy-MM-dd HH:mm:ss",
          { timeZone: timezone }
        );

        // Validasi
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

        // Menambahkan data ke koleksi "tahunAjaran"
        const docRef = await addDoc(collection(db, "tahunAjaran"), {
          tahun: tahunAjaran,
          createdAt: formattedTime,
          // createdBy: user,
          editedBy: "-",
        });

        console.log("Document written with ID: ", docRef.id);

        // Mengosongkan input setelah berhasil menambahkan data
        setTahunAjaran("");
        setError(null);
        Swal.fire({
          title: "Success",
          text: "Data berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/tahun-ajaran");
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }

      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <div className="flex-1 p-8">
          <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-full bg-slate-600">
            Tambah Tahun Ajaran
          </h1>
          <form
            onSubmit={handleFormSubmit}
            className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
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
      )}
    </div>
  );
};
