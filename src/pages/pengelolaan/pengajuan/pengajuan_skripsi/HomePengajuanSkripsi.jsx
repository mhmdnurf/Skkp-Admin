import React, { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
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
import Swal from "sweetalert2";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Datepicker from "react-tailwindcss-datepicker";
import * as XLSX from "xlsx";
import Pagination from "../../../../components/pengajuan-skripsi/Pagination";
import PengajuanSkripsiTable from "../../../../components/pengajuan-skripsi/PengajuanSkripsiTable";

export const HomePengajuanSkripsi = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tanggal, setTanggal] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const [page, setPage] = useState(1);
  const [startIndex, setStartIndex] = useState(1);

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
        where("jenisPengajuan", "==", "Skripsi"),
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

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "pengajuan", id);
      const docSnapshot = await getDoc(docRef);
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
          Swal.fire("Error", "Topik Penelitian sudah disidangkan!", "error");
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
            const docRef = doc(db, "pengajuan", id);
            await deleteDoc(docRef);
            setData(data.filter((item) => item.id !== id));
            Swal.fire("Success", "Data Berhasil dihapus!", "success");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleRiwayatLaporan = () => {
    navigate("/pengajuan-skripsi/riwayat-laporan");
  };

  const handleValueChange = (newValue) => {
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
        where("jenisPengajuan", "==", "Skripsi")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire("Gagal", "Data Pengajuan Skripsi tidak ditemukan", "error");
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
              topikPenelitian: pengajuan.topikPenelitian,
              status: pengajuan.status,
              catatan: pengajuan.catatan,
            });
          })
        );
        console.log(rows);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Pengajuan Skripsi");
        XLSX.utils.sheet_add_aoa(worksheet, [
          [
            "No",
            "Tanggal Daftar",
            "NIM",
            "Nama",
            "Jurusan",
            "Topik Penelitian",
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
          `laporan/pengajuanSkripsi/${formattedDate}.xlsx`
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
          a.download = `Laporan_Pengajuan_Skripsi_${formattedDate}.xlsx`; // Nama file yang akan diunduh
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          const laporanData = {
            jenisLaporan: "Skripsi",
            createdAt: new Date(),
            fileURL: fileUrl,
            namaLaporan: `Laporan Pengajuan Skripsi - ${formattedDate}`,
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

  const handleNext = async ({ item }) => {
    try {
      if (data.length === 0) {
        console.log("No more next documents!");
        setIsLoading(false);
      }
      setIsLoading(true);
      const q = query(
        collection(db, "pengajuan"),
        where("jenisPengajuan", "==", "Skripsi"),
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
        where("jenisPengajuan", "==", "Skripsi"),
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

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    fetchData();
  }, [fetchData, loading, user, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center h-screen bg-slate-100">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <>
          <div className="flex bg-slate-100 h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-10 bg-slate-600">
                Data Pengajuan Skripsi
              </h1>
              <div className="flex mt-16 mb-2 ml-4 mr-4 items-center">
                <div className="flex-grow">
                  <input
                    type="text"
                    className="px-4 py-2 border rounded-md shadow-sm w-[500px]"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </div>
                <div>
                  <div className="space-x-2">
                    <button
                      onClick={onOpen}
                      className="p-2 bg-slate-300 rounded-md text-slate-700 w-[200px] shadow-sm hover:bg-slate-500 hover:text-white"
                    >
                      Laporan
                    </button>
                    <Modal
                      isCentered
                      isOpen={isOpen}
                      onClose={onClose}
                      motionPreset="slideInBottom"
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Periode Pengajuan</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <div className="mb-4 relative mt-2">
                            <label className="block text-slate-600 font-bold">
                              Tanggal
                            </label>
                            <div>
                              <Datepicker
                                value={tanggal}
                                onChange={handleValueChange}
                                classNames="z-0"
                              />
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <button
                            onClick={() => {
                              handleLaporan(), onClose();
                            }}
                            className="hover:bg-slate-800 w-full justify-center items-center flex bg-slate-700 p-2 text-white rounded-md"
                          >
                            Print
                          </button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                    <button
                      onClick={handleRiwayatLaporan}
                      className="p-2 bg-gray-300 hover:bg-gray-500 hover:text-white text-slate-700 rounded-md shadow-sm w-[200px]"
                    >
                      Riwayat Laporan
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col px-4 mt-2">
                {/* Tabel Data */}
                <PengajuanSkripsiTable
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
