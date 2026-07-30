import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { policies } from "./policies.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

let vectorStore = null;

export async function initVectorStore() {
  if (vectorStore) return vectorStore;

  console.log("Initializing vector store (embedding policies)...");

  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-small",
  });

  const documents = policies.map(
    (p) =>
      new Document({
        pageContent: `${p.title}\n\n${p.content}`,
        metadata: { id: p.id, title: p.title },
      })
  );

  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
  console.log(`Vector store ready with ${documents.length} policies.`);
  return vectorStore;
}

export async function searchPolicies(query, k = 2) {
  const store = await initVectorStore();
  const results = await store.similaritySearch(query, k);
  return results.map((r) => ({
    id: r.metadata.id,
    title: r.metadata.title,
    content: r.pageContent,
  }));
}
