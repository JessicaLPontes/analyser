document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        themeToggle.textContent = body.classList.contains("dark-mode") ? "Tema Claro" : "Tema Escuro";
    });

    // JSON Analysis
    const jsonTextarea = document.getElementById("json-textarea");
    const jsonOutput = document.getElementById("json-output");

    document.getElementById("validate-json-button").addEventListener("click", () => {
        jsonOutput.innerHTML = ""; // Limpa saída anterior
        const lines = jsonTextarea.value.split("\n");
        try {
            const parsed = JSON.parse(jsonTextarea.value);
            jsonOutput.textContent = JSON.stringify(parsed, null, 2);
            jsonOutput.classList.remove("error");
        } catch (e) {
            jsonOutput.classList.add("error");
            lines.forEach((line, index) => {
                const div = document.createElement("div");
                div.textContent = `${index + 1}: ${line}`;
                if (line.includes(e.message.split(" ")[1])) {
                    div.style.backgroundColor = "#ffecec";
                    div.style.color = "#721c24";
                }
                jsonOutput.appendChild(div);
            });
            jsonOutput.append(`Erro: ${e.message}`);
        }
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonOutput.textContent = "";
    });

    // Logs Analysis
    const logsTextarea = document.getElementById("logs-textarea");
    const logsOutput = document.getElementById("logs-output");

    document.getElementById("analyze-logs-button").addEventListener("click", () => {
        const lines = logsTextarea.value.split("\n");
        logsOutput.innerHTML = ""; // Limpa saída anterior
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