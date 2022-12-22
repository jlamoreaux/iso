import axios from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
};

export type Photographer = User & {
  company?: string;
  email: string;
  phone?: string;
  website?: string;
  city?: string;
  state?: string;
  zip?: string;
  gear?: any;
  availability?: Date[];
  regions?: string[];
  profilePic?: string;
  bio?: string;
  portfolioImages?: string[];
};

export interface LoginResponse {
  id: string;
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

export const logout = async () => {
  return await api.post("/logout");
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await api.post<RegisterResponse>("/register", data);
  return res.data;
};

export const authTest = async () => {
  const response = await api.get("/authtest");
  return response;
};

export const getPhotographer = async (id: string | undefined): Promise<Photographer> => {
  const response = await api.get<Photographer>(`/photographer/${id}`);
  return response.data;
};
