import React from "react";
import { useAppStore } from "../state/AppStore";
import { Loading } from "./Loading";

export function ConnectScreen() {
  const [isLoading, setLoading] = React.useState(false);
  const connect = React.useCallback(async () => {
    setLoading(true);
    try {
      if (!window.webln) {
        throw new Error("Please install the Alby extension");
      }
      console.log("Enabling webln");
      await window.webln.enable();
      useAppStore.getState().setConnected(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full items-center justify-center">
      <h1 className="text-lg p-0 m-0">WebLN Manager</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <button className="btn btn-primary" onClick={connect}>
          Connect
        </button>
      )}
    </div>
  );
}
