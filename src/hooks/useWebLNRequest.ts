import { RequestMethod } from "@webbtc/webln-types";
import useSWR from "swr";

export function useWebLNRequest<T>(request: RequestMethod) {
  return useSWR<T>(`request.${request}`, () => {
    if (!window.webln) {
      throw new Error("No WebLN");
    }
    return window.webln.request(request) as T;
  });
}
