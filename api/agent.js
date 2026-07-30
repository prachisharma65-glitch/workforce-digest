import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  get_team_calendar,
  get_team_roster,
  get_availability,
  get_pto_status,
} from "./tools.js";
import { searchPolicies } from "./rag.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Wrap each function as a LangChain tool with a schema
const teamCalendarTool = tool(
  async ({ team, week }) => {
    const result = await get_team_calendar({ team, week });
    return JSON.stringify(result);
  },
  {
    name: "get_team_calendar",
    description: "Get a team's calendar for a specific week — meetings, demos, sprint boundaries. Use this to understand what commitments the team has.",
    schema: z.object({
      team: z.string().describe("Team name, e.g., 'Engineering', 'Design'"),
      week: z.string().describe("Week start date in YYYY-MM-DD format, e.g., '2026-04-21'"),
    }),
  }
);

const teamRosterTool = tool(
  async ({ team }) => {
    const result = await get_team_roster({ team });
    return JSON.stringify(result);
  },
  {
    name: "get_team_roster",
    description: "Get a team's roster — members, roles, squads. Use this to find people on the team or identify backup candidates from adjacent teams.",
    schema: z.object({
      team: z.string().describe("Team name, e.g., 'Engineering', 'Platform', 'Design'"),
    }),
  }
);

const availabilityTool = tool(
  async ({ user_ids, window }) => {
    const result = await get_availability({ user_ids, window });
    return JSON.stringify(result);
  },
  {
    name: "get_availability",
    description: "Check availability of specific people for a time window. Use to find who's free to serve as backup or buddy.",
    schema: z.object({
      user_ids: z.array(z.string()).describe("List of person names to check"),
      window: z.string().describe("Time window, e.g., 'this_week' or 'next_5_days'"),
    }),
  }
);

const ptoTool = tool(
  async ({ team, window }) => {
    const result = await get_pto_status({ team, window });
    return JSON.stringify(result);
  },
  {
    name: "get_pto_status",
    description: "Get PTO/leave status for a team over a time window — who's out, why, and when they return.",
    schema: z.object({
      team: z.string().describe("Team name"),
      window: z.string().describe("Week start date in YYYY-MM-DD format"),
    }),
  }
);

const searchPoliciesTool = tool(
  async ({ query }) => {
    const results = await searchPolicies(query, 2);
    return JSON.stringify(results);
  },
  {
    name: "search_policies",
    description: "Search HR policies semantically. Use this to find relevant policies for coverage, buddy assignments, demo rescheduling, engagement checks, PTO coverage, etc. Returns the top 2 most relevant policies.",
    schema: z.object({
      query: z.string().describe("Natural language question about what policy applies"),
    }),
  }
);

const tools = [
  teamCalendarTool,
  teamRosterTool,
  availabilityTool,
  ptoTool,
  searchPoliciesTool,
];

// System prompt: what the agent's job is
const SYSTEM_PROMPT = `You are an HR operations agent for Workforce Digest. Investigate fired workforce alerts and produce a specific, actionable recommendation.

Process:
1. Understand the alert
2. Call tools to gather context (calendar, roster, availability, PTO, policies)
3. Once you have enough context, produce your final answer

CRITICAL OUTPUT FORMAT:
When you have enough information, respond with ONLY a JSON object. No preamble, no analysis text, no markdown code fences, no reasoning, no "let me reconsider" — just the JSON object as your entire response.

Exact shape:
{"recommendation": "One-line specific action, naming people and dates", "rationale": "2-3 sentence explanation citing specific data and policies"}

If you find yourself writing anything other than the JSON object as your final message, stop and rewrite as just the JSON.`;

export async function investigateAlert(alert) {
  const model = new ChatAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-sonnet-4-5-20250929",
    temperature: 0,
  });

  const modelWithTools = model.bindTools(tools);

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Investigate this alert and produce a recommendation:\n\n${JSON.stringify(alert, null, 2)}` },
  ];

  const trace = [];
  let iterations = 0;
  const MAX_ITERATIONS = 8;

  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const response = await modelWithTools.invoke(messages);
    messages.push(response);

    // If the model called tools, execute them and loop
    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        trace.push({
          step: iterations,
          type: "tool_call",
          tool: toolCall.name,
          input: toolCall.args,
        });

        const toolFn = tools.find((t) => t.name === toolCall.name);
        const result = await toolFn.invoke(toolCall.args);

        trace.push({
          step: iterations,
          type: "tool_result",
          tool: toolCall.name,
          output: JSON.parse(result),
        });

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }
      continue;
    }

    // No more tool calls — parse final JSON response
    const finalText = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    let parsed = null;
    // Find all JSON-looking blocks and try each from last to first (Claude may include analysis text before the final JSON)
    const jsonMatches = [...finalText.matchAll(/\{[\s\S]*?\}/g)].map(m => m[0]);
    for (let i = jsonMatches.length - 1; i >= 0; i--) {
      try {
        const candidate = JSON.parse(jsonMatches[i]);
        if (candidate.recommendation && candidate.rationale) {
          parsed = candidate;
          break;
        }
      } catch (e) { /* try next */ }
    }
    if (!parsed) {
      // Fallback: try a more permissive match
      const bigMatch = finalText.match(/\{[\s\S]*\}/);
      if (bigMatch) {
        try {
          parsed = JSON.parse(bigMatch[0]);
        } catch (e) {
          parsed = { recommendation: "Could not parse", rationale: finalText.slice(0, 500) };
        }
      } else {
        parsed = { recommendation: "Could not parse", rationale: finalText.slice(0, 500) };
      }
    }

    return {
      recommendation: parsed.recommendation,
      rationale: parsed.rationale,
      trace,
      iterations,
    };
  }

  return {
    recommendation: "Investigation exceeded max iterations",
    rationale: "The agent could not complete investigation within the iteration limit",
    trace,
    iterations,
  };
}
