// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30

interface IComplianceEngine {
    function evaluate(address wallet, bytes calldata zkProof) external returns (bool);
    function getVerdict(address wallet) external view returns (bool, uint8, uint256, string memory);
}
