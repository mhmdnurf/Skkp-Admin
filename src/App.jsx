import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { HomePengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/HomePengajuanKP";
import { HomePengajuanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/HomePengajuanSkripsi";
import { HomeTahunAjaran } from "./pages/tahun_ajaran/HomeTahunAjaran";
import { HomeJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/HomeJadwalSidang";
import { Login } from "./pages/auth/Login";
import { CreateTahunAjaran } from "./pages/tahun_ajaran/CreateTahunAjaran";
import { EditTahunAjaran } from "./pages/tahun_ajaran/EditTahunAjaran";
import { CreateJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/CreateJadwalSidang";
import { HomeJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/HomeJadwalPengajuan";
import { CreateJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/CreateJadwalPengajuan";
import { DetailPengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/DetailPengajuanKP";
import { VerifikasiKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/VerifikasiKP";
import { DosenPembimbingKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/DosenPembimbingKP";

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
            path="/kelola-jadwal/pengajuan"
            element={<HomeJadwalPengajuan />}
          />
          <Route
            path="/kelola-jadwal/pengajuan/create"
            element={<CreateJadwalPengajuan />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
