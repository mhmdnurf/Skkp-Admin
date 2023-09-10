import { useState, useEffect } from "react";
import {
  FaBullhorn,
  FaFileContract,
  FaHistory,
  FaHome,
  FaRegClock,
  FaRegFolderOpen,
  FaServer,
  FaSignOutAlt,
  FaUser,
  FaUserGraduate,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SubMenuPengajuan,
  SubMenuSidang,
  SubMenuJadwal,
  SubMenuPengguna,
  SubMenuNilai,
} from "./SubMenu";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import Swal from "sweetalert2";

const Menus = [{ title: "dashboard", label: "Dashboard", icon: FaHome }];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [subMenuPengajuan, setSubMenuPengajuan] = useState(false);
  const [subMenuSidang, setSubMenuSidang] = useState(false);
  const [subMenuJadwal, setSubMenuJadwal] = useState(false);
  const [subMenuPengguna, setSubMenuPengguna] = useState(false);
  const [subMenuNilai, setSubMenuNilai] = useState(false);

  useEffect(() => {
    const path = location.pathname.slice(1);

    if (path.startsWith("pengajuan-")) {
      setActive("pengajuan");
    } else if (path.startsWith("sidang-")) {
      setActive("sidang");
    } else if (path.startsWith("kelola-jadwal")) {
      setActive("kelolaJadwal");
    } else if (path.startsWith("kelola-nilai")) {
      setActive("kelolaNilai");
    } else if (path.startsWith("kelola-topik")) {
      setActive("kelolaTopik");
    } else if (path.startsWith("kelola-pengguna")) {
      setActive("kelolaPengguna");
    } else if (path.startsWith("tahun-ajaran")) {
      setActive("tahunAjaran");
    } else if (path.startsWith("pengumuman")) {
      setActive("pengumuman");
    } else {
      setActive("dashboard");
    }

    const closeDropdown = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setSubMenuPengajuan(false);
        setSubMenuSidang(false);
        setSubMenuJadwal(false);
        setSubMenuNilai(false);
        setSubMenuPengguna(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [location]);

  const dropdownPengajuan = () => {
    setSubMenuPengajuan(!subMenuPengajuan);
    setActive("pengajuan");
  };

  const dropdownSidang = () => {
    setSubMenuSidang(!subMenuSidang);
    setActive("sidang");
  };

  const dropdownJadwal = () => {
    setSubMenuJadwal(!subMenuJadwal);
    setActive("kelolaJadwal");
  };

  const dropdownNilai = () => {
    setSubMenuNilai(!subMenuNilai);
    setActive("kelolaNilai");
  };

  const dropdownPengguna = () => {
    setSubMenuPengguna(!subMenuPengguna);
    setActive("kelolaPengguna");
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda Yakin?",
        text: "Data akan hilang permanen ketika dihapus",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#334155",
        cancelButtonColor: "#94a3b8",
        cancelButtonText: "Batal",
        confirmButtonText: "Confirm",
      });

      if (result.isConfirmed) {
        await signOut(auth);
        navigate("/login");
        Swal.fire("Success", "Berhasil Logout!", "success");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className="bg-slate-100 h-full min-w-[300px] text-slate-600 border-2 overflow-y-auto transition-opacity duration-300 drop-shadow-xl border-r-slate-300 fixed top-0 left-0">
        <div className="flex items-center justify-center pt-10 pb-4">
          <div className="p-2 bg-white rounded-xl mr-2 shadow-md border-2">
            <img
              src="https://api-frontend.kemdikbud.go.id/v2/detail_pt_logo/RjFDMjk0MDktMzJDNi00QThFLUI0NDQtNTU2MTU4Qjk5MjZG"
              alt="logo stti"
              className="object-contain w-10 h-10"
            />
          </div>
          <h1 className="text-xl font-bold">SKKP ADMIN</h1>
        </div>
        <hr />

        {Menus.map((menu) => (
          <Link
            key={menu.title}
            to={menu.title === "dashboard" ? "/" : `/${menu.title}`}
            className="flex items-center justify-center mt-4 transition-opacity duration-300"
          >
            <div
              className={`flex w-[200px] p-4 items-center ${
                active === menu.title
                  ? "bg-white rounded-md drop-shadow-lg"
                  : ""
              } ${active === menu.title ? "opacity-100" : "opacity-50"}`}
            >
              <menu.icon className="font-bold mr-2 text-lg" />
              <h1 className="font-bold">{menu.label}</h1>
            </div>
          </Link>
        ))}

        {/* Kelola Pengajuan */}
        <div className="flex items-center justify-center mt-4 ">
          <div
            onClick={dropdownPengajuan}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "pengajuan"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaRegFolderOpen className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Kelola Pengajuan</h1>
          </div>
        </div>
        {subMenuPengajuan && <SubMenuPengajuan />}

        {/* Kelola Sidang */}
        <div className="flex items-center justify-center mt-4 ">
          <div
            onClick={dropdownSidang}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "sidang"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaUserGraduate className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Kelola Sidang</h1>
          </div>
        </div>
        {subMenuSidang && <SubMenuSidang />}

        {/* Jadwal Pengajuan */}
        <div className="flex items-center justify-center mt-4">
          <div
            onClick={dropdownJadwal}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "kelolaJadwal"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaRegClock className="font-bold mr-2 text-lg" />
            <h1 className="font-bold">Kelola Jadwal</h1>
          </div>
        </div>
        {subMenuJadwal && <SubMenuJadwal />}

        {/* Jadwal Pengajuan */}
        <div className="flex items-center justify-center mt-4">
          <div
            onClick={dropdownNilai}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "kelolaNilai"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaServer className="font-bold mr-2 text-lg" />
            <h1 className="font-bold">Kelola Nilai</h1>
          </div>
        </div>
        {subMenuNilai && <SubMenuNilai />}

        {/* Jadwal Pengajuan */}
        <div className="flex items-center justify-center mt-4">
          <Link
            to="/kelola-topik"
            className={`flex w-[200px] p-4 items-center cursor-pointer ${
              active === "kelolaTopik"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaFileContract className="font-bold mr-2 text-lg" />
            <h1 className="font-bold">Kelola Topik</h1>
          </Link>
        </div>

        {/* Jadwal Pengajuan */}
        <div className="flex items-center justify-center mt-4">
          <div
            onClick={dropdownPengguna}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "kelolaPengguna"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaUser className="font-bold mr-2 text-lg" />
            <h1 className="font-bold">Kelola Pengguna</h1>
          </div>
        </div>
        {subMenuPengguna && <SubMenuPengguna />}

        {/* Tahun Ajaran */}
        <div className="flex items-center justify-center mt-4">
          <Link
            to="/tahun-ajaran"
            className={`flex w-[200px] p-4 items-center cursor-pointer ${
              active === "tahunAjaran"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaHistory className="font-bold mr-2 text-lg" />
            <h1 className="font-bold">Tahun Ajaran</h1>
          </Link>
        </div>

        {/* Buka Pengumuman */}
        <div className="flex items-center justify-center mt-4">
          <Link
            to="/pengumuman"
            className={`flex w-[200px] p-4 items-center cursor-pointer ${
              active === "pengumuman"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaBullhorn className="font-bold mr-2 text-lg" />
            <h1 className="font-bold">Pengumuman</h1>
          </Link>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-center mt-4 ">
          <div
            onClick={handleLogout}
            className={`flex w-[200px] p-4 items-center cursor-pointer ${
              active === "logout"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaSignOutAlt className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Logout</h1>
          </div>
        </div>

        <div className="mb-10" />
      </div>
    </>
  );
};
