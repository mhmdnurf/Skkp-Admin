import { FaRegPaperPlane } from "react-icons/fa";
import PropTypes from "prop-types";

const Header = ({ username }) => (
  <h1 className="m-2 p-6 bg-white mb-4 rounded-xl drop-shadow-xl text-xl text-slate-600 font-extrabold flex items-center">
    Welcome Back, {username}
    <div className="ml-4 flex ">
      <FaRegPaperPlane size={40} />
    </div>
  </h1>
);

Header.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Header;
