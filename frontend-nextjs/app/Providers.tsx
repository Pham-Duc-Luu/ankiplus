// app/providers.tsx
"use client";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import createApolloClient from "@/lib/apolloClient";
import { useAppSelector } from "@/store/hooks";
import { persistor, store } from "@/store/store";
import { ApolloProvider } from "@apollo/client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export function ApolloCustomeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useAppSelector((state) => state.persistedReducer);

  return (
    <ApolloProvider client={createApolloClient({ token: auth.access_token })}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>{children}</Provider>
      </PersistGate>
    </ApolloProvider>
  );
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Toaster></Toaster>

        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <ApolloCustomeProvider>{children}</ApolloCustomeProvider>
          </Provider>
        </PersistGate>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
