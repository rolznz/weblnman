import { GetInfoResponse } from "@webbtc/webln-types";
import React from "react";
import { Loading } from "./components/Loading";
import { Buffer } from "buffer";

type GetWalletBalanceResponse = {
  total_balance: string;
  confirmed_balance: string;
  unconfirmed_balance: string;
  locked_balance: string;
  reserved_balance_anchor_chan: string;
  account_balance: {
    default: {
      confirmed_balance: string;
      unconfirmed_balance: string;
    };
  };
};

type ListChannelsResponse = {
  channels: {}[];
};
type ListPeersResponse = {
  peers: {
    pub_key: string;
    address: string;
    bytes_sent: string;
    bytes_recv: string;
    sat_sent: string;
    sat_recv: string;
    inbound: boolean;
    ping_time: string;
    sync_type: string;
    features: Record<string, unknown>;
    errors: [];
    flap_count: number;
    last_flap_ns: string;
    last_ping_payload: string;
  }[];
};

function App() {
  const [info, setInfo] = React.useState<GetInfoResponse | undefined>();
  const [isLoading, setLoading] = React.useState<boolean>();
  const [walletBalance, setWalletBalance] = React.useState<
    { confirmed: number; unconfirmed: number } | undefined
  >();
  const [peers, setPeers] = React.useState<
    ListPeersResponse["peers"] | undefined
  >();
  const [channels, setChannels] = React.useState<
    ListChannelsResponse["channels"] | undefined
  >();
  const connect = React.useCallback(async () => {
    if (!window.webln) {
      throw new Error("Please install the Alby extension");
    }
    setLoading(true);
    console.log("Enabling webln");
    await window.webln.enable();

    console.log("Getting info");
    const info = await window.webln.getInfo();
    console.log("Got info", info);
    setInfo(info);
    if (info.methods.indexOf("walletbalance") > -1) {
      const balanceResponse = (await window.webln.request(
        "walletbalance"
      )) as GetWalletBalanceResponse;
      console.log("Balance", balanceResponse);
      setWalletBalance({
        confirmed: parseInt(balanceResponse.confirmed_balance),
        unconfirmed: parseInt(balanceResponse.unconfirmed_balance),
      });
    }
    if (info.methods.indexOf("listpeers") > -1) {
      const peersResponse = (await window.webln.request(
        "listpeers"
      )) as ListPeersResponse;
      console.log("Peers", peersResponse);
      setPeers(peersResponse.peers);
    }
    if (info.methods.indexOf("listchannels") > -1) {
      const channelsResponse = (await window.webln.request(
        "listchannels"
      )) as ListChannelsResponse;
      console.log("Channels", channelsResponse);
      setChannels(channelsResponse.channels);
    }
    setLoading(false);
  }, []);

  const openChannel = React.useCallback(async () => {
    if (isLoading) {
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
        if (!peers.some((peer) => peer.pub_key === pubkey)) {
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
          "Fee (sat/vB) - note: currently high priority!",
          "200"
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
        console.log("Connect peer result", openChannelResult);
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
        }
      })();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [isLoading, peers, info]);

  return (
    <div className="p-4 flex flex-col gap-4 items-center justify-center min-h-full container">
      <h1 className="text-lg p-0 m-0">WebLN Manager</h1>
      {!info && !isLoading && (
        <button className="btn btn-primary" onClick={connect}>
          Connect
        </button>
      )}
      {isLoading && <Loading />}
      {info && (
        <div className="">
          <p>
            Connected to {info.node.alias} {info.node.pubkey}
          </p>
          <p>Supported methods: {JSON.stringify(info.methods, undefined, 2)}</p>
        </div>
      )}
      {walletBalance && (
        <div className="">
          <p>
            Wallet balance: {walletBalance.confirmed} sats confirmed,{" "}
            {walletBalance.unconfirmed} sats unconfirmed
          </p>
        </div>
      )}
      {peers && (
        <div className="">
          <p>
            Peers:{" "}
            {JSON.stringify(
              peers.map((peer) => peer.pub_key),
              undefined,
              2
            )}
          </p>
        </div>
      )}
      {channels && (
        <div className="">
          <p>Channels: {JSON.stringify(channels, undefined, 2)}</p>
        </div>
      )}
      {info &&
        info.methods.indexOf("connectpeer") > -1 &&
        info.methods.indexOf("openchannel") > -1 &&
        peers && (
          <button className="btn btn-primary" onClick={openChannel}>
            Open Channel
          </button>
        )}
    </div>
  );
}

export default App;
