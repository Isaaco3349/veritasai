// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30

interface IAgent {
    function getScore(address wallet) external view returns (uint8);
    function logAction(address wallet, bool cleared, uint8 riskScore) external;
}
