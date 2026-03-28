# VeritasAI

> Full-stack AI compliance agent for RWA issuers on Redbelly Network — bringing verifiable, automated compliance to real-world asset tokenisation.

[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/Isaaco3349/veritasai)
[![Network](https://img.shields.io/badge/network-Redbelly-red)](https://redbelly.network)
[![Stack](https://img.shields.io/badge/stack-Solidity%20%2B%20TypeScript-purple)](https://github.com/Isaaco3349/veritasai)
[![Status](https://img.shields.io/badge/status-v1--alpha-orange)](https://github.com/Isaaco3349/veritasai)

---

## What is VeritasAI?

VeritasAI is a modular, on-chain AI compliance system built specifically for the Redbelly Network. It combines three specialised AI agents with a smart-contract compliance engine to automate the full compliance lifecycle for tokenised real-world assets (RWAs).

The core problem it solves: **compliance for RWA tokenisation is still manual, slow, and opaque.** VeritasAI makes it automated, visual, and fully verifiable on-chain — every decision comes with a transaction hash you can verify on the Redbelly explorer.

### Core Agents

- 🛡️ **KYC Sentinel** — AI-powered identity scoring and accreditation verification using Redbelly's zkSNARK credential layer
- 🔍 **AML Watchtower** — Real-time wallet risk analysis and behavioural pattern detection
- 📋 **AutoAudit Ledger** — Tamper-proof, on-chain audit trail generation with anomaly detection
- 📊 **RegReportBot** — Automated regulatory report compilation, ready for jurisdictional export

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

## Deployed Contracts — Redbelly Testnet

| Contract | Address |
| --- | --- |
| KYCSentinel | `0xC2aDD96dCc3D86F37A7aaEE195F9E49b636fDF8a` |
| AMLWatchtower | `0xD617B048569bed25288360A7e3De04D7e93C37a9` |
| AutoAuditLedger | `0x7af5011E661C1A06c08656ae259BBBf0d76896ED` |
| ComplianceEngine | `0x83b7C20d15f6516f057c93772cbC56cd760EC839` |

🔍 Verify on [Redbelly Testnet Explorer](https://redbelly.testnet.routescan.io)

---

## Features

### Live Now
- ✅ Smart contracts deployed on Redbelly testnet
- ✅ KYC, AML, and Audit agents (TypeScript)
- ✅ On-chain compliance verdict system
- ✅ Full audit trail logged on Redbelly ledger

### Coming Soon
- 🔨 **Live Compliance Dashboard** — Real-time KYC/AML status, risk scores, and verdicts in one interface
- 🔨 **Wallet Compliance Checker** — Paste any wallet address, get a full compliance report instantly
- 🔨 **Risk Score Visualizer** — Charts showing wallet risk scores over time for pattern detection
- 🔨 **On-Chain Audit Trail Viewer** — Every agent decision linked to a Redbelly explorer transaction
- 🔨 **Compliance Report Generator** — One-click PDF reports ready for regulators and auditors
- 🔨 **RWA Issuance Compliance Gate** — Smart contract blocks issuance if issuer fails compliance checks
- 🔨 **Multi-Jurisdiction Policy Engine** — Configure compliance rules per jurisdiction (US, EU, UAE and more)

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
├── dashboard/                        # Frontend (in development)
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
git clone https://github.com/Isaaco3349/veritasai
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

## Environment Variables
```env
# Redbelly Network
REDBELLY_TESTNET_RPC=https://governors.testnet.redbelly.network
REDBELLY_MAINNET_RPC=https://governors.mainnet.redbelly.network
DEPLOYER_PRIVATE_KEY=your_private_key_here

# AI Agent Config
OPENAI_API_KEY=your_openai_key
KYC_PROVIDER_API=your_kyc_provider_url
AML_DATA_SOURCE=your_aml_feed_url

# Dashboard
NEXT_PUBLIC_COMPLIANCE_ENGINE_ADDRESS=0x83b7C20d15f6516f057c93772cbC56cd760EC839
```

---

## Roadmap

| Phase | Milestone | Status |
| --- | --- | --- |
| v1 | Core contracts + 3 agents deployed on testnet | ✅ Complete |
| v2 | Live compliance dashboard + wallet checker + risk visualizer | 🔨 In Progress |
| v3 | Audit trail viewer + PDF compliance report generator | 📋 Planned |
| v4 | RWA issuance compliance gate + multi-jurisdiction policy engine | 📋 Planned |
| v5 | Mainnet deployment + regulator dashboard (live) | 📋 Planned |

---

## Built On

- **Redbelly Network** — Compliance-first EVM chain with zkSNARK identity layer
- **Hardhat** — Smart contract development
- **ethers.js** — Contract interaction
- **TypeScript** — Agent services
- **React / Next.js** — Frontend dashboard (in development)

---

## Contributing

PRs are welcome. Please open an issue first to discuss what you'd like to change. All agents must maintain full on-chain audit trails — no off-chain-only decisions.

---

## License

MIT © VeritasAI — Built by [Havertz](https://github.com/Isaaco3349) 🇳🇬