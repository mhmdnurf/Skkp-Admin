import { useEffect, useState } from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export const HomeTahunAjaran = () => {
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tahunAjaran"),
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
        setIsLoading(false);
      }
    );

    return () => {
      // Cleanup function untuk menghentikan pemantauan ketika komponen di-unmount
      unsubscribe();
    };
  }, []);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = data.slice(firstIndex, lastIndex);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <InfinitySpin width="200" color="#475569" />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 w-1/2 bg-slate-600">
            Tahun Ajaran
          </h1>

          <div className="flex justify-between mt-16">
            <div className="flex items-center ml-4 ">
              <Link
                to={"/tahun-ajaran/create"}
                className="px-4 py-2 border w-[200px] rounded-md drop-shadow-lg bg-slate-600 text-white font-bold"
              >
                Tambah Tahun Ajaran
              </Link>
            </div>
            <div className="flex items-center mr-4">
              <input
                type="text"
                className="px-4 py-2 border w-[400px] rounded-md drop-shadow-sm"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="overflow-x-auto flex flex-col px-4 mt-2">
            <table className="w-full bg-white rounded-t-lg text-slate-700 drop-shadow-md">
              <thead className="shadow-sm font-extralight text-sm">
                <tr>
                  <th className="p-2 px-6">No</th>
                  <th className="p-2 px-6">Tahun Ajaran</th>
                  <th className="p-2 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="rounded-b-md text-sm">
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-100 border-b border-t border-slate-300"
                  >
                    <td className="text-center">{index + 1 + firstIndex}</td>
                    <td className="text-center">{item.tahun}</td>
                    <td className="text-center p-4">
                      <div className="flex items-center justify-center">
                        <button className="p-2 bg-slate-200 rounded-md hover:bg-slate-300 mr-1">
                          Ubah
                        </button>
                        <button className="p-2 bg-red-200 rounded-md hover:bg-red-300">
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
                Showing {Math.min(currentPage * itemsPerPage, data.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, data.length) -
                  itemsPerPage +
                  currentItems.length}{" "}
                of {data.length} results
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
            <div className="mb-10" />
          </div>
        </div>
      )}
    </div>
  );
};
