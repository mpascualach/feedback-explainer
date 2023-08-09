// components/Header.tsx
import React from "react";
import type { HTMLAttributes } from "react";
import { ConnectButton } from "@web3uikit/web3";

// declare module "@web3uikit/web3" {
//   export interface IConnectButtonProps extends HTMLAttributes<HTMLDivElement> {
//     chainId?: number;
//     moralisAuth?: boolean;
//     signingMessage?: string;
//   }
//   export const ConnectButton: React.FC<IConnectButtonProps>;
// }

const Web3ConnectButton = ConnectButton as React.FC;

const Header = () => {
  return (
    <header className="p-4 text-white text-center font-harmattan text-4xl font-normal shadow-white relative">
      Feynman
      <div className="absolute right-0" style={{ top: "25%" }}>
        <Web3ConnectButton />
      </div>
    </header>
  );
};

export default Header;
