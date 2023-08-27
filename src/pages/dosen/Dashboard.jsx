import { useEffect, useState } from "react";
import {
  FaInfoCircle,
  FaLaptopCode,
  FaRegFileAlt,
  FaRegPaperPlane,
  FaToolbox,
  FaUserGraduate,
} from "react-icons/fa";
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
import { db, auth } from "../../utils/firebase";
import { SidebarDosen } from "../../components/sidebar/SidebarDosen";

export const DashboardDosen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [user, loading] = useAuthState(auth);
  const [tanggalBukaKP, setTanggalBukaKP] = useState(null);
  const [tanggalTutupKP, setTanggalTutupKP] = useState(null);
  const [tanggalBukaSempro, setTanggalBukaSempro] = useState(null);
  const [tanggalTutupSempro, setTanggalTutupSempro] = useState(null);
  const [tanggalBukaKompre, setTanggalBukaKompre] = useState(null);
  const [tanggalTutupKompre, setTanggalTutupKompre] = useState(null);
  const [tanggalBukaSkripsi, setTanggalBukaSkripsi] = useState(null);
  const [tanggalTutupSkripsi, setTanggalTutupSkripsi] = useState(null);
  const [tanggalSidangKP, setTanggalSidangKP] = useState(null);
  const [tanggalSidangSempro, setTanggalSidangSempro] = useState(null);
  const [tanggalSidangKompre, setTanggalSidangKompre] = useState(null);
  const [tanggalSidangSkripsi, setTanggalSidangSkripsi] = useState(null);
  const [jumlahPendaftarKP, setJumlahPendaftarKP] = useState(0);
  const [jumlahPendaftarSempro, setJumlahPendaftarSempro] = useState(0);
  const [jumlahPendaftarKompre, setJumlahPendaftarKompre] = useState(0);
  const [jumlahPendaftarSkripsi, setJumlahPendaftarSkripsi] = useState(0);

  const fetchUserName = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUsername(userData.nama);
        setIsLoading(false);

        if (userData.role !== "Dosen") {
          navigate("/login"); // Redirect jika peran bukan "prodi"
        }
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  const fetchKerjaPraktek = async () => {
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
      setJumlahPendaftarKP(jumlahPendaftarKP);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchSeminarProposal = async () => {
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
      setJumlahPendaftarSempro(jumlahPendaftarSempro);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSkripsi = async () => {
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
      setJumlahPendaftarSkripsi(jumlahPendaftarSkripsi);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchKomprehensif = async () => {
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
      setJumlahPendaftarKompre(jumlahPendaftarKompre);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSidang = () => {
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
            if (jenisSidang.includes("Kerja Praktek")) {
              // Memeriksa jenis pengajuan
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaKP(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupKP(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangKP(jadwalData.tanggalSidang.toDate());
            }
            if (jenisSidang.includes("Seminar Proposal")) {
              // Memeriksa jenis pengajuan
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaSempro(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupSempro(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangSempro(jadwalData.tanggalSidang.toDate());
            }
            if (jenisSidang.includes("Komprehensif")) {
              // Memeriksa jenis pengajuan
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaKompre(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupKompre(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangKompre(jadwalData.tanggalSidang.toDate());
            }
            if (jenisSidang.includes("Skripsi")) {
              // Memeriksa jenis pengajuan
              const periodePendaftaran = jadwalData.periodePendaftaran;
              setTanggalBukaSkripsi(periodePendaftaran.tanggalBuka.toDate());
              setTanggalTutupSkripsi(periodePendaftaran.tanggalTutup.toDate());
              setTanggalSidangSkripsi(jadwalData.tanggalSidang.toDate());
            }
          });
        } else {
          // Tidak ada jadwal sidang aktif
          setTanggalBukaKP(false);
          setTanggalTutupKP(false);
        }
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    const unsubscribeKP = fetchSidang();
    fetchUserName();
    fetchKerjaPraktek();
    fetchSeminarProposal();
    fetchKomprehensif();
    fetchSkripsi();
    return () => {
      unsubscribeKP();
    };
  }, [user, loading, navigate]);

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
            <SidebarDosen />

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
                        <p>{jumlahPendaftarKP}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaRegFileAlt className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Seminar Proposal</p>
                        <p>{jumlahPendaftarSempro}</p>
                      </div>
                    </div>
                  </div>
                  {/* Data Pendaftar Kanan */}
                  <div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaLaptopCode className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Komprehensif</p>
                        <p>{jumlahPendaftarKompre}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
                      <FaUserGraduate className="mr-2" size={80} />
                      <div className="text-right">
                        <p>Pendaftar Sidang Akhir Skripsi</p>
                        <p>{jumlahPendaftarSkripsi}</p>
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
                      {tanggalBukaSempro && tanggalTutupSempro ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Seminar Proporsal
                            akan diadakan pada tanggal :{" "}
                            <b>
                              {" "}
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidangSempro)}
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
                              }).format(tanggalBukaSempro)}
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
                              }).format(tanggalTutupSempro)}
                            </b>
                          </p>
                        </>
                      ) : (
                        <p className="text-red-500 font-bold uppercase uppercase">
                          Pendaftaran Sedang Ditutup
                        </p>
                      )}
                    </div>
                    <div className="proporsal bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
                      <h3 className="font-bold text-md">
                        INFORMASI SIDANG AKHIR SKRIPSI !
                      </h3>
                      {tanggalBukaSkripsi && tanggalTutupSkripsi ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Sidang Skripsi akan
                            diadakan pada tanggal :{" "}
                            <b>
                              {" "}
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidangSkripsi)}
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
                              }).format(tanggalBukaSkripsi)}
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
                              }).format(tanggalTutupSkripsi)}
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
                      {tanggalBukaKP && tanggalTutupKP ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Sidang Kerja
                            Praktek akan diadakan pada tanggal :{" "}
                            <b>
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidangKP)}
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
                              }).format(tanggalBukaKP)}
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
                              }).format(tanggalTutupKP)}
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
                      {tanggalBukaKompre && tanggalTutupKompre ? (
                        <>
                          <p>
                            Diberitahukan kepada mahasiswa/i Sidang Komprehensif
                            akan diadakan pada tanggal :{" "}
                            <b>
                              {" "}
                              {new Intl.DateTimeFormat("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }).format(tanggalSidangKompre)}
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
                              }).format(tanggalBukaKompre)}
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
                              }).format(tanggalTutupKompre)}
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
