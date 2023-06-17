import { WalletBalanceResponse } from "@webbtc/webln-types";
import { useInfo } from "../hooks/useInfo";
import { useWebLNRequest } from "../hooks/useWebLNRequest";
import { Loading } from "./Loading";

export function InfoScreen() {
  const { data: info } = useInfo();
  const { data: walletBalance } =
    useWebLNRequest<WalletBalanceResponse>("walletbalance");
  if (!info) {
    return <Loading />;
  }
  return (
    <>
      <p>Alias: {info.node.alias}</p>
      <p>Pubkey: {info.node.pubkey}</p>
      <p>
        Supported methods:
        <br />
        {JSON.stringify(info.methods, undefined, 2)}
      </p>

      {walletBalance ? (
        <div className="">
          <p>
            Onchain balance: {walletBalance.confirmed_balance} sats confirmed,{" "}
            {walletBalance.unconfirmed_balance} sats unconfirmed
          </p>
        </div>
      ) : (
        <p>Loading onchain balance...</p>
      )}
    </>
  );
}
