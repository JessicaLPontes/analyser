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
            const { linha, coluna, descricao } = traduzirErroJSON(e.message, lines);
            jsonOutput.innerHTML = `
                <div class="error">
                    <strong>Erro encontrado:</strong> ${descricao}<br>
                    <strong>Linha:</strong> ${linha}, <strong>Coluna:</strong> ${coluna}
                </div>
                <pre>${destacarErroJSON(lines, linha, coluna)}</pre>
            `;
        }
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonOutput.innerHTML = "";
    });

    // Função para traduzir e detalhar o erro do JSON
    function traduzirErroJSON(mensagem, linhas) {
        const match = mensagem.match(/Unexpected token (\S+) in JSON at position (\d+)/);
        const descricao = match
            ? `Token inesperado "${match[1]}". Verifique a sintaxe na linha correspondente.`
            : `Erro inesperado. Certifique-se de que o JSON está bem formatado.`;

        const posicao = match ? parseInt(match[2], 10) : 0;
        const linha = encontrarLinhaErro(posicao, linhas);
        const coluna = encontrarColunaErro(posicao, linhas);

        return { linha, coluna, descricao };
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

    // Função para localizar a coluna do erro
    function encontrarColunaErro(posicao, linhas) {
        let acumulador = 0;
        for (let i = 0; i < linhas.length; i++) {
            const linhaLength = linhas[i].length + 1; // +1 para quebra de linha
            if (acumulador + linhaLength > posicao) {
                return posicao - acumulador + 1;
            }
            acumulador += linhaLength;
        }
        return "desconhecida";
    }

    // Função para destacar a linha do erro
    function destacarErroJSON(linhas, linhaErro, colunaErro) {
        return linhas
            .map((linha, index) => {
                if (index + 1 === linhaErro) {
                    return linha.slice(0, colunaErro - 1) +
                        `<span class="error-highlight">${linha[colunaErro - 1]}</span>` +
                        linha.slice(colunaErro);
                }
                return linha;
            })
            .join("\n");
    }
});