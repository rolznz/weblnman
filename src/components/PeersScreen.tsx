import { ListPeersResponse } from "@webbtc/webln-types";
import { useWebLNRequest } from "../hooks/useWebLNRequest";
import { Loading } from "./Loading";
import React from "react";

export function PeersScreen() {
  const { data: peersResponse } =
    useWebLNRequest<ListPeersResponse>("listpeers");
  const sortedPeers = React.useMemo(
    () =>
      peersResponse?.peers.sort(
        (a, b) => parseInt(b.sat_sent) - parseInt(a.sat_sent)
      ),
    [peersResponse]
  );
  if (!sortedPeers) {
    return <Loading />;
  }

  return (
    <>
      <p>Connected Peers ({sortedPeers.length})</p>
      <table className="table">
        <thead>
          <tr>
            <th>Pubkey</th>
            <th>Sats sent</th>
            <th>Sats received</th>
          </tr>
        </thead>
        <tbody>
          {sortedPeers.map((peer) => (
            <tr key={peer.pub_key}>
              <th>{peer.pub_key}</th>
              <th>{peer.sat_sent}</th>
              <th>{peer.sat_recv}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
