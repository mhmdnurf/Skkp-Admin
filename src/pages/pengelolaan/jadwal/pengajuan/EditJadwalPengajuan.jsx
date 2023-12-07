import { useEffect, useState } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../../../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const EditJadwalPengajuan = () => {
  const navigate = useNavigate();

  const { itemId } = useParams();

  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "jadwalPengajuan", itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStatus(data.status);
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

  const handleFormEdit = async (e) => {
    e.preventDefault();

    if (!status) {
      setError("Status harus diisi");
      return;
    }

    try {
      setIsSubmitting(true);

      // Update data pada Firestore
      const docRef = doc(db, "jadwalPengajuan", itemId);
      await updateDoc(docRef, { status: status, manualStatus: true });
      if (status === "Tidak Aktif") {
        // Kirim permintaan ke server untuk mengirim notifikasi
        const response = await fetch(
          "https://fcm-skkp-cqk5st7fhq-et.a.run.app/send-notification/pengajuanTutup",
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
      }
      Swal.fire("Success", "Data Berhasil diubah!", "success");
      setIsSubmitting(false);
      navigate("/kelola-jadwal/pengajuan");
    } catch (error) {
      console.error("Error updating data: ", error);
      setError("Error updating data");
      setIsSubmitting(false);
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
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 bg-slate-600">
              Ubah Status Jadwal Pengajuan
            </h1>
            <form
              onSubmit={handleFormEdit}
              className="px-8 m-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih Status
                  </option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
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
