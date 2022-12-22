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
  } catch(error){
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/register", data);
    return res.data;
  } catch(error){
    throw error;
  }
};

// Photographer routes

export const getPhotographerById = (id: string): Promise<Photographer> => {
  try {
    const res = api.get(`/api/photographer/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updatePhotographerById = (id: string, photographer: Photographer): Promise<void> => {
  try {
    api.put(`/api/photographer/${id}`, photographer);
  } catch (error) {
    throw error;
  }
};

export const getPhotographersByRegion = (region: string): Promise<Photographer[]> => {
  try {
    const res = api.get(`/api/photographers/${region}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPhotographersByRegionAndAvailability = (region: string, date: string): Promise<Photographer[]> => {
  try {
    const res = api.get(`/api/photographers/${region}/${date}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Message routes

export const getMessages = (): Promise<Message[]> => {
  try {
    const res = api.get("/api/messages");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getMessage = (id: string): Promise<Message> => {
  try {
    const res = api.get(`/api/messages/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createMessage = (message: Message): Promise<void> => {
  try {
    api.post("/api/messages", message);
  } catch (error) {
    throw error;
  }
};

export const updateMessage = (id: string, message: Message): Promise<void> => {
  try {
    api.put(`/api/messages/${id}`, message);
  } catch (error) {
    throw error;
  }
};

export const deleteMessage = (id: string): Promise<void> => {
  try {
    api.delete(`/api/messages/${id}`);
  } catch (error) {
    throw error;
  }
};

// Event routes

export const getEvents = (): Promise<Event[]> => {
  try {
    const res = api.get("/api/events");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getEvent = (id: string): Promise<Event> => {
  try {
    const res = api.get(`/api/events/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createEvent = (event: Event): Promise<void> => {
  try {
    api.post("/api/events", event);
  } catch (error) {
    throw error;
  }
};

export const updateEvent = (id: string, event: Event): Promise<void> => {
  try {
    api.put(`/api/events/${id}`, event);
  } catch (error) {
    throw error;
  }
};

export const deleteEvent = (id: string): Promise<void> => {
  try {
    api.delete(`/api/events/${id}`);
  } catch (error) {
    throw error;
  }
};


