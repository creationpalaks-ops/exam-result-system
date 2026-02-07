const subjects = ["Hindi", "SS", "English", "Science", "Gujarati", "Maths", "Sanskrit"];
let lastResult = "";
let subjectDetails = "";

function toggleTheme() {
  document.body.classList.toggle("light");
}

function loadExam() {
  form.innerHTML = "";
  result.innerHTML = "";
  lastResult = "";
  subjectDetails = "";

  if (!exam.value) return;

  // WEEKLY
  if (exam.value === "weekly") {
    form.innerHTML = `
      <input id="weeklyMark" type="number" min="0" max="25" placeholder="Enter marks (0–25)">
      <small>Marks must be between 0 and 25</small>
      <button onclick="weekly()">Check</button>
    `;
    return;
  }

  // TERM EXAMS
  let limit = exam.value === "annual" ? 80 : 50;

  form.innerHTML += `
    <p class="note">
      Enter marks between 0–${limit}
    </p>
  `;

  subjects.forEach(subject => {
    form.innerHTML += `
      <input 
        id="${subject}" 
        type="number" 
        min="0" 
        max="${limit}" 
        placeholder="${subject} (0–${limit})">
    `;
  });

  form.innerHTML += `<button onclick="term('${exam.value}')">Check</button>`;
}

function grade(p) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B";
  if (p >= 60) return "C";
  if (p >= 50) return "D";
  return "F";
}

// WEEKLY RESULT
function weekly() {
  let m = +weeklyMark.value;

  if (m < 0 || m > 25 || isNaN(m)) {
    alert("Please enter marks between 0 and 25");
    return;
  }

  let p = ((m / 25) * 100).toFixed(2);

  lastResult =
`WEEKLY EXAM RESULT
-------------------------
Marks : ${m} / 25
Percentage : ${p}%
Grade : ${grade(p)}
Result : ${m >= 8 ? "PASS" : "FAIL"}`;

  result.innerHTML = lastResult.replaceAll("\n", "<br>");
}

// TERM RESULT
function term(type) {
  let max = type === "annual" ? 80 : 50;
  let pass = type === "annual" ? 35 : 18;

  let total = 0;
  let fail = false;
  subjectDetails = "";

  subjects.forEach(s => {
    let m = +document.getElementById(s).value;

    if (m < 0 || m > max || isNaN(m)) {
      alert(`Invalid marks in ${s}. Enter between 0 and ${max}`);
      fail = true;
      return;
    }

    total += m;
    subjectDetails += `${s} : ${m}/${max}\n`;

    if (m < pass) fail = true;
  });

  if (fail && subjectDetails === "") return;

  let grandTotal = max * subjects.length;
  let p = ((total / grandTotal) * 100).toFixed(2);

  lastResult =
`${type.toUpperCase()} TERM EXAM RESULT
----------------------------------
${subjectDetails}
----------------------------------
Total : ${total} / ${grandTotal}
Percentage : ${p}%
Grade : ${grade(p)}
Result : ${fail ? "FAIL" : "PASS"}`;

  result.innerHTML = lastResult.replaceAll("\n", "<br>");
}

// PDF
function downloadPDF() {
  if (!lastResult) {
    alert("Please calculate result first");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.setFontSize(14);
  pdf.text("EXAM RESULT MARKSHEET", 20, 20);

  pdf.setFontSize(11);
  pdf.text(lastResult, 20, 35);

  pdf.save("Marksheet.pdf");
}

// PRINT
function printResult() {
  if (!lastResult) {
    alert("Please calculate result first");
    return;
  }

  let win = window.open("");
  win.document.write(`<pre>${lastResult}</pre>`);
  win.print();
  win.close();
}

// SHARE
async function shareResult() {
  if (!lastResult) {
    alert("Please calculate result first");
    return;
  }

  if (navigator.share) {
    await navigator.share({
      title: "Exam Result Marksheet",
      text: lastResult
    });
  } else {
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(lastResult),
      "_blank"
    );
  }
}
