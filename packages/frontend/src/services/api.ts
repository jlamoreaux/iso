import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Accept, Origin, Authorization",
    "Access-Control-Allow-Origin": "localhost:3001",
  },
});

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/login", {
    email,
    password,
  });
  return res.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/register", data);
  return res.data;
};
