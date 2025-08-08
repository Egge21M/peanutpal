import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import BaseRoute from "./routes/BaseRoute.tsx";
import ConnectRoute from "./routes/ConnectRoute.tsx";
import HomeRoute from "./routes/HomeRoute.tsx";
import WalletRoute from "./routes/WalletRoute.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RemoteRoute from "./routes/RemoteRoute.tsx";
import SettingsRoute from "./routes/SettingsRoute.tsx";
import { nostrService } from "./services";

// Initialize keys and start Nostr listening
nostrService.initAndStart().catch((error) => {
  console.error("Failed to initialize Nostr:", error);
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseRoute />,
    children: [
      {
        path: "",
        element: <HomeRoute />,
      },
      { path: "/wallet", element: <WalletRoute /> },
      { path: "/remote/:npub", element: <RemoteRoute /> },
      { path: "/connect", element: <ConnectRoute /> },
      { path: "/settings", element: <SettingsRoute /> },
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
