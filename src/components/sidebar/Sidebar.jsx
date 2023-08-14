import { useState, useEffect } from "react";
import { FaHome, FaReact } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Menus = [{ title: "dashboard", label: "Dashboard", icon: FaHome }];

const DropdownMenu = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/pengajuan" className="block py-2">
      Pengajuan Kerja Praktek
    </Link>
    <Link to="/pengajuan" className="block py-2">
      Pengajuan Skripsi
    </Link>
  </div>
);

export const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState("");
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const path = location.pathname.slice(1);
    setActive(path || "dashboard");
    const closeDropdown = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setDropdown(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, [location]);

  const dropdownPengajuan = () => {
    setDropdown(true);
    setActive("pengajuan");
  };

  return (
    <>
      <div
        className={`bg-slate-100 min-w-[300px] min-h-screen text-slate-600 border-2 overflow-y-auto transition-opacity duration-300`}
      >
        <div className="flex items-center justify-center pt-10 pb-4">
          <FaReact className="text-2xl mr-2" />
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

        <div className="flex items-center justify-center mt-4 ">
          <div
            onClick={dropdownPengajuan}
            className={`flex w-[200px] p-4 items-center cursor-pointer dropdown-container ${
              active === "pengajuan"
                ? " bg-white rounded-md drop-shadow-lg"
                : "opacity-50"
            }`}
          >
            <FaReact className="font-bold mr-2 text-lg" />
            <h1 className="font-bold ">Kelola Pengajuan</h1>
          </div>
        </div>
        {dropdown && <DropdownMenu />}

        <div className="mb-10" />
      </div>
    </>
  );
};
