import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../views/auth/Login.ts";
import Logout from "../views/auth/Logout.ts";
import Register from "../views/auth/Register.ts";
import Profile from "../views/profile/index.ts";
import Root from "./Root.ts";
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
} from "../services/api.ts";
import logoutLoader from "../utils/logoutLoader.ts";
import PhotographersList, { LIST_TYPE } from "../views/photographers/PhotographersList.ts";
import Compose from "../views/messages/Compose.ts";
import Inbox from "../views/messages/Inbox.ts";
import ViewMessage from "../views/messages/ViewMessage.ts";
import Layout from "../views/Layout.ts";
import EventDetail from "../views/events/EventDetail.ts";
import EventsFeed from "../views/events/EventsFeed.ts";
import Search from "../views/search/Search.ts";

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
