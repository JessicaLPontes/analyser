document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        themeToggle.textContent = body.classList.contains("dark-mode") ? "Tema Claro" : "Tema Escuro";
    });

    const jsonTextarea = document.getElementById("json-textarea");
    const jsonErrors = document.getElementById("json-errors");
    const jsonCorrected = document.getElementById("json-corrected");
    const copyButton = document.getElementById("copy-json-button");

    document.getElementById("validate-json-button").addEventListener("click", () => {
        jsonErrors.innerHTML = ""; // Limpa erros
        jsonCorrected.textContent = ""; // Limpa JSON corrigido

        const originalText = jsonTextarea.value;

        const erros = analisarJSON(originalText);
        const jsonCorrigido = corrigirJSON(originalText);

        if (erros.length > 0) {
            jsonErrors.innerHTML = `
                <div id="error-container">
                    <strong>O JSON apresenta os seguintes erros:</strong>
                    <ul>${erros.map(err => `<li>${err}</li>`).join("")}</ul>
                </div>
            `;
        }

        jsonCorrected.textContent = jsonCorrigido;

        // Valida o JSON corrigido
        if (jsonCorrigido !== "Não foi possível corrigir automaticamente o JSON. Verifique a estrutura.") {
            try {
                JSON.parse(jsonCorrigido);
                jsonErrors.innerHTML += `
                    <div class="success">
                        O JSON corrigido está válido!
                    </div>
                `;
            } catch {
                jsonErrors.innerHTML += `
                    <div class="error">
                        O JSON corrigido ainda contém erros. Verifique novamente.
                    </div>
                `;
            }
        }
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonErrors.innerHTML = "";
        jsonCorrected.textContent = "";
    });

    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(jsonCorrected.textContent).then(() => {
            alert("JSON corrigido copiado para a área de transferência!");
        });
    });

    const logsTextarea = document.getElementById("logs-textarea");
    const logsOutput = document.getElementById("logs-output");

    document.getElementById("analyze-logs-button").addEventListener("click", () => {
        logsOutput.innerHTML = ""; // Limpa saída anterior
        const lines = logsTextarea.value.split("\n");

        lines.forEach((line, index) => {
            const div = document.createElement("div");
            div.textContent = `${index + 1}: ${line}`;
            if (/ERROR/.test(line)) {
                div.textContent += " → Linha contém um erro crítico (ERROR).";
                div.classList.add("error-highlight");
            } else if (/WARN/.test(line)) {
                div.textContent += " → Linha contém um aviso (WARN).";
                div.classList.add("warn-highlight");
            }
            logsOutput.appendChild(div);
        });
    });

    document.getElementById("clear-logs-button").addEventListener("click", () => {
        logsTextarea.value = "";
        logsOutput.innerHTML = "";
    });

    function analisarJSON(textoJSON) {
        const erros = [];
        const regexChaves = /([a-zA-Z_$][\w$]*)\s*:/g;
        const regexVirgulas = /,(\s*[}\]])/g;

        textoJSON.split("\n").forEach((linha, index) => {
            if (regexChaves.test(linha)) {
                erros.push(`Linha ${index + 1}: Chave sem aspas.`);
            }
            if (regexVirgulas.test(linha)) {
                erros.push(`Linha ${index + 1}: Vírgula desnecessária.`);
            }
        });

        try {
            JSON.parse(textoJSON);
        } catch (e) {
            erros.push("Erro geral: Verifique o JSON.");
        }

        return erros;
    }

    function corrigirJSON(textoJSON) {
        try {
            const corrigido = textoJSON
                .replace(/([a-zA-Z_$][\w$]*)\s*:/g, '"$1":')
                .replace(/,(\s*[}\]])/g, "$1");

            JSON.parse(corrigido);
            return corrigido;
        } catch {
            return "Não foi possível corrigir automaticamente o JSON. Verifique a estrutura.";
        }
    }
});