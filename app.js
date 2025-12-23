const today = new Date().toISOString().split("T")[0];
document.getElementById("date").innerText = today;

function timeToDecimal(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  return (h + m / 60).toFixed(2);
}

function updateRow(startId, endId, decimalId, rowId) {
  const start = document.getElementById(startId).value;
  const end = document.getElementById(endId).value;
  const row = document.getElementById(rowId);

  if (start && end) {
    document.getElementById(decimalId).innerText =
      `(${timeToDecimal(start)} – ${timeToDecimal(end)})`;
    row.className = "row complete";
  } else {
    row.className = "row incomplete";
  }

  saveDay();
}

function saveDay() {
  const data = {
    m_start: m_start.value,
    m_end: m_end.value,
    a_start: a_start.value,
    a_end: a_end.value
  };
  localStorage.setItem(today, JSON.stringify(data));
}

function loadDay(date) {
  const data = JSON.parse(localStorage.getItem(date));
  if (!data) return;
  Object.keys(data).forEach(k => document.getElementById(k).value = data[k]);
}

loadDay(today);

["m_start", "m_end"].forEach(id =>
  document.getElementById(id).addEventListener("change", () =>
    updateRow("m_start", "m_end", "m_decimal", "morning")
  )
);

["a_start", "a_end"].forEach(id =>
  document.getElementById(id).addEventListener("change", () =>
    updateRow("a_start", "a_end", "a_decimal", "afternoon")
  )
);

document.getElementById("copy").onclick = () => {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  loadDay(yesterday);
};
