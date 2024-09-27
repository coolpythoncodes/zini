// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address token;
        uint256 deployerKey;
    }

    NetworkConfig public activeNetworkConfig;
    uint256 public DEFAULT_ANVIL_KEY =
        0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6;

    constructor() {
        if (block.chainid == 4202) {
            activeNetworkConfig = getLiskEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        vm.startBroadcast();
        ERC20Mock _token = new ERC20Mock();
        vm.stopBroadcast();

        return
            NetworkConfig({
                token: address(_token),
                deployerKey: DEFAULT_ANVIL_KEY
            });
    }

    function getLiskEthConfig() public returns (NetworkConfig memory) {
        vm.startBroadcast();
        // ERC20Mock _token = new ERC20Mock();
        vm.stopBroadcast();

        return
            NetworkConfig({
                token: 0x8de23bbE29028d6e646950db8D99eE92C821b5BB,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }
}
