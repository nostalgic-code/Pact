import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <div className="h-full">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto bg-zinc-950">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
