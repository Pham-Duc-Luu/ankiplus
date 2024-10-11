import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" relative min-h-screen">
      <Navbar></Navbar>
      <div>
        <SideBar></SideBar>
        <div>{children}</div>
      </div>
    </div>
  );
}
