import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  where,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../../../../utils/firebase";
import Swal from "sweetalert2";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";

export const EditDosen = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [namaDosen, setNamaDosen] = useState("");
  const [emailDosen, setEmailDosen] = useState("");
  const [dataEmailDosen, setDataEmailDosen] = useState("");
  const [nidnDosen, setNidnDosen] = useState("");
  const [dataNidnDosen, setDataNidnDosen] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dosen yang akan diedit
        const dosenDoc = await getDoc(doc(db, "users", itemId));
        if (dosenDoc.exists()) {
          const data = dosenDoc.data();
          setNamaDosen(data.nama);
          setEmailDosen(data.email);
          setNidnDosen(data.nidn);
          setDataEmailDosen(data.email);
          setDataNidnDosen(data.nidn);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          Swal.fire("Error", "Dosen tidak ditemukan", "error").then(() => {
            navigate("/kelola-pengguna/dosen");
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data: ", error);
        Swal.fire("Error", "Gagal mengambil data dosen", "error").then(() => {
          navigate("/kelola-pengguna/dosen");
        });
      }
    };

    fetchData();
  }, [itemId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (emailDosen !== dataEmailDosen) {
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", emailDosen))
      );

      if (!querySnapshot.empty) {
        Swal.fire("Error", "Email telah digunakan!", "error");
        setIsSubmitting(false);
        return;
      }
    } else if (nidnDosen !== dataNidnDosen) {
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("nidn", "==", nidnDosen))
      );

      if (!querySnapshot.empty) {
        Swal.fire("Error", "NIDN telah digunakan!", "error");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Cek apakah email atau NIDN sudah ada
      if (!namaDosen || !emailDosen || !nidnDosen) {
        Swal.fire("Error", "Data harus diisi!", "error");
        return;
      }

      // Update data dosen
      const dosenRef = doc(db, "users", itemId);
      await updateDoc(dosenRef, {
        nidn: nidnDosen,
        nama: namaDosen,
        email: emailDosen,
      });

      Swal.fire("Success", "Data Dosen berhasil diperbarui", "success").then(
        () => {
          navigate("/kelola-pengguna/dosen");
        }
      );
    } catch (error) {
      console.error("Error updating data: ", error);
      Swal.fire("Error", "Gagal memperbarui data dosen", "error");
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
          <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 bg-slate-600">
              Edit Data Dosen
            </h1>
            <form
              onSubmit={handleSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  NIDN
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  name="nidn"
                  value={nidnDosen}
                  onChange={(e) => setNidnDosen(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  name="nama"
                  value={namaDosen}
                  onChange={(e) => setNamaDosen(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  name="email"
                  value={emailDosen}
                  onChange={(e) => setEmailDosen(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-600 drop-shadow-lg text-white rounded-md hover:bg-slate-700"
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
                <Link
                  to="/kelola-pengguna/dosen"
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 ml-1 drop-shadow-lg"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
