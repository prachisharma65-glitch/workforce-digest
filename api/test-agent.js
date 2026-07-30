import { investigateAlert } from "./agent.js";

const leaveSpikeAlert = {
  id: "leave-spike",
  category: "Leave anomaly",
  team: "Engineering",
  week: "2026-04-21",
  title: "Engineering has 27% of the team out — double the baseline",
  summary: "Six engineers on leave at once, including two unplanned sick days called in Sunday night. The Payments squad is down to two of five.",
  key_facts: [
    "Engineering on leave: 6 of 22 (27%)",
    "12-week baseline: 2.6 of 22 (12%)",
    "Payments squad coverage: 2 of 5",
    "Unplanned absences (last 48h): 2",
  ],
};

console.log("=== Investigating leave-spike alert ===\n");
const result = await investigateAlert(leaveSpikeAlert);

console.log("\n=== FINAL RECOMMENDATION ===");
console.log("Recommendation:", result.recommendation);
console.log("Rationale:", result.rationale);

console.log("\n=== REASONING TRACE ===");
for (const step of result.trace) {
  if (step.type === "tool_call") {
    console.log(`\nStep ${step.step}: Called ${step.tool}`);
    console.log("  Input:", JSON.stringify(step.input));
  } else {
    console.log(`  Result: ${JSON.stringify(step.output).slice(0, 200)}...`);
  }
}
console.log(`\nTotal iterations: ${result.iterations}`);
