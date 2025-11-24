document.getElementById("btn-exportar").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;

    // --- Configurações de Estilo ---
    const COR_PRIMARIA = [40, 80, 160]; // Azul Escuro
    const COR_SECUNDARIA = [230, 230, 230]; // Cinza Claro para BG
    const MARGEM_H = 15; // Margem horizontal
    const MARGEM_V_TOPO = 35; // Posição vertical inicial após o cabeçalho
    const ESPACAMENTO = 7;
    const LINE_HEIGHT = 5; // Altura base da linha para o corpo do texto

    // ---------- CAPTURAR MAPA ----------
    const mapElement = document.querySelector("#map");

    // --- MELHORIA AQUI: AUMENTANDO O SCALE PARA MELHOR QUALIDADE ---
    const canvas = await html2canvas(mapElement, {
        useCORS: true,
        logging: false,
        scale: 3, // Aumentado de 2 para 3 ou 4. Experimente 4 se 3 ainda não for suficiente.
        // Adicionando um atributo para renderizar em DPI mais alto (experimental, nem sempre suportado por html2canvas)
        dpi: 300 // Tenta renderizar com 300 DPI
    });

    const mapImage = canvas.toDataURL("image/jpeg", 1.0); // Qualidade JPEG em 1.0 (máxima)

    // ---------- CAPTURAR TEXTOS DA PÁGINA ----------
    const pontosHtml = document.querySelector("#roteiro-container").innerText;
    const destino = document.querySelector("#titulo-mapa").innerText;
    const periodo = document.querySelector("#data-viagem").innerText;
    const orcamento = document.querySelector("#orcamento-viagem").innerText;
    const pais = document.querySelector("#pais-localidade").innerText.trim();

    // ---------- NOVO PDF PROFISSIONAL ----------
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * MARGEM_H;


    // ------------------------------------------
    //             PÁGINA 1 - RESUMO
    // ------------------------------------------

    // --- CABEÇALHO ---
    pdf.setFillColor(...COR_PRIMARIA);
    pdf.rect(0, 0, pageWidth, 20, "F"); 
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20); 
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Roteiro: ${destino}`, MARGEM_H, 13);
    
    // Subtítulo do cabeçalho
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Seu guia de viagem personalizado", pageWidth - MARGEM_H, 13, { align: "right" });


    // ------------------- BLOCO 1: INFORMAÇÕES GERAIS (2 COLUNAS) -------------------
    let currentY = MARGEM_V_TOPO;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detalhes da Viagem", MARGEM_H, currentY);

    // Linha divisória fina
    currentY += 3;
    pdf.setDrawColor(...COR_PRIMARIA);
    pdf.setLineWidth(0.5);
    pdf.line(MARGEM_H, currentY, pageWidth - MARGEM_H, currentY);

    currentY += 5; // Pula para o conteúdo

    // Configurações de coluna
    const colWidth = contentWidth / 2;
    const col1X = MARGEM_H;
    const col2X = MARGEM_H + colWidth;
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    // Função auxiliar para bloco de informação
    const drawInfoBlock = (label, value, x, y) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(`${label}:`, x, y);
        pdf.setFont("helvetica", "normal");
        const labelWidth = pdf.getStringUnitWidth(`${label}:`) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        pdf.text(value, x + labelWidth + 2, y);
    }

    // Coluna 1
    drawInfoBlock("País", pais, col1X, currentY);
    drawInfoBlock("Orçamento", orcamento, col1X, currentY + ESPACAMENTO);

    // Coluna 2
    drawInfoBlock("Destino", destino, col2X, currentY);
    drawInfoBlock("Período", periodo, col2X, currentY + ESPACAMENTO);

    currentY += ESPACAMENTO * 3; // Espaçamento após o bloco de info


    // ------------------- BLOCO 2: MAPA -------------------
    const mapHeight = 110;
    const mapWidth = contentWidth;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Mapa do Roteiro", MARGEM_H, currentY);

    currentY += 3;
    pdf.setDrawColor(...COR_PRIMARIA);
    pdf.setLineWidth(0.5);
    pdf.line(MARGEM_H, currentY, pageWidth - MARGEM_H, currentY);
    
    currentY += 5;

    // Adiciona o background cinza claro para a moldura
    pdf.setFillColor(...COR_SECUNDARIA);
    pdf.rect(MARGEM_H, currentY, mapWidth, mapHeight, "F"); 
    
    // --- MELHORIA AQUI: PASSANDO LARGURA E ALTURA DA IMAGEM ---
    // Em vez de subtrair 4 dos valores, vamos garantir que a imagem preencha a moldura
    // e o jsPDF a redimensione com base na imagem de alta qualidade.
    pdf.addImage(mapImage, "JPEG", MARGEM_H + 2, currentY + 2, mapWidth - 4, mapHeight - 4); 
    // Outra opção, se a imagem original for quadrada, seria:
    // pdf.addImage(mapImage, "JPEG", MARGEM_H + 2, currentY + 2, mapWidth - 4, (canvas.height * (mapWidth - 4)) / canvas.width);


    currentY += mapHeight + 10;
    
    // ------------------------------------------
    //             PÁGINA 2 E SEGUINTES - ROTEIRO DETALHADO
    // ------------------------------------------
    
    // Função para iniciar a seção na página 2 ou em uma nova página
    const startDetailPage = () => {
        pdf.addPage();
        let y = MARGEM_H; 
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(...COR_PRIMARIA);
        pdf.text("Pontos de Interesse Detalhados", MARGEM_H, y);

        y += 5;
        pdf.setDrawColor(...COR_PRIMARIA);
        pdf.setLineWidth(1); 
        pdf.line(MARGEM_H, y, pageWidth - MARGEM_H, y);
        
        return y + 10;
    }

    let currentY2 = startDetailPage();

    // 1. Regex para extrair blocos de ponto de interesse:
    const regex = /(.+?)\s*\n\(([-0-9., ]+?)\)\s*\n(.+?)(?=\n[A-Z]|\Z)/gs;
    let match;
    
    // 2. Itera sobre cada ponto de interesse encontrado:
    while ((match = regex.exec(pontosHtml)) !== null) {
        const [fullMatch, titulo, coordenada, descricao] = match;

        // --- Verificação de Quebra de Página (Pelo menos 3 linhas de espaço) ---
        if (currentY2 > pageHeight - 30) { 
            currentY2 = startDetailPage();
        }

        // --- TÍTULO DO PONTO (Negrito, Fonte 12, Cor Primária) ---
        pdf.setTextColor(...COR_PRIMARIA);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(titulo.trim(), MARGEM_H, currentY2);
        currentY2 += LINE_HEIGHT;

        // --- COORDENADA (Itálico, Cinza Claro) ---
        pdf.setTextColor(100, 100, 100);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(9);
        pdf.text(`Coordenadas: ${coordenada.trim()}`, MARGEM_H, currentY2);
        currentY2 += LINE_HEIGHT;

        // --- DESCRIÇÃO (Normal, Fonte 11, Preto) ---
        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        
        const linhasDescricao = pdf.splitTextToSize(descricao.trim(), contentWidth);
        pdf.text(linhasDescricao, MARGEM_H, currentY2);

        currentY2 += linhasDescricao.length * LINE_HEIGHT + 2; 
        currentY2 += ESPACAMENTO; 

    }

    // ---------- RODAPÉ (ADICIONADO EM TODAS AS PÁGINAS) ----------
    const totalPages = pdf.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - MARGEM_H, pdf.internal.pageSize.getHeight() - 5, { align: "right" });
    }
    
    // ---------- SALVAR ----------
    pdf.save(`Roteiro-${destino}.pdf`);
});