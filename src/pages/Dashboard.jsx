import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Sidebar } from "../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { auth } from "../utils/firebase";
import Header from "../components/Header";
import PengumumanCard from "../components/dashboard/PengumumanCard";
import PendaftarCard from "../components/dashboard/PendaftarCard";
import Loader from "../components/Loader";

/**
 * Dashboard component.
 * Renders the dashboard page with user information and data about registered students for different types of exams.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [user, loading] = useAuthState(auth);
  const [periode, setPeriode] = useState({
    tanggalBukaKP: null,
    tanggalTutupKP: null,
    tanggalBukaSempro: null,
    tanggalTutupSempro: null,
    tanggalBukaKompre: null,
    tanggalTutupKompre: null,
    tanggalBukaSkripsi: null,
    tanggalTutupSkripsi: null,
  });
  const [tanggalSidang, setTanggalSidang] = useState({
    tanggalSidangKP: null,
    tanggalSidangSempro: null,
    tanggalSidangKompre: null,
    tanggalSidangSkripsi: null,
  });
  const [jumlahPendaftar, setJumlahPendaftar] = useState({
    jumlahPendaftarKP: 0,
    jumlahPendaftarSempro: 0,
    jumlahPendaftarKompre: 0,
    jumlahPendaftarSkripsi: 0,
  });

  const getPendaftarKP = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "jadwalSidang"), where("status", "==", "Aktif"))
      );

      const kerjaPraktekUIDs = querySnapshot.docs
        .filter((doc) => doc.data().jenisSidang.includes("Kerja Praktek"))
        .map((doc) => doc.id);

      console.log(kerjaPraktekUIDs);

      const queryKerjaPraktek = await getDocs(
        query(
          collection(db, "sidang"),
          where("jenisSidang", "==", "Kerja Praktek")
        )
      );
      const periodePendaftaran = queryKerjaPraktek.docs
        .filter((doc) => kerjaPraktekUIDs.includes(doc.data().jadwalSidang_uid))
        .map((doc) => doc.data().periodePendaftaran);

      // Membandingkan isi array
      const jumlahPendaftarKP = periodePendaftaran.length;
      setJumlahPendaftar({
        jumlahPendaftarKP: jumlahPendaftarKP,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getPendaftarSempro = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "jadwalSidang"), where("status", "==", "Aktif"))
      );

      const seminarProposalUIDs = querySnapshot.docs
        .filter((doc) => doc.data().jenisSidang.includes("Seminar Proposal"))
        .map((doc) => doc.id);

      console.log(seminarProposalUIDs);

      const querySempro = await getDocs(
        query(
          collection(db, "sidang"),
          where("jenisSidang", "==", "Seminar Proposal")
        )
      );
      const periodePendaftaran = querySempro.docs
        .filter((doc) =>
          seminarProposalUIDs.includes(doc.data().jadwalSidang_uid)
        )
        .map((doc) => doc.data().periodePendaftaran);

      // Membandingkan isi array
      const jumlahPendaftarSempro = periodePendaftaran.length;
      setJumlahPendaftar({
        jumlahPendaftarSempro: jumlahPendaftarSempro,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getPendaftarKompre = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "jadwalSidang"), where("status", "==", "Aktif"))
      );

      const kompreUIDs = querySnapshot.docs
        .filter((doc) => doc.data().jenisSidang.includes("Komprehensif"))
        .map((doc) => doc.id);

      console.log(kompreUIDs);

      const queryKompre = await getDocs(
        query(
          collection(db, "sidang"),
          where("jenisSidang", "==", "Komprehensif")
        )
      );
      const periodePendaftaran = queryKompre.docs
        .filter((doc) => kompreUIDs.includes(doc.data().jadwalSidang_uid))
        .map((doc) => doc.data().periodePendaftaran);

      // Membandingkan isi array
      const jumlahPendaftarKompre = periodePendaftaran.length;
      setJumlahPendaftar({
        jumlahPendaftarKompre: jumlahPendaftarKompre,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getPendaftarSkripsi = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "jadwalSidang"), where("status", "==", "Aktif"))
      );

      const skripsiUIDs = querySnapshot.docs
        .filter((doc) => doc.data().jenisSidang.includes("Skripsi"))
        .map((doc) => doc.id);

      console.log(skripsiUIDs);

      const querySkripsi = await getDocs(
        query(collection(db, "sidang"), where("jenisSidang", "==", "Skripsi"))
      );
      const periodePendaftaran = querySkripsi.docs
        .filter((doc) => skripsiUIDs.includes(doc.data().jadwalSidang_uid))
        .map((doc) => doc.data().periodePendaftaran);

      // Membandingkan isi array
      const jumlahPendaftarSkripsi = periodePendaftaran.length;
      setJumlahPendaftar({
        jumlahPendaftarSkripsi: jumlahPendaftarSkripsi,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getInformasiSidang = () => {
    const activeJadwalPengajuanQuery = query(
      collection(db, "jadwalSidang"),
      where("status", "==", "Aktif")
    );

    const unsubscribe = onSnapshot(
      activeJadwalPengajuanQuery,
      (jadwalPengajuanSnapshot) => {
        if (!jadwalPengajuanSnapshot.empty) {
          jadwalPengajuanSnapshot.forEach((doc) => {
            const jadwalData = doc.data();
            const jenisSidang = jadwalData.jenisSidang;
            const periodePendaftaran = jadwalData.periodePendaftaran;

            if (jenisSidang.includes("Kerja Praktek")) {
              setPeriode((prevPeriode) => ({
                ...prevPeriode,
                tanggalBukaKP: periodePendaftaran.tanggalBuka.toDate(),
                tanggalTutupKP: periodePendaftaran.tanggalTutup.toDate(),
              }));
              setTanggalSidang((prevTanggalSidang) => ({
                ...prevTanggalSidang,
                tanggalSidangKP: jadwalData.tanggalSidang.toDate(),
              }));
            }

            if (jenisSidang.includes("Seminar Proposal")) {
              setPeriode((prevPeriode) => ({
                ...prevPeriode,
                tanggalBukaSempro: periodePendaftaran.tanggalBuka.toDate(),
                tanggalTutupSempro: periodePendaftaran.tanggalTutup.toDate(),
              }));
              setTanggalSidang((prevTanggalSidang) => ({
                ...prevTanggalSidang,
                tanggalSidangSempro: jadwalData.tanggalSidang.toDate(),
              }));
            }

            if (jenisSidang.includes("Komprehensif")) {
              setPeriode((prevPeriode) => ({
                ...prevPeriode,
                tanggalBukaKompre: periodePendaftaran.tanggalBuka.toDate(),
                tanggalTutupKompre: periodePendaftaran.tanggalTutup.toDate(),
              }));
              setTanggalSidang((prevTanggalSidang) => ({
                ...prevTanggalSidang,
                tanggalSidangKompre: jadwalData.tanggalSidang.toDate(),
              }));
            }

            if (jenisSidang.includes("Skripsi")) {
              setPeriode((prevPeriode) => ({
                ...prevPeriode,
                tanggalBukaSkripsi: periodePendaftaran.tanggalBuka.toDate(),
                tanggalTutupSkripsi: periodePendaftaran.tanggalTutup.toDate(),
              }));
              setTanggalSidang((prevTanggalSidang) => ({
                ...prevTanggalSidang,
                tanggalSidangSkripsi: jadwalData.tanggalSidang.toDate(),
              }));
            }
          });
        }
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    const getUserAuthorization = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUsername(userData.nama);
          setIsLoading(false);
          if (userData.role !== "prodi") {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user data");
      }
    };

    getInformasiSidang();
    getUserAuthorization();
    getPendaftarKP();
    getPendaftarSempro();
    getPendaftarKompre();
    getPendaftarSkripsi();
    return () => {
      getInformasiSidang();
    };
  }, [user, loading, navigate]);

  return (
    <>
      <div className="flex bg-slate-100 h-screen">
        {isLoading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <Header username={username} />
              <h1 className="p-4 text-4xl text-slate-600 font-bold">
                Dashboard
              </h1>
              <div className="flex">
                <div className="flex text-slate-600 text-xl drop-shadow-lg">
                  {/* Data Pendaftar Kiri */}
                  <div>
                    <PendaftarCard
                      title="Pendaftar Sidang Kerja Praktek"
                      count={jumlahPendaftar.jumlahPendaftarKP}
                      icon="FaToolbox"
                    />
                    <PendaftarCard
                      title="Pendaftar Seminar Proposal"
                      count={jumlahPendaftar.jumlahPendaftarSempro}
                      icon="FaRegFileAlt"
                    />
                  </div>
                  {/* Data Pendaftar Kanan */}
                  <div>
                    <PendaftarCard
                      title="Pendaftar Sidang Komprehensif"
                      count={jumlahPendaftar.jumlahPendaftarKompre}
                      icon="FaLaptopCode"
                    />
                    <PendaftarCard
                      title="Pendaftar Sidang Akhir Skripsi"
                      count={jumlahPendaftar.jumlahPendaftarSkripsi}
                      icon="FaUserGraduate"
                    />
                  </div>
                </div>
                <div>
                  <img src="../../undraw_slider_re_ch7w.svg" alt="" />
                </div>
              </div>
              <div className="bg-slate-200 p-4 m-4 rounded-lg drop-shadow-xl">
                <div className="flex items-center m-4 text-slate-600">
                  <FaInfoCircle className="font-bold mr-2 text-lg" size={40} />
                  <h1 className="text-3xl font-bold">Pengumuman</h1>
                </div>
                <div className="flex-row">
                  <div className="px-10">
                    <PengumumanCard
                      title="INFORMASI SEMINAR PROPOSAL !"
                      dates={{ start: tanggalSidang.tanggalSidangSempro }}
                      registrationDates={{
                        start: periode.tanggalBukaSempro,
                        end: periode.tanggalTutupSempro,
                      }}
                    />
                    <PengumumanCard
                      title="INFORMASI SIDANG AKHIR SKRIPSI !"
                      dates={{ start: tanggalSidang.tanggalSidangSkripsi }}
                      registrationDates={{
                        start: periode.tanggalBukaSkripsi,
                        end: periode.tanggalTutupSkripsi,
                      }}
                    />
                    <PengumumanCard
                      title="INFORMASI SIDANG KERJA PRAKTEK !"
                      dates={{ start: tanggalSidang.tanggalSidangKP }}
                      registrationDates={{
                        start: periode.tanggalBukaKP,
                        end: periode.tanggalTutupKP,
                      }}
                    />
                    <PengumumanCard
                      title="INFORMASI SIDANG KOMPREHENSIF !"
                      dates={{ start: tanggalSidang.tanggalSidangKompre }}
                      registrationDates={{
                        start: periode.tanggalBukaKompre,
                        end: periode.tanggalTutupKompre,
                      }}
                    />
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

export default Dashboard;
