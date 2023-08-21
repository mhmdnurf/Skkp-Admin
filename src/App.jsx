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

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
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
          <Route path="/pengajuan-skripsi" element={<HomePengajuanSkripsi />} />
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
          <Route path="/tahun-ajaran" element={<HomeTahunAjaran />} />
          <Route path="/tahun-ajaran/create" element={<CreateTahunAjaran />} />
          <Route
            path="/tahun-ajaran/edit/:itemId"
            element={<EditTahunAjaran />}
          />
          <Route path="/kelola-jadwal/sidang" element={<HomeJadwalSidang />} />
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

          {/* Rute Sidang KP */}
          <Route path="/sidang-kp/" element={<HomeSidangKP />} />
          <Route
            path="/sidang-kp/detail/:itemId"
            element={<DetailSidangKP />}
          />
          <Route
            path="/sidang-kp/verifikasi/:itemId"
            element={<VerifikasiKP />}
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
        </Routes>
      </BrowserRouter>
    </>
  );
}
