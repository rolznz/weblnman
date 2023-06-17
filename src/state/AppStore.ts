import { create } from "zustand";

export const tabs = [
  "info",
  "peers",
  "channels",
  "invoices",
  "payments",
] as const;
export type TabType = (typeof tabs)[number];

interface AppState {
  isConnected: boolean;
  selectedTab: TabType;
  setConnected: (isConnected: boolean) => void;
  setSelectedTab: (tab: TabType) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  isConnected: false,
  setConnected: (isConnected) => set(() => ({ isConnected })),
  selectedTab: "info",
  setSelectedTab: (tab) => set(() => ({ selectedTab: tab })),
}));
