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

export const SubMenuSidang = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/sidang-kp" className="block py-2">
      Sidang Kerja Praktek
    </Link>
    <Link to="/sidang-sempro" className="block py-2">
      Sidang Seminar Proposal
    </Link>
    <Link to="/sidang-kompre" className="block py-2">
      Sidang Komprehensif
    </Link>
    <Link to="/sidang-skripsi" className="block py-2">
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

export const SubMenuPengguna = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/kelola-pengguna/mahasiswa" className="block py-2">
      Mahasiswa
    </Link>
    <Link to="/kelola-pengguna/dosen" className="block py-2">
      Dosen
    </Link>
  </div>
);

export const SubMenuNilai = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/kelola-pengguna/mahasiswa" className="block py-2">
      Kerja Praktek
    </Link>
    <Link to="/kelola-pengguna/dosen" className="block py-2">
      Skripsi
    </Link>
  </div>
);
export const SubMenuTopik = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/kelola-pengguna/mahasiswa" className="block py-2">
      Teknik Informatika
    </Link>
    <Link to="/kelola-pengguna/dosen" className="block py-2">
      Sistem Informasi
    </Link>
    <Link to="/kelola-pengguna/dosen" className="block py-2">
      Komputer Akuntansi
    </Link>
  </div>
);
