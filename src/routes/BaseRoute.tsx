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
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
}

export default BaseRoute;
