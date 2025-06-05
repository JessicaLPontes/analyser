document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        themeToggle.textContent = body.classList.contains("dark-mode") ? "Tema Claro" : "Tema Escuro";
    });

    // JSON Analysis
    const jsonInput = document.getElementById("json-input");
    const jsonTextarea = document.getElementById("json-textarea");
    const jsonOutput = document.getElementById("json-output");
    const clearJsonButton = document.getElementById("clear-json-button");

    jsonInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                jsonTextarea.value = reader.result;
            };
            reader.readAsText(file);
        }
        jsonInput.value = "";
    });

    document.getElementById("validate-json-button").addEventListener("click", () => {
        try {
            const parsed = JSON.parse(jsonTextarea.value);
            jsonOutput.textContent = JSON.stringify(parsed, null, 2);
            jsonOutput.classList.remove("error");
        } catch (e) {
            jsonOutput.textContent = `Erro: ${e.message}`;
            jsonOutput.classList.add("error");
        }
    });

    clearJsonButton.addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonOutput.textContent = "";
    });

    // Log Analysis
    const logsInput = document.getElementById("logs-input");
    const logsTextarea = document.getElementById("logs-textarea");
    const logsOutput = document.getElementById("logs-output");
    const clearLogsButton = document.getElementById("clear-logs-button");

    logsInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                logsTextarea.value = reader.result;
            };
            reader.readAsText(file);
        }
        logsInput.value = "";
    });

    document.getElementById("analyze-logs-button").addEventListener("click", () => {
        const lines = logsTextarea.value.split("\n").filter(Boolean);
        logsOutput.innerHTML = "";
        lines.forEach((line, index) => {
            const div = document.createElement("div");
            div.textContent = `${index + 1}: ${line}`;
            if (/ERROR|WARN/.test(line)) {
                div.classList.add("error");
            }
            logsOutput.appendChild(div);
        });
    });

    clearLogsButton.addEventListener("click", () => {
        logsTextarea.value = "";
        logsOutput.innerHTML = "";
    });
});