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
import { Sidebar } from "../../../../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";

export const EditMahasiswa = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [nama, setNama] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [nim, setNim] = useState("");
  const [dataNim, setDataNim] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data dosen yang akan diedit
        const mhsDoc = await getDoc(doc(db, "users", itemId));
        if (mhsDoc.exists()) {
          const data = mhsDoc.data();
          setNama(data.nama);
          setNim(data.nim);
          setJurusan(data.jurusan);
          setDataNim(data.nim);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          Swal.fire("Error", "Mahasiswa tidak ditemukan", "error").then(() => {
            navigate("/kelola-pengguna/mahasiswa");
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data: ", error);
        Swal.fire("Error", "Gagal mengambil data mahasiswa", "error").then(
          () => {
            navigate("/kelola-pengguna/mahasiswa");
          }
        );
      }
    };

    fetchData();
  }, [itemId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (nim !== dataNim) {
      const querySnapshot = await getDocs(
        query(collection(db, "users"), where("nim", "==", nim))
      );

      if (!querySnapshot.empty) {
        Swal.fire("Error", "NIM telah digunakan!", "error");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Cek apakah email atau NIDN sudah ada
      if (!nama || !nim) {
        Swal.fire("Error", "Data harus diisi!", "error");
        return;
      }

      // Update data dosen
      const dosenRef = doc(db, "users", itemId);
      await updateDoc(dosenRef, {
        nim: nim,
        nama: nama,
        jurusan: jurusan,
      });

      Swal.fire(
        "Success",
        "Data Mahasiswa berhasil diperbarui",
        "success"
      ).then(() => {
        navigate("/kelola-pengguna/mahasiswa");
      });
    } catch (error) {
      console.error("Error updating data: ", error);
      Swal.fire("Error", "Gagal memperbarui data mahasiswa", "error");
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
              Edit Data Mahasiswa
            </h1>
            <form
              onSubmit={handleSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  NIM
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  name="nidn"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
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
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Jurusan
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  name="jurusan"
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih Jurusan
                  </option>
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Komputer Akuntansi">Komputer Akuntansi</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-600 drop-shadow-lg text-white rounded-md hover:bg-slate-700"
                >
                  {isSubmitting ? "Loading..." : "Submit"}
                </button>
                <Link
                  to="/kelola-pengguna/mahasiswa"
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
