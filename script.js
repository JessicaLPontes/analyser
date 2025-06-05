document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    // Alternar Tema
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
        let errosDetectados = [];
        let jsonValido = true;

        try {
            JSON.parse(jsonTextarea.value);
            jsonOutput.textContent = "O JSON está válido!";
            jsonOutput.classList.remove("error");
        } catch (e) {
            jsonValido = false;
            const { linha, coluna, descricao } = traduzirErroJSON(e.message, lines);
            errosDetectados.push({ linha, coluna, descricao });
        }

        // Destacar erros no JSON e exibir mensagens
        if (!jsonValido) {
            jsonOutput.innerHTML = gerarSaidaErros(errosDetectados, lines);
        }
    });

    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonOutput.innerHTML = "";
    });

    // Função para traduzir erros do JSON
    function traduzirErroJSON(mensagem, linhas) {
        const match = mensagem.match(/Unexpected token (\S+) in JSON at position (\d+)/);
        const descricao = match
            ? `Token inesperado "${match[1]}". Verifique a sintaxe.`
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
            acumulador += linhas[i].length + 1;
            if (acumulador >= posicao) {
                return i + 1;
            }
        }
        return "desconhecida";
    }

    // Função para localizar a coluna do erro
    function encontrarColunaErro(posicao, linhas) {
        let acumulador = 0;
        for (let i = 0; i < linhas.length; i++) {
            const linhaLength = linhas[i].length + 1;
            if (acumulador + linhaLength > posicao) {
                return posicao - acumulador + 1;
            }
            acumulador += linhaLength;
        }
        return "desconhecida";
    }

    // Função para gerar saída formatada com erros destacados
    function gerarSaidaErros(erros, linhas) {
        const saida = erros.map(erro => `
            <div class="error">
                <strong>Erro encontrado:</strong> ${erro.descricao}<br>
                <strong>Linha:</strong> ${erro.linha}, <strong>Coluna:</strong> ${erro.coluna}
            </div>
        `);

        const linhasDestacadas = linhas.map((linha, index) => {
            const erro = erros.find(err => err.linha === index + 1);
            if (erro) {
                return linha.slice(0, erro.coluna - 1) +
                    `<span class="error-highlight">${linha[erro.coluna - 1]}</span>` +
                    linha.slice(erro.coluna);
            }
            return linha;
        });

        return saida.join("") + `<pre>${linhasDestacadas.join("\n")}</pre>`;
    }
});