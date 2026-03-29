import { HardhatUserConfig } from "hardhat/config";
import "fhenix-hardhat-plugin";
import "fhenix-hardhat-docker";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            evmVersion: "cancun",
        },
    },
    defaultNetwork: "localfhenix",
    networks: {
        localfhenix: {
            url: "http://127.0.0.1:42069",
        },
        testnet: {
            url: "https://api.helium.fhenix.zone",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};

export default config;
