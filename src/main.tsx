import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import BaseRoute from "./routes/BaseRoute.tsx";
import { generateSecretKey } from "nostr-tools";
import { nsecEncode } from "nostr-tools/nip19";
import ConnectRoute from "./routes/ConnectRoute.tsx";
import HomeRoute from "./routes/HomeRoute.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

if (!localStorage.getItem("peanut-key")) {
  const newKey = generateSecretKey();
  const encoded = nsecEncode(newKey);
  localStorage.setItem("peanut-key", encoded);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseRoute />,
    children: [
      {
        path: "",
        element: <HomeRoute />,
      },
      { path: "/remote/:npub", element: <p>Remote</p> },
      { path: "/connect", element: <ConnectRoute /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </>,
);
