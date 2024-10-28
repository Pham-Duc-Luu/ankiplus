import React, { createContext, useState, ReactNode, FC } from "react";

// Define types for the context
interface MouseContextType {
  cursorType: string | "hover-hand" | "drag-hand";
  cursorChangeHandler: (cursorType: string) => void;
}

// Define the initial context with types
export const MouseContext = createContext<MouseContextType>({
  cursorType: "",
  cursorChangeHandler: () => {},
});

// Define props for the provider component
interface MouseContextProviderProps {
  children: ReactNode;
}

const MouseContextProvider: FC<MouseContextProviderProps> = ({ children }) => {
  const [cursorType, setCursorType] = useState<string>("");

  const cursorChangeHandler = (cursorType: string) => {
    setCursorType(cursorType);
  };

  return (
    <MouseContext.Provider
      value={{
        cursorType,
        cursorChangeHandler,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
};

export default MouseContextProvider;
