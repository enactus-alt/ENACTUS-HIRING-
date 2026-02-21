const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxClcp_8P6kUt30r_4kaTlKtxWB6K08GHuiQl_kgL9EyuoXXpwM0pWEAXsiM2sAJM8e/exec";

const form = document.getElementById("form");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Envoi en cours...";

  const payload = {
    NomPrenom: document.getElementById("NomPrenom").value.trim(),
    Email: document.getElementById("Email").value.trim(),
    DateNaissance: document.getElementById("DateNaissance").value,
    Departement: document.getElementById("Departement").value,
    PourquoiEnactus: document.getElementById("PourquoiEnactus").value.trim(),
    Apprendre: document.getElementById("Apprendre").value.trim(),
    Motivation: document.getElementById("Motivation").value.trim(),
  };

  try {
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    msg.textContent = data.ok ? ("✅ " + data.message) : ("❌ " + data.message);

    if (data.ok) form.reset();
  } catch (err) {
    msg.textContent = "❌ Erreur réseau: " + err;
  }
});