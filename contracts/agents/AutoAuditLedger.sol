// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "../interfaces/IAgent.sol";

/// @title AutoAuditLedger
/// @notice Tamper-proof on-chain audit trail for all VeritasAI compliance actions.
contract AutoAuditLedger is IAgent {

    address public owner;
    address public complianceEngine;

    struct AuditEntry {
        address wallet;
        bool cleared;
        uint8 riskScore;
        uint256 timestamp;
        bytes32 entryHash;
    }

    AuditEntry[] public auditLog;
    mapping(address => uint256[]) public walletEntries;

    event AuditEntryLogged(
        address indexed wallet,
        bool cleared,
        uint8 riskScore,
        bytes32 entryHash,
        uint256 timestamp
    );

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

    /// @notice Log a compliance action — called by ComplianceEngine
    function logAction(address wallet, bool cleared, uint8 riskScore) external override onlyAuthorized {
        bytes32 entryHash = keccak256(
            abi.encodePacked(wallet, cleared, riskScore, block.timestamp, auditLog.length)
        );

        AuditEntry memory entry = AuditEntry({
            wallet: wallet,
            cleared: cleared,
            riskScore: riskScore,
            timestamp: block.timestamp,
            entryHash: entryHash
        });

        auditLog.push(entry);
        walletEntries[wallet].push(auditLog.length - 1);

        emit AuditEntryLogged(wallet, cleared, riskScore, entryHash, block.timestamp);
    }

    /// @notice Returns score — satisfies IAgent interface
    function getScore(address wallet) external view override returns (uint8) {
        uint256[] memory indices = walletEntries[wallet];
        if (indices.length == 0) return 0;
        return auditLog[indices[indices.length - 1]].riskScore;
    }

    /// @notice Get total number of audit entries
    function getTotalEntries() external view returns (uint256) {
        return auditLog.length;
    }

    /// @notice Get all entry indices for a wallet
    function getWalletEntries(address wallet) external view returns (uint256[] memory) {
        return walletEntries[wallet];
    }

    /// @notice Get a specific audit entry by index
    function getEntry(uint256 index) external view returns (AuditEntry memory) {
        require(index < auditLog.length, "Index out of bounds");
        return auditLog[index];
    }

    function setComplianceEngine(address _engine) external onlyOwner {
        complianceEngine = _engine;
    }
}