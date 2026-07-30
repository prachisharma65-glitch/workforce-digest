import { investigateAlert } from "./agent.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const alert = req.body;
    if (!alert || !alert.id) {
      return res.status(400).json({ error: "Missing alert data" });
    }

    console.log(`[investigate] Starting investigation for alert: ${alert.id}`);
    const result = await investigateAlert(alert);
    console.log(`[investigate] Completed in ${result.iterations} iterations`);

    return res.status(200).json(result);
  } catch (error) {
    console.error("[investigate] Error:", error);
    return res.status(500).json({
      error: "Investigation failed",
      details: error.message,
    });
  }
}
