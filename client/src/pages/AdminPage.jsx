import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function AdminPage() {
  useEffect(() => {
    document.title = "ADMIN Panel";
  }, []);
  return (
    <div className="w-full h-[100vh] bg-zinc-800 flex flex-col">
      <Navbar firstHead={"admin"} secondHead={"panel"} />
      <Outlet />
    </div>
  );
}

export default AdminPage;
