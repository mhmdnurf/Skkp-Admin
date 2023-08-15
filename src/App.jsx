import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { HomePengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/HomePengajuanKP";
import { HomePengajuanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/HomePengajuanSkripsi";
import { HomeTahunAjaran } from "./pages/tahun_ajaran/HomeTahunAjaran";
import { HomeJadwal } from "./pages/pengelolaan/jadwal/HomeJadwal";
import { AddTahunAjaran } from "./pages/tahun_ajaran/AddTahunAjaran";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pengajuan-kp" element={<HomePengajuanKP />} />
          <Route path="/pengajuan-skripsi" element={<HomePengajuanSkripsi />} />
          <Route path="/tahun-ajaran" element={<HomeTahunAjaran />} />
          <Route path="/tahun-ajaran/create" element={<AddTahunAjaran />} />
          <Route path="/kelola-jadwal" element={<HomeJadwal />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
