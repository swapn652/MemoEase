import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

interface UserData {
  id: string;
  username: string;
  email: string;
  // Add other properties if needed
}

interface ApiResponse {
  success: boolean;
  data: UserData;
}

const getCurrentLoggedInUserData = () => {
  const { token } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get<ApiResponse>("http://localhost:8080/getCurrentLoggedInUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.data);
      } catch (error: any) {
        setError(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return { userData, loading, error };
};

export default getCurrentLoggedInUserData;
