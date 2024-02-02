import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { db, auth } from "../../../../utils/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const CreateDosen = () => {
  const [nama, setNama] = useState("");
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [nidn, setNidn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    setIsLoading(false);
  }, [user, loading, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // const user = auth.currentUser;

      // Validasi
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (!querySnapshot.empty) {
        Swal.fire("Error", "Email Sudah Digunakan", "error");
        setError("Email sudah digunakan");
        setIsSubmitting(false);
        return;
      }
      const usersCollectionRef = collection(db, "users");
      await addDoc(usersCollectionRef, {
        nama: nama,
        email: email,
        role: "Dosen",
        nidn: nidn,
        createdAt: serverTimestamp(),
      });

      // Mengosongkan input setelah berhasil menambahkan data
      setNama("");
      setEmail("");
      setError(null);
      Swal.fire({
        title: "Success",
        text: "Data berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/kelola-pengguna/dosen");
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setIsSubmitting(false);
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
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-full bg-slate-600">
              Tambah Dosen
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan Nama Dosen"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
                <label className="block text-slate-600 font-bold mb-2">
                  Email
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="block text-slate-600 font-bold mb-2">
                  NIDN
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan NIDN"
                  value={nidn}
                  onChange={(e) => setNidn(e.target.value)}
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
                  to="/kelola-pengguna/dosen"
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
