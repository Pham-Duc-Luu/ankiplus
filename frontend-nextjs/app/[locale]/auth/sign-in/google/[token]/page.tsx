import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { token } = useParams<{ token: string }>();
  return <div>{token}</div>;
};

export default page;
