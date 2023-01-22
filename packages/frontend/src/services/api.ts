import axios from "axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
};

export type Photographer = User & {
  company?: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  city?: string;
  state?: string;
  zip?: string;
  gear?: any;
  availability?: Date[];
  regions?: {
    city?: string;
    state?: string;
  }[];
  profilePic?: string;
  bio?: string;
  portfolioImages?: string[];
  isFavorite?: boolean;
};

export type PhotographerSearchQuery = {
  name: string;
  location:
    | string
    | {
        city: string;
        state: string;
      };
  gear: string;
  rate:
    | string
    | {
        min: string;
        max: string;
      };
  rating: string;
  page?: string | number;
};

export type Message = {
  sender: string;
  recipient: string;
  message: string;
  createdAt: string;
  lastReply: string;
  isRootMessage: boolean;
  eventTitle?: string;
  eventType?: string;
  eventLocation?: string;
  eventDescription?: string;
  eventDate?: Date;
  isRead?: boolean;
  reactions?: string[];
  replyTo?: string;
  hasUnreadReplies?: boolean;
  lastReadReplyId?: string;
};

export type IncomingMessage = Message & {
  replies?: IncomingMessage[];
  id: string;
  sender: Photographer;
};

export type MessageResponse = {
  message: IncomingMessage;
  thread: IncomingMessage[];
};

export type LoginResponse = User & {
  status: Number;
};

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  company?: string;
  city?: string;
  state?: string;
}

export interface RegisterResponse {
  userId: string;
}

export type SearchResponse = {
  photographers: Photographer[];
  totalResults: number;
  totalPages: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  rate: number;
  photographer: Photographer;
};

export type EventFeedResponse = {
  events: Event[];
  totalResults: number;
  totalPages: number;
};

export type EventResponse = {
  event: Event;
};

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error.response;
  },
);

export const login = async (
  username: string,
  password: string | undefined,
): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });
    return { ...res.data, status: res.status };
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

export const getLoggedInUser = async (): Promise<LoginResponse> => {
  try {
    const res = await api.get("/auth/user");
    return { ...res.data, status: res.status };
  } catch (error) {
    throw error;
  }
};

// Photographer routes

export const updateProfile = async (photographer: Partial<Photographer>): Promise<Photographer> => {
  try {
    const res = await api.put<Photographer>(`/api/photographer/${photographer.id}`, photographer);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentPhotographer = async (): Promise<Photographer> => {
  try {
    const res = await api.get("/api/photographer");
    return res.data;
  } catch (error) {
    throw error;
  }
};

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

export const searchPhotographers = async (
  search: PhotographerSearchQuery,
): Promise<SearchResponse> => {
  try {
    const res = await api.post("/api/photographers/search", search);
    if (res.status === 200) {
      return res.data;
    }
    return { photographers: [], totalResults: 0, totalPages: 0 };
  } catch (error) {
    throw error;
  }
};

export const getFavorites = async (): Promise<Photographer[]> => {
  try {
    const res = await api.get("/api/favorites");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addFavorite = async (id: string): Promise<Photographer> => {
  try {
    const res = await api.post("/api/favorites", { id });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeFavorite = async (id: string): Promise<Photographer> => {
  try {
    const res = await api.delete("/api/favorites/", { data: { id } });
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

export const createMessage = async (message: Message): Promise<Message> => {
  try {
    const res = await api.post("/api/messages", message);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateMessage = async (id: string, message: Partial<Message>): Promise<void> => {
  try {
    const res = await api.patch(`/api/messages/${id}`, message);
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

export const getEvents = async (page: number): Promise<EventFeedResponse> => {
  try {
    const res = await api.get("/api/events?page=" + page);
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
