import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../../../utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Swal from "sweetalert2";
import { useDisclosure } from "@chakra-ui/react";
import * as XLSX from "xlsx";
import Loader from "../../../../components/Loader";
import PengajuanKPTable from "../../../../components/pengajuan-kp/PengajuanKPTable";
import Pagination from "../../../../components/pengajuan-kp/Pagination";
import SearchBar from "../../../../components/pengajuan-kp/SearchBar";
import LaporanButton from "../../../../components/pengajuan-kp/LaporanButton";

export const HomePengajuanKP = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [tanggal, setTanggal] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "pengajuan"),
        where("jenisPengajuan", "==", "Kerja Praktek"),
        orderBy("status", "asc")
      ),
      async (snapshot) => {
        const fetchedData = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const userInfo = await getUserInfo(data.user_uid);
          let dosenPembimbingInfo = null;

          // Cek jika pembimbing_uid tidak sama dengan "-"
          if (data.pembimbing_uid !== "-") {
            dosenPembimbingInfo = await getUserInfo(data.pembimbing_uid);
          }
          fetchedData.push({
            id: doc.id,
            ...data,
            userInfo: userInfo,
            dosenPembimbingInfo: dosenPembimbingInfo,
          });
        }
        const filteredData = fetchedData.filter(
          (item) =>
            item.userInfo.nama
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.userInfo.jurusan
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.userInfo.nim
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.status.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.dosenPembimbingInfo &&
              item.dosenPembimbingInfo.nama
                .toLowerCase()
                .includes(searchText.toLowerCase())) ||
            new Date(item.createdAt.seconds * 1000)
              .toLocaleDateString("en-US")
              .includes(searchText) ||
            item.judul.toLowerCase().includes(searchText.toLowerCase())
        );
        setData(filteredData);
        setIsLoading(false);
      }
    );

    if (loading) return;
    if (!user) return navigate("/login");
    const getUserAuthorization = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
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

    getUserAuthorization();

    // Cleanup: unsubscribe when the component unmounts or when the effect re-runs
    return () => unsubscribe();
  }, [user, loading, navigate, searchText, tanggal.startDate, tanggal.endDate]);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "pengajuan", id);
      const docSnapshot = await getDoc(docRef);
      const data = docSnapshot.data();
      if (docSnapshot.exists()) {
        const pengajuanSnapshot = await getDocs(collection(db, "sidang"));
        let isUsedInPengajuan = false;
        pengajuanSnapshot.forEach((doc) => {
          const sidangData = doc.data();
          if (docRef.id === sidangData.pengajuan_uid) {
            isUsedInPengajuan = true;
          }
        });
        if (isUsedInPengajuan) {
          Swal.fire("Error", "Kerja Praktek sudah disidangkan!", "error");
        } else {
          const result = await Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Data akan hilang permanen ketika dihapus",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#334155",
            cancelButtonColor: "#94a3b8",
            cancelButtonText: "Batal",
            confirmButtonText: "Confirm",
          });

          if (result.isConfirmed) {
            const transkipNilaiFileName = `persyaratan/pengajuanKP/transkipNilai/${data.user_uid}`;
            const formKrsFileName = `persyaratan/pengajuanKP/formKRS/${data.user_uid}`;
            const pendaftaranKpFileName = `persyaratan/pengajuanKP/formPendaftaranKP/${data.user_uid}`;
            const pembayaranKpFileName = `persyaratan/pengajuanKP/slipPembayaranKP/${data.user_uid}`;
            const proporsalFileName = `persyaratan/pengajuanKP/proporsalKP/${data.user_uid}`;
            await deleteObject(ref(storage, transkipNilaiFileName));
            await deleteObject(ref(storage, formKrsFileName));
            await deleteObject(ref(storage, pendaftaranKpFileName));
            await deleteObject(ref(storage, pembayaranKpFileName));
            await deleteObject(ref(storage, proporsalFileName));
            await deleteDoc(docRef);
            Swal.fire("Success", "Data Berhasil dihapus!", "success");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleRiwayatLaporan = () => {
    navigate("/pengajuan-kp/riwayat-laporan");
  };

  const handleValueChange = (newValue) => {
    // console.log("newValue:", newValue);
    setTanggal(newValue);
  };

  const handleLaporan = async () => {
    try {
      const startDate = new Date(tanggal.startDate);
      const endDate = new Date(tanggal.endDate);
      endDate.setHours(23, 59, 59);

      const q = query(
        collection(db, "pengajuan"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate),
        where("jenisPengajuan", "==", "Kerja Praktek")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire(
          "Gagal",
          "Data Pengajuan Kerja Praktek tidak ditemukan",
          "error"
        );
      } else {
        const pengajuanData = [];
        const rows = [];
        let no = 1;
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const pengajuan = doc.data();
            const userInfo = await getUserInfo(pengajuan.user_uid);
            const tanggalDaftar = new Date(pengajuan.createdAt.seconds * 1000);

            // Memasukkan data ke dalam array pengajuanData
            pengajuanData.push({
              id: doc.id,
              ...pengajuan,
              userInfo: userInfo,
            });

            // Memasukkan data yang akan dicetak ke dalam array rows dengan nomor
            rows.push({
              no: no++,
              tanggalDaftar: tanggalDaftar.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              nim: userInfo.nim,
              nama: userInfo.nama,
              jurusan: userInfo.jurusan,
              judul: pengajuan.judul,
              status: pengajuan.status,
              catatan: pengajuan.catatan,
            });
          })
        );
        console.log(rows);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Pengajuan Kerja Praktek"
        );
        XLSX.utils.sheet_add_aoa(worksheet, [
          [
            "No",
            "Tanggal Daftar",
            "NIM",
            "Nama",
            "Jurusan",
            "Judul",
            "Status",
            "Catatan",
          ],
        ]);

        const buffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const date = new Date(); // Gantilah dengan tanggal yang sesuai
        const formattedDate = new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date);

        const storageRef = ref(
          storage,
          `laporan/pengajuanKerjaPraktek/${formattedDate}.xlsx`
        );
        try {
          const uploadTask = await uploadBytes(storageRef, buffer, {
            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          console.log("File Excel berhasil disimpan di Firebase Storage!");
          const fileUrl = await getDownloadURL(uploadTask.ref);

          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = `Laporan_Pengajuan_KP_${formattedDate}.xlsx`; // Nama file yang akan diunduh
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          const laporanData = {
            jenisLaporan: "Kerja Praktek",
            createdAt: new Date(),
            fileURL: fileUrl,
            namaLaporan: `Laporan Pengajuan KP - ${formattedDate}`,
          };

          const docRef = await addDoc(
            collection(db, "riwayatLaporanPengajuan"),
            laporanData
          );
          console.log(
            "Data laporan berhasil ditambahkan ke koleksi riwayatLaporan dengan ID:",
            docRef.id
          );
          Swal.fire("Success", "Laporan berhasil dibuat", "success");
        } catch (error) {
          console.error("Gagal menyimpan file Excel:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = currentPage * itemsPerPage;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex bg-slate-100 h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-10 bg-slate-600">
                Data Pengajuan Kerja Praktek
              </h1>
              {/* Top Container Start */}
              <div className="flex mt-16 mb-2 ml-4 mr-4 items-center">
                {/* Search Bar */}
                <SearchBar
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
                <div>
                  {/* Laporan Button */}
                  <LaporanButton
                    onOpen={onOpen}
                    onClose={onClose}
                    isOpen={isOpen}
                    tanggal={tanggal}
                    handleValueChange={handleValueChange}
                    handleLaporan={handleLaporan}
                    handleRiwayatLaporan={handleRiwayatLaporan}
                  />
                </div>
              </div>
              {/* Top Container End */}
              <div className="flex flex-col px-4 mt-2">
                {/* Tabel Data */}
                <PengajuanKPTable
                  data={data}
                  startIdx={startIdx}
                  endIdx={endIdx}
                  handleDelete={handleDelete}
                />
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  data={data}
                  setCurrentPage={setCurrentPage}
                />
              </div>
              <div className="mb-10" />
            </div>
          </div>
        </>
      )}
    </>
  );
};
