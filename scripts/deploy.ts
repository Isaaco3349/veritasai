import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying VeritasAI contracts with:", deployer.address);

  // 1. Deploy agent contracts
  const KYCSentinel = await ethers.deployContract("KYCSentinel");
  await KYCSentinel.waitForDeployment();
  console.log("KYCSentinel deployed to:", await KYCSentinel.getAddress());

  const AMLWatchtower = await ethers.deployContract("AMLWatchtower");
  await AMLWatchtower.waitForDeployment();
  console.log("AMLWatchtower deployed to:", await AMLWatchtower.getAddress());

  const AutoAuditLedger = await ethers.deployContract("AutoAuditLedger");
  await AutoAuditLedger.waitForDeployment();
  console.log("AutoAuditLedger deployed to:", await AutoAuditLedger.getAddress());

  // 2. Deploy ComplianceEngine with agent addresses
  const ComplianceEngine = await ethers.deployContract("ComplianceEngine", [
    await KYCSentinel.getAddress(),
    await AMLWatchtower.getAddress(),
    await AutoAuditLedger.getAddress(),
  ]);
  await ComplianceEngine.waitForDeployment();
  console.log("ComplianceEngine deployed to:", await ComplianceEngine.getAddress());

  console.log("\n✅ All VeritasAI contracts deployed on Redbelly Network.");
  console.log("Update .env with the ComplianceEngine address to connect the dashboard.");
}

main().catch((e) => { console.error(e); process.exit(1); });
