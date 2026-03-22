// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30

import "../interfaces/IAgent.sol";
import "../interfaces/IComplianceEngine.sol";

/// @title ComplianceEngine
/// @notice Aggregates signals from KYC, AML, and Audit agents and emits a compliance verdict.
contract ComplianceEngine is IComplianceEngine {

    address public owner;
    address public kycSentinel;
    address public amlWatchtower;
    address public autoAuditLedger;

    struct Verdict {
        bool cleared;
        uint8 riskScore;    // 0-100
        uint256 timestamp;
        string reason;
    }

    mapping(address => Verdict) public verdicts;

    event ComplianceCleared(address indexed wallet, uint8 riskScore, uint256 timestamp);
    event ComplianceFlagged(address indexed wallet, uint8 riskScore, string reason, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRegisteredAgent() {
        require(
            msg.sender == kycSentinel ||
            msg.sender == amlWatchtower ||
            msg.sender == autoAuditLedger,
            "Unregistered agent"
        );
        _;
    }

    constructor(address _kyc, address _aml, address _audit) {
        owner = msg.sender;
        kycSentinel = _kyc;
        amlWatchtower = _aml;
        autoAuditLedger = _audit;
    }

    /// @notice Evaluate a wallet's compliance status using all agent signals.
    function evaluate(address wallet, bytes calldata zkProof) external override returns (bool) {
        uint8 kycScore = IAgent(kycSentinel).getScore(wallet);
        uint8 amlScore = IAgent(amlWatchtower).getScore(wallet);

        uint8 combinedRisk = (kycScore + amlScore) / 2;

        bool cleared = combinedRisk < 70 && _verifyProof(zkProof);
        string memory reason = cleared ? "All checks passed" : "Risk threshold exceeded";

        verdicts[wallet] = Verdict({
            cleared: cleared,
            riskScore: combinedRisk,
            timestamp: block.timestamp,
            reason: reason
        });

        // Log to audit ledger
        IAgent(autoAuditLedger).logAction(wallet, cleared, combinedRisk);

        if (cleared) {
            emit ComplianceCleared(wallet, combinedRisk, block.timestamp);
        } else {
            emit ComplianceFlagged(wallet, combinedRisk, reason, block.timestamp);
        }

        return cleared;
    }

    /// @notice Read the latest verdict for a wallet.
    function getVerdict(address wallet) external view override returns (bool, uint8, uint256, string memory) {
        Verdict memory v = verdicts[wallet];
        return (v.cleared, v.riskScore, v.timestamp, v.reason);
    }

    /// @dev Stub: integrate with Redbelly's zkSNARK verifier in production.
    function _verifyProof(bytes calldata proof) internal pure returns (bool) {
        return proof.length > 0;
    }

    function updateAgents(address _kyc, address _aml, address _audit) external onlyOwner {
        kycSentinel = _kyc;
        amlWatchtower = _aml;
        autoAuditLedger = _audit;
    }
}
