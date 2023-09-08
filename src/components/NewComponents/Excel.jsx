import { useEffect, useState } from "react";
import { db, storage } from "../../utils/firebase";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { ref, uploadBytes } from "firebase/storage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import Datepicker from "react-tailwindcss-datepicker";

export default function Excel() {
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [periodeSidang, setPeriodeSidang] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     query(collection(db, "users"), where("role", "==", "Mahasiswa")),
  //     (snapshot) => {
  //       const fetchedData = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setUsers(fetchedData);
  //     }
  //   );

  //   // Cleanup: unsubscribe when the component unmounts or when the effect re-runs
  //   return () => unsubscribe();
  // }, []);

  const handleExcel = async () => {
    const rows = users.map((user) => ({
      nim: user.nim,
      nama: user.nama,
      jurusan: user.jurusan,
      email: user.email,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.utils.sheet_add_aoa(worksheet, [["NIM", "Nama", "Jurusan", "Email"]]);

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array", // Menghasilkan berkas buffer
    });

    // Menyimpan file Excel ke Firebase Cloud Storage // Inisialisasi Firebase Storage
    const storageRef = ref(storage, "laporan/Users.xlsx"); // Ref dengan path ke file di Firebase Storage

    try {
      await uploadBytes(storageRef, buffer, {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      console.log("File Excel berhasil disimpan di Firebase Storage!");
    } catch (error) {
      console.error("Gagal menyimpan file Excel:", error);
    }
  };

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setPeriodeSidang(newValue);
  };

  return (
    <>
      <div className="p-4 rounded-lg flex justify-evenly items-center h-screen">
        <button
          className="bg-slate-300 p-2 text-2xl shadow-lg rounded-md"
          onClick={handleExcel}
        >
          Export
        </button>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Halo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="mb-4 relative mt-2">
                <label className="block text-slate-600 font-bold">
                  Periode Pendaftaran Sidang
                </label>
                <div>
                  <Datepicker
                    value={periodeSidang}
                    onChange={handleValueChange}
                  />
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
