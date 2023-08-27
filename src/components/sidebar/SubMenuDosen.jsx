import { Link } from "react-router-dom";

export const SubMenuBimbingan = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/bimbingan-kp" className="block py-2">
      Bimbingan Kerja Praktek
    </Link>
    <Link to="/bimbingan-skripsi" className="block py-2">
      Bimbingan Skripsi
    </Link>
  </div>
);

export const SubMenuPenguji = () => (
  <div className="ml-[65px] mt-2 flex flex-col justify-center">
    <Link to="/penguji-kp" className="block py-2">
      Penguji Kerja Praktek
    </Link>
    <Link to="/penguji-sempro" className="block py-2">
      Penguji Seminar Proposal
    </Link>
    <Link to="/penguji-skripsi" className="block py-2">
      Penguji Akhir Skripsi
    </Link>
  </div>
);
