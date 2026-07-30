import { get_team_calendar, get_team_roster, get_availability, get_pto_status, retrieve_policy } from "./tools.js";

console.log("=== Test 1: get_team_calendar ===");
console.log(await get_team_calendar({ team: "Engineering", week: "2026-04-21" }));

console.log("\n=== Test 2: get_team_roster ===");
console.log(await get_team_roster({ team: "Engineering" }));

console.log("\n=== Test 3: get_availability ===");
console.log(await get_availability({ user_ids: ["Maya", "Devon", "Sasha"], window: "this_week" }));

console.log("\n=== Test 4: get_pto_status ===");
console.log(await get_pto_status({ team: "Engineering", window: "2026-04-21" }));

console.log("\n=== Test 5: retrieve_policy ===");
console.log(await retrieve_policy({ topic: "coverage" }));