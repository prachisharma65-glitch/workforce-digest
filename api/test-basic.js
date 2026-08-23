import { ChatAnthropic } from "@langchain/anthropic";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const model = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-sonnet-4-5-20250929",
});

const result = await model.invoke("Say hello in 5 words.");
console.log("SUCCESS:", result.content);
