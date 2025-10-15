export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { token, request } = req.body || {};
  if (!token || !request)
    return res.status(400).json({ error: "Missing parameters" });

  try {
    const response = await fetch("https://leakosintapi.com/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, request, limit: 300, lang: "ru" }),
    });

    const text = await response.text();
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch {
      return res.status(502).json({ error: "API returned invalid JSON" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}