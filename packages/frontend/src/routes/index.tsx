import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Logout from "../pages/auth/Logout";
import Register from "../pages/auth/Register";
import Profile from "../pages/profile";
import Root from "./Root";
import {
  getPhotographerById,
  getPhotographersByRegion,
  getPhotographersByRegionAndAvailability,
  getMessages,
  getMessage,
  getFavorites,
  getEvents,
  getEvent,
  getCurrentPhotographer,
} from "../services/api";
import logoutLoader from "../utils/logoutLoader";
import PhotographersList, { LIST_TYPE } from "../pages/photographers/PhotographersList";
import Compose from "../pages/messages/Compose";
import Inbox from "../pages/messages/Inbox";
import ViewMessage from "../pages/messages/ViewMessage";
import Layout from "../pages/Layout";

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
        path: "/photographers/:region",
        loader: async ({ params }) => {
          const photographers = await getPhotographersByRegion(params.region);
          return photographers;
        },
        element: <PhotographersList listType={LIST_TYPE.REGION} />,
      },
      {
        path: "/photographers/:region/:date",
        loader: async ({ params }) => {
          const photographers = await getPhotographersByRegionAndAvailability(
            params.region,
            params.date,
          );
          return photographers;
        },
        element: <PhotographersList listType={LIST_TYPE.AVAILABILITY} />,
      },
      {
        path: "/messages",
        loader: async () => {
          const messages = await getMessages();
          return messages;
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
          const message = await getMessage(params.id);
          return message;
        },
      },
      {
        path: "/favorites",
        loader: async () => {
          const photographers = await getFavorites();
          console.log(photographers);
          return photographers;
        },
        element: <PhotographersList listType={LIST_TYPE.FAVORITES} />,
      },
      // {
      //   path: "/events",
      //   loader: async () => {
      //     const events = await getEvents();
      //     return events;
      //   },
      //   element: <EventsList />,
      // },
      // {
      //   path: "/events/:id",
      //   loader: async ({ params }) => {
      //     const event = await getEvent(params.id);
      //     return event;
      //   },
      //   element: <EventDetails />,
      // },
    ],
  },
]);

export default router;
