import axios from "axios";
import { useAuth } from "../context/AuthContext";

const useDeleteNote = () => {
    const { token } = useAuth();

    const deleteNote = async (noteId: string) => {
        try {
            const response = await axios.delete(`http://localhost:8080/deleteNote/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error: any) {
            console.log("Error deleting note: ", error);
            throw error;
        }
    };

    return { deleteNote };
}

export default useDeleteNote;
