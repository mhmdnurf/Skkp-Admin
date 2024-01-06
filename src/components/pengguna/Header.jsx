import PropTypes from "prop-types";

const Header = ({ title }) => {
  return (
    <>
      <h1 className="text-2xl text-white text-center shadow-md font-semibold rounded-lg p-4 m-4 mb-10 bg-slate-600">
        Data {title}
      </h1>
    </>
  );
};

export default Header;

Header.propTypes = {
  title: PropTypes.string.isRequired,
};
