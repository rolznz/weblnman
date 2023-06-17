import { ListChannelsResponse } from "@webbtc/webln-types";
import { useWebLNRequest } from "../hooks/useWebLNRequest";
import { Loading } from "./Loading";
import React from "react";
import { OpenChannelButton } from "./OpenChannelButton";

const BACKGROUND_OPACITY = 0.25;
const GREEN = `rgba(0,255,0,${BACKGROUND_OPACITY})`;
const BLUE = `rgba(0,0,255,${BACKGROUND_OPACITY})`;

export function ChannelsScreen() {
  const { data: channelsResponse } =
    useWebLNRequest<ListChannelsResponse>("listchannels");
  const sortedChannels = React.useMemo(
    () =>
      channelsResponse?.channels.sort(
        (a, b) => parseInt(b.capacity) - parseInt(a.capacity)
      ),
    [channelsResponse]
  );
  if (!sortedChannels) {
    return <Loading />;
  }

  return (
    <>
      <p>Connected Channels ({sortedChannels.length})</p>
      <OpenChannelButton />
      <table className="table bg-transparent">
        <thead>
          <tr>
            <th>Pubkey</th>
            <th>Capacity</th>
            <th>Local balance</th>
            <th>Remote balance</th>
            <th>Sats sent</th>
            <th>Sats received</th>
          </tr>
        </thead>
        <tbody>
          {sortedChannels.map((channel) => {
            const localLiquidityPercent =
              (parseInt(channel.local_balance) /
                (parseInt(channel.local_balance) +
                  parseInt(channel.remote_balance))) *
              100;
            return (
              <tr
                key={channel.channel_point}
                style={{
                  background: `linear-gradient(90deg, ${GREEN} 0%, ${GREEN} ${localLiquidityPercent}%, ${BLUE} ${localLiquidityPercent}%, ${BLUE} 100%)`,
                }}
              >
                <th className="bg-transparent">{channel.remote_pubkey}</th>
                <th className="bg-transparent">{channel.capacity}</th>
                <th className="bg-transparent">{channel.local_balance}</th>
                <th className="bg-transparent">{channel.remote_balance}</th>
                <th className="bg-transparent">
                  {channel.total_satoshis_sent}
                </th>
                <th className="bg-transparent">
                  {channel.total_satoshis_received}
                </th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
