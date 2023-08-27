import { useState, useEffect } from "react";
import {
  FaHome,
  FaLinux,
  FaRegFolderOpen,
  FaSignOutAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SubMenuBimbingan, SubMenuPenguji } from "./SubMenuDosen";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import Swal from "sweetalert2";

const Menus = [{ title: "dashboard", label: "Dashboard", icon: FaHome }];

export const SidebarDosen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [subMenuBimbingan, setSubMenuBimbingan] = useState(false);
  const [subMenuPenguji, setSubMenuPenguji] = useState(false);

  useEffect(() => {
    const path = location.pathname.slice(1);

    if (path.startsWith("bimbingan-")) {
      setActive("bimbingan");
    } else if (path.startsWith("penguji-")) {
      setActive("penguji");
    } else {
      setActive("dashboard");
    }

    const closeDropdown = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setSubMenuBimbingan(false);
        setSubMenuPenguji(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [location]);

  const dropdownPengajuan = () => {
    setSubMenuBimbingan(!subMenuBimbingan);
    setActive("bimbingan");
  };

  const dropdownSidang = () => {
    setSubMenuPenguji(!subMenuPenguji);
    setActive("penguji");
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah anda yakin untuk logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
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
          <FaLinux className="text-2xl mr-2" />
          <h1 className="text-xl font-bold">SKKP DOSEN</h1>
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
              active === "bimbingan"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaRegFolderOpen className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Bimbingan</h1>
          </div>
        </div>
        {subMenuBimbingan && <SubMenuBimbingan />}

        {/* Kelola Sidang */}
        <div className="flex items-center justify-center mt-4 ">
          <div
            onClick={dropdownSidang}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "penguji"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaUserGraduate className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Penguji</h1>
          </div>
        </div>
        {subMenuPenguji && <SubMenuPenguji />}

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
