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
  getCurrentPhotographer,
  searchPhotographers,
  PhotographerSearchQuery,
  SearchResponse,
} from "../services/api";
import logoutLoader from "../utils/logoutLoader";
import PhotographersList, { LIST_TYPE } from "../pages/photographers/PhotographersList";
import Compose from "../pages/messages/Compose";
import Inbox from "../pages/messages/Inbox";
import ViewMessage from "../pages/messages/ViewMessage";
import Layout from "../pages/Layout";
import SearchPhotographers from "../pages/search/SearchPhotographers";

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
          return { data: photographers };
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
        element: <SearchPhotographers />,
        children: [
          {
            path: "results",
            loader: async ({ request }) => {
              const url = new URL(request.url);
              const searchTerm = Object.fromEntries(url.searchParams) as PhotographerSearchQuery;
              const data = await searchPhotographers(searchTerm);
              const fetchNextPage = async (pageNumber: number): Promise<SearchResponse> => {
                const result = await searchPhotographers({ ...searchTerm, page: pageNumber });
                console.log({ result });
                return result;
              };
              return { data, fetchNextPage };
            },
            element: <PhotographersList listType={LIST_TYPE.REGION} />,
          },
        ],
      },
    ],
  },
]);

export default router;
