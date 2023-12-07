import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { db, auth } from "../../../../utils/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
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
  }, [loading, user, navigate]);

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setPeriodePengajuan(newValue);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Dapatkan data yang akan disimpan
      const jadwalData = {
        tahunAjaran: tahunAjaran,
        periodePendaftaran: {
          tanggalBuka: new Date(periodePengajuan.startDate),
          tanggalTutup: new Date(periodePengajuan.endDate),
        },
        jenisPengajuan: selectedJenisPengajuan,
        status: "Aktif",
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
        await addDoc(collection(db, "jadwalPengajuan"), jadwalData);

        // Kirim permintaan ke server untuk mengirim notifikasi

        let endpoint;

        if (selectedJenisPengajuan.includes(1)) {
          endpoint = "pengajuanKP";
        } else if (selectedJenisPengajuan.includes(2)) {
          endpoint = "pengajuanSkripsi";
        } else {
          endpoint = "pengajuan";
        }

        const response = await fetch(
          `https://fcm-skkp-cqk5st7fhq-et.a.run.app/send-notification/${endpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          console.log("Notifications sent successfully to all users");
        } else {
          console.error("Failed to send notifications to all users");
        }

        Swal.fire("Success", "Jadwal berhasil dibuka!", "success").then(() => {
          navigate("/kelola-jadwal/pengajuan");
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
    setSelectedJenisPengajuan((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value);
      } else {
        return [...prevSelected, value];
      }
    });
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
          </div>
        </>
      )}
    </div>
  );
};
