import PropTypes from "prop-types";

const PengumumanCard = ({ title, dates, registrationDates }) => (
  <div className="bg-white p-4 rounded-lg mb-4 hover:transform hover:scale-105 transition-transform duration-300 ease-in-out text-slate-600 drop-shadow-lg">
    <h3 className="font-bold text-md">{title}</h3>
    {dates.start && dates.end ? (
      <>
        <p>
          Diberitahukan kepada mahasiswa/i {title} akan diadakan pada periode :{" "}
          <b>
            {" "}
            {new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(dates.start)}
          </b>
        </p>
        <p>
          Pendaftaran dibuka Tanggal:{" "}
          <b>
            {new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(registrationDates.start)}
          </b>
        </p>
        <p>
          Pendaftaran ditutup Tanggal:{" "}
          <b>
            {new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(registrationDates.end)}
          </b>
        </p>
      </>
    ) : (
      <p className="text-red-500 font-bold uppercase">
        Pendaftaran Sedang Ditutup
      </p>
    )}
  </div>
);

PengumumanCard.propTypes = {
  title: PropTypes.string.isRequired,
  dates: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }).isRequired,
  registrationDates: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }).isRequired,
};

export default PengumumanCard;
