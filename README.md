# VeritasAI

> Full-stack AI compliance agent for the Redbelly Network — bringing verifiable, automated compliance to real-world asset tokenisation.

![License](https://img.shields.io/badge/license-MIT-blue)
![Network](https://img.shields.io/badge/network-Redbelly-red)
![Stack](https://img.shields.io/badge/stack-Solidity%20%2B%20TypeScript-purple)
![Status](https://img.shields.io/badge/status-v1--alpha-orange)

---

## What is VeritasAI?

VeritasAI is a modular, on-chain AI compliance system built specifically for the Redbelly Network. It combines three specialised AI agents with a smart-contract compliance engine to automate the full compliance lifecycle for tokenised real-world assets (RWAs):

- **KYC Sentinel** — AI-powered identity scoring and accreditation verification using Redbelly's zkSNARK credential layer
- **AML Watchtower** — Real-time wallet risk analysis and behavioural pattern detection
- **AutoAudit Ledger** — Tamper-proof, on-chain audit trail generation with anomaly detection
- **RegReportBot** — Automated regulatory report compilation, ready for jurisdictional export

Every agent action is cryptographically logged on-chain. No black boxes. No unverifiable decisions. Full regulatory accountability.

---

## Architecture

```
User / dApp Request
        │
        ▼
┌──────────────────────┐
│   Identity Gate      │  ← zkSNARK proof check
│   (Redbelly ZK Layer)│  ← Verifiable credentials
└──────────┬───────────┘
           │ pass
    ┌──────┴──────┐──────────────┐
    ▼             ▼              ▼
KYC Sentinel  AML Watchtower  AutoAudit Ledger
    └──────┬──────┘──────────────┘
           │ signals
           ▼
┌──────────────────────┐
│  Compliance Engine   │  ← Aggregates signals
│  (Smart Contract)    │  ← Enforces policy rules
└──────────┬───────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
Execute TX    Flag + Freeze
    │
    ├── On-chain proof (Redbelly ledger)
    └── RegReportBot (regulator dashboard)
```

---

## Repo Structure

```
veritasai/
├── contracts/
│   ├── core/
│   │   ├── ComplianceEngine.sol      # Master policy enforcer
│   │   └── VeritasRegistry.sol       # Agent registry + access control
│   ├── agents/
│   │   ├── KYCSentinel.sol           # On-chain KYC interface
│   │   ├── AMLWatchtower.sol         # On-chain AML interface
│   │   └── AutoAuditLedger.sol       # Audit log contract
│   └── interfaces/
│       ├── IAgent.sol                # Shared agent interface
│       └── IComplianceEngine.sol     # Engine interface
├── agents/
│   ├── kyc/
│   │   └── kycAgent.ts               # KYC AI agent (TypeScript)
│   ├── aml/
│   │   └── amlAgent.ts               # AML AI agent (TypeScript)
│   └── audit/
│       └── auditAgent.ts             # Audit agent (TypeScript)
├── scripts/
│   ├── deploy.ts                     # Deploy all contracts
│   └── registerAgent.ts             # Register agents on-chain
├── test/
│   └── ComplianceEngine.test.ts      # Full test suite
├── dashboard/
│   └── src/
│       └── App.tsx                   # Regulator dashboard (React)
├── docs/
│   └── architecture.md
├── .env.example
├── hardhat.config.ts
├── package.json
└── tsconfig.json
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- A Redbelly Network RPC endpoint
- A funded wallet on Redbelly testnet

### Install

```bash
git clone https://github.com/your-handle/veritasai
cd veritasai
npm install
cp .env.example .env
# Fill in your RPC URL and private key in .env
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to Redbelly Testnet

```bash
npx hardhat run scripts/deploy.ts --network redbelly-testnet
```

### Register Agents

```bash
npx hardhat run scripts/registerAgent.ts --network redbelly-testnet
```

---

## Smart Contracts

### ComplianceEngine.sol

The heart of VeritasAI. Receives signals from all three agents, applies jurisdiction-specific policy rules, and emits a final compliance verdict that either clears or blocks a transaction.

Key functions:
- `evaluate(address wallet, bytes calldata proof)` — Run full compliance check
- `setPolicy(bytes32 jurisdiction, PolicyConfig calldata config)` — Configure rules per jurisdiction
- `getVerdict(address wallet)` — Read latest verdict for a wallet

### VeritasRegistry.sol

Maintains the registry of authorised agents. Only registered agents can submit compliance signals. Owner-controlled with multi-sig support.

### KYCSentinel.sol / AMLWatchtower.sol / AutoAuditLedger.sol

On-chain interfaces that receive signals from their off-chain AI counterparts and store attestations on the Redbelly ledger.

---

## AI Agents

Each agent runs as a TypeScript service, queries off-chain data sources, and submits signed attestations back to the on-chain contracts.

### KYC Sentinel (`agents/kyc/kycAgent.ts`)
- Integrates with Redbelly's verifiable credential layer
- Scores user KYC profiles (0–100 risk score)
- Checks accreditation status per jurisdiction
- Flags missing or expired credentials

### AML Watchtower (`agents/aml/amlAgent.ts`)
- Monitors wallet transaction history
- Detects structuring, layering, and integration patterns
- Assigns AML risk scores using ML models
- Flags wallets matching known bad-actor patterns

### AutoAudit Ledger (`agents/audit/auditAgent.ts`)
- Logs every agent action on-chain with a timestamp and hash
- Detects anomalies across the audit trail
- Generates compliance proof bundles for regulators
- Supports export to PDF and JSON

---

## Environment Variables

```env
# Redbelly Network
REDBELLY_TESTNET_RPC=https://governors.testnet.redbelly.network
REDBELLY_MAINNET_RPC=https://governors.redbelly.network
DEPLOYER_PRIVATE_KEY=your_private_key_here

# AI Agent Config
OPENAI_API_KEY=your_openai_key         # Or swap for local model
KYC_PROVIDER_API=your_kyc_provider_url
AML_DATA_SOURCE=your_aml_feed_url

# Dashboard
NEXT_PUBLIC_COMPLIANCE_ENGINE_ADDRESS=0x...
```

---

## Roadmap

| Phase | Milestone | Status |
|-------|-----------|--------|
| v1 | Core contracts + 3 agents deployed on testnet | 🔨 In progress |
| v2 | RegReportBot + PDF export | 📋 Planned |
| v3 | Multi-jurisdiction policy configs | 📋 Planned |
| v4 | zkSNARK-native agent attestations | 📋 Planned |
| v5 | Regulator dashboard (live) | 📋 Planned |

---

## Built On

- **Redbelly Network** — Compliance-first EVM chain with zkSNARK identity layer
- **Hardhat** — Smart contract development
- **ethers.js** — Contract interaction
- **TypeScript** — Agent services
- **React** — Regulator dashboard

---

## Contributing

PRs are welcome. Please open an issue first to discuss what you'd like to change. All agents must maintain full on-chain audit trails — no off-chain-only decisions.

---

## License

MIT © VeritasAI Contributors
