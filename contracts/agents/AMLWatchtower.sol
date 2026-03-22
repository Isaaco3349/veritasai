// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../interfaces/IAgent.sol";

/// @title AMLWatchtower
/// @notice Receives AML risk scores from the off-chain AI agent and flags suspicious wallets.
contract AMLWatchtower is IAgent {

    address public owner;
    address public complianceEngine;

    enum RiskLevel { Low, Medium, High, Blacklisted }

    struct AMLRecord {
        uint8 score;
        RiskLevel riskLevel;
        bool flagged;
        uint256 timestamp;
        string reason;
    }

    mapping(address => AMLRecord) public records;
    mapping(address => bool) public blacklist;

    event AMLScoreSubmitted(address indexed wallet, uint8 score, RiskLevel level, uint256 timestamp);
    event WalletFlagged(address indexed wallet, string reason, uint256 timestamp);
    event WalletBlacklisted(address indexed wallet, uint256 timestamp);

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

    /// @notice Submit AML score — called by off-chain AI agent
    function submitScore(address wallet, uint8 score, string calldata reason) external onlyAuthorized {
        RiskLevel level;
        bool flagged = false;

        if (score < 30) {
            level = RiskLevel.Low;
        } else if (score < 60) {
            level = RiskLevel.Medium;
        } else if (score < 85) {
            level = RiskLevel.High;
            flagged = true;
        } else {
            level = RiskLevel.Blacklisted;
            flagged = true;
            blacklist[wallet] = true;
            emit WalletBlacklisted(wallet, block.timestamp);
        }

        records[wallet] = AMLRecord({
            score: score,
            riskLevel: level,
            flagged: flagged,
            timestamp: block.timestamp,
            reason: reason
        });

        emit AMLScoreSubmitted(wallet, score, level, block.timestamp);

        if (flagged) {
            emit WalletFlagged(wallet, reason, block.timestamp);
        }
    }

    /// @notice Returns AML risk score — called by ComplianceEngine
    function getScore(address wallet) external view override returns (uint8) {
        return records[wallet].score;
    }

    /// @notice Log action — called by ComplianceEngine
    function logAction(address wallet, bool cleared, uint8 riskScore) external override onlyAuthorized {
        emit AMLScoreSubmitted(wallet, riskScore, records[wallet].riskLevel, block.timestamp);
    }

    /// @notice Check if wallet is blacklisted
    function isBlacklisted(address wallet) external view returns (bool) {
        return blacklist[wallet];
    }

    /// @notice Check if wallet is flagged
    function isFlagged(address wallet) external view returns (bool) {
        return records[wallet].flagged;
    }

    function setComplianceEngine(address _engine) external onlyOwner {
        complianceEngine = _engine;
    }
}