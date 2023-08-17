import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { db, auth } from "../../../../utils/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import { utcToZonedTime } from "date-fns-tz";
import format from "date-fns-tz/format";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const CreateJadwalPengajuan = () => {
  const [user, loading] = useAuthState(auth);
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableTahunAjaran, setAvailableTahunAjaran] = useState([]);
  const [periodePengajuan, setPeriodePengajuan] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const [selectedJenisPengajuan, setSelectedJenisPengajuan] = useState([]);

  const jenisPengajuanOptions = [
    { id: 1, value: "Kerja Praktek", label: "Pengajuan Kerja Praktek" },
    { id: 2, value: "Skripsi", label: "Pengajuan Skripsi" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTahunAjaran = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tahunAjaran"));
        const tahunAjaranOptions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAvailableTahunAjaran(tahunAjaranOptions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching tahun ajaran data: ", error);
        setError("Error fetching data");
        setIsLoading(false);
      }
    };
    if (loading) return;
    if (!user) return navigate("/login");

    fetchTahunAjaran();
  }, [loading, user]);

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setPeriodePengajuan(newValue);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
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
      setIsSubmitting(true);

      // Dapatkan data yang akan disimpan
      const jadwalData = {
        tahunAjaran: tahunAjaran,
        periodePendaftaran: {
          tanggalBuka: periodePengajuan.startDate,
          tanggalTutup: periodePengajuan.endDate,
        },
        jenisPengajuan: selectedJenisPengajuan,
        status: "Aktif",
        cretedAt: formattedTime,
      };

      // Simpan data jadwal ke koleksi jadwal
      const docRef = await addDoc(
        collection(db, "jadwalPengajuan"),
        jadwalData
      );

      console.log("Document written with ID: ", docRef.id);

      Swal.fire({
        title: "Success",
        text: "Data berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/kelola-jadwal/pengajuan");
      });
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
                  Tahun Ajaran
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih Tahun Ajaran
                  </option>
                  {availableTahunAjaran.map((tahun) => (
                    <option key={tahun.id} value={tahun.tahun}>
                      {tahun.tahun}
                    </option>
                  ))}
                </select>
                <div className="mb-4 relative mt-2">
                  <label className="block text-slate-600 font-bold">
                    Periode Pengajuan
                  </label>
                  <div>
                    <Datepicker
                      value={periodePengajuan}
                      onChange={handleValueChange}
                    />
                  </div>
                </div>

                <div className="border-4 p-2 border-slate-200 rounded-md mt-2">
                  <label className="block text-slate-600 font-bold">
                    Jenis Pengajuan
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
                  to="/kelola-jadwal/pengajuan"
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
