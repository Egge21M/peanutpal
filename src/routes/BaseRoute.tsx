import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { configRepository } from "../database";

function BaseRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const onboarded = await configRepository.isOnboarded();
      if (!onboarded) {
        navigate("/onboarding", { replace: true });
      }
    })();
  }, [navigate]);
  return (
    <div className="">
      <Navbar />
      {/* Add left padding on large screens to account for the fixed sidebar width */}
      <main className="p-2 lg:pl-64">
        <Outlet />
      </main>
    </div>
  );
}

export default BaseRoute;
