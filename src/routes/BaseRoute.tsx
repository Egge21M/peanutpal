import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

function BaseRoute() {
  return (
    <div className="">
      <Navbar />
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
}

export default BaseRoute;
