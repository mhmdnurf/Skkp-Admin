import { useState, useEffect } from "react";
import {
  FaHistory,
  FaHome,
  FaLinux,
  FaRegClock,
  FaRegFolderOpen,
  FaSignOutAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SubMenuPengajuan, SubMenuPendaftaran, SubMenuJadwal } from "./SubMenu";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

const Menus = [{ title: "dashboard", label: "Dashboard", icon: FaHome }];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [subMenuPengajuan, setSubMenuPengajuan] = useState(false);
  const [subMenuPendaftaran, setSubMenuPendaftaran] = useState(false);
  const [subMenuJadwal, setSubMenuJadwal] = useState(false);

  useEffect(() => {
    const path = location.pathname.slice(1);

    if (path.startsWith("pengajuan-")) {
      setActive("pengajuan");
    } else if (path.startsWith("tahun-ajaran")) {
      setActive("tahunAjaran");
    } else if (path.startsWith("kelola-jadwal")) {
      setActive("kelolaJadwal");
    } else {
      setActive("dashboard");
    }

    const closeDropdown = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setSubMenuPengajuan(false);
        setSubMenuPendaftaran(false);
        setSubMenuJadwal(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [location]);

  const dropdownPengajuan = () => {
    setSubMenuPengajuan(!subMenuPengajuan);
    setActive("pengajuan");
  };

  const dropdownPendaftaran = () => {
    setSubMenuPendaftaran(!subMenuPendaftaran);
    setActive("pendaftaran");
  };

  const dropdownJadwal = () => {
    setSubMenuJadwal(!subMenuJadwal);
    setActive("kelolaJadwal");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div
        className={`bg-slate-100 min-w-[300px] min-h-screen text-slate-600 border-2 overflow-y-auto transition-opacity duration-300 drop-shadow-xl border-r-slate-300`}
      >
        <div className="flex items-center justify-center pt-10 pb-4">
          <FaLinux className="text-2xl mr-2" />
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

        {/* Kelola Pendaftaran */}
        <div className="flex items-center justify-center mt-4 ">
          <div
            onClick={dropdownPendaftaran}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "pendaftaran"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaUserGraduate className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Kelola Pendaftaran</h1>
          </div>
        </div>
        {subMenuPendaftaran && <SubMenuPendaftaran />}

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
