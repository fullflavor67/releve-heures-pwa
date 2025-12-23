/***********************
 * INITIALISATION
 ***********************/
const dayPicker = document.getElementById("dayPicker");
const dateTitle = document.getElementById("date");

const m_start = document.getElementById("m_start");
const m_end = document.getElementById("m_end");
const a_start = document.getElementById("a_start");
const a_end = document.getElementById("a_end");

const m_decimal = document.getElementById("m_decimal");
const a_decimal = document.getElementById("a_decimal");

const morningRow = document.getElementById("morning");
const afternoonRow = document.getElementById("afternoon");

const weekView = document.getElementById("weekView");
const copyBtn = document.getElementById("copy");

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
}

function loadDay(date) {
  const data = JSON.parse(localStorage.getItem(date));
  m_start.value = data?.m_start || "";
  m_end.value   = data?.m_end   || "";
  a_start.value = data?.a_start || "";
  a_end.value   = data?.a_end   || "";
  updateAll();
  updateWeekView();
}

/***********************
 * MISE À JOUR AFFICHAGE
 ***********************/
function updateRow(startInput, endInput, decimalSpan, row) {
  if (startInput.value && endInput.value) {
    decimalSpan.innerText =
      `(${timeToDecimal(startInput.value)} – ${timeToDecimal(endInput.value)})`;
    row.className = "row complete";
  } else {
    decimalSpan.innerText = "";
    row.className = "row incomplete";
  }
  saveDay();
}

function updateAll() {
  updateRow(m_start, m_end, m_decimal, morningRow);
  updateRow(a_start, a_end, a_decimal, afternoonRow);
}

/***********************
 * AUTO-FOCUS
 ***********************/
m_start.onchange = () => m_end.focus();
m_end.onchange   = () => a_start.focus();
a_start.onchange = () => a_end.focus();

/***********************
 * DUPLICATION JOUR PRÉCÉDENT
 ***********************/
copyBtn.addEventListener("click", () => {
  const d = new Date(currentDay);
  d.setDate(d.getDate() - 1);
  const previousDay = d.toISOString().split("T")[0];
  loadDay(previousDay);
  saveDay();
});

/***********************
 * SÉLECTEUR DE JOUR
 ***********************/
dayPicker.addEventListener("change", () => {
  currentDay = dayPicker.value;
  dateTitle.innerText = currentDay;
  loadDay(currentDay);
});

/***********************
 * VUE SEMAINE
 ***********************/
function updateWeekView() {
  weekView.innerHTML = "";
  const baseDate = new Date(currentDay);
  baseDate.setDate(baseDate.getDate() - baseDate.getDay()); // début de semaine dimanche
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

    const displayDate = dateStr.slice(5); // MM-DD
    const div = document.createElement("div");
    div.innerText = `${displayDate} ${complete} | Matin: ${mStart}→${mEnd} | Après-midi: ${aStart}→${aEnd}`;
    weekView.appendChild(div);
  }
}

/***********************
 * ÉCOUTEURS SUR CHAMPS
 ***********************/
[m_start, m_end].forEach(el =>
  el.addEventListener("change", () =>
    updateRow(m_start, m_end, m_decimal, morningRow)
  )
);

[a_start, a_end].forEach(el =>
  el.addEventListener("change", () =>
    updateRow(a_start, a_end, a_decimal, afternoonRow)
  )
);

/***********************
 * CHARGEMENT INITIAL
 ***********************/
loadDay(currentDay);
