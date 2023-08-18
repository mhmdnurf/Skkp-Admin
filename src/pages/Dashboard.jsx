import { useEffect, useState } from "react";
import {
  FaInfoCircle,
  FaLaptopCode,
  FaRegFileAlt,
  FaRegPaperPlane,
  FaToolbox,
  FaUserGraduate,
} from "react-icons/fa";
import { Sidebar } from "../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { auth } from "../utils/firebase";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [user, loading] = useAuthState(auth);
  const [jumlahKP, setJumlahKP] = useState(0);

  const fetchUserName = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      // Mendapatkan jadwal sidang yang aktif
      const activeJadwalSidangQuery = query(
        collection(db, "jadwalSidang"),
        where("status", "==", "Aktif")
      );
      const activeJadwalSidangDocs = await getDocs(activeJadwalSidangQuery);

      let activeJadwalSidang;
      if (activeJadwalSidangDocs.size > 0) {
        // Jika ada jadwal sidang aktif, ambil data jadwal sidang pertama
        activeJadwalSidang = activeJadwalSidangDocs.docs[0].data();
      }

      // Jika ada jadwal sidang aktif, lakukan query berdasarkan jenis pengajuan dan periode pendaftaran
      const currentDate = new Date();

      if (activeJadwalSidang) {
        const tanggalBuka = new Date(activeJadwalSidang.tanggalBuka);
        const tanggalTutup = new Date(activeJadwalSidang.tanggalTutup);

        if (currentDate >= tanggalBuka && currentDate <= tanggalTutup) {
          const kerjaPraktekQuery = query(
            collection(db, "pengajuan"),
            where("jenisPengajuan", "==", "Kerja Praktek"),
            where("createdAt", ">=", tanggalBuka),
            where("createdAt", "<=", tanggalTutup)
          );

          const kerjaPraktekDocs = await getDocs(kerjaPraktekQuery);
          setJumlahKP(kerjaPraktekDocs.size);
        } else {
          setJumlahKP(0);
        }
      } else {
        setJumlahKP(0);
      }

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUsername(userData.nama);
        setIsLoading(false);

        if (userData.role !== "prodi") {
          navigate("/login"); // Redirect jika peran bukan "prodi"
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    console.log(jumlahKP);

    fetchUserName();
  }, [user, loading]);

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        {/* Sidebar Start */}

        {/* Sidebar End */}
        {/* Content Start */}

        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen overflow-y-auto ">
            <InfinitySpin width="200" color="#475569" />
          </div>
        ) : (
          <>
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="m-2 p-6 bg-white mb-4 rounded-xl drop-shadow-xl text-xl text-slate-600 font-extrabold flex items-center">
                Welcome Back, {username}
                <div className="ml-4 flex ">
                  <FaRegPaperPlane size={40} />
                </div>
              </h1>
              <h1 className="p-4 text-4xl text-slate-600 font-bold">
                Dashboard
              </h1>
              <div className="flex">
                <div className="data-pendaftar flex text-slate-600 text-xl drop-shadow-lg">
                  {/* Data Pendaftar Kiri */}
                  <div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaToolbox className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Kerja Praktek</p>
                        <p>{jumlahKP}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaRegFileAlt className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Seminar Proposal</p>
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                  {/* Data Pendaftar Kanan */}
                  <div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaLaptopCode className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Komprehensif</p>
                        <p>0</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaUserGraduate className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Akhir Skripsi</p>
                        <p>0</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <img src="../src/assets/undraw_slider_re_ch7w.svg" alt="" />
                </div>
              </div>
              <div className="bg-slate-200 p-4 m-4 rounded-lg drop-shadow-xl">
                <div className="flex items-center m-4 text-slate-600">
                  <FaInfoCircle className="font-bold mr-2 text-lg" size={40} />
                  <h1 className="text-3xl font-bold">Pengumuman</h1>
                </div>
                <div className="flex-row">
                  <div className="px-10">
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SEMINAR PROSPOSAL !
                      </h3>
                      <p>
                        Diberitahukan kepada mahasiswa/i Seminar Proporsal akan
                        diadakan pada tanggal : <b>Jumat,23-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran dibuka Tanggal : <b>Selasa,13-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran ditutup Tanggal : <b>Senin,19-06-2023</b>
                      </p>
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG AKHIR SKRIPSI !
                      </h3>
                      <p>
                        Diberitahukan kepada mahasiswa/i Seminar Proporsal akan
                        diadakan pada tanggal : <b>Jumat,23-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran dibuka Tanggal : <b>Selasa,13-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran ditutup Tanggal : <b>Senin,19-06-2023</b>
                      </p>
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG KERJA PRAKTEK !
                      </h3>
                      <p>
                        Diberitahukan kepada mahasiswa/i Seminar Proporsal akan
                        diadakan pada tanggal : <b>Jumat,23-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran dibuka Tanggal : <b>Selasa,13-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran ditutup Tanggal : <b>Senin,19-06-2023</b>
                      </p>
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG KOMPREHENSIF !
                      </h3>
                      <p>
                        Diberitahukan kepada mahasiswa/i Seminar Proporsal akan
                        diadakan pada tanggal : <b>Jumat,23-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran dibuka Tanggal : <b>Selasa,13-06-2023</b>
                      </p>
                      <p>
                        Pendaftaran ditutup Tanggal : <b>Senin,19-06-2023</b>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
