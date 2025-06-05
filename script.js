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
            JSON.parse(jsonTextarea.value);
            jsonOutput.textContent = "O JSON está válido!";
            jsonOutput.classList.remove("error");
        } catch (e) {
            const errorMessage = traduzirErroJSON(e.message, lines);
            jsonOutput.innerHTML = `<div class="error">${errorMessage}</div>`;
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
            if (/ERROR/.test(line)) {
                div.textContent += " → Linha contém um erro crítico (ERROR).";
                div.classList.add("error");
            } else if (/WARN/.test(line)) {
                div.textContent += " → Linha contém um aviso (WARN).";
                div.classList.add("warn");
            }
            logsOutput.appendChild(div);
        });
    });

    document.getElementById("clear-logs-button").addEventListener("click", () => {
        logsTextarea.value = "";
        logsOutput.innerHTML = "";
    });

    // Função para traduzir e detalhar o erro do JSON
    function traduzirErroJSON(mensagem, linhas) {
        if (mensagem.includes("Unexpected token")) {
            return `Erro: Token inesperado encontrado. Verifique a estrutura na linha correspondente.`;
        } else if (mensagem.includes("Unexpected end of JSON input")) {
            return `Erro: Final inesperado do JSON. Certifique-se de fechar todas as chaves e colchetes.`;
        } else if (mensagem.includes("position")) {
            const match = mensagem.match(/position (\d+)/);
            if (match) {
                const position = parseInt(match[1]);
                const linha = encontrarLinhaErro(position, linhas);
                return `Erro: Estrutura inválida detectada na linha ${linha}. Revise a sintaxe.`;
            }
        }
        return `Erro desconhecido: ${mensagem}`;
    }

    // Função para localizar a linha do erro com base na posição
    function encontrarLinhaErro(posicao, linhas) {
        let acumulador = 0;
        for (let i = 0; i < linhas.length; i++) {
            acumulador += linhas[i].length + 1; // +1 para considerar a quebra de linha
            if (acumulador >= posicao) {
                return i + 1; // Linha encontrada
            }
        }
        return "desconhecida";
    }
});