"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
