// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../interfaces/IAgent.sol";

/// @title KYCSentinel
/// @notice Receives KYC scores from the off-chain AI agent and stores attestations on-chain.
contract KYCSentinel is IAgent {

    address public owner;
    address public complianceEngine;

    struct KYCRecord {
        uint8 score;
        bool verified;
        uint256 timestamp;
        string jurisdiction;
    }

    mapping(address => KYCRecord) public records;

    event KYCScoreSubmitted(address indexed wallet, uint8 score, string jurisdiction, uint256 timestamp);
    event KYCRevoked(address indexed wallet, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || msg.sender == complianceEngine, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Submit a KYC score for a wallet — called by the off-chain AI agent
    function submitScore(address wallet, uint8 score, string calldata jurisdiction) external onlyAuthorized {
        records[wallet] = KYCRecord({
            score: score,
            verified: score < 70,
            timestamp: block.timestamp,
            jurisdiction: jurisdiction
        });
        emit KYCScoreSubmitted(wallet, score, jurisdiction, block.timestamp);
    }

    /// @notice Returns the risk score for a wallet — called by ComplianceEngine
    function getScore(address wallet) external view override returns (uint8) {
        return records[wallet].score;
    }

    /// @notice Log action — called by ComplianceEngine
    function logAction(address wallet, bool cleared, uint8 riskScore) external override onlyAuthorized {
        emit KYCScoreSubmitted(wallet, riskScore, records[wallet].jurisdiction, block.timestamp);
    }

    /// @notice Revoke KYC for a wallet
    function revokeKYC(address wallet) external onlyOwner {
        records[wallet].verified = false;
        emit KYCRevoked(wallet, block.timestamp);
    }

    /// @notice Check if a wallet is KYC verified
    function isVerified(address wallet) external view returns (bool) {
        return records[wallet].verified;
    }

    function setComplianceEngine(address _engine) external onlyOwner {
        complianceEngine = _engine;
    }
}