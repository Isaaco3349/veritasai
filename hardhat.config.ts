import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.30",
    settings: {
      evmVersion: "prague"
    }
  },
  networks: {
    "redbelly-testnet": {
      url: process.env.REDBELLY_TESTNET_RPC || "https://governors.testnet.redbelly.network",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 153,
    },
    "redbelly-mainnet": {
      url: process.env.REDBELLY_MAINNET_RPC || "https://governors.mainnet.redbelly.network",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 151,
    },
  },
  paths: { sources: "./contracts", tests: "./test", scripts: "./scripts" },
};
export default config;
```

Also update `.env.example` — change the mainnet RPC line to:
```
REDBELLY_MAINNET_RPC=https://governors.mainnet.redbelly.network