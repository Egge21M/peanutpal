import { Outlet } from "react-router";

function BaseRoute() {
  return (
    <div>
      <div></div>
      <Outlet />
    </div>
  );
}

export default BaseRoute;
