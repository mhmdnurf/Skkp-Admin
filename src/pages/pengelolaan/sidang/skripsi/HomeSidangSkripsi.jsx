import { useState, useEffect } from "react";
import { Sidebar } from "../../../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../../../utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { deleteObject, ref } from "firebase/storage";

export const HomeSidangSkripsi = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
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
        where("jenisSidang", "==", "Skripsi"),
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
          const pengujiSatuInfo = await getUserInfo(data.pengujiSatu_uid);
          const pengujiDuaInfo = await getUserInfo(data.pengujiDua_uid);
          fetchedData.push({
            id: doc.id,
            ...data,
            userInfo: userInfo,
            dosenPembimbingInfo: dosenPembimbingInfo,
            pengajuanInfo: pengajuanInfo,
            pengujiSatuInfo: pengujiSatuInfo,
            pengujiDuaInfo: pengujiDuaInfo,
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
            (item.pengujiSatuInfo &&
              item.pengujiSatuInfo.nama
                .toLowerCase()
                .includes(searchText.toLowerCase())) ||
            (item.pengujiDuaInfo &&
              item.pengujiDuaInfo.nama
                .toLowerCase()
                .includes(searchText.toLowerCase())) ||
            new Date(item.createdAt.seconds * 1000)
              .toLocaleDateString("en-US")
              .includes(searchText) ||
            item.pengajuanInfo.judul
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
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
  }, [user, loading, navigate, searchText]);

  const truncateTitle = (title, words = 3) => {
    const wordsArray = title.split(" ");
    if (wordsArray.length > words) {
      return wordsArray.slice(0, words).join(" ") + "...";
    }
    return title;
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda Yakin?",
        text: "Data akan hilang permanen ketika dihapus",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Batal",
        confirmButtonText: "Confirm",
      });

      if (result.isConfirmed) {
        const docRef = doc(db, "sidang", id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const transkipNilaiFileName = `persyaratan/sidangSempro/transkipNilai/${data.user_uid}`;
          const pendaftaranSemproFileName = `persyaratan/sidangSempro/formPendaftaran/${data.user_uid}`;
          const persetujuanSemproFileName = `persyaratan/sidangSempro/formPersetujuan/${data.user_uid}`;
          const sertifikatKeahlianFileName = `persyaratan/sidangSempro/sertifikatKeahlian/${data.user_uid}`;
          const menghadiriSidangFileName = `persyaratan/sidangSempro/formMenghadiriSidang/${data.user_uid}`;
          await deleteObject(ref(storage, transkipNilaiFileName));
          await deleteObject(ref(storage, pendaftaranSemproFileName));
          await deleteObject(ref(storage, persetujuanSemproFileName));
          await deleteObject(ref(storage, sertifikatKeahlianFileName));
          await deleteObject(ref(storage, menghadiriSidangFileName));
          await deleteDoc(docRef);
        }
        Swal.fire("Success", "Data Berhasil dihapus!", "success");
      }
    } catch (error) {
      console.error("Error deleting data: ", error);
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
                Data Sidang Skripsi
              </h1>
              <div className="flex items-center mt-16 mb-2 mx-2 justify-end mr-4">
                <input
                  type="text"
                  className="px-4 py-2 border w-[400px] rounded-md drop-shadow-sm"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>

              {/* Tabel Data */}
              <div className="flex flex-col px-4 mt-2">
                <table className="overflow-x-auto block bg-white rounded-t-lg text-slate-700 drop-shadow-md uppercase">
                  <thead className=" shadow-sm font-extralight text-sm">
                    <tr className="">
                      <th className="p-2 px-6">No</th>
                      <th className="p-2 px-6">Tanggal Daftar</th>
                      <th className="p-2 px-6">NIM</th>
                      <th className="p-2 px-6">Nama</th>
                      <th className="p-2 px-6">Jurusan</th>
                      <th className="p-2 px-6">Kelompok Keilmuan</th>
                      <th className="p-2 px-6">Status</th>
                      <th className="p-2 px-6">Catatan</th>
                      <th className="p-2 px-6">Pembimbing</th>
                      <th className="p-2 px-6 whitespace-nowrap">Penguji 1</th>
                      <th className="p-2 px-6 whitespace-nowrap">Penguji 2</th>
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
                          {truncateTitle(item.pengajuanInfo.topikPenelitian, 3)}
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
                        <td className="text-center p-6 whitespace-nowrap">
                          {item.pengujiSatuInfo
                            ? item.pengujiSatuInfo.nama
                            : "-"}
                        </td>
                        <td className="text-center p-6 whitespace-nowrap">
                          {item.pengujiDuaInfo ? item.pengujiDuaInfo.nama : "-"}
                        </td>
                        <td className="text-center p-4">
                          <div className="flex">
                            <Link
                              to={`/sidang-skripsi/detail/${item.id}`}
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
