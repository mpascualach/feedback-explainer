// components/Header.tsx
import React from "react";
// import { ConnectButton } from "@web3uikit/web3";

// const Web3ConnectButton = ConnectButton as React.FC;

// const connect = async () => {
//   if (window.ethereum) {
//   }
// };

const Header = (handleClick: any) => {
  return (
    <header className="p-4 text-white text-center font-harmattan text-4xl font-normal shadow-white relative">
      <p onClick={handleClick} className="cursor-pointer">
        Feynman
      </p>
      <div className="absolute right-0" style={{ top: "25%" }}>
        {/* <Web3ConnectButton /> */}
        {/* <input type="button" value="Connect Wallet" onClick={connect}></input> */}
      </div>
    </header>
  );
};

export default Header;
