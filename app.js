/***********************
 * INITIALISATION
 ***********************/
const dayPicker = document.getElementById("dayPicker");
const dateTitle = document.getElementById("date");

const morningRow = document.getElementById("morning");
const afternoonRow = document.getElementById("afternoon");

const m_start = document.getElementById("m_start");
const m_end = document.getElementById("m_end");
const a_start = document.getElementById("a_start");
const a_end = document.getElementById("a_end");

const m_decimal = document.getElementById("m_decimal");
const a_decimal = document.getElementById("a_decimal");

const weekView = document.getElementById("weekView");

/***********************
 * DATE COURANTE
 ***********************/
function getToday() {
  return new Date().toISOString().split("T")[0];
}

let currentDay = getToday();
dayPicker.value = currentDay;
dateTitle.innerText = currentDay;

/***********************
 * GENERATION PICKER HEURES
 ***********************/
function generateTimeOptions(selectElement) {
  selectElement.innerHTML = "";
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      const option = document.createElement("option");
      option.value = `${hh}:${mm}`;
      option.text = `${hh}:${mm}`;
      selectElement.appendChild(option);
    }
  }
}

[m_start, m_end, a_start, a_end].forEach(generateTimeOptions);

/***********************
 * OUTILS
 ***********************/
function timeToDecimal(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  return (h + m / 60).toFixed(2);
}

/***********************
 * SAUVEGARDE / CHARGEMENT
 ***********************/
function saveDay() {
  const data = {
    m_start: m_start.value,
    m_end: m_end.value,
    a_start: a_start.value,
    a_end: a_end.value
  };
  localStorage.setItem(currentDay, JSON.stringify(data));
  updateAll();
  updateWeekView();
}

function loadDay(date) {
  const data = JSON.parse(localStorage.getItem(date));
  m_start.value = data?.m_start || "08:00";
  m_end.value   = data?.m_end   || "12:00";
  a_start.value = data?.a_start || "13:00";
  a_end.value   = data?.a_end   || "17:00";
  updateAll();
  updateWeekView();
}

/***********************
 * MISE À JOUR AFFICHAGE
 ***********************/
function updateRow(startSelect, endSelect, decimalSpan, row) {
  if (startSelect.value && endSelect.value) {
    decimalSpan.innerText =
      `(${timeToDecimal(startSelect.value)} – ${timeToDecimal(endSelect.value)})`;
    row.className = "row complete";
  } else {
    decimalSpan.innerText = "";
    row.className = "row incomplete";
  }
}

function updateAll() {
  updateRow(m_start, m_end, m_decimal, morningRow);
  updateRow(a_start, a_end, a_decimal, afternoonRow);
}

/***********************
 * VALIDATION LIGNE
 ***********************/
function validateRow(rowId) {
  if (rowId === "morning") {
    updateRow(m_start, m_end, m_decimal, morningRow);
  } else if (rowId === "afternoon") {
    updateRow(a_start, a_end, a_decimal, afternoonRow);
  }
  saveDay();
}

/***********************
 * VUE SEMAINE
 ***********************/
function updateWeekView() {
  weekView.innerHTML = "";
  const baseDate = new Date(currentDay);
  baseDate.setDate(baseDate.getDate() - baseDate.getDay()); // dimanche

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const data = JSON.parse(localStorage.getItem(dateStr)) || {};

    const mStart = data.m_start || "--:--";
    const mEnd   = data.m_end   || "--:--";
    const aStart = data.a_start || "--:--";
    const aEnd   = data.a_end   || "--:--";

    const complete =
      data.m_start && data.m_end && data.a_start && data.a_end
        ? "✅"
        : "❌";

    const displayDate = dateStr.slice(5);
    const div = document.createElement("div");
    div.innerText = `${displayDate} ${complete} | Matin: ${mStart}→${mEnd} | Après-midi: ${aStart}→${aEnd}`;
    weekView.appendChild(div);
  }
}

/***********************
 * SÉLECTEUR DE JOUR
 ***********************/
dayPicker.addEventListener("change", () => {
  currentDay = dayPicker.value;
  dateTitle.innerText = currentDay;
  loadDay(currentDay);
});

/***********************
 * CHARGEMENT INITIAL
 ***********************/
loadDay(currentDay);
