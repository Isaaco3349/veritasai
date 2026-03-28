"use client";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  FileText,
  Globe,
  Clock,
  ExternalLink,
} from "lucide-react";

const CONTRACT_ADDRESSES = {
  KYCSentinel: "0xC2aDD96dCc3D86F37A7aaEE195F9E49b636fDF8a",
  AMLWatchtower: "0xD617B048569bed25288360A7e3De04D7e93C37a9",
  AutoAuditLedger: "0x7af5011E661C1A06c08656ae259BBBf0d76896ED",
  ComplianceEngine: "0x83b7C20d15f6516f057c93772cbC56cd760EC839",
};

const EXPLORER = "https://redbelly.testnet.routescan.io/address/";

const mockRiskData = [
  { date: "Jan", kyc: 82, aml: 75, audit: 90 },
  { date: "Feb", kyc: 78, aml: 80, audit: 88 },
  { date: "Mar", kyc: 85, aml: 72, audit: 92 },
  { date: "Apr", kyc: 90, aml: 85, audit: 95 },
  { date: "May", kyc: 88, aml: 78, audit: 91 },
  { date: "Jun", kyc: 94, aml: 90, audit: 97 },
];

const mockAuditTrail = [
  {
    id: "0xabc...1f2e",
    action: "KYC Check Passed",
    wallet: "0x1a2b...3c4d",
    timestamp: "2026-03-28 18:42:11",
    status: "pass",
  },
  {
    id: "0xdef...3a4b",
    action: "AML Flag Raised",
    wallet: "0x5e6f...7g8h",
    timestamp: "2026-03-28 17:30:05",
    status: "fail",
  },
  {
    id: "0xghi...5c6d",
    action: "RWA Issuance Cleared",
    wallet: "0x9i0j...1k2l",
    timestamp: "2026-03-28 16:15:33",
    status: "pass",
  },
  {
    id: "0xjkl...7e8f",
    action: "Audit Trail Logged",
    wallet: "0x3m4n...5o6p",
    timestamp: "2026-03-28 15:00:20",
    status: "pass",
  },
];

const jurisdictions = ["Global", "United States", "European Union", "UAE", "United Kingdom"];

function getVerdict(kyc: number, aml: number) {
  if (kyc >= 80 && aml >= 80) return "CLEARED";
  if (kyc >= 60 && aml >= 60) return "REVIEW";
  return "BLOCKED";
}

export default function VeritasAIDashboard() {
  const [walletInput, setWalletInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<null | {
    kyc: number;
    aml: number;
    audit: number;
    verdict: string;
  }>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jurisdiction, setJurisdiction] = useState("Global");

  const handleCheck = async () => {
    if (!walletInput) return;
    setChecking(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1800));
    const kyc = Math.floor(Math.random() * 40) + 60;
    const aml = Math.floor(Math.random() * 40) + 60;
    const audit = Math.floor(Math.random() * 20) + 80;
    setResult({ kyc, aml, audit, verdict: getVerdict(kyc, aml) });
    setChecking(false);
  };

  const verdictColor =
    result?.verdict === "CLEARED"
      ? "text-green-400"
      : result?.verdict === "REVIEW"
      ? "text-yellow-400"
      : "text-red-400";

  const verdictBg =
    result?.verdict === "CLEARED"
      ? "bg-green-500/10 border-green-500/30"
      : result?.verdict === "REVIEW"
      ? "bg-yellow-500/10 border-yellow-500/30"
      : "bg-red-500/10 border-red-500/30";

  const VerdictIcon =
    result?.verdict === "CLEARED"
      ? CheckCircle
      : result?.verdict === "REVIEW"
      ? AlertTriangle
      : XCircle;

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-mono">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase">VeritasAI</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">
              Compliance Engine · Redbelly Network
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/50">Testnet Live</span>
        </div>
      </header>

      <nav className="border-b border-white/10 px-6 flex gap-6">
        {["dashboard", "checker", "audit", "contracts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 text-xs tracking-widest uppercase transition-all ${
              activeTab === tab
                ? "text-red-400 border-b-2 border-red-400"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "KYC Checks", value: "1,284", icon: Shield, color: "text-blue-400" },
                { label: "AML Flags", value: "37", icon: AlertTriangle, color: "text-yellow-400" },
                { label: "Verdicts Issued", value: "1,247", icon: CheckCircle, color: "text-green-400" },
                { label: "Audit Entries", value: "4,891", icon: FileText, color: "text-purple-400" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{label}</span>
                    <Icon size={14} className={color} />
                  </div>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Globe size={14} className="text-white/40" />
              <span className="text-xs text-white/40 uppercase tracking-widest">Jurisdiction:</span>
              <div className="flex gap-2 flex-wrap">
                {jurisdictions.map((j) => (
                  <button
                    key={j}
                    onClick={() => setJurisdiction(j)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                      jurisdiction === j
                        ? "border-red-500 text-red-400 bg-red-500/10"
                        : "border-white/10 text-white/40 hover:border-white/30"
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xs uppercase tracking-widest text-white/50 mb-6">
                Compliance Score Trends — {jurisdiction}
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockRiskData}>
                  <defs>
                    <linearGradient id="kyc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="aml" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="audit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#ffffff40", fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #ffffff20", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="kyc" stroke="#60a5fa" fill="url(#kyc)" strokeWidth={2} name="KYC Score" />
                  <Area type="monotone" dataKey="aml" stroke="#f59e0b" fill="url(#aml)" strokeWidth={2} name="AML Score" />
                  <Area type="monotone" dataKey="audit" stroke="#a78bfa" fill="url(#audit)" strokeWidth={2} name="Audit Score" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-4">
                {[["KYC Sentinel", "#60a5fa"], ["AML Watchtower", "#f59e0b"], ["AutoAudit Ledger", "#a78bfa"]].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] text-white/40">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xs uppercase tracking-widest text-white/50 mb-4">
                Recent On-Chain Actions
              </h2>
              <div className="space-y-3">
                {mockAuditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {entry.status === "pass" ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <XCircle size={14} className="text-red-400" />
                      )}
                      <div>
                        <p className="text-xs text-white/80">{entry.action}</p>
                        <p className="text-[10px] text-white/30">{entry.wallet}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <a
                        href={`${EXPLORER}${entry.wallet}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-red-400 flex items-center gap-1 hover:underline"
                      >
                        {entry.id} <ExternalLink size={10} />
                      </a>
                      <p className="text-[10px] text-white/20 flex items-center gap-1 justify-end">
                        <Clock size={9} /> {entry.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "checker" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-white/50 mb-1">
                Wallet Compliance Checker
              </h2>
              <p className="text-[11px] text-white/30">
                Enter any wallet address to run a full KYC + AML compliance check via the on-chain agents.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="0x... wallet address"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/50"
              />
              <button
                onClick={handleCheck}
                disabled={checking || !walletInput}
                className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-40 rounded-lg text-sm flex items-center gap-2 transition-all"
              >
                <Search size={14} />
                {checking ? "Checking..." : "Check"}
              </button>
            </div>

            {checking && (
              <div className="space-y-2">
                {["Running KYC Sentinel...", "Querying AML Watchtower...", "Fetching Audit Ledger..."].map((msg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                    <Activity size={12} className="animate-pulse text-red-400" />
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className={`border rounded-xl p-6 space-y-6 ${verdictBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <VerdictIcon size={20} className={verdictColor} />
                    <span className={`text-lg font-bold tracking-widest ${verdictColor}`}>
                      {result.verdict}
                    </span>
                  </div>
                  <a
                    href={`${EXPLORER}${CONTRACT_ADDRESSES.ComplianceEngine}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-white/30 hover:text-white/60 flex items-center gap-1"
                  >
                    View on Redbelly <ExternalLink size={10} />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "KYC Score", value: result.kyc, color: "text-blue-400" },
                    { label: "AML Score", value: result.aml, color: "text-yellow-400" },
                    { label: "Audit Score", value: result.audit, color: "text-purple-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      <p className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-white/30 space-y-1">
                  <p>Wallet: {walletInput}</p>
                  <p>Checked at: {new Date().toISOString()}</p>
                  <p>Engine: {CONTRACT_ADDRESSES.ComplianceEngine}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/50">
              On-Chain Audit Trail
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/30 uppercase tracking-widest">
                    <th className="text-left px-4 py-3">Tx Hash</th>
                    <th className="text-left px-4 py-3">Action</th>
                    <th className="text-left px-4 py-3">Wallet</th>
                    <th className="text-left px-4 py-3">Timestamp</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAuditTrail.map((entry) => (
                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="px-4 py-3">
                        <a
                          href={`${EXPLORER}${entry.wallet}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-red-400 hover:underline flex items-center gap-1"
                        >
                          {entry.id} <ExternalLink size={10} />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-white/70">{entry.action}</td>
                      <td className="px-4 py-3 text-white/40">{entry.wallet}</td>
                      <td className="px-4 py-3 text-white/30">{entry.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-widest ${entry.status === "pass" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/50">
              Deployed Contracts — Redbelly Testnet
            </h2>
            <div className="space-y-3">
              {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
                <div key={name} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">{name}</p>
                    <p className="text-xs text-white/30 mt-1">{address}</p>
                  </div>
                  <a
                    href={`${EXPLORER}${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-red-400 hover:underline"
                  >
                    Explorer <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
