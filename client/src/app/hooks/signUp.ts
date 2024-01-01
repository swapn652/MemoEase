import axios from "axios";

interface SignUpData {
    username: string;
    email: string;
    password: string;
}

const signUp = async (userData: SignUpData): Promise<any> => {
    try {
        const response = await axios.post("http://localhost:8080/register", userData);
        return response.data;
    } catch(error: any) {
        throw error.response.data;
    }
}

export default signUp;