import React from "react";
import { useWebLNRequest } from "../hooks/useWebLNRequest";
import { ListPeersResponse } from "@webbtc/webln-types";
import { Buffer } from "buffer";

export function OpenChannelButton() {
  const [isLoading, setLoading] = React.useState(false);
  const { data: peers } = useWebLNRequest<ListPeersResponse>("listpeers");

  const openChannel = React.useCallback(async () => {
    if (isLoading || !peers) {
      alert("please wait");
      return;
    }
    if (!peers) {
      alert("failed to load peers");
      return;
    }
    setLoading(true);

    try {
      await (async () => {
        const pubkey = window.prompt(
          "Pubkey",
          "035e4ff418fc8b5554c5d9eea66396c227bd429a3251c8cbc711002ba215bfc226"
        );
        if (!pubkey) {
          return;
        }
        if (!peers.peers.some((peer) => peer.pub_key === pubkey)) {
          const host = window.prompt("Host", "170.75.163.209:9735");
          if (!host) {
            return;
          }
          const connectPeerResult = await window.webln?.request("connectpeer", {
            addr: {
              pubkey,
              host,
            },
            perm: true,
            timeout: 10,
          });
          console.log("Connect peer result", connectPeerResult);
        } else {
          console.log("Peer already connected");
        }

        const amount = window.prompt("Local funding amount", "500000");
        if (!amount) {
          return;
        }
        const fee = window.prompt(
          "Fee (sat/vB) - check mempool.space for an appropriate value",
          "20"
        );
        if (!fee) {
          return;
        }

        //https://stackoverflow.com/a/41797377/4562693
        function hexToBase64(hexstring: string) {
          return btoa(
            hexstring
              .match(/\w{2}/g)!
              .map(function (a) {
                return String.fromCharCode(parseInt(a, 16));
              })
              .join("")
          );
        }

        const openChannelResult = (await window.webln?.request("openchannel", {
          node_pubkey: hexToBase64(pubkey),
          local_funding_amount: parseInt(amount),
          push_sat: 0,
          sat_per_byte: parseInt(fee),
        })) as { funding_txid_bytes?: string };
        console.log("Open channel result", openChannelResult);
        if (openChannelResult.funding_txid_bytes) {
          const swapEndianness = (string: string) => {
            const result = [];
            let len = string.length - 2;

            while (len >= 0) {
              result.push(string.substring(len, len + 2));
              len -= 2;
            }
            return result.join("");
          };

          const getTransactionId = (transactionIdBytes: string): string => {
            const buffer = Buffer.from(transactionIdBytes, "base64");
            const hex = buffer.toString("hex");
            const transactionId = swapEndianness(hex);

            return transactionId;
          };
          console.log(
            "Transaction ID: ",
            getTransactionId(openChannelResult.funding_txid_bytes)
          );
          alert(
            "Transaction ID: " +
              getTransactionId(openChannelResult.funding_txid_bytes)
          );
        }
      })();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [isLoading, peers]);

  return (
    <button className="btn btn-primary" onClick={openChannel}>
      Open Channel
    </button>
  );
}
