// Mock tools for the Workforce Digest agent
// Each tool returns canned data based on input, simulating what a real integration would return.

// Tool 1: Get the team's calendar for a specific week
export async function get_team_calendar({ team, week }) {
  const calendars = {
    Engineering: {
      "2026-04-21": {
        events: [
          { day: "Wed", title: "Payments squad sprint standup", attendees: 5 },
          { day: "Thu", title: "Architecture review", attendees: 8 },
          { day: "Fri", title: "Payments customer demo", attendees: 5, is_customer_facing: true, importance: "high" },
        ],
        sprint_end: "Fri 2026-04-25",
      },
    },
    Design: {
      "2026-04-21": {
        events: [
          { day: "Tue", title: "Design crit", attendees: 4 },
          { day: "Thu", title: "Team retro", attendees: 4 },
        ],
        sprint_end: null,
      },
    },
  };

  return calendars[team]?.[week] || { events: [], sprint_end: null, note: "No calendar data for this team/week" };
}

// Tool 2: Get the roster for a team
export async function get_team_roster({ team }) {
  const rosters = {
    Engineering: {
      total: 22,
      members: [
        { name: "Priya", role: "Engineering Manager", squad: "Payments" },
        { name: "Alex", role: "Senior Engineer", squad: "Payments" },
        { name: "Jordan", role: "Engineer", squad: "Payments", note: "new hire, day 12" },
        { name: "Sam", role: "Engineer", squad: "Payments" },
        { name: "Chen", role: "Engineer", squad: "Payments" },
      ],
      squads: ["Payments", "Platform", "Data"],
    },
    Platform: {
      total: 6,
      members: [
        { name: "Maya", role: "Senior Engineer", squad: "Platform", note: "cross-trained on Payments" },
        { name: "Devon", role: "Engineer", squad: "Platform" },
      ],
    },
    Design: {
      total: 4,
      members: [
        { name: "Riley", role: "Senior Designer" },
        { name: "Casey", role: "Designer" },
        { name: "Jordan-D", role: "Designer" },
        { name: "Morgan", role: "Designer" },
      ],
    },
  };

  return rosters[team] || { total: 0, members: [], note: "No roster data for this team" };
}

// Tool 3: Get who's available across the org during a given window
export async function get_availability({ user_ids, window }) {
  const availability = {
    Maya: { status: "available", days_free: ["Wed", "Thu", "Fri"], notes: "no scheduled meetings" },
    Devon: { status: "on_leave", return_date: "2026-05-05" },
    Sasha: { status: "available", days_free: ["Mon", "Tue", "Wed", "Thu", "Fri"], notes: "onboarded February, same team as Jordan" },
    Priya: { status: "available", days_free: ["Wed", "Thu"], notes: "Payments EM" },
  };

  const results = {};
  for (const user of user_ids) {
    results[user] = availability[user] || { status: "unknown", notes: "no availability data" };
  }
  return results;
}

// Tool 4: Get PTO status for a team over a time window
export async function get_pto_status({ team, window }) {
  const pto = {
    Engineering: {
      "2026-04-21": {
        on_leave: [
          { name: "Devon", type: "extended_leave", planned: true, return: "2026-05-05" },
          { name: "Chen", type: "vacation", planned: true, return: "2026-04-28" },
          { name: "Alex", type: "vacation", planned: true, return: "2026-04-25" },
          { name: "Priya-B", type: "parental", planned: true, return: "2026-07-01" },
          { name: "Kim", type: "sick", planned: false, return: "unknown" },
          { name: "Lee", type: "sick", planned: false, return: "unknown" },
        ],
        total_out: 6,
        team_size: 22,
        pct_out: 27,
      },
    },
    Design: {
      "2026-04-21": {
        on_leave: [],
        total_out: 0,
        team_size: 4,
        pct_out: 0,
      },
    },
  };

  return pto[team]?.[window] || { on_leave: [], total_out: 0, note: "No PTO data for this team/window" };
}

// Tool 5: Retrieve a mock HR policy by topic
export async function retrieve_policy({ topic }) {
  const policies = {
    coverage: {
      title: "Team Coverage Standards",
      content:
        "Customer-facing demos require a minimum of 3 team members present with at least 1 senior engineer. Sprint completion requires 40% of the sprint team available for the sprint's final 3 days. Coverage gaps should be resolved by (1) rescheduling non-critical customer commitments, or (2) cross-team backup from platform or adjacent squads with prior context.",
    },
    backup_buddy: {
      title: "Onboarding Buddy Assignment",
      content:
        "Every new hire is assigned an onboarding buddy in their first week. If the buddy or hiring manager becomes unavailable for more than 5 business days, an interim buddy must be assigned within 24 hours. Best-fit interim buddies are (1) recent hires on the same team who completed onboarding in the last 90 days, (2) senior engineers with cross-team context.",
    },
    demo_reschedule: {
      title: "Customer Demo Rescheduling Protocol",
      content:
        "Customer-facing demos with fewer than 3 team members present should be rescheduled unless the customer explicitly waives the requirement. Rescheduling requires (1) 24 hours notice to the customer, (2) proposed new date within 5 business days, (3) written confirmation from account team.",
    },
    engagement_check: {
      title: "Engagement Drop Response Protocol",
      content:
        "When individual engagement signals drop for 7+ days without PTO explanation, managers should initiate an informal 1:1 within 3 business days. Approach as check-in, not evaluation. Do not reference specific engagement data (message counts, meeting attendance) in the conversation. Focus on workload, blockers, and support needs.",
    },
    pto_coverage: {
      title: "Planned PTO Coverage Requirements",
      content:
        "Teams must maintain 60% availability during any given business week. When planned PTO would drop availability below 60%, the manager must (1) identify cross-team backup 2 weeks in advance, (2) defer non-critical work, (3) escalate to department head if neither option is viable.",
    },
    unplanned_absence: {
      title: "Unplanned Absence Handling",
      content:
        "Unplanned absences exceeding 15% of the team in a single week trigger a coverage review. Actions include: identify critical customer/sprint commitments in the next 3 days, evaluate whether commitments can be met with current coverage, coordinate cross-team backup if not, notify affected customers of any expected delays.",
    },
    sprint_planning: {
      title: "Sprint Planning Coverage Rules",
      content:
        "Sprint plans should assume 90% availability for the sprint duration. When actual availability drops below 80% during a sprint, the sprint scope must be re-evaluated within 24 hours. Descoping decisions rest with the engineering manager and product manager jointly.",
    },
  };

  return policies[topic] || { title: "Not found", content: `No policy exists on topic: ${topic}. Available topics: ${Object.keys(policies).join(", ")}` };
}