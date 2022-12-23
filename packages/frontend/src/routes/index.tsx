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
  getEvents,
  getEvent,
} from "../services/api";
import logoutLoader from "../utils/logoutLoader";
import PhotographersList, { LIST_TYPE } from "../pages/PhotographersList";

const router = createBrowserRouter([
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
  // {
  //   path: "/messages",
  //   loader: async () => {
  //     const messages = await getMessages();
  //     return messages;
  //   },
  //   element: <MessagesList />,
  // },
  // {
  //   path: "/messages/:id",
  //   loader: async ({ params }) => {
  //     const message = await getMessage(params.id);
  //     return message;
  //   },
  //   element: <MessageDetails />,
  // },
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
]);

export default router;
