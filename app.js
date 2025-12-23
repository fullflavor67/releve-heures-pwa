/***********************
 * INITIALISATION
 ***********************/
const dayPicker = document.getElementById("dayPicker");
const dateTitle = document.getElementById("date");

const morningRow = document.getElementById("morning");
const afternoonRow = document.getElementById("afternoon");

const m_start_h = document.getElementById("m_start_h");
const m_start_m = document.getElementById("m_start_m");
const m_end_h = document.getElementById("m_end_h");
const m_end_m = document.getElementById("m_end_m");

const a_start_h = document.getElementById("a_start_h");
const a_start_m = document.getElementById("a_start_m");
const a_end_h = document.getElementById("a_end_h");
const a_end_m = document.getElementById("a_end_m");

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
 * GENERATION PICKER HEURES / MINUTES
 ***********************/
function generateHourOptions(selectElement) {
  selectElement.innerHTML = "";
  for (let h = 0; h < 24; h++) {
    const option = document.createElement("option");
    option.value = h.toString().padStart(2, "0");
    option.text = h.toString().padStart(2, "0");
    selectElement.appendChild(option);
  }
}

function generateMinuteOptions(selectElement) {
  selectElement.innerHTML = "";
  for (let m = 0; m < 60; m += 5) {
    const option = document.createElement("option");
    option.value = m.toString().padStart(2, "0");
    option.text = m.toString().padStart(2, "0");
    selectElement.appendChild(option);
  }
}

// Appliquer à tous les pickers
[m_start_h, m_end_h, a_start_h, a_end_h].forEach(generateHourOptions);
[m_start_m, m_end_m, a_start_m, a_end_m].forEach(generateMinuteOptions);

/***********************
 * OUTILS
 ***********************/
function getTimeValue(hSelect, mSelect) {
  return `${hSelect.value}:${mSelect.value}`;
}

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
    m_start: getTimeValue(m_start_h, m_start_m),
    m_end: getTimeValue(m_end_h, m_end_m),
    a_start: getTimeValue(a_start_h, a_start_m),
    a_end: getTimeValue(a_end_h, a_end_m)
  };
  localStorage.setItem(currentDay, JSON.stringify(data));
  updateAll();
  updateWeekView();
}

function loadDay(date) {
  const data = JSON.parse(localStorage.getItem(date));

  const mStart = data?.m_start || "08:00";
  const mEnd = data?.m_end || "12:00";
  const aStart = data?.a_start || "13:00";
  const aEnd = data?.a_end || "17:00";

  [m_start_h, m_start_m].forEach((s, i) => s.value = i === 0 ? mStart.split(":")[0] : mStart.split(":")[1]);
  [m_end_h, m_end_m].forEach((s, i) => s.value = i === 0 ? mEnd.split(":")[0] : mEnd.split(":")[1]);
  [a_start_h, a_start_m].forEach((s, i) => s.value = i === 0 ? aStart.split(":")[0] : aStart.split(":")[1]);
  [a_end_h, a_end_m].forEach((s, i) => s.value = i === 0 ? aEnd.split(":")[0] : aEnd.split(":")[1]);

  updateAll();
  updateWeekView();
}

/***********************
 * MISE À JOUR AFFICHAGE
 ***********************/
function updateRow(startH, startM, endH, endM, decimalSpan, row) {
  const start = getTimeValue(startH, startM);
  const end = getTimeValue(endH, endM);
  if (start && end) {
    decimalSpan.innerText = `(${timeToDecimal(start)} – ${timeToDecimal(end)})`;
    row.className = "row complete";
  } else {
    decimalSpan.innerText = "";
    row.className = "row incomplete";
  }
}

function updateAll() {
  updateRow(m_start_h, m_start_m, m_end_h, m_end_m, m_decimal, morningRow);
  updateRow(a_start_h, a_start_m, a_end_h, a_end_m, a_decimal, afternoonRow);
}

/***********************
 * VALIDATION LIGNE
 ***********************/
function validateRow(rowId) {
  if (rowId === "morning") {
    updateRow(m_start_h, m_start_m, m_end_h, m_end_m, m_decimal, morningRow);
  } else if (rowId === "afternoon") {
    updateRow(a_start_h, a_start_m, a_end_h, a_end_m, a_decimal, afternoonRow);
  }
  saveDay();
}

/***********************
 * VUE SEMAINE
 ***********************/
function updateWeekView() {
  weekView.innerHTML = "";
  const baseDate = new Date(currentDay);
  baseDate.setDate(baseDate.getDate() - baseDate.getDay());

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const data = JSON.parse(localStorage.getItem(dateStr)) || {};

    const mStart = data.m_start || "--:--";
    const mEnd = data.m_end || "--:--";
    const aStart = data.a_start || "--:--";
    const aEnd = data.a_end || "--:--";

    const complete = data.m_start && data.m_end && data.a_start && data.a_end ? "✅" : "❌";
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
