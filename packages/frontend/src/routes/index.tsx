import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../views/auth/Login.js";
import Logout from "../views/auth/Logout.js";
import Register from "../views/auth/Register.js";
import Profile from "../views/profile/index.js";
import Root from "./Root.jsx";
import {
  getPhotographerById,
  getMessages,
  getMessage,
  getFavorites,
  getCurrentPhotographer,
  searchPhotographers,
  PhotographerSearchQuery,
  PhotographerSearchResponse,
  getEventById,
  getEventsByPhotographer,
  EventSearchQuery,
  searchEvents,
  EventSearchResponse,
} from "../services/api.js";
import logoutLoader from "../utils/logoutLoader.js";
import PhotographersList, { LIST_TYPE } from "../views/photographers/PhotographersList.js";
import Compose from "../views/messages/Compose.js";
import Inbox from "../views/messages/Inbox.js";
import ViewMessage from "../views/messages/ViewMessage.js";
import Layout from "../views/Layout.js";
import EventDetail from "../views/events/EventDetail.js";
import EventsFeed from "../views/events/EventsFeed.js";
import Search from "../views/search/Search.js";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
        loader: async () => await logoutLoader(),
        element: <Logout />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/event/:id",
        loader: async ({ params }) => {
          const event = await getEventById(params.id);
          return event;
        },
        element: <EventDetail />,
      },
      {
        path: "/profile",
        loader: async () => {
          const photographer = await getCurrentPhotographer();
          return photographer;
        },
        element: <Profile />,
      },
      {
        path: "/photographer/:id",
        loader: async ({ params }) => {
          const photographer = await getPhotographerById(params.id);
          return photographer;
        },
        element: <Profile />,
      },
      {
        path: "/photographer/:id/events",
        loader: async ({ params }) => {
          return await getEventsByPhotographer(params.id);
        },
        element: <EventsFeed />,
      },
      {
        path: "/messages",
        loader: async () => {
          const data = await getMessages();
          return data;
        },
        element: <Inbox />,
      },
      {
        path: "/messages/compose",
        element: <Compose />,
      },
      {
        path: "/messages/:id",
        loader: async ({ params }) => {
          const message = await getMessage(params.id);
          return message;
        },
        element: <ViewMessage />,
      },
      {
        path: "/messages/:id/reply",
        element: <Compose />,
        loader: async ({ params }) => {
          const data = await getMessage(params.id);
          return data;
        },
      },
      {
        path: "/favorites",
        loader: async () => {
          const photographers = await getFavorites();
          return { data: { photographers } };
        },
        element: <PhotographersList listType={LIST_TYPE.FAVORITES} />,
      },
      {
        path: "/search",
        element: <Search />,
        children: [
          {
            path: "photographer/results",
            loader: async ({ request }) => {
              const url = new URL(request.url);
              const searchTerms = Object.fromEntries(url.searchParams) as PhotographerSearchQuery;
              const data = await searchPhotographers(searchTerms);
              const fetchNextPage = async (
                pageNumber: number,
              ): Promise<PhotographerSearchResponse> => {
                const result = await searchPhotographers({ ...searchTerms, page: pageNumber });
                return result;
              };
              return { data, fetchNextPage };
            },
            element: <PhotographersList />,
          },
          {
            path: "event/results",
            loader: async ({ request }) => {
              const url = new URL(request.url);
              const searchTerms = Object.fromEntries(url.searchParams) as EventSearchQuery;
              const data = await searchEvents(searchTerms, 1);
              const fetchNextPage = async (pageNumber: number): Promise<EventSearchResponse> => {
                const result = await searchEvents(searchTerms, pageNumber);
                return result;
              };
              return { data, fetchNextPage };
            },
            element: <EventsFeed />,
          },
        ],
      },
    ],
  },
]);

export default router;
