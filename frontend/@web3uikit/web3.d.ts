declare module "@web3uikit/web3" {
  import type { HTMLAttributes } from "react";

  export interface IConnectButtonProps extends HTMLAttributes<HTMLDivElement> {
    chainId?: number;
    moralisAuth?: boolean;
    signingMessage?: string;
  }

  export const ConnectButton: React.FC<IConnectButtonProps>;
}
