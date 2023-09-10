import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
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
import Swal from "sweetalert2";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Datepicker from "react-tailwindcss-datepicker";
import * as XLSX from "xlsx";
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

export const HomeKompre = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tanggal, setTanggal] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", uid);
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
    const unsubscribe = onSnapshot(
      query(
        collection(db, "sidang"),
        where("jenisSidang", "==", "Komprehensif"),
        orderBy("status", "asc")
      ),
      async (snapshot) => {
        const fetchedData = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          const userInfo = await getUserInfo(data.user_uid);
          const pengajuanInfo = await getPengajuanInfo(data.pengajuan_uid);
          const dosenPembimbingInfo = await getUserInfo(
            pengajuanInfo.pembimbing_uid
          );
          fetchedData.push({
            id: doc.id,
            ...data,
            userInfo: userInfo,
            dosenPembimbingInfo: dosenPembimbingInfo,
            pengajuanInfo: pengajuanInfo,
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
            item.dosenPembimbingInfo.nama
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            new Date(item.createdAt.seconds * 1000)
              .toLocaleDateString("en-US")
              .includes(searchText) ||
            item.pengajuanInfo.topikPenelitian
              .toLowerCase()
              .includes(searchText.toLowerCase())
        );
        setData(filteredData);
        setIsLoading(false);
      }
    );

    if (loading) return;
    if (!user) return navigate("/login");

    // Cleanup: unsubscribe when the component unmounts or when the effect re-runs
    return () => unsubscribe();
  }, [user, loading, navigate, data, searchText]);

  const handleDelete = async (id) => {
    try {
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
        const docRef = doc(db, "sidang", id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const sintakFileName = `persyaratan/sidangKompre/SINTAK/${data.user_uid}`;
          const persetujuanKompreFileName = `persyaratan/sidangKompre/formPersetujuanKompre/${data.user_uid}`;
          await deleteObject(ref(storage, sintakFileName));
          await deleteObject(ref(storage, persetujuanKompreFileName));
          await deleteDoc(docRef);
        }
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const handleRiwayatLaporan = () => {
    navigate("/sidang-kompre/riwayat-laporan");
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
        collection(db, "sidang"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate),
        where("jenisSidang", "==", "Komprehensif")
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Swal.fire("Gagal", "Data Sidang Komprehensif tidak ditemukan", "error");
      } else {
        const sidangData = [];
        const rows = [];
        let no = 1;
        await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const sidang = doc.data();
            const userInfo = await getUserInfo(sidang.user_uid);
            const tanggalDaftar = new Date(sidang.createdAt.seconds * 1000);
            const pengajuanInfo = await getPengajuanInfo(sidang.pengajuan_uid);
            const dosenPembimbingInfo = await getUserInfo(
              pengajuanInfo.pembimbing_uid
            );
            let pengujiSatuInfo = null;
            let pengujiDuaInfo = null;
            if (sidang.penguji) {
              pengujiSatuInfo = sidang.penguji.pengujiSatu
                ? await getUserInfo(sidang.penguji.pengujiSatu)
                : null;
              pengujiDuaInfo = sidang.penguji.pengujiDua
                ? await getUserInfo(sidang.penguji.pengujiDua)
                : null;
            }

            // Memasukkan data ke dalam array sidangData
            sidangData.push({
              id: doc.id,
              ...sidang,
              userInfo: userInfo,
              dosenPembimbingInfo: dosenPembimbingInfo,
              pengajuanInfo: pengajuanInfo,
              pengujiSatuInfo: pengujiSatuInfo,
              pengujiDuaInfo: pengujiDuaInfo,
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
              topikPenelitian: pengajuanInfo.topikPenelitian,
              judul: sidang.judul,
              status: sidang.status,
              catatan: sidang.catatan,
              dosenPembimbing: dosenPembimbingInfo.nama,
            });
          })
        );
        console.log(rows);

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Sidang Komprehensif"
        );
        XLSX.utils.sheet_add_aoa(worksheet, [
          [
            "No",
            "Tanggal Daftar",
            "NIM",
            "Nama",
            "Jurusan",
            "Topik Penelitian",
            "Judul",
            "Status",
            "Catatan",
            "Dosen Pembimbing",
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
          `laporan/komprehensif/${formattedDate}`
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
          a.download = `Laporan_Komprehensif_${formattedDate}.xlsx`; // Nama file yang akan diunduh
          a.style.display = "none";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          const laporanData = {
            jenisLaporan: "Komprehensif",
            createdAt: new Date(),
            fileURL: fileUrl,
            namaLaporan: `Laporan Komprehensif - ${formattedDate}`,
          };

          const docRef = await addDoc(
            collection(db, "riwayatLaporanSidang"),
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
        <div className="flex-1 flex justify-center items-center h-screen bg-slate-100">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <>
          <div className="flex bg-slate-100 h-screen">
            <Sidebar />
            <div className="flex flex-col w-full pl-[300px] overflow-y-auto pr-4 pb-4">
              <h1 className="text-2xl text-white text-center shadow-md font-bold rounded-lg p-4 m-4 mb-10 bg-slate-600">
                Data Sidang Komprehensif
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

              {/* Tabel Data */}
              <div className="flex flex-col px-4 mt-2">
                <table className="overflow-x-auto block bg-white rounded-t-lg text-slate-700 drop-shadow-md uppercase">
                  <thead className=" shadow-sm font-extralight text-sm">
                    <tr className="">
                      <th className="p-2 px-6">No</th>
                      <th className="p-2 px-6 whitespace-nowrap">
                        Tanggal Daftar
                      </th>
                      <th className="p-2 px-6">NIM</th>
                      <th className="p-2 px-6">Nama</th>
                      <th className="p-2 px-6">Jurusan</th>
                      <th className="p-2 px-6">Judul</th>
                      <th className="p-2 px-6">Status</th>
                      <th className="p-2 px-6">Catatan</th>
                      <th className="p-2 px-6">Pembimbing</th>
                      <th className="p-2 px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="rounded-b-md text-sm">
                    {data.slice(startIdx, endIdx).map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-100 border-b border-t border-slate-300"
                      >
                        <td className="text-center">{startIdx + index + 1}</td>
                        <td className="text-center">
                          {item.createdAt &&
                            new Date(
                              item.createdAt.seconds * 1000
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}

                          {item.tanggalDaftar}
                        </td>
                        <td className="text-center">
                          {item.userInfo && item.userInfo.nim}
                        </td>
                        <td className="text-center whitespace-nowrap">
                          {item.userInfo && item.userInfo.nama}
                        </td>
                        <td className="text-center">
                          {item.userInfo && item.userInfo.jurusan}
                        </td>
                        <td className="text-center p-4 whitespace-nowrap">
                          {item.pengajuanInfo.topikPenelitian}
                        </td>
                        <td className="text-center whitespace-nowrap">
                          {item.status}
                        </td>
                        <td className="text-center p-4">{item.catatan}</td>
                        <td className="text-center p-6 whitespace-nowrap">
                          {item.pengajuanInfo
                            ? item.dosenPembimbingInfo.nama
                            : "-"}
                        </td>
                        <td className="text-center p-4">
                          <div className="flex">
                            <Link
                              to={`/sidang-kompre/detail/${item.id}`}
                              className="normal-case p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1"
                            >
                              Detail
                            </Link>
                            <button
                              className="p-2 bg-red-200 rounded-md hover:bg-red-300"
                              onClick={() => handleDelete(item.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="flex justify-between items-center bg-white drop-shadow-md rounded-b-lg p-2">
                  <p className="text-xs text-slate-600 ml-2">
                    Showing{" "}
                    {Math.min(
                      (currentPage - 1) * itemsPerPage + 1,
                      data.length
                    )}{" "}
                    to {Math.min(currentPage * itemsPerPage, data.length)} of{" "}
                    {data.length} results
                  </p>

                  <div className="flex">
                    <button
                      className="px-3 py-2 text-xs bg-slate-300 text-slate-600 rounded-md hover:bg-slate-400 mr-1"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-2 text-xs text-slate-600 bg-slate-300 rounded-md hover:bg-slate-400"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage === Math.ceil(data.length / itemsPerPage)
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-10" />
            </div>
          </div>
        </>
      )}
    </>
  );
};
