import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen overflow-y-auto ">
        <InfinitySpin width="200" color="#475569" />
      </div>
    </>
  );
};

export default Loader;
