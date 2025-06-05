document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle").querySelector("i");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.classList.replace("fa-sun", "fa-moon");
    }

    window.toggleTheme = function () {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeToggle.classList.toggle("fa-sun");
        themeToggle.classList.toggle("fa-moon");
    };
});

function handleJsonFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById("json-textarea").value = reader.result;
        };
        reader.readAsText(file);
    }
}

function validateJson() {
    const input = document.getElementById("json-textarea").value;
    try {
        const parsed = JSON.parse(input);
        document.getElementById("json-output").innerText = JSON.stringify(parsed, null, 2);
    } catch (error) {
        document.getElementById("json-output").innerText = "JSON inválido: " + error.message;
    }
}

function handleLogFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById("logs-textarea").value = reader.result;
        };
        reader.readAsText(file);
    }
}

function analyzeLogs() {
    const input = document.getElementById("logs-textarea").value;
    const lines = input.split("\n").filter(line => line.trim() !== "");
    const logStats = lines.reduce((acc, line) => {
        const level = line.match(/INFO|ERROR|WARN|DEBUG/);
        if (level) {
            acc[level[0]] = (acc[level[0]] || 0) + 1;
        }
        return acc;
    }, {});
    const output = Object.entries(logStats)
        .map(([level, count]) => `${level}: ${count}`)
        .join("\n");
    document.getElementById("logs-output").innerText = output || "Nenhum padrão reconhecido.";
}