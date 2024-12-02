"use client";

import IconCloud from "@/components/magicui/icon-cloud";
import React, { useEffect } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BackgroundLines className=" min-w-full min-h-screen flex items-center justify-center">
      <div className=" flex-1 justify-center items-center flex">{children}</div>
    </BackgroundLines>
  );
};

export default Layout;
