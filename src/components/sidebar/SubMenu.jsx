import { Link } from "react-router-dom";

export const SubMenuPengajuan = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/pengajuan-kp" className="block py-2">
      Pengajuan Kerja Praktek
    </Link>
    <Link to="/pengajuan-skripsi" className="block py-2">
      Pengajuan Skripsi
    </Link>
  </div>
);

export const SubMenuPendaftaran = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/pendaftaran" className="block py-2">
      Sidang Kerja Praktek
    </Link>
    <Link to="/pendaftaran" className="block py-2">
      Sidang Seminar Proposal
    </Link>
    <Link to="/pendaftaran" className="block py-2">
      Sidang Komprehensif
    </Link>
    <Link to="/pendaftaran" className="block py-2">
      Sidang Akhir Skripsi
    </Link>
  </div>
);

export const SubMenuJadwal = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/kelola-jadwal/pengajuan" className="block py-2">
      Jadwal Pengajuan
    </Link>
    <Link to="/kelola-jadwal/sidang" className="block py-2">
      Jadwal Sidang
    </Link>
  </div>
);
