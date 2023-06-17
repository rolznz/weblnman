import { GetInfoResponse } from "@webbtc/webln-types";
import useSWR from "swr";

export function useInfo() {
  return useSWR<GetInfoResponse>("info", () => {
    if (!window.webln) {
      throw new Error("No WebLN");
    }
    return window.webln.getInfo();
  });
}
