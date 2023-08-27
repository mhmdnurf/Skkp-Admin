import { useState, useEffect } from "react";
import { auth, db } from "../../../../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import { SidebarDosen } from "../../../../../components/sidebar/SidebarDosen";

export const EditNilaiPengujiSempro = () => {
  const { itemId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pengajuanUID, setPengajuanUID] = useState("");
  const [nilaiPenguji, setNilaiPenguji] = useState("");

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };
  const getPeriodeInfo = async (uid) => {
    const userDocRef = doc(db, "jadwalSidang", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };

  const getPengajuanInfo = async (uid) => {
    const userDocRef = doc(db, "pengajuan", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const itemDocRef = doc(db, "sidang", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      if (itemDocSnapshot.exists()) {
        const itemData = itemDocSnapshot.data();
        const userInfo = await getUserInfo(itemData.user_uid);
        const pengajuanInfo = await getPengajuanInfo(itemData.pengajuan_uid);
        const dosenPembimbingInfo = await getUserInfo(
          pengajuanInfo.pembimbing_uid
        );
        const pengujiSatuInfo =
          itemData.penguji.length > 0
            ? await getUserInfo(itemData.penguji[0])
            : null;
        const pengujiDuaInfo =
          itemData.penguji.length > 1
            ? await getUserInfo(itemData.penguji[1])
            : null;
        const periodePendaftaranInfo = await getPeriodeInfo(
          itemData.jadwalSidang_uid
        );

        setData({
          id: itemDocSnapshot.id,
          ...itemData,
          userInfo: userInfo,
          dosenPembimbingInfo: dosenPembimbingInfo,
          pengujiSatuInfo: pengujiSatuInfo,
          pengujiDuaInfo: pengujiDuaInfo,
          pengajuanInfo: pengajuanInfo,
          periodePendaftaranInfo: periodePendaftaranInfo,
        });
        setPengajuanUID(itemData.pengajuan_uid);
        // console.log(data.penguji[1] === user.uid);
        if (data.penguji[0] === user.uid) {
          setNilaiPenguji(pengajuanInfo.nilaiPengujiSemproSatu);
        } else if (data.penguji[1] === user.uid) {
          setNilaiPenguji(pengajuanInfo.nilaiPengujiSemproDua);
        }
      }

      setIsLoading(false);
    };

    fetchData();

    if (loading) return;
    if (!user) return navigate("/login");
  }, [itemId, user, loading, navigate, data]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the existing document data
      const itemDocRef = doc(db, "pengajuan", pengajuanUID);
      const itemDocSnapshot = await getDoc(itemDocRef);
      const sidangDoc = doc(db, "sidang", itemId);
      const sidangDocSnapshot = await getDoc(sidangDoc);
      console.log(sidangDocSnapshot.data().penguji);
      if (sidangDocSnapshot.data().penguji[0] === user.uid) {
        if (itemDocSnapshot.exists()) {
          // Update the document with new nilaiBimbingan and nilaiPerusahaan
          await updateDoc(itemDocRef, {
            nilaiPengujiSemproSatu: nilaiPenguji,
            editedAt: new Date(),
          });
        }
      } else if (sidangDocSnapshot.data().penguji[1] === user.uid) {
        if (itemDocSnapshot.exists()) {
          await updateDoc(itemDocRef, {
            nilaiPengujiSemproDua: nilaiPenguji,
            editedAt: new Date(),
          });
        }
      }
      Swal.fire({
        title: "Success",
        text: "Data berhasil diperbarui",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate(`/penguji-sempro`);
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    setIsLoading(false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <SidebarDosen />
      <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <InfinitySpin width="200" color="#475569" />
          </div>
        ) : (
          <div className="flex-1 p-8">
            <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-4 w-full bg-slate-600">
              Nilai Penguji Kerja Praktek
            </h1>
            <form
              onSubmit={handleFormSubmit}
              className="w-full px-8 ml-4 py-10 drop-shadow-md rounded-lg bg-white"
            >
              <div className="mb-4">
                <label className="block text-slate-600 font-bold mb-2">
                  Nilai Penguji
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  placeholder="Masukkan Nilai"
                  value={nilaiPenguji}
                  onChange={(e) => setNilaiPenguji(e.target.value)}
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
                  to={`/penguji-sempro/detail/${itemId}`}
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
