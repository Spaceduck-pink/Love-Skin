"use client";

import { createContext, useContext } from "react";

export const MobileMenuContext = createContext<() => void>(() => {});

export function useCloseMobileMenu() {
  return useContext(MobileMenuContext);
}
