import { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { db } from "../../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner"; // Import loader library
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Pengguna terautentikasi, cek role
      const checkUserRole = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === "prodi") {
            navigate("/");
          } else {
            // Pengguna bukan "prodi", tampilkan pesan kesalahan
            alert("Access denied. Kamu bukan prodi :)");
          }
        }
      };

      checkUserRole();
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Memulai loader saat proses otentikasi dimulai

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Mengambil data pengguna dari Firebase Authentication
      const user = userCredential.user;

      // Mengambil data pengguna dari Firestore menggunakan user.uid sebagai referensi
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Memeriksa role pengguna
        if (userData.role === "prodi") {
          console.log("Logged in user:", user);
          // Reset input fields dan error
          setEmail("");
          setPassword("");
        }
      }

      setIsLoading(false); // Menghentikan loader setelah proses otentikasi selesai
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false); // Menghentikan loader jika terjadi kesalahan
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <div className="w-1/2">
          <img
            src="../../src/assets/undraw_join_re_w1lh.svg"
            alt="Left"
            className="w-full"
          />
        </div>
        <div className="w-full max-w-md mx-auto p-20 drop-shadow-2xl bg-slate-100 border-8 border-white rounded-xl">
          <h1 className="text-2xl font-bold text-slate-600 mb-4 text-center">
            Halo, Silahkan Login Terlebih Dahulu
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 drop-shadow-sm">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 drop-shadow-sm">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 px-4 py-2 w-full border rounded-md focus:ring focus:ring-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-600 text-white py-2 rounded-md hover:bg-slate-700 focus:ring focus:ring-slate-600"
              disabled={isLoading} // Menonaktifkan tombol login selama isLoading true
            >
              Login{" "}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
        <div className="w-1/2">
          <img
            src="../../src/assets/undraw_sign_up_n6im.svg"
            alt="Right"
            className="w-full"
          />
        </div>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black bg-opacity-50">
          <InfinitySpin width={200} color="#ffffff" />
        </div>
      )}
    </>
  );
};
