// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {ZiniSavings} from "../src/ziniSavings.sol";

import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployZini is Script {
    address tokenAddress;
    uint256 deployerKey;

    function run() external returns (ZiniSavings, HelperConfig) {
        HelperConfig config = new HelperConfig();
        (tokenAddress, deployerKey) = config.activeNetworkConfig();
        vm.startBroadcast();
        ZiniSavings zini = new ZiniSavings(tokenAddress);
        vm.stopBroadcast();
        return (zini, config);
    }
}
