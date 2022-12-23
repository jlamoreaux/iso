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

export type Message = {
  sender: Photographer;
  recipient: Photographer;
  message: string;
  date?: Date;
  isRead?: boolean;
  reactions?: string[];
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

export const login = async (
  email: string,
  password: string | undefined,
): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  return await api.post("/auth/logout");
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Photographer routes

export const getPhotographerById = async (id: string | undefined): Promise<Photographer> => {
  try {
    const res = await api.get(`/api/photographer/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updatePhotographerById = async (
  id: string,
  photographer: Photographer,
): Promise<void> => {
  try {
    const res = await api.put(`/api/photographer/${id}`, photographer);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPhotographersByRegion = async (
  region: string | undefined,
): Promise<Photographer[]> => {
  try {
    const res = await api.get(`/api/photographers/${region}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPhotographersByRegionAndAvailability = async (
  region?: string,
  date?: string,
): Promise<Photographer[]> => {
  try {
    const res = await api.get(`/api/photographers/${region}/${date}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Message routes

export const getMessages = async (): Promise<Message[]> => {
  try {
    const res = await api.get("/api/messages");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMessage = async (id: string | undefined): Promise<Message> => {
  try {
    const res = await api.get(`/api/messages/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createMessage = async (message: Message): Promise<void> => {
  try {
    const res = await api.post("/api/messages", message);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateMessage = async (id: string, message: Message): Promise<void> => {
  try {
    const res = await api.put(`/api/messages/${id}`, message);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = async (id: string | undefined): Promise<void> => {
  try {
    const res = await api.delete(`/api/messages/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Event routes

export const getEvents = async (): Promise<Event[]> => {
  try {
    const res = await api.get("/api/events");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getEvent = async (id: string | undefined): Promise<Event> => {
  try {
    const res = await api.get(`/api/events/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createEvent = async (event: Event): Promise<void> => {
  try {
    const res = await api.post("/api/events", event);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (id: string, event: Event): Promise<void> => {
  try {
    const res = await api.put(`/api/events/${id}`, event);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = async (id: string | undefined): Promise<void> => {
  try {
    const res = await api.delete(`/api/events/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
