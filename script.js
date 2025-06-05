document.addEventListener("DOMContentLoaded", () => {
    const jsonTextarea = document.getElementById("json-textarea");
    const jsonOutput = document.getElementById("json-output");

    document.getElementById("validate-json-button").addEventListener("click", () => {
        jsonOutput.innerHTML = ""; // Limpa saída anterior
        const originalText = jsonTextarea.value;
        const lines = originalText.split("\n");

        try {
            JSON.parse(originalText);
            jsonOutput.textContent = "O JSON está válido!";
            jsonOutput.classList.remove("error");
        } catch (e) {
            const erros = analisarJSON(originalText);
            const jsonCorrigido = corrigirJSON(originalText);

            jsonOutput.innerHTML = `
                <div class="error">
                    <strong>O JSON apresenta os seguintes erros:</strong>
                    <ul>${erros.map(err => `<li>${err}</li>`).join("")}</ul>
                </div>
                <strong>JSON Corrigido:</strong>
                <pre>${jsonCorrigido}</pre>
            `;
        }
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonOutput.innerHTML = "";
    });

    /**
     * Função para analisar JSON e listar erros
     * @param {string} textoJSON
     * @returns {Array<string>} Lista de erros encontrados
     */
    function analisarJSON(textoJSON) {
        const erros = [];
        const regexAspas = /(["'])\s*([^"\s]*?)\s*\1\s*:/g;
        const regexVirgulas = /(,)(\s*[}\]])/g;

        // Verifica chaves sem aspas duplas
        if (!regexAspas.test(textoJSON)) {
            erros.push(`Uma ou mais chaves estão sem aspas duplas. Todas as chaves devem ser cercadas por aspas.`);
        }

        // Verifica vírgulas duplicadas ou ausentes
        if (regexVirgulas.test(textoJSON)) {
            erros.push(`Há elementos separados incorretamente por vírgulas.`);
        }

        return erros.length > 0 ? erros : ["Erro inesperado no JSON. Verifique a estrutura geral."];
    }

    /**
     * Função para corrigir JSON
     * @param {string} textoJSON
     * @returns {string} JSON corrigido
     */
    function corrigirJSON(textoJSON) {
        try {
            const corrigido = textoJSON
                .replace(/(['"])\s*([^"\s]*?)\s*\1\s*:/g, '"$2":') // Corrige chaves sem aspas duplas
                .replace(/,(\s*[}\]])/g, "$1"); // Remove vírgulas extras antes de } ou ]

            JSON.parse(corrigido); // Valida o JSON corrigido
            return corrigido;
        } catch {
            return "Não foi possível corrigir automaticamente o JSON.";
        }
    }
});