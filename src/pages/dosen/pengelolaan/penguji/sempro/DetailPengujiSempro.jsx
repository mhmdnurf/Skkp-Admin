import { useState, useEffect } from "react";
import { Sidebar } from "../../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export const DetailPengujiSempro = () => {
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
        console.log(data);
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

  const handleButtonNilaiPenguji = () => {
    navigate(`/penguji-sempro/nilai/${itemId}`);
  };

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        <Sidebar />
        <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
          <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-10 bg-slate-600">
            Detail Sidang Seminar Proposal
          </h1>

          <div className="flex flex-col px-4 mt-2 bg-white mx-4 rounded-lg p-4 drop-shadow-lg">
            <div className="border p-4 rounded-md border-slate-300 uppercase">
              <h1 className="text-lg font-bold text-slate-600 mb-2">
                Tanggal Daftar
              </h1>
              <p className="mb-2">
                {data.createdAt.toDate().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <h1 className="text-lg font-bold text-slate-600 mb-2">
                Periode Pendaftaran
              </h1>
              <p className="mb-2">
                {data.periodePendaftaranInfo.periodePendaftaran.tanggalBuka &&
                  new Date(
                    data.periodePendaftaranInfo.periodePendaftaran.tanggalBuka.toDate()
                  ).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                -{" "}
                {data.periodePendaftaranInfo.periodePendaftaran.tanggalTutup &&
                  new Date(
                    data.periodePendaftaranInfo.periodePendaftaran.tanggalTutup.toDate()
                  ).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
              </p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Tahun Ajaran
              </h1>
              <p className="mb-2">
                {data.periodePendaftaranInfo.tahunAjaran &&
                  data.periodePendaftaranInfo.tahunAjaran}
              </p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">NIM</h1>
              <p className="mb-2">{data.userInfo.nim}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Nama</h1>
              <p className="mb-2">{data.userInfo.nama}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Jurusan</h1>
              <p className="mb-2">{data.userInfo.jurusan}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Topik Penelitian
              </h1>
              <p className="mb-2">{data.pengajuanInfo.topikPenelitian}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Judul</h1>
              <p className="mb-2">{data.judul}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Dosen Pembimbing
              </h1>
              <p className="mb-2">
                {" "}
                {data.dosenPembimbingInfo ? (
                  <p className="mb-2">{data.dosenPembimbingInfo.nama}</p>
                ) : (
                  <p className="mb-2 ">-</p>
                )}
              </p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Penguji Satu
              </h1>
              <p className="mb-2">
                {" "}
                {data.pengujiSatuInfo ? (
                  <p className="mb-2">{data.pengujiSatuInfo.nama}</p>
                ) : (
                  <p className="mb-2 ">-</p>
                )}
              </p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Penguji Dua
              </h1>
              <p className="mb-2">
                {" "}
                {data.pengujiDuaInfo ? (
                  <p className="mb-2">{data.pengujiDuaInfo.nama}</p>
                ) : (
                  <p className="mb-2 ">-</p>
                )}
              </p>
            </div>

            <div className="flex flex-1 justify-end p-4">
              <button
                onClick={handleButtonNilaiPenguji}
                className="bg-blue-600 hover:bg-blue-500 p-2 m-2 rounded-lg w-[200px] text-center text-slate-100"
              >
                Beri Nilai Penguji
              </button>
              <Link
                to={"/penguji-sempro"}
                className="bg-red-400 hover:bg-red-300 p-2 m-2 rounded-lg w-[150px] text-center text-slate-100"
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
