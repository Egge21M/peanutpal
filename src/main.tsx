import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import BaseRoute from "./routes/BaseRoute.tsx";
import { generateSecretKey } from "nostr-tools";
import { nsecEncode } from "nostr-tools/nip19";

if (!localStorage.getItem("peanut-key")) {
  const newKey = generateSecretKey();
  const encoded = nsecEncode(newKey);
  localStorage.setItem("peeanut-key", encoded);
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseRoute />,
    children: [
      {
        path: "",
        element: <p>Home</p>,
      },
      { path: "/remote/:npub", element: <p>Remote</p> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
