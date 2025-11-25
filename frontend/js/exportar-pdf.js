document.getElementById("btn-exportar").addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;

    const COR_PRIMARIA = [40, 80, 160]; 
    const COR_SECUNDARIA = [230, 230, 230]; 
    const MARGEM_H = 15; 
    const MARGEM_V_TOPO = 35; 
    const ESPACAMENTO = 7;
    const LINE_HEIGHT = 5; 

    const mapElement = document.querySelector("#map");

    const canvas = await html2canvas(mapElement, {
        useCORS: true,
        logging: false,
        scale: 3, 
        dpi: 300 
    });

    const mapImage = canvas.toDataURL("image/jpeg", 1.0); 
    const pontosHtml = document.querySelector("#roteiro-container").innerText;
    const destino = document.querySelector("#titulo-mapa").innerText;
    const periodo = document.querySelector("#data-viagem").innerText;
    const orcamento = document.querySelector("#orcamento-viagem").innerText;
    const pais = document.querySelector("#pais-localidade").innerText.trim();

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentWidth = pageWidth - 2 * MARGEM_H;

    pdf.setFillColor(...COR_PRIMARIA);
    pdf.rect(0, 0, pageWidth, 20, "F"); 
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20); 
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Roteiro: ${destino}`, MARGEM_H, 13);
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Seu guia de viagem personalizado", pageWidth - MARGEM_H, 13, { align: "right" });

    let currentY = MARGEM_V_TOPO;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Detalhes da Viagem", MARGEM_H, currentY);

    currentY += 3;
    pdf.setDrawColor(...COR_PRIMARIA);
    pdf.setLineWidth(0.5);
    pdf.line(MARGEM_H, currentY, pageWidth - MARGEM_H, currentY);

    currentY += 5; 

    const colWidth = contentWidth / 2;
    const col1X = MARGEM_H;
    const col2X = MARGEM_H + colWidth;
    
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    const drawInfoBlock = (label, value, x, y) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(`${label}:`, x, y);
        pdf.setFont("helvetica", "normal");
        const labelWidth = pdf.getStringUnitWidth(`${label}:`) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        pdf.text(value, x + labelWidth + 2, y);
    }

    drawInfoBlock("País", pais, col1X, currentY);
    drawInfoBlock("Orçamento", orcamento, col1X, currentY + ESPACAMENTO);

    drawInfoBlock("Destino", destino, col2X, currentY);
    drawInfoBlock("Período", periodo, col2X, currentY + ESPACAMENTO);

    currentY += ESPACAMENTO * 3; 

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

    pdf.setFillColor(...COR_SECUNDARIA);
    pdf.rect(MARGEM_H, currentY, mapWidth, mapHeight, "F"); 
    
    pdf.addImage(mapImage, "JPEG", MARGEM_H + 2, currentY + 2, mapWidth - 4, mapHeight - 4); 

    currentY += mapHeight + 10;
    
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

    const regex = /(.+?)\s*\n\(([-0-9., ]+?)\)\s*\n(.+?)(?=\n[A-Z]|\Z)/gs;
    let match;
    
    while ((match = regex.exec(pontosHtml)) !== null) {
        const [fullMatch, titulo, coordenada, descricao] = match;

        if (currentY2 > pageHeight - 30) { 
            currentY2 = startDetailPage();
        }

        pdf.setTextColor(...COR_PRIMARIA);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(titulo.trim(), MARGEM_H, currentY2);
        currentY2 += LINE_HEIGHT;

        pdf.setTextColor(100, 100, 100);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(9);
        pdf.text(`Coordenadas: ${coordenada.trim()}`, MARGEM_H, currentY2);
        currentY2 += LINE_HEIGHT;

        pdf.setTextColor(0, 0, 0);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        
        const linhasDescricao = pdf.splitTextToSize(descricao.trim(), contentWidth);
        pdf.text(linhasDescricao, MARGEM_H, currentY2);

        currentY2 += linhasDescricao.length * LINE_HEIGHT + 2; 
        currentY2 += ESPACAMENTO; 

    }

    const totalPages = pdf.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - MARGEM_H, pdf.internal.pageSize.getHeight() - 5, { align: "right" });
    }
    
    pdf.save(`Roteiro-${destino}.pdf`);
});