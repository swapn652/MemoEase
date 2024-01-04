import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ApiResponse {
    success: boolean;
    data: any;
}

const useAddNote = () => {
    const { token } = useAuth();

    const addNote = async(title: string, description: string): Promise<ApiResponse> => {
        try {
            const response = await axios.post<ApiResponse>(
                "http://localhost:8080/addNote",
                { title, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch(error) {
            console.log("Error adding note: ", error);
            throw error;
        }
    }

    return { addNote };
}

export default useAddNote;