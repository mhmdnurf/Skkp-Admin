import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export const DetailNilaiSkripsi = () => {
  const { itemId } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };
  const getPeriodeInfo = async (uid) => {
    const userDocRef = doc(db, "jadwalPengajuan", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const itemDocRef = doc(db, "pengajuan", itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);

      if (itemDocSnapshot.exists()) {
        const itemData = itemDocSnapshot.data();
        const userInfo = await getUserInfo(itemData.user_uid);
        const dosenPembimbingInfo = await getUserInfo(itemData.pembimbing_uid);
        const periodePendaftaranInfo = await getPeriodeInfo(
          itemData.jadwalPengajuan_uid
        );

        setData({
          id: itemDocSnapshot.id,
          ...itemData,
          userInfo: userInfo,
          dosenPembimbingInfo: dosenPembimbingInfo,
          periodePendaftaranInfo: periodePendaftaranInfo,
        });
      }

      setIsLoading(false);
    };

    fetchData();

    if (loading) return;
    if (!user) return navigate("/login");
  }, [itemId, user, loading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <InfinitySpin width="200" color="#475569" />
      </div>
    );
  }

  if (!data) {
    return <p>Data not found.</p>;
  }

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        <Sidebar />
        <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
          <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-4 bg-slate-600">
            Detail Nilai Skripsi
          </h1>

          <div className="flex flex-col px-4 mt-2 bg-white mx-4 rounded-lg p-4 drop-shadow-lg">
            <div className="border p-4 rounded-md border-slate-300">
              <div className="flex flex-wrap justify-around">
                <div className="w-[450px] border p-4 mb-4 rounded-lg border-slate-300 shadow-lg hover:transform hover:scale-105 transition-transform duration-300 ease-in-out ">
                  <h1 className="text-center text-2xl bg-slate-600 p-4 rounded-lg text-white mb-4">
                    Data Skripsi
                  </h1>
                  <p className="mb-2 text-lg font-bold text-slate-600">NIM</p>
                  <p className="mb-2">{data.userInfo.nim}</p>
                  <p className="mb-2 text-lg font-bold text-slate-600">Nama</p>
                  <p className="mb-2">{data.userInfo.nama}</p>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Jurusan
                  </p>
                  <p className="mb-2">{data.userInfo.jurusan}</p>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Topik Penelitian
                  </p>
                  <p className="mb-2">{data.topikPenelitian}</p>
                </div>
                <div className="w-[450px] border p-4 mb-4 rounded-lg border-slate-300 shadow-lg hover:transform hover:scale-105 transition-transform duration-300 ease-in-out ">
                  <h1 className="text-center text-2xl bg-slate-600 p-4 rounded-lg text-white mb-4">
                    Nilai Seminar Proposal
                  </h1>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Penguji 1
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiSempro ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiSempro
                      ? data.nilaiSempro.nilaiPengujiSatu
                      : "Belum Dinilai"}
                  </p>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Penguji 2
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiSempro ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiSempro
                      ? data.nilaiSempro.nilaiPengujiDua
                      : "Belum Dinilai"}
                  </p>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Akhir Sempro
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiSempro ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiSempro
                      ? data.nilaiSempro.nilaiAkhirSempro
                      : "Belum Dinilai"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-around">
                <div className="w-[450px] border p-4 mb-4 rounded-lg border-slate-300 shadow-lg hover:transform hover:scale-105 transition-transform duration-300 ease-in-out ">
                  <h1 className="text-center text-2xl bg-slate-600 p-4 rounded-lg text-white mb-4">
                    Nilai Komprehensif
                  </h1>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Komprehensif
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiKompre ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiKompre
                      ? data.nilaiKompre.nilaiKomprehensif
                      : "Belum Dinilai"}
                  </p>
                </div>
                <div className="w-[450px] border p-4 mb-4 rounded-lg border-slate-300 shadow-lg hover:transform hover:scale-105 transition-transform duration-300 ease-in-out ">
                  <h1 className="text-center text-2xl bg-slate-600 p-4 rounded-lg text-white mb-4">
                    Nilai Skripsi
                  </h1>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Penguji 1
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiSkripsi ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiSkripsi
                      ? data.nilaiSkripsi.nilaiPengujiSatu
                      : "Belum Dinilai"}
                  </p>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Penguji 2
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiSkripsi ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiSkripsi
                      ? data.nilaiSkripsi.nilaiPengujiDua
                      : "Belum Dinilai"}
                  </p>
                  <p className="mb-2 text-lg font-bold text-slate-600">
                    Nilai Akhir Skripsi
                  </p>
                  <p
                    className={`mb-2 ${
                      data.nilaiSkripsi ? "" : "text-red-600 font-bold"
                    }`}
                  >
                    {data.nilaiSkripsi
                      ? data.nilaiSkripsi.nilaiSkripsi
                      : "Belum Dinilai"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 justify-end p-4">
              <Link
                to={`/kelola-nilai/sempro/${itemId}`}
                className="bg-green-600 hover:bg-green-700 p-2 m-2 rounded-lg w-[150px] text-center text-slate-100 "
              >
                Nilai Sempro
              </Link>
              <Link
                to={`/kelola-nilai/kompre/${itemId}`}
                className="bg-lime-600 hover:bg-lime-700 p-2 m-2 rounded-lg w-[150px] text-center text-slate-100 "
              >
                Nilai Kompre
              </Link>
              <Link
                to={`/kelola-nilai/skripsi/${itemId}`}
                className="bg-teal-600 hover:bg-teal-700 p-2 m-2 rounded-lg w-[150px] text-center text-slate-100"
              >
                Nilai Skripsi
              </Link>
              <Link
                to={"/kelola-nilai/skripsi"}
                className="bg-red-400 hover:bg-red-600 p-2 m-2 rounded-lg w-[150px] text-center text-slate-100"
              >
                Kembali
              </Link>
            </div>
          </div>
          <div className="mb-10" />
        </div>
      </div>
    </>
  );
};
