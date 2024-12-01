// app/providers.tsx
"use client";
import { Toaster } from "@/components/ui/toaster";
import MouseContextProvider from "@/context/mouse-context";
import createApolloClient from "@/lib/apolloClient";
import { useAppSelector } from "@/store/hooks";
import { persistor, store } from "@/store/store";
import { ApolloProvider } from "@apollo/client";
import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
            <MouseContextProvider>
              <GoogleOAuthProvider
                clientId={`${process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID}`}
              >
                {children}
              </GoogleOAuthProvider>
              {/* <ApolloCustomeProvider> */}
              {/* </ApolloCustomeProvider> */}
            </MouseContextProvider>
          </Provider>
        </PersistGate>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
