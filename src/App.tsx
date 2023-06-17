import { tabs, useAppStore } from "./state/AppStore";
import { ConnectScreen } from "./components/ConnectScreen";
import clsx from "clsx";
import { InfoScreen } from "./components/InfoScreen";
import { PeersScreen } from "./components/PeersScreen";
import { ChannelsScreen } from "./components/ChannelsScreen";
import { InvoicesScreen } from "./components/InvoicesScreen";
import { PaymentsScreen } from "./components/PaymentsScreen";

function App() {
  const isConnected = useAppStore((store) => store.isConnected);
  const selectedTab = useAppStore((store) => store.selectedTab);

  return (
    <div className="p-4 flex flex-col gap-4 items-center justify-between h-full container">
      <div className="p-4 flex flex-col gap-4 items-center justify-start h-full container">
        {!isConnected ? (
          <ConnectScreen />
        ) : (
          <>
            <div className="tabs tabs-boxed">
              {tabs.map((tab) => (
                <a
                  key={tab}
                  className={clsx("tab", tab === selectedTab && "tab-active")}
                  onClick={() => useAppStore.getState().setSelectedTab(tab)}
                >
                  {tab}
                </a>
              ))}
            </div>
            {selectedTab === "info" && <InfoScreen />}
            {selectedTab === "peers" && <PeersScreen />}
            {selectedTab === "channels" && <ChannelsScreen />}
            {selectedTab === "invoices" && <InvoicesScreen />}
            {selectedTab === "payments" && <PaymentsScreen />}
          </>
        )}
      </div>
      <div className="flex w-full gap-2 items-center justify-end">
        <a
          href="https://github.com/rolznz/weblnman"
          className="justify-self-end"
        >
          <img
            className="w-8 h-8"
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          />
        </a>
        <a
          href="#"
          className="justify-self-end"
          onClick={() =>
            alert(
              "1. Setup your own lightning node and install lightning terminal.\n2. Install the Alby browser extension and connect to your node using LNC.\n3. Send some onchain funds to your node.\n4. Find a channel to peer with (e.g. on https://amboss.space/)"
            )
          }
        >
          ❔
        </a>
      </div>
    </div>
  );
}

export default App;
