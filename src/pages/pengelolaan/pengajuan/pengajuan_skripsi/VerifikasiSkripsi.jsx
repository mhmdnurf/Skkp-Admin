import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { auth, db } from "../../../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export const VerifikasiSkripsi = () => {
  const { itemId } = useParams();
  const [status, setStatus] = useState("");
  const [catatan, setCatatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
  }, [itemId, user, loading, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the existing document data
      const itemDocRef = doc(db, "pengajuan", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      if (itemDocSnapshot.exists()) {
        // Update the document with new status and catatan
        await updateDoc(itemDocRef, {
          status: status,
          catatan: catatan.toUpperCase(),
        });

        Swal.fire({
          title: "Success",
          text: "Data berhasil diperbarui",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/pengajuan-skripsi/detail/${itemId}`);
        });
      }
      const user_uid = itemDocSnapshot.data().user_uid;
      const userDocRef = doc(db, "users", user_uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const registrationToken = userDocSnapshot.data().registrationToken;

        if (status === "Sah") {
          const response = await fetch(
            `https://fcm-skkp-cqk5st7fhq-et.a.run.app/send-notification/hasil-verifikasi-skripsi-berhasil/${user_uid}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                registrationToken: registrationToken,
              }),
            }
          );

          if (response.ok) {
            console.log("Notification sent successfully");
          } else {
            console.error("Failed to send notification");
          }
        } else {
          const response = await fetch(
            `https://fcm-skkp-cqk5st7fhq-uc.a.run.app/send-notification/hasil-verifikasi-skripsi-ditolak/${user_uid}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                registrationToken: registrationToken,
              }),
            }
          );

          if (response.ok) {
            console.log("Notification sent successfully");
          } else {
            console.error("Failed to send notification");
          }
        }
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
              Verifikasi Pengajuan Skripsi
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-slate-300 bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Pilih Status
                  </option>
                  <option value="Sah">Sah</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
                <label className="block text-slate-600 font-bold mb-2">
                  Catatan
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Catatan Verifikasi"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
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
                  to={`/pengajuan-skripsi/detail/${itemId}`}
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
