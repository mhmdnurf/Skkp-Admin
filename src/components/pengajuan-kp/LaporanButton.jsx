import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Datepicker from "react-tailwindcss-datepicker";
import PropTypes from "prop-types";

const LaporanButton = ({
  onOpen,
  isOpen,
  onClose,
  tanggal,
  handleValueChange,
  handleLaporan,
  handleRiwayatLaporan,
}) => {
  return (
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
              <label className="block text-slate-600 font-bold">Tanggal</label>
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
  );
};

LaporanButton.propTypes = {
  onOpen: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  tanggal: PropTypes.string,
  handleValueChange: PropTypes.func,
  handleLaporan: PropTypes.func,
  handleRiwayatLaporan: PropTypes.func,
};

export default LaporanButton;
