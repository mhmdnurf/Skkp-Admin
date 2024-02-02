import React from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../../../utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
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
  const itemsPerPage = 10;
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState("");
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [user, loading] = useAuthState(auth);
  const [tanggal, setTanggal] = React.useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startIndex, setStartIndex] = React.useState(1);

  const getUserAuthorization = React.useCallback(async () => {
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
  }, [user, navigate]);

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    }
    return null;
  };

  const fetchData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "pengajuan"),
        where("jenisPengajuan", "==", "Kerja Praktek"),
        orderBy("createdAt", "desc"),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No documents!");
        return;
      }
      let items = [];
      querySnapshot.docs.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log("first items", items);
      setData(items);
      setStartIndex(1);
    } catch (e) {
      console.error("Error fetching data: ", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNext = async ({ item }) => {
    try {
      if (data.length === 0) {
        console.log("No more next documents!");
        setIsLoading(false);
      }
      setIsLoading(true);
      const q = query(
        collection(db, "pengajuan"),
        where("jenisPengajuan", "==", "Kerja Praktek"),
        orderBy("createdAt", "desc"),
        startAfter(item.createdAt),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No documents!");
        return;
      }
      let items = [];

      querySnapshot.docs.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setData(items);
      console.log("next items", items);
      setPage(page + 1); // Update page on next
      setStartIndex(page * itemsPerPage + 1);
    } catch (error) {
      console.error("Error fetching next documents: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = async ({ item }) => {
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "pengajuan"),
        where("jenisPengajuan", "==", "Kerja Praktek"),
        orderBy("createdAt", "desc"),
        endBefore(item.createdAt),
        limitToLast(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No documents!");
        return;
      }
      let items = [];

      querySnapshot.docs.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setData(items);
      console.log("previous items", items);
      setPage(page - 1); // Update page on next
      setStartIndex((page - 2) * itemsPerPage + 1);
    } catch (error) {
      console.error("Error fetching previous documents: ", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  React.useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    getUserAuthorization();
    fetchData();
  }, [fetchData, getUserAuthorization, loading, navigate, user]);

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
                  startIndex={startIndex}
                  handleDelete={handleDelete}
                />
                {/* Pagination */}
                <Pagination
                  handlePrev={() => handlePrev({ item: data[0] })}
                  handleNext={() => handleNext({ item: data[data.length - 1] })}
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
