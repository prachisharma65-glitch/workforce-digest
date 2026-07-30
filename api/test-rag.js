import { searchPolicies } from "./rag.js";

console.log("=== Query: how many people needed for a customer demo ===");
const r1 = await searchPolicies("how many people needed for a customer demo");
console.log(r1);

console.log("\n=== Query: what to do when a new hire is stuck ===");
const r2 = await searchPolicies("what to do when a new hire is stuck");
console.log(r2);

console.log("\n=== Query: someone hasn't messaged in two weeks ===");
const r3 = await searchPolicies("someone hasn't messaged in two weeks");
console.log(r3);