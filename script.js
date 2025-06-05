document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle").querySelector("i");

    // Aplicar o tema salvo no LocalStorage ao carregar a página
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
        themeToggle.classList.remove("fa-sun");
        themeToggle.classList.add("fa-moon");
    } else {
        body.classList.remove("dark-mode");
        themeToggle.classList.remove("fa-moon");
        themeToggle.classList.add("fa-sun");
    }

    // Função para alternar entre modo escuro e claro
    window.toggleTheme = function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.classList.remove("fa-sun");
            themeToggle.classList.add("fa-moon");
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.classList.remove("fa-moon");
            themeToggle.classList.add("fa-sun");
        }
    };

    // Alternância entre seções
    const jsonButton = document.getElementById("jsonButton");
    const logsButton = document.getElementById("logsButton");
    const jsonSection = document.getElementById("jsonSection");
    const logsSection = document.getElementById("logsSection");

    jsonButton.addEventListener("click", () => {
        jsonSection.classList.remove("hidden");
        logsSection.classList.add("hidden");
    });

    logsButton.addEventListener("click", () => {
        logsSection.classList.remove("hidden");
        jsonSection.classList.add("hidden");
    });

    // Validação de JSON
    const validateJsonButton = document.getElementById("validateJson");
    const jsonInput = document.getElementById("jsonInput");
    const jsonOutput = document.getElementById("jsonOutput");

    validateJsonButton.addEventListener("click", () => {
        try {
            const parsedJson = JSON.parse(jsonInput.value);
            jsonOutput.textContent = JSON.stringify(parsedJson, null, 4);
        } catch (error) {
            jsonOutput.textContent = `Erro: JSON inválido.\n${error.message}`;
        }
    });

    // Análise de Logs
    const analyzeLogsButton = document.getElementById("analyzeLogs");
    const logsInput = document.getElementById("logsInput");
    const logsOutput = document.getElementById("logsOutput");

    analyzeLogsButton.addEventListener("click", () => {
        const logs = logsInput.value.split("\n");
        const parsedLogs = logs.map((log, index) => `Linha ${index + 1}: ${log}`);
        logsOutput.innerHTML = `<pre>${parsedLogs.join("\n")}</pre>`;
    });
});