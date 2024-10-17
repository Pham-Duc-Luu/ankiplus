import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" relative min-h-screen flex justify-center items-center">
      <> {children}</>
    </div>
  );
}