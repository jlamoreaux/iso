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
  try {
    const res = await api.post<LoginResponse>("/login", {
      email,
      password,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/register", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Photographer routes

export const getPhotographerById = async (id: string): Promise<Photographer> => {
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

export const getPhotographersByRegion = async (region: string): Promise<Photographer[]> => {
  try {
    const res = await api.get(`/api/photographers/${region}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPhotographersByRegionAndAvailability = async (
  region: string,
  date: string,
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

export const getMessage = async (id: string): Promise<Message> => {
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

export const deleteMessage = async (id: string): Promise<void> => {
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

export const getEvent = async (id: string): Promise<Event> => {
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

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const res = await api.delete(`/api/events/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
