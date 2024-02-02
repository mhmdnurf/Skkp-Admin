import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { auth, db } from "../../../../utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import Select from "react-select";

export const DosenPembimbingKP = () => {
  const { itemId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [availableDosen, setAvailableDosen] = useState([]);
  const [dosenPembimbing, setDosenPembimbing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "users"), where("role", "==", "Dosen"))
        );
        console.log(querySnapshot);
        const dosenOptions = querySnapshot.docs.map((doc) => ({
          value: doc.id, // Gunakan id sebagai value
          label: doc.data().nama, // Gunakan nama sebagai label
        }));

        console.log(dosenOptions);
        setAvailableDosen(dosenOptions);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
        setIsLoading(false);
      }
    };

    if (loading) return;
    if (!user) return navigate("/login");
    fetchDosen();
  }, [user, loading, navigate]);

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
          pembimbing_uid: dosenPembimbing.value,
          catatan: "-",
        });

        Swal.fire({
          title: "Success",
          text: "Data berhasil diperbarui",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/pengajuan-kp/detail/${itemId}`);
        });
      }

      // const mahasiswa_uid = itemDocSnapshot.data().mahasiswa_uid;
      // const userDocRef = doc(db, "users", mahasiswa_uid);
      // const userDocSnapshot = await getDoc(userDocRef);
      // if (userDocSnapshot.exists()) {
      //   const registrationToken = userDocSnapshot.data().registrationToken;

      //   const response = await fetch(
      //     `https://fcm-skkp-cqk5st7fhq-et.a.run.app/send-notification/dosen-pembimbing-kp/${mahasiswa_uid}`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         registrationToken: registrationToken,
      //       }),
      //     }
      //   );

      //   if (response.ok) {
      //     console.log("Notification sent successfully");
      //   } else {
      //     console.error("Failed to send notification");
      //   }
      // }
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
              Verifikasi Pengajuan Kerja Praktek
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Dosen Pembimbing
                </label>
                <Select
                  className="w-full"
                  value={dosenPembimbing}
                  options={availableDosen}
                  onChange={(selectedOption) =>
                    setDosenPembimbing(selectedOption)
                  }
                  isSearchable={true}
                  placeholder="Pilih Dosen Pembimbing"
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
                  to={`/pengajuan-kp/detail/${itemId}`}
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
