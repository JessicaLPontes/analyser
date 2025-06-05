document.addEventListener("DOMContentLoaded", () => {
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
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonErrors.innerHTML = "";
        jsonCorrected.textContent = "";
    });

    // Botão copiar JSON corrigido
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(jsonCorrected.textContent).then(() => {
            alert("JSON corrigido copiado para a área de transferência!");
        });
    });

    /**
     * Função para analisar JSON e listar erros
     * @param {string} textoJSON
     * @returns {Array<string>} Lista de erros encontrados
     */
    function analisarJSON(textoJSON) {
        const erros = [];
        const linhas = textoJSON.split("\n");

        linhas.forEach((linha, index) => {
            // Verifica chaves sem aspas duplas
            const regexChavesSemAspas = /([a-zA-Z0-9_]+)\s*:/g;
            if (regexChavesSemAspas.test(linha)) {
                erros.push(`Linha ${index + 1}: Chave "${linha.match(regexChavesSemAspas)[1]}" está sem aspas duplas.`);
            }

            // Verifica vírgulas duplicadas ou ausentes
            const regexVirgulasDuplicadas = /,(\s*[}\]])/g;
            if (regexVirgulasDuplicadas.test(linha)) {
                erros.push(`Linha ${index + 1}: Vírgula desnecessária encontrada.`);
            }
        });

        // Validação geral do JSON
        try {
            JSON.parse(textoJSON);
        } catch (e) {
            const mensagemErro = e.message.match(/position (\d+)/)
                ? `Erro geral no JSON perto da posição ${e.message.match(/position (\d+)/)[1]}.`
                : "Erro geral no JSON. Verifique toda a estrutura.";
            erros.push(mensagemErro);
        }

        return erros;
    }

    /**
     * Função para corrigir JSON
     * @param {string} textoJSON
     * @returns {string} JSON corrigido
     */
    function corrigirJSON(textoJSON) {
        try {
            const corrigido = textoJSON
                .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":') // Corrige chaves sem aspas duplas
                .replace(/,(\s*[}\]])/g, "$1"); // Remove vírgulas extras antes de } ou ]

            JSON.parse(corrigido); // Valida o JSON corrigido
            return corrigido;
        } catch {
            return "Não foi possível corrigir automaticamente o JSON.";
        }
    }
});