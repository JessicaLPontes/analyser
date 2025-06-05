document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    // Alternar Tema
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        themeToggle.textContent = body.classList.contains("dark-mode") ? "Tema Claro" : "Tema Escuro";
    });

    // JSON Analysis
    const jsonInput = document.getElementById("json-input");
    const jsonTextarea = document.getElementById("json-textarea");
    const jsonOutput = document.getElementById("json-output");

    jsonInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                jsonTextarea.value = reader.result;
            };
            reader.readAsText(file);
        }
        jsonInput.value = ""; // Limpar input
    });

    document.getElementById("validate-json-button").addEventListener("click", () => {
        jsonOutput.innerHTML = ""; // Limpa saída anterior
        const lines = jsonTextarea.value.split("\n");
        try {
            const parsed = JSON.parse(jsonTextarea.value);
            jsonOutput.textContent = "JSON válido!";
            jsonOutput.classList.remove("error");
        } catch (e) {
            const errorLine = e.message.match(/position (\d+)/);
            const lineNumber = errorLine ? Math.ceil(errorLine[1] / jsonTextarea.cols) : "desconhecida";
            jsonOutput.innerHTML = `<div class="error">Erro na linha ${lineNumber}: ${e.message}</div>`;
        }
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonOutput.innerHTML = "";
    });

    // Logs Analysis
    const logsInput = document.getElementById("logs-input");
    const logsTextarea = document.getElementById("logs-textarea");
    const logsOutput = document.getElementById("logs-output");

    logsInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                logsTextarea.value = reader.result;
            };
            reader.readAsText(file);
        }
        logsInput.value = ""; // Limpar input
    });

    document.getElementById("analyze-logs-button").addEventListener("click", () => {
        logsOutput.innerHTML = ""; // Limpa saída anterior
        const lines = logsTextarea.value.split("\n").filter(Boolean);
        lines.forEach((line, index) => {
            const div = document.createElement("div");
            div.textContent = `${index + 1}: ${line}`;
            if (/ERROR|WARN/.test(line)) {
                div.classList.add("error");
            }
            logsOutput.appendChild(div);
        });
    });

    document.getElementById("clear-logs-button").addEventListener("click", () => {
        logsTextarea.value = "";
        logsOutput.innerHTML = "";
    });
});