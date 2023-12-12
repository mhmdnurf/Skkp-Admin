import {
  FaToolbox,
  FaRegFileAlt,
  FaLaptopCode,
  FaUserGraduate,
} from "react-icons/fa";
import PropTypes from "prop-types";

const iconMap = {
  FaToolbox: <FaToolbox className="mr-2" size={80} />,
  FaRegFileAlt: <FaRegFileAlt className="mr-2" size={80} />,
  FaLaptopCode: <FaLaptopCode className="mr-2" size={80} />,
  FaUserGraduate: <FaUserGraduate className="mr-2" size={80} />,
};

const PendaftarCard = ({ title, count, icon }) => (
  <div className="p-4 bg-white m-2 flex items-center justify-center rounded-xl hover:transform hover:scale-110 transition-transform duration-300 ease-in-out">
    {iconMap[icon]}
    <div className="text-right">
      <p>{title}</p>
      <p>{count ? count : 0}</p>
    </div>
  </div>
);

export default PendaftarCard;

PendaftarCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  icon: PropTypes.string.isRequired,
};
