import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export const DetailSidangSkripsi = () => {
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
        const periodePendaftaranInfo = await getPeriodeInfo(
          itemData.jadwalSidang_uid
        );

        setData({
          id: itemDocSnapshot.id,
          ...itemData,
          userInfo: userInfo,
          dosenPembimbingInfo: dosenPembimbingInfo,
          pengajuanInfo: pengajuanInfo,
          periodePendaftaranInfo: periodePendaftaranInfo,
        });
      }

      setIsLoading(false);
    };

    fetchData();

    if (loading) return;
    if (!user) return navigate("/login");
  }, [itemId, user, loading, navigate, data]);

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

  const handleButtonPembimbing = () => {
    if (data.status != "Sah") {
      Swal.fire({
        title: "Error",
        text: "Data belum diverifikasi",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      navigate(`/sidang-skripsi/penguji/${itemId}`);
    }
  };

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        <Sidebar />
        <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
          <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-10 bg-slate-600">
            Detail Sidang Skripsi
          </h1>

          <div className="flex flex-col px-4 mt-2 bg-white mx-4 rounded-lg p-4 drop-shadow-lg">
            <div className="flex justify-start mt-4 items-center">
              <h1 className="w-full p-4 bg-slate-600 text-center text-white rounded-lg  font-bold">
                Berkas Persyaratan
              </h1>
            </div>
            <div className="flex justify-between items-center p-4 flex-wrap">
              <Link
                to={`${data.ijazah}`}
                target="_blank"
                className="p-2 bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Ijazah SMA/SMK
              </Link>
              <Link
                to={`${data.transkipNilai}`}
                target="_blank"
                className="p-2 bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Transkip Nilai
              </Link>
              <Link
                to={`${data.pendaftaranSkripsi}`}
                target="_blank"
                className="p-2 bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Form Pendaftaran Sidang
              </Link>
              <Link
                to={`${data.persetujuanSkripsi}`}
                target="_blank"
                className="p-2 bg-slate-300 hover:bg-slate-200 rounded-md font-semibold text-slate-600 hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Form Persetujuan
              </Link>
              <Link
                to={`${data.fileBuktiLunas}`}
                target="_blank"
                className="p-2 bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Bukti Lunas Sidang
              </Link>
              <Link
                to={`${data.lembarRevisi}`}
                target="_blank"
                className="p-2  text-center bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Lembar Revisi
              </Link>
              <Link
                to={`${data.ktp}`}
                target="_blank"
                className="p-2 mt-2 basis-1/4 text-center bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Scan KTP
              </Link>
              <Link
                to={`${data.kk}`}
                target="_blank"
                className="p-2 mt-2 basis-1/3 text-center bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Scan KK
              </Link>
              <Link
                to={`${data.bimbinganSkripsi}`}
                target="_blank"
                className="p-2 mt-2 basis-1/4 text-center bg-slate-300 hover:bg-slate-200 rounded-md text-slate-600  font-semibold hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
              >
                Form Bimbingan
              </Link>
            </div>

            <div className="border p-4 rounded-md border-slate-300">
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
              <p className="mb-2 uppercase">{data.userInfo.nama}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Jurusan</h1>
              <p className="mb-2 uppercase">{data.userInfo.jurusan}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Topik Penelitian
              </h1>
              <p className="mb-2 uppercase">
                {data.pengajuanInfo.topikPenelitian}
              </p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Judul</h1>
              <p className="mb-2 uppercase">{data.judul}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Status</h1>
              <p className="mb-2 uppercase">{data.status}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">Catatan</h1>
              <p className="mb-2 uppercase">{data.catatan}</p>
              <h1 className="mb-2 text-lg font-bold text-slate-600">
                Dosen Pembimbing
              </h1>
              <p className="mb-2 uppercase">
                {" "}
                {data.dosenPembimbingInfo ? (
                  <p className="mb-2">{data.dosenPembimbingInfo.nama}</p>
                ) : (
                  <p className="mb-2 ">-</p>
                )}
              </p>
            </div>

            <div className="flex flex-1 justify-end p-4">
              <Link
                to={`/sidang-skripsi/ubah-judul/${itemId}`}
                className="bg-emerald-500 hover:bg-emerald-600 p-2 m-2 rounded-md w-[150px] text-center text-slate-100 drop-shadow-xl"
              >
                Ubah Judul
              </Link>
              <Link
                to={`/sidang-skripsi/verifikasi/${itemId}`}
                className="bg-green-600 hover:bg-green-700 p-2 m-2 rounded-md w-[150px] text-center text-slate-100 drop-shadow-xl"
              >
                Verifikasi
              </Link>
              <button
                onClick={handleButtonPembimbing}
                className="bg-blue-600 hover:bg-blue-700 p-2 m-2 rounded-md w-[200px] text-center text-slate-100"
              >
                Beri Dosen Penguji
              </button>
              <Link
                to={"/sidang-sempro"}
                className="bg-red-400 hover:bg-red-500 p-2 m-2 rounded-md w-[150px] text-center text-slate-100"
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
