import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { db, auth } from "../../../utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const CreateTopik = () => {
  const [user, loading] = useAuthState(auth);
  const [namaTopik, setNamaTopik] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJenisPengajuan, setSelectedJenisPengajuan] = useState([]);

  const jenisPengajuanOptions = [
    { id: 1, value: "Teknik Informatika", label: "Teknik Informatika" },
    { id: 2, value: "Sistem Informasi", label: "Sistem Informasi" },
    { id: 3, value: "Komputer Akuntansi", label: "Komputer Akuntansi" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    setIsLoading(false);
  }, [loading, user, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Dapatkan data yang akan disimpan
      const topikPenelitian = {
        namaTopik: namaTopik,
        prodiTopik: selectedJenisPengajuan,
        cretedAt: new Date(),
      };

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
        await addDoc(collection(db, "topikPenelitian"), topikPenelitian);
        Swal.fire(
          "Success",
          "Topik Penelitian berhasil ditambahkan!",
          "success"
        ).then(() => {
          navigate("/kelola-topik");
        });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Error adding document");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJenisPengajuanChange = (value) => {
    if (selectedJenisPengajuan.includes(value)) {
      setSelectedJenisPengajuan(
        selectedJenisPengajuan.filter((item) => item !== value)
      );
    } else {
      setSelectedJenisPengajuan([...selectedJenisPengajuan, value]);
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
            <div className="flex-1 p-8">
              <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-full bg-slate-600">
                Buat Jadwal Pengajuan
              </h1>
              <form
                onSubmit={handleFormSubmit}
                className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
              >
                <div className="mb-4">
                  <label className="block text-slate-600 font-bold mb-2">
                    Nama Topik
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Masukkan nama topik"
                    value={namaTopik}
                    onChange={(e) => setNamaTopik(e.target.value)}
                    required
                  />
                  <div className="border-4 p-2 border-slate-200 rounded-md mt-2">
                    <label className="block text-slate-600 font-bold">
                      Program Studi
                    </label>
                    <div className="flex justify-evenly mt-2">
                      {jenisPengajuanOptions.map((option) => (
                        <label
                          key={option.id}
                          className="block text-slate-600 font-bold"
                        >
                          <input
                            type="checkbox"
                            value={option.value}
                            checked={selectedJenisPengajuan.includes(
                              option.value
                            )}
                            onChange={() =>
                              handleJenisPengajuanChange(option.value)
                            }
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
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
                    to="/kelola-topik"
                    className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 ml-1 drop-shadow-lg"
                  >
                    Cancel
                  </Link>
                </div>
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
