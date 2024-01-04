import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";

const useUserAuthorization = (user) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserAuthorization = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setIsLoading(false);
          if (userData.role !== "prodi") {
            navigate("/login");
          }
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching user data");
      }
    };

    getUserAuthorization();
  }, [user, navigate]);

  return isLoading;
};

export default useUserAuthorization;
