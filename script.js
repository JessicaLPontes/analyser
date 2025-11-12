document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const themeToggle = document.getElementById("theme-toggle");

    // Toggle de tema
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        themeToggle.textContent = body.classList.contains("dark-mode") ? "Tema Claro" : "Tema Escuro";
    });

    // ===== ANALISADOR DE JSON =====
    const jsonTextarea = document.getElementById("json-textarea");
    const jsonErrors = document.getElementById("json-errors");
    const jsonCorrected = document.getElementById("json-corrected");
    const copyButton = document.getElementById("copy-json-button");

    // Carregar arquivo JSON
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

    // Validar JSON
    document.getElementById("validate-json-button").addEventListener("click", () => {
        jsonErrors.innerHTML = "";
        jsonCorrected.textContent = "";

        const originalText = jsonTextarea.value.trim();

        // Validação de input vazio
        if (!originalText) {
            jsonErrors.innerHTML = `
                <div id="error-container">
                    <strong>⚠️ Atenção:</strong> O campo está vazio. Por favor, insira um JSON para validar.
                </div>
            `;
            return;
        }

        const erros = analisarJSON(originalText);
        const jsonCorrigido = corrigirJSON(originalText);

        if (erros.length > 0) {
            jsonErrors.innerHTML = `
                <div id="error-container">
                    <strong>O JSON apresenta os seguintes erros:</strong>
                    <ul>${erros.map(err => `<li>${err}</li>`).join("")}</ul>
                </div>
            `;
        } else {
            jsonErrors.innerHTML = `
                <div style="margin-top: 20px; padding: 10px; border: 1px solid #c3e6cb; background-color: #d4edda; color: #155724; border-radius: 5px;">
                    <strong>✓ JSON válido!</strong>
                </div>
            `;
        }

        jsonCorrected.textContent = jsonCorrigido;
    });

    // Copiar JSON corrigido
    copyButton.addEventListener("click", () => {
        const texto = jsonCorrected.textContent;
        if (!texto || texto.startsWith("Não foi possível")) {
            alert("Não há JSON válido para copiar.");
            return;
        }
        navigator.clipboard.writeText(texto).then(() => {
            alert("JSON corrigido copiado para a área de transferência!");
        }).catch(() => {
            alert("Erro ao copiar. Tente novamente.");
        });
    });

    // Limpar campos do JSON
    document.getElementById("clear-json-button").addEventListener("click", () => {
        jsonTextarea.value = "";
        jsonErrors.innerHTML = "";
        jsonCorrected.textContent = "";
        document.getElementById("json-input").value = "";
    });

    // Função para analisar JSON
    function analisarJSON(textoJSON) {
        const erros = [];
        
        // Verificar chaves sem aspas (corrigido para evitar falso positivo)
        const linhas = textoJSON.split("\n");
        linhas.forEach((linha, index) => {
            // Criar nova regex para cada linha para evitar problema com flag global
            const regexChaves = /([a-zA-Z_$][\w$]*)\s*:/;
            if (regexChaves.test(linha)) {
                erros.push(`Linha ${index + 1}: Chave sem aspas detectada.`);
            }
            
            // Verificar vírgulas desnecessárias
            const regexVirgulas = /,(\s*[}\]])/;
            if (regexVirgulas.test(linha)) {
                erros.push(`Linha ${index + 1}: Vírgula desnecessária antes de fechar objeto/array.`);
            }
        });

        // Tentar fazer parse do JSON
        try {
            JSON.parse(textoJSON);
        } catch (e) {
            erros.push(`Erro de sintaxe JSON: ${e.message}`);
        }

        return erros;
    }

    // Função para corrigir JSON
    function corrigirJSON(textoJSON) {
        try {
            const corrigido = textoJSON
                .replace(/([a-zA-Z_$][\w$]*)\s*:/g, '"$1":')  // Adiciona aspas nas chaves
                .replace(/,(\s*[}\]])/g, "$1");  // Remove vírgulas desnecessárias

            const parsed = JSON.parse(corrigido);
            return JSON.stringify(parsed, null, 2);  // Formata com indentação
        } catch {
            return "Não foi possível corrigir automaticamente o JSON. Verifique a estrutura manualmente.";
        }
    }

    // ===== ANALISADOR DE LOGS =====
    const logsTextarea = document.getElementById("logs-textarea");
    const logsOutput = document.getElementById("logs-output");

    // Carregar arquivo de logs
    document.getElementById("logs-input").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                logsTextarea.value = reader.result;
            };
            reader.readAsText(file);
        }
    });

    // Analisar logs
    document.getElementById("analyze-logs-button").addEventListener("click", () => {
        logsOutput.textContent = "";

        const logsText = logsTextarea.value.trim();

        if (!logsText) {
            logsOutput.innerHTML = `
                <div style="padding: 10px; border: 1px solid #f5c6cb; background-color: #ffecec; color: #721c24; border-radius: 5px;">
                    <strong>⚠️ Atenção:</strong> O campo está vazio. Por favor, insira logs para analisar.
                </div>
            `;
            return;
        }

        const analise = analisarLogs(logsText);
        logsOutput.innerHTML = analise;
    });

    // Limpar logs
    document.getElementById("clear-logs-button").addEventListener("click", () => {
        logsTextarea.value = "";
        logsOutput.textContent = "";
        document.getElementById("logs-input").value = "";
    });

    // Função para analisar logs
    function analisarLogs(textoLogs) {
        const linhas = textoLogs.split("\n");
        const totalLinhas = linhas.length;
        
        let errors = 0;
        let warnings = 0;
        let info = 0;
        let debug = 0;
        
        const linhasErro = [];
        const linhasWarning = [];

        linhas.forEach((linha, index) => {
            const linhaLower = linha.toLowerCase();
            
            if (linhaLower.includes("error") || linhaLower.includes("erro")) {
                errors++;
                linhasErro.push(`Linha ${index + 1}: ${linha}`);
            } else if (linhaLower.includes("warn") || linhaLower.includes("warning") || linhaLower.includes("aviso")) {
                warnings++;
                linhasWarning.push(`Linha ${index + 1}: ${linha}`);
            } else if (linhaLower.includes("info")) {
                info++;
            } else if (linhaLower.includes("debug")) {
                debug++;
            }
        });

        let resultado = `<div style="padding: 10px;">`;
        resultado += `<h3>Resumo da Análise</h3>`;
        resultado += `<p><strong>Total de linhas:</strong> ${totalLinhas}</p>`;
        resultado += `<p><strong>Erros:</strong> ${errors}</p>`;
        resultado += `<p><strong>Avisos:</strong> ${warnings}</p>`;
        resultado += `<p><strong>Info:</strong> ${info}</p>`;
        resultado += `<p><strong>Debug:</strong> ${debug}</p>`;

        if (linhasErro.length > 0) {
            resultado += `<h4 style="color: #b30000;">Linhas com Erros:</h4>`;
            resultado += `<ul style="color: #b30000;">`;
            linhasErro.forEach(linha => {
                resultado += `<li>${linha}</li>`;
            });
            resultado += `</ul>`;
        }

        if (linhasWarning.length > 0) {
            resultado += `<h4 style="color: #856404;">Linhas com Avisos:</h4>`;
            resultado += `<ul style="color: #856404;">`;
            linhasWarning.forEach(linha => {
                resultado += `<li>${linha}</li>`;
            });
            resultado += `</ul>`;
        }

        if (errors === 0 && warnings === 0) {
            resultado += `<p style="color: #155724; font-weight: bold;">✓ Nenhum erro ou aviso detectado nos logs!</p>`;
        }

        resultado += `</div>`;
        return resultado;
    }
});
