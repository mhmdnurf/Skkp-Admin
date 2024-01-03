import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import { HomePengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/HomePengajuanKP";
import { DetailPengajuanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/DetailPengajuanKP";
import { VerifikasiKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/VerifikasiKP";
import { DosenPembimbingKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/DosenPembimbingKP";
import { JudulKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/JudulKP";
import { RiwayatLaporanKP } from "./pages/pengelolaan/pengajuan/pengajuan_kp/RiwayatLaporanKP";
import { HomePengajuanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/HomePengajuanSkripsi";
import { DetailPengajuanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/DetailPengajuanSkripsi";
import { VerifikasiSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/VerifikasiSkripsi";
import { DosenPembimbingSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/DosenPembimbingSkripsi";
import { UbahTopikSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/TopikSkripsi";
import { RiwayatLaporanSkripsi } from "./pages/pengelolaan/pengajuan/pengajuan_skripsi/RiwayatLaporanSkripsi";
import { HomeTahunAjaran } from "./pages/pengelolaan/tahun_ajaran/HomeTahunAjaran";
import { CreateTahunAjaran } from "./pages/pengelolaan/tahun_ajaran/CreateTahunAjaran";
import { EditTahunAjaran } from "./pages/pengelolaan/tahun_ajaran/EditTahunAjaran";
import { HomeJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/HomeJadwalSidang";
import { CreateJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/CreateJadwalSidang";
import { EditJadwalSidang } from "./pages/pengelolaan/jadwal/sidang/EditJadwalSidang";
import { HomeJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/HomeJadwalPengajuan";
import { EditJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/EditJadwalPengajuan";
import { CreateJadwalPengajuan } from "./pages/pengelolaan/jadwal/pengajuan/CreateJadwalPengajuan";
import { HomeNilaiKP } from "./pages/pengelolaan/nilai/kerja_praktek/HomeNilaiKP";
import { EditNilaiKP } from "./pages/pengelolaan/nilai/kerja_praktek/EditNilaiKP";
import { RiwayatNilaiKP } from "./pages/pengelolaan/nilai/kerja_praktek/RiwayatNilaiKP";
import { HomeNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/HomeNilaiSkripsi";
import { DetailNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/DetailNilaiSkripsi";
import { EditNilaiSempro } from "./pages/pengelolaan/nilai/skripsi/EditNilaiSempro";
import { EditNilaiKompre } from "./pages/pengelolaan/nilai/skripsi/EditNilaiKomprehensif";
import { EditNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/EditNilaiSkripsi";
import { RiwayatNilaiSkripsi } from "./pages/pengelolaan/nilai/skripsi/RiwayatNilaiSkripsi";
import { HomeSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/HomeSidangKP";
import { DetailSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/DetailSidangKP";
import { VerifikasiSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/VerifikasiSidangKP";
import { DosenPengujiKP } from "./pages/pengelolaan/sidang/kerja_praktek/DosenPengujiKP";
import { RiwayatLaporanSidangKP } from "./pages/pengelolaan/sidang/kerja_praktek/RiwayatLaporanSidangKP";
import { HomeSempro } from "./pages/pengelolaan/sidang/sempro/HomeSempro";
import { DetailSempro } from "./pages/pengelolaan/sidang/sempro/DetailSempro";
import { VerifikasiSempro } from "./pages/pengelolaan/sidang/sempro/VerifikasiSempro";
import { DosenPengujiSempro } from "./pages/pengelolaan/sidang/sempro/DosenPengujiSempro";
import { JudulSempro } from "./pages/pengelolaan/sidang/sempro/JudulSempro";
import { RiwayatLaporanSempro } from "./pages/pengelolaan/sidang/sempro/RiwayatLaporanSempro";
import { HomeKompre } from "./pages/pengelolaan/sidang/kompre/HomeKompre";
import { DetailKompre } from "./pages/pengelolaan/sidang/kompre/DetailKompre";
import { VerifikasiKompre } from "./pages/pengelolaan/sidang/kompre/VerifikasiKompre";
import { JudulKompre } from "./pages/pengelolaan/sidang/kompre/JudulKompre";
import { RiwayatLaporanKompre } from "./pages/pengelolaan/sidang/kompre/RiwayatLaporanKompre";
import { HomeSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/HomeSidangSkripsi";
import { DetailSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/DetailSidangSkripsi";
import { VerifikasiSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/VerifikasiSidangSkripsi";
import { DosenPengujiSkripsi } from "./pages/pengelolaan/sidang/skripsi/DosenPengujiSkripsi";
import { JudulSkripsi } from "./pages/pengelolaan/sidang/skripsi/JudulSkripsi";
import { RiwayatLaporanSidangSkripsi } from "./pages/pengelolaan/sidang/skripsi/RiwayatLaporanSidangSkripsi";
import { HomeTopik } from "./pages/pengelolaan/topik/HomeTopik";
import { EditTopik } from "./pages/pengelolaan/topik/EditTopik";
import { CreateTopik } from "./pages/pengelolaan/topik/CreateTopik";
import { HomeMahasiswa } from "./pages/pengelolaan/pengguna/mahasiswa/HomeMahasiswa";
import { EditMahasiswa } from "./pages/pengelolaan/pengguna/mahasiswa/EditMahasiswa";
import { HomeDosen } from "./pages/pengelolaan/pengguna/dosen/HomeDosen";
import { CreateDosen } from "./pages/pengelolaan/pengguna/dosen/CreateDosen";
import { EditDosen } from "./pages/pengelolaan/pengguna/dosen/EditDosen";
import { CreatePengumuman } from "./pages/pengelolaan/pengumuman/CreatePengumuman";
import { HomePengumuman } from "./pages/pengelolaan/pengumuman/HomeBukaPengumuman";
import HomePersyaratan from "./pages/pengelolaan/persyaratan/HomePersyaratan";
import CreatePersyaratan from "./pages/pengelolaan/persyaratan/CreatePersyaratan";
import EditPersyaratan from "./pages/pengelolaan/persyaratan/EditPersyaratan";

const routes = [
  { path: "/login", element: <Login /> },
  { path: "/", element: <Dashboard /> },
  { path: "/pengajuan-kp", element: <HomePengajuanKP /> },
  { path: "/pengajuan-kp/detail/:itemId", element: <DetailPengajuanKP /> },
  { path: "/pengajuan-kp/verifikasi/:itemId", element: <VerifikasiKP /> },
  {
    path: "/pengajuan-kp/dosen-pembimbing/:itemId",
    element: <DosenPembimbingKP />,
  },
  { path: "/pengajuan-kp/judul/:itemId", element: <JudulKP /> },
  { path: "/pengajuan-kp/riwayat-laporan", element: <RiwayatLaporanKP /> },
  { path: "/pengajuan-skripsi", element: <HomePengajuanSkripsi /> },
  {
    path: "/pengajuan-skripsi/detail/:itemId",
    element: <DetailPengajuanSkripsi />,
  },
  {
    path: "/pengajuan-skripsi/verifikasi/:itemId",
    element: <VerifikasiSkripsi />,
  },
  {
    path: "/pengajuan-skripsi/dosen-pembimbing/:itemId",
    element: <DosenPembimbingSkripsi />,
  },
  {
    path: "/pengajuan-skripsi/ubah-topik/:itemId",
    element: <UbahTopikSkripsi />,
  },
  {
    path: "/pengajuan-skripsi/riwayat-laporan",
    element: <RiwayatLaporanSkripsi />,
  },
  { path: "/tahun-ajaran", element: <HomeTahunAjaran /> },
  { path: "/tahun-ajaran/create", element: <CreateTahunAjaran /> },
  { path: "/tahun-ajaran/edit/:itemId", element: <EditTahunAjaran /> },
  { path: "/kelola-jadwal/sidang", element: <HomeJadwalSidang /> },
  { path: "/kelola-jadwal/sidang/create", element: <CreateJadwalSidang /> },
  { path: "/kelola-jadwal/sidang/edit/:itemId", element: <EditJadwalSidang /> },
  { path: "/kelola-jadwal/pengajuan", element: <HomeJadwalPengajuan /> },
  {
    path: "/kelola-jadwal/pengajuan/edit/:itemId",
    element: <EditJadwalPengajuan />,
  },
  {
    path: "/kelola-jadwal/pengajuan/create",
    element: <CreateJadwalPengajuan />,
  },
  { path: "/kelola-nilai/kp", element: <HomeNilaiKP /> },
  { path: "/kelola-nilai/kp/:itemId", element: <EditNilaiKP /> },
  { path: "/kelola-nilai/kp/riwayat-laporan", element: <RiwayatNilaiKP /> },
  { path: "/kelola-nilai/skripsi", element: <HomeNilaiSkripsi /> },
  {
    path: "/kelola-nilai/skripsi/detail/:itemId",
    element: <DetailNilaiSkripsi />,
  },
  { path: "/kelola-nilai/sempro/:itemId", element: <EditNilaiSempro /> },
  { path: "/kelola-nilai/kompre/:itemId", element: <EditNilaiKompre /> },
  { path: "/kelola-nilai/skripsi/:itemId", element: <EditNilaiSkripsi /> },
  {
    path: "/kelola-nilai/skripsi/riwayat-laporan",
    element: <RiwayatNilaiSkripsi />,
  },
  { path: "/sidang-kp/", element: <HomeSidangKP /> },
  { path: "/sidang-kp/detail/:itemId", element: <DetailSidangKP /> },
  { path: "/sidang-kp/verifikasi/:itemId", element: <VerifikasiSidangKP /> },
  { path: "/sidang-kp/penguji/:itemId", element: <DosenPengujiKP /> },
  { path: "/sidang-kp/riwayat-laporan", element: <RiwayatLaporanSidangKP /> },
  { path: "/sidang-sempro/", element: <HomeSempro /> },
  { path: "/sidang-sempro/detail/:itemId", element: <DetailSempro /> },
  { path: "/sidang-sempro/verifikasi/:itemId", element: <VerifikasiSempro /> },
  { path: "/sidang-sempro/penguji/:itemId", element: <DosenPengujiSempro /> },
  { path: "/sidang-sempro/ubah-judul/:itemId", element: <JudulSempro /> },
  { path: "/sidang-sempro/riwayat-laporan", element: <RiwayatLaporanSempro /> },
  { path: "/sidang-kompre/", element: <HomeKompre /> },
  { path: "/sidang-kompre/detail/:itemId", element: <DetailKompre /> },
  { path: "/sidang-kompre/verifikasi/:itemId", element: <VerifikasiKompre /> },
  { path: "/sidang-kompre/ubah-judul/:itemId", element: <JudulKompre /> },
  { path: "/sidang-kompre/riwayat-laporan", element: <RiwayatLaporanKompre /> },
  { path: "/sidang-skripsi/", element: <HomeSidangSkripsi /> },
  { path: "/sidang-skripsi/detail/:itemId", element: <DetailSidangSkripsi /> },
  {
    path: "/sidang-skripsi/verifikasi/:itemId",
    element: <VerifikasiSidangSkripsi />,
  },
  { path: "/sidang-skripsi/penguji/:itemId", element: <DosenPengujiSkripsi /> },
  { path: "/sidang-skripsi/ubah-judul/:itemId", element: <JudulSkripsi /> },
  {
    path: "/sidang-skripsi/riwayat-laporan",
    element: <RiwayatLaporanSidangSkripsi />,
  },
  { path: "/kelola-topik", element: <HomeTopik /> },
  { path: "/kelola-topik/edit/:itemId", element: <EditTopik /> },
  { path: "/kelola-topik/create", element: <CreateTopik /> },
  { path: "/kelola-pengguna/mahasiswa", element: <HomeMahasiswa /> },
  {
    path: "/kelola-pengguna/mahasiswa/edit/:itemId",
    element: <EditMahasiswa />,
  },
  { path: "/kelola-pengguna/dosen", element: <HomeDosen /> },
  { path: "/kelola-pengguna/dosen/create", element: <CreateDosen /> },
  { path: "/kelola-pengguna/dosen/edit/:itemId", element: <EditDosen /> },
  { path: "/pengumuman", element: <HomePengumuman /> },
  { path: "/pengumuman/create", element: <CreatePengumuman /> },
  { path: "/kelola-persyaratan", element: <HomePersyaratan /> },
  { path: "/kelola-persyaratan/create", element: <CreatePersyaratan /> },
  { path: "/kelola-persyaratan/edit/:itemId", element: <EditPersyaratan /> },
];

export default routes;
