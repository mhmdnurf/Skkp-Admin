import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { HomePengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/HomePengajuanKP";
import { HomePengajuanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/HomePengajuanSkripsi";
import { HomeTahunAjaran } from "./pages/pengelolaan/tahun_ajaran/HomeTahunAjaran";
import { HomeJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/HomeJadwalSidang";
import { Login } from "./pages/auth/Login";
import { CreateTahunAjaran } from "./pages/pengelolaan/tahun_ajaran/CreateTahunAjaran";
import { EditTahunAjaran } from "./pages/pengelolaan/tahun_ajaran/EditTahunAjaran";
import { CreateJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/CreateJadwalSidang";
import { HomeJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/HomeJadwalPengajuan";
import { CreateJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/CreateJadwalPengajuan";
import { DetailPengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/DetailPengajuanKP";
import { VerifikasiKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/VerifikasiKP";
import { DosenPembimbingKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/DosenPembimbingKP";
import { DetailPengajuanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/DetailPengajuanSkripsi";
import { VerifikasiSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/VerifikasiSkripsi";
import { DosenPembimbingSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/DosenPembimbingSkripsi";
import { EditJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/EditJadwalPengajuan";
import { EditJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/EditJadwalSidang";
import { HomeSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/HomeSidangKP";
import { DetailSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/DetailSidangKP";
import { HomeSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/HomeSidangSkripsi";
import { DetailSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/DetailSidangSkripsi";
import { VerifikasiSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/VerifikasiSidangSkripsi";
import { HomeSempro } from "./pages/pengelolaan/sidang/sempro/HomeSempro";
import { DetailSempro } from "./pages/pengelolaan/sidang/sempro/DetailSempro";
import { VerifikasiSempro } from "./pages/pengelolaan/sidang/sempro/VerifikasiSempro";
import { HomeKompre } from "./pages/pengelolaan/sidang/kompre/HomeKompre";
import { DetailKompre } from "./pages/pengelolaan/sidang/kompre/DetailKompre";
import { VerifikasiKompre } from "./pages/pengelolaan/sidang/kompre/VerifikasiKompre";
import { HomeMahasiswa } from "./pages/pengelolaan/pengguna/mahasiswa/HomeMahasiswa";
import { HomeDosen } from "./pages/pengelolaan/pengguna/dosen/HomeDosen";
import { HomeTopik } from "./pages/pengelolaan/topik/HomeTopik";
import { HomeNilaiKP } from "./pages/pengelolaan/nilai/kerja_praktek/HomeNilaiKP";
import { HomeNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/HomeNilaiSkripsi";
import { DosenPengujiKP } from "./pages/pengelolaan/sidang/kerja_praktek/DosenPengujiKP";
import { VerifikasiSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/VerifikasiSidangKP";
import { DosenPengujiSkripsi } from "./pages/pengelolaan/sidang/skripsi/DosenPengujiSkripsi";
import { DosenPengujiSempro } from "./pages/pengelolaan/sidang/sempro/DosenPengujiSempro";
import { CreateDosen } from "./pages/pengelolaan/pengguna/dosen/CreateDosen";
import { EditNilaiKP } from "./pages/pengelolaan/nilai/kerja_praktek/EditNilaiKP";
import { EditTopik } from "./pages/pengelolaan/topik/EditTopik";
import { CreateTopik } from "./pages/pengelolaan/topik/CreateTopik";
import { EditNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/EditNilaiSkripsi";
import { DetailNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/DetailNilaiSkripsi";
import { EditNilaiSempro } from "./pages/pengelolaan/nilai/skripsi/EditNilaiSempro";
import { EditNilaiKompre } from "./pages/pengelolaan/nilai/skripsi/EditNilaiKomprehensif";
import { JudulKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/JudulKP";
import { UbahTopikSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/TopikSkripsi";
import { JudulSempro } from "./pages/pengelolaan/sidang/sempro/JudulSempro";
import { JudulKompre } from "./pages/pengelolaan/sidang/kompre/JudulKompre";
import { JudulSkripsi } from "./pages/pengelolaan/sidang/skripsi/JudulSkripsi";
import { EditDosen } from "./pages/pengelolaan/pengguna/dosen/EditDosen";
import { EditMahasiswa } from "./pages/pengelolaan/pengguna/mahasiswa/EditMahasiswa";
import Excel from "./components/NewComponents/Excel";
import { RiwayatLaporanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/RiwayatLaporanKP";
import { RiwayatLaporanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/RiwayatLaporanSkripsi";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/excel" element={<Excel />} />
            <Route path="/pengajuan-kp" element={<HomePengajuanKP />} />
            <Route
              path="/pengajuan-kp/detail/:itemId"
              element={<DetailPengajuanKP />}
            />
            <Route
              path="/pengajuan-kp/verifikasi/:itemId"
              element={<VerifikasiKP />}
            />
            <Route
              path="/pengajuan-kp/dosen-pembimbing/:itemId"
              element={<DosenPembimbingKP />}
            />
            <Route path="/pengajuan-kp/judul/:itemId" element={<JudulKP />} />
            <Route
              path="/pengajuan-kp/riwayat-laporan"
              element={<RiwayatLaporanKP />}
            />
            <Route
              path="/pengajuan-skripsi"
              element={<HomePengajuanSkripsi />}
            />
            <Route
              path="/pengajuan-skripsi/detail/:itemId"
              element={<DetailPengajuanSkripsi />}
            />
            <Route
              path="/pengajuan-skripsi/verifikasi/:itemId"
              element={<VerifikasiSkripsi />}
            />
            <Route
              path="/pengajuan-skripsi/dosen-pembimbing/:itemId"
              element={<DosenPembimbingSkripsi />}
            />
            <Route
              path="/pengajuan-skripsi/ubah-topik/:itemId"
              element={<UbahTopikSkripsi />}
            />
            <Route
              path="/pengajuan-skripsi/riwayat-laporan"
              element={<RiwayatLaporanSkripsi />}
            />

            <Route path="/tahun-ajaran" element={<HomeTahunAjaran />} />
            <Route
              path="/tahun-ajaran/create"
              element={<CreateTahunAjaran />}
            />
            <Route
              path="/tahun-ajaran/edit/:itemId"
              element={<EditTahunAjaran />}
            />
            <Route
              path="/kelola-jadwal/sidang"
              element={<HomeJadwalSidang />}
            />
            <Route
              path="/kelola-jadwal/sidang/create"
              element={<CreateJadwalSidang />}
            />
            <Route
              path="/kelola-jadwal/sidang/edit/:itemId"
              element={<EditJadwalSidang />}
            />

            <Route
              path="/kelola-jadwal/pengajuan"
              element={<HomeJadwalPengajuan />}
            />

            <Route
              path="/kelola-jadwal/pengajuan/edit/:itemId"
              element={<EditJadwalPengajuan />}
            />
            <Route
              path="/kelola-jadwal/pengajuan/create"
              element={<CreateJadwalPengajuan />}
            />

            {/* Rute Kelola Nilai KP */}
            <Route path="/kelola-nilai/kp" element={<HomeNilaiKP />} />
            <Route path="/kelola-nilai/kp/:itemId" element={<EditNilaiKP />} />

            {/* Rute Kelola Nilai Skripsi */}
            <Route
              path="/kelola-nilai/skripsi"
              element={<HomeNilaiSkripsi />}
            />
            <Route
              path="/kelola-nilai/skripsi/detail/:itemId"
              element={<DetailNilaiSkripsi />}
            />
            <Route
              path="/kelola-nilai/sempro/:itemId"
              element={<EditNilaiSempro />}
            />
            <Route
              path="/kelola-nilai/kompre/:itemId"
              element={<EditNilaiKompre />}
            />
            <Route
              path="/kelola-nilai/skripsi/:itemId"
              element={<EditNilaiSkripsi />}
            />

            {/* Rute Sidang KP */}
            <Route path="/sidang-kp/" element={<HomeSidangKP />} />
            <Route
              path="/sidang-kp/detail/:itemId"
              element={<DetailSidangKP />}
            />
            <Route
              path="/sidang-kp/verifikasi/:itemId"
              element={<VerifikasiSidangKP />}
            />
            <Route
              path="/sidang-kp/penguji/:itemId"
              element={<DosenPengujiKP />}
            />

            {/* Rute Sempro */}
            <Route path="/sidang-sempro/" element={<HomeSempro />} />
            <Route
              path="/sidang-sempro/detail/:itemId"
              element={<DetailSempro />}
            />
            <Route
              path="/sidang-sempro/verifikasi/:itemId"
              element={<VerifikasiSempro />}
            />
            <Route
              path="/sidang-sempro/penguji/:itemId"
              element={<DosenPengujiSempro />}
            />
            <Route
              path="/sidang-sempro/ubah-judul/:itemId"
              element={<JudulSempro />}
            />

            {/* Rute Komprehensif */}
            <Route path="/sidang-kompre/" element={<HomeKompre />} />
            <Route
              path="/sidang-kompre/detail/:itemId"
              element={<DetailKompre />}
            />
            <Route
              path="/sidang-kompre/verifikasi/:itemId"
              element={<VerifikasiKompre />}
            />
            <Route
              path="/sidang-kompre/ubah-judul/:itemId"
              element={<JudulKompre />}
            />

            {/* Rute Sidang Skripsi */}
            <Route path="/sidang-skripsi/" element={<HomeSidangSkripsi />} />
            <Route
              path="/sidang-skripsi/detail/:itemId"
              element={<DetailSidangSkripsi />}
            />
            <Route
              path="/sidang-skripsi/verifikasi/:itemId"
              element={<VerifikasiSidangSkripsi />}
            />
            <Route
              path="/sidang-skripsi/penguji/:itemId"
              element={<DosenPengujiSkripsi />}
            />
            <Route
              path="/sidang-skripsi/ubah-judul/:itemId"
              element={<JudulSkripsi />}
            />

            {/* Rute Kelola Topik */}
            <Route path="/kelola-topik" element={<HomeTopik />} />
            <Route path="/kelola-topik/edit/:itemId" element={<EditTopik />} />
            <Route path="/kelola-topik/create" element={<CreateTopik />} />

            {/* Rute Pengguna Mahasiswa */}
            <Route
              path="/kelola-pengguna/mahasiswa"
              element={<HomeMahasiswa />}
            />
            <Route
              path="/kelola-pengguna/mahasiswa/edit/:itemId"
              element={<EditMahasiswa />}
            />

            {/* Rute Dosen */}
            <Route path="/kelola-pengguna/dosen" element={<HomeDosen />} />
            <Route
              path="/kelola-pengguna/dosen/create"
              element={<CreateDosen />}
            />
            <Route
              path="/kelola-pengguna/dosen/edit/:itemId"
              element={<EditDosen />}
            />
          </>
        </Routes>
      </BrowserRouter>
    </>
  );
}
