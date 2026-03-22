import { ethers } from "ethers";

const AUDIT_ABI = [
  "function logAction(address wallet, bool cleared, uint8 riskScore) external",
  "event AuditEntry(address indexed wallet, bool cleared, uint8 riskScore, uint256 timestamp)"
];

export class AuditAgent {
  private contract: ethers.Contract;
  private signer: ethers.Wallet;

  constructor(contractAddress: string, provider: ethers.Provider, privateKey: string) {
    this.signer = new ethers.Wallet(privateKey, provider);
    this.contract = new ethers.Contract(contractAddress, AUDIT_ABI, this.signer);
  }

  /// Log a compliance action on-chain
  async logAction(wallet: string, cleared: boolean, riskScore: number): Promise<void> {
    const tx = await this.contract.logAction(wallet, cleared, riskScore);
    await tx.wait();
    console.log(`[AutoAuditLedger] Logged action for ${wallet} — cleared: ${cleared}, risk: ${riskScore}`);
  }

  /// Fetch full audit trail for a wallet
  async getAuditTrail(wallet: string): Promise<any[]> {
    const filter = this.contract.filters.AuditEntry(wallet);
    const events = await this.contract.queryFilter(filter);
    return events.map((e: any) => ({
      wallet: e.args.wallet,
      cleared: e.args.cleared,
      riskScore: e.args.riskScore.toString(),
      timestamp: new Date(Number(e.args.timestamp) * 1000).toISOString(),
      txHash: e.transactionHash,
    }));
  }

  /// Generate a compliance report bundle (for RegReportBot)
  async generateReport(wallet: string): Promise<object> {
    const trail = await this.getAuditTrail(wallet);
    return {
      wallet,
      generatedAt: new Date().toISOString(),
      totalChecks: trail.length,
      cleared: trail.filter(e => e.cleared).length,
      flagged: trail.filter(e => !e.cleared).length,
      entries: trail,
    };
  }
}
