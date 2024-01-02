import axios from "axios";

interface LoginData {
    username: string;
    password: string;
}

const login = async (userData: LoginData): Promise<any> => {
    try {
        const response = await axios.post("http://localhost:8080/login", userData);
        return response.data;
    } catch(error: any) {
        throw error.response.data;
    }
}

export default login;