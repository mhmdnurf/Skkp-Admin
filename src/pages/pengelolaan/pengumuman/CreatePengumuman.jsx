import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/sidebar/Sidebar";
import { auth, db } from "../../../utils/firebase";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Swal from "sweetalert2";
import { addDoc, collection } from "firebase/firestore";

export const CreatePengumuman = () => {
  const [user, loading] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [judul, setJudul] = useState("");
  const [pesan, setPesan] = useState("");
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
      const response = await fetch(
        "https://fcm-skkp-cqk5st7fhq-et.a.run.app/send-notification/pengumuman",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: judul, // Menggunakan nilai judul dari state
            body: pesan, // Menggunakan nilai pesan dari state
          }),
        }
      );

      if (response.ok) {
        await addDoc(collection(db, "pengumuman"), {
          judul: judul,
          pesan: pesan,
          createdAt: new Date(),
        });

        console.log("Notifications sent successfully to all users");
      } else {
        console.error("Failed to send notifications to all users");
      }
      Swal.fire({
        title: "Success",
        text: "Pengumuman berhasil dikirimkan",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/pengumuman");
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    setIsLoading(false);
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
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 bg-slate-600">
              Pengumuman
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="mt-10 px-8 ml-4 mr-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Judul
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan Judul Pengumuman"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                />
                <label className="block text-slate-600 font-bold mt-2">
                  Pesan
                </label>
                <textarea
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Pesan Pengumuman"
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
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
                  to="/pengumuman"
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
