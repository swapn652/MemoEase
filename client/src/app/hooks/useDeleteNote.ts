import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface ApiResponse {
  success: boolean;
  data: any; 
}

const useDeleteNote = () => {
  const { token } = useAuth();

  const deleteNote = async (noteId: string): Promise<ApiResponse> => {
    try {
      const response = await axios.delete<ApiResponse>(`http://localhost:8080/deleteNote/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting note: ", error);
      throw error;
    }
  };

  return { deleteNote };
};

export default useDeleteNote;
