import React from "react";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../utils/firebase";
import { Sidebar } from "../../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreatePersyaratan = () => {
  const [formData, setFormData] = React.useState({
    jenisPersyaratan: [],
    berkasPersyaratan: "",
    berkasList: [],
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const jenisPersyaratanOptions = [
    {
      id: 1,
      value: "Pengajuan Kerja Praktek",
      label: "Pengajuan Kerja Praktek",
    },
    { id: 2, value: "Pengajuan Skripsi", label: "Pengajuan Skripsi" },
    { id: 3, value: "Sidang Kerja Praktek", label: "Sidang Kerja Praktek" },
    { id: 4, value: "Seminar Proposal", label: "Seminar Proposal" },
    { id: 5, value: "Sidang Komprehensif", label: "Sidang Komprehensif" },
    { id: 6, value: "Sidang Akhir Skripsi", label: "Sidang Akhir Skripsi" },
  ];

  const navigate = useNavigate();

  const addBerkas = () => {
    const { berkasPersyaratan, berkasList } = formData;
    if (berkasPersyaratan) {
      setFormData({
        ...formData,
        berkasList: [...berkasList, berkasPersyaratan.trim()],
        berkasPersyaratan: "",
      });
    }
  };

  const deleteBerkas = (index) => {
    const newBerkasList = [...formData.berkasList];
    newBerkasList.splice(index, 1);
    setFormData({
      ...formData,
      berkasList: newBerkasList,
    });
  };

  const handleJenisPersyaratanChange = (e) => {
    const selectedJenisPersyaratan = e.target.value;
    setFormData({
      ...formData,
      jenisPersyaratan: selectedJenisPersyaratan,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { jenisPersyaratan, berkasList } = formData;
      if (jenisPersyaratan.length === 0 || berkasList.length === 0) {
        alert("Mohon isi semua kolom!");
        return;
      }

      const persyaratanRef = collection(db, "persyaratan");
      const sameJenisPersyaratanSnapshot = await getDocs(
        query(persyaratanRef, where("jenisPersyaratan", "==", jenisPersyaratan))
      );

      if (!sameJenisPersyaratanSnapshot.empty) {
        alert("Jenis persyaratan sudah ada!");
        return;
      }

      const result = await Swal.fire({
        title: "Apakah Anda Yakin Untuk Menambah Persyaratan?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#334155",
        cancelButtonColor: "#94a3b8",
        cancelButtonText: "Batal",
        confirmButtonText: "Confirm",
      });
      if (result.isConfirmed) {
        const persyaratanRef = collection(db, "persyaratan");
        await addDoc(persyaratanRef, {
          jenisPersyaratan,
          berkasPersyaratan: berkasList,
        });

        setFormData({
          jenisPersyaratan: [],
          berkasPersyaratan: "",
          berkasList: [],
        });
        Swal.fire("Success", "Persyaratan berhasil dibuat!", "success").then(
          () => {
            navigate("/kelola-persyaratan");
          }
        );
      }
    } catch (error) {
      console.error("Error tambah persyaratan: ", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <>
        <Sidebar />
        <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-full bg-slate-600">
              Buat Persyaratan
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Jenis Persyaratan
                </label>
                <div className="flex justify-evenly mt-2">
                  <select
                    value={formData.jenisPersyaratan}
                    onChange={handleJenisPersyaratanChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-600"
                  >
                    <option value="" disabled>
                      Pilih Jenis Persyaratan
                    </option>
                    {jenisPersyaratanOptions.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-md mt-4">
                  <label className="block text-slate-600 font-bold">
                    Berkas Persyaratan
                  </label>
                  <div className="flex mt-2">
                    <input
                      type="text"
                      className="w-full border rounded-md focus:outline-none focus:ring "
                      value={formData.berkasPersyaratan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          berkasPersyaratan: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => addBerkas()}
                      className="bg-slate-600 text-white py-2 px-4 ml-4 rounded shadow-md drop-shadow-lg"
                    >
                      +
                    </button>
                  </div>
                  <ul className="mb-4 py-4 rounded">
                    <div className="flex flex-row flex-wrap">
                      {formData.berkasList.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center bg-slate-600 p-1 rounded w-fit mt-2 mr-2"
                        >
                          <span className="font-semibold text-white ml-2">
                            {item}
                          </span>
                          <button
                            onClick={() => deleteBerkas(index)}
                            className="ml-2 text-white bg-red-500 px-2 flex justify-center items-center rounded font-bold"
                            type="button"
                          >
                            x
                          </button>
                        </li>
                      ))}
                    </div>
                  </ul>
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
                  to="/kelola-persyaratan"
                  className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-500 ml-1 drop-shadow-lg"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </>
    </div>
  );
};

export default CreatePersyaratan;
