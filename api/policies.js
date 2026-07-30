// Mock HR policy corpus for RAG
// In production, these would come from a real policy database

export const policies = [
  {
    id: "coverage",
    title: "Team Coverage Standards",
    content: "Customer-facing demos require a minimum of 3 team members present with at least 1 senior engineer. Sprint completion requires 40% of the sprint team available for the sprint's final 3 days. Coverage gaps should be resolved by (1) rescheduling non-critical customer commitments, or (2) cross-team backup from platform or adjacent squads with prior context.",
  },
  {
    id: "backup_buddy",
    title: "Onboarding Buddy Assignment",
    content: "Every new hire is assigned an onboarding buddy in their first week. If the buddy or hiring manager becomes unavailable for more than 5 business days, an interim buddy must be assigned within 24 hours. Best-fit interim buddies are (1) recent hires on the same team who completed onboarding in the last 90 days, (2) senior engineers with cross-team context.",
  },
  {
    id: "demo_reschedule",
    title: "Customer Demo Rescheduling Protocol",
    content: "Customer-facing demos with fewer than 3 team members present should be rescheduled unless the customer explicitly waives the requirement. Rescheduling requires (1) 24 hours notice to the customer, (2) proposed new date within 5 business days, (3) written confirmation from account team.",
  },
  {
    id: "engagement_check",
    title: "Engagement Drop Response Protocol",
    content: "When individual engagement signals drop for 7+ days without PTO explanation, managers should initiate an informal 1:1 within 3 business days. Approach as check-in, not evaluation. Do not reference specific engagement data (message counts, meeting attendance) in the conversation. Focus on workload, blockers, and support needs.",
  },
  {
    id: "pto_coverage",
    title: "Planned PTO Coverage Requirements",
    content: "Teams must maintain 60% availability during any given business week. When planned PTO would drop availability below 60%, the manager must (1) identify cross-team backup 2 weeks in advance, (2) defer non-critical work, (3) escalate to department head if neither option is viable.",
  },
  {
    id: "unplanned_absence",
    title: "Unplanned Absence Handling",
    content: "Unplanned absences exceeding 15% of the team in a single week trigger a coverage review. Actions include: identify critical customer/sprint commitments in the next 3 days, evaluate whether commitments can be met with current coverage, coordinate cross-team backup if not, notify affected customers of any expected delays.",
  },
  {
    id: "sprint_planning",
    title: "Sprint Planning Coverage Rules",
    content: "Sprint plans should assume 90% availability for the sprint duration. When actual availability drops below 80% during a sprint, the sprint scope must be re-evaluated within 24 hours. Descoping decisions rest with the engineering manager and product manager jointly.",
  },
];