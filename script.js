const password = "Happy@5278";
let apiToken = localStorage.getItem("apiToken") || "7395422268:eJEnV7ZH";

function toggleSettings() {
  document.getElementById("settingsBox").classList.toggle("hidden");
}

function changeApi() {
  const pass = document.getElementById("passwordInput").value;
  const newToken = document.getElementById("newApiKey").value.trim();
  if (pass !== password) return alert("❌ Wrong password!");
  if (!newToken) return alert("⚠️ Enter new token!");
  localStorage.setItem("apiToken", newToken);
  apiToken = newToken;
  alert("✅ Token updated!");
}

async function searchLeak() {
  const number = document.getElementById("queryInput").value.trim();
  const box = document.getElementById("resultBox");
  if (!number) return box.textContent = "⚠️ Enter a number!";
  box.textContent = "⏳ Searching...";

  try {
    const res = await fetch("/api.js", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token: apiToken, request: number})
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); }
    catch { throw new Error("Invalid JSON from API"); }

    if (data.error) return box.textContent = "❌ " + data.error;

    let out = "";
    for (const db in data.List) {
      out += `📁 ${db}\n${data.List[db].InfoLeak || ""}\n\n`;
      if (data.List[db].Data)
        data.List[db].Data.forEach(i => {
          for (const k in i) out += `• ${k}: ${i[k]}\n`;
          out += "\n";
        });
    }
    box.textContent = out || "✅ No results found.";
  } catch (e) {
    box.textContent = "❌ Failed: " + e.message;
  }
}

function copyResults() {
  navigator.clipboard.writeText(document.getElementById("resultBox").textContent);
  alert("✅ Copied!");
}