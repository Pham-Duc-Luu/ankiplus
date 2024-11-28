import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="  relative">
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}
