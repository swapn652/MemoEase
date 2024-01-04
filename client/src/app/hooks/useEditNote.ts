import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ApiResponse {
  success: boolean;
  data: any;
}

const useEditNote = () => {
  const { token } = useAuth();

  const editNote = async (noteId: string, title: string, description: string): Promise<ApiResponse> => {
    try {
      const response = await axios.patch<ApiResponse>(
        `http://localhost:8080/editNote/${noteId}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error editing note:', error);
      throw error;
    }
  };

  return { editNote };
};

export default useEditNote;
