document.addEventListener("DOMContentLoaded", function () {
    // Alternar tema
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    window.toggleTheme = function () {
        body.classList.toggle("dark-mode");
        localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    };
});

// JSON
function handleJsonFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById("json-textarea").value = reader.result;
    };
    reader.readAsText(file);
    event.target.value = ""; // Limpa o input
}

function validateJson() {
    const textarea = document.getElementById("json-textarea");
    const output = document.getElementById("json-output");
    try {
        const json = JSON.parse(textarea.value);
        output.innerText = JSON.stringify(json, null, 2);
        output.classList.remove("error");
    } catch (e) {
        output.innerText = `Erro: ${e.message}`;
        output.classList.add("error");
    }
}

function clearJson() {
    document.getElementById("json-textarea").value = "";
    document.getElementById("json-output").innerText = "";
}

// Logs
function handleLogFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        document.getElementById("logs-textarea").value = reader.result;
    };
    reader.readAsText(file);
    event.target.value = ""; // Limpa o input
}

function analyzeLogs() {
    const textarea = document.getElementById("logs-textarea");
    const output = document.getElementById("logs-output");
    const lines = textarea.value.split("\n");
    output.innerHTML = ""; // Limpa o output anterior

    lines.forEach((line, index) => {
        const div = document.createElement("div");
        div.textContent = `${index + 1}: ${line}`;
        if (/ERROR|WARN/.test(line)) {
            div.classList.add("error");
        }
        output.appendChild(div);
    });
}

function clearLogs() {
    document.getElementById("logs-textarea").value = "";
    document.getElementById("logs-output").innerHTML = "";
}