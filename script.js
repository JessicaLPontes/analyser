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

    document.getElementById("json-input").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                jsonTextarea.value = reader.result;
            };
            reader.readAsText(file);
        }
    });

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
    });

    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(jsonCorrected.textContent).then(() => {
            alert("JSON corrigido copiado para a área de transferência!");
        });
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