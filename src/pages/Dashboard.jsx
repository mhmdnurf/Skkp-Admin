import { useEffect, useState } from "react";
import {
  FaLaptopCode,
  FaReact,
  FaRegFileAlt,
  FaToolbox,
  FaUserGraduate,
} from "react-icons/fa";
import { Sidebar } from "../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const userRef = doc(db, "users", "2lFizySdnoM3l8RPA75Ly49bvAT2");
    const unsubscribe = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUsername(userData.nama);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting user data:", error);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        {/* Sidebar Start */}
        <Sidebar />
        {/* Sidebar End */}
        {/* Content Start */}

        {isLoading ? (
          <div className="flex items-center justify-center w-screen">
            <InfinitySpin width="200" color="#475569" />
          </div>
        ) : (
          <div className="w-full content overflow-y-auto">
            <h1 className="m-2 p-6 bg-white mb-4 rounded-xl drop-shadow-xl text-xl text-slate-600 font-extrabold ">
              Welcome Back, {username}
            </h1>
            <h1 className="p-4 text-4xl text-slate-600 font-bold">Dashboard</h1>
            <div className="flex">
              <div className="data-pendaftar flex text-slate-600 text-xl drop-shadow-lg">
                {/* Data Pendaftar Kiri */}
                <div>
                  <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                    <FaToolbox className="mr-2" size={80} />
                    <div className="text-right">
                      <p>Pendaftar Sidang Kerja Praktek</p>
                      <p>0</p>
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
                <FaReact className="font-bold mr-2 text-lg" size={40} />
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
        )}
      </div>
    </>
  );
};
