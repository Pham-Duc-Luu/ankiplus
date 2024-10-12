// app/providers.tsx
"use client";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { persistor, store } from "@/store/store";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Toaster></Toaster>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>{children}</Provider>
        </PersistGate>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
