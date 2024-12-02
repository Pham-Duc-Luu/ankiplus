import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { GlobeDemo } from "./GlobaDemo";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="  min-h-screen min-w-full">
      <>{children}</>
    </div>
  );
}
