import { useEffect, useState } from "react";
import {
  FaInfoCircle,
  FaLaptopCode,
  FaRegFileAlt,
  FaToolbox,
  FaUserGraduate,
} from "react-icons/fa";
import { Sidebar } from "../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
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
    const getUser = async () => {
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
    getUser();
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
            <div className="flex items-center justify-center w-full h-screen overflow-y-auto ">
              <InfinitySpin width="200" color="#475569" />
            </div>
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
                <div className="data-pendaftar flex text-slate-600 text-xl drop-shadow-lg">
                  {/* Data Pendaftar Kiri */}
                  <div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaToolbox className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Kerja Praktek</p>
                        <p>{jumlahPendaftar.jumlahPendaftarKP}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaRegFileAlt className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Seminar Proposal</p>
                        <p>{jumlahPendaftar.jumlahPendaftarSempro}</p>
                      </div>
                    </div>
                  </div>
                  {/* Data Pendaftar Kanan */}
                  <div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaLaptopCode className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Komprehensif</p>
                        <p>{jumlahPendaftar.jumlahPendaftarKompre}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaUserGraduate className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Akhir Skripsi</p>
                        <p>{jumlahPendaftar.jumlahPendaftarSkripsi}</p>
                      </div>
                    </div>
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
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SEMINAR PROPOSAL !
                      </h3>
                      {periode.tanggalBukaSempro &&
                      periode.tanggalTutupSempro ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Seminar Proposal
                            akan diadakan pada periode :{" "}
                            <b>
                              {" "}
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidang.tanggalSidangSempro)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran dibuka Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalBukaSempro)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran ditutup Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalTutupSempro)}
                            </b>
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500 font-bold uppercase">
                          Pendaftaran Sedang Ditutup
                        </p>
                      )}
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG AKHIR SKRIPSI !
                      </h3>
                      {periode.tanggalBukaSkripsi &&
                      periode.tanggalTutupSkripsi ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Sidang Skripsi akan
                            diadakan pada periode :{" "}
                            <b>
                              {" "}
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidang.tanggalSidangSkripsi)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran dibuka Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalBukaSkripsi)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran ditutup Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalTutupSkripsi)}
                            </b>
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500 font-bold uppercase">
                          Pendaftaran Sedang Ditutup
                        </p>
                      )}
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG KERJA PRAKTEK !
                      </h3>
                      {periode.tanggalBukaKP && periode.tanggalTutupKP ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Sidang Kerja
                            Praktek akan diadakan pada periode :{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidang.tanggalSidangKP)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran dibuka Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalBukaKP)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran ditutup Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalTutupKP)}
                            </b>
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500 font-bold uppercase">
                          Pendaftaran Sedang Ditutup
                        </p>
                      )}
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG KOMPREHENSIF !
                      </h3>
                      {periode.tanggalBukaKompre &&
                      periode.tanggalTutupKompre ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Sidang Komprehensif
                            akan diadakan pada periode :{" "}
                            <b>
                              {" "}
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidang.tanggalSidangKompre)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran dibuka Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalBukaKompre)}
                            </b>
                          </p>
                          <p>
                            Pendaftaran ditutup Tanggal:{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(periode.tanggalTutupKompre)}
                            </b>
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500 font-bold uppercase">
                          Pendaftaran Sedang Ditutup
                        </p>
                      )}
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

export default Dashboard;
