import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

interface Note {
    id: string;
    title: string;
    description: string;
}

interface ApiResponse {
    notes: Note[];
}

const fetchNotes = () => {
    const { token } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!token)
                    throw new Error("Token not found!");

                const response = await axios.get<ApiResponse>("http://localhost:8080/fetchNotes", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            
                setNotes(response.data.notes);
            } catch (error: any) {
                setError(error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [notes, token])


    return { notes, loading, error };
}

export default fetchNotes;