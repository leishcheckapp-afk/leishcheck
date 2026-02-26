import jsPDF from 'jspdf';
import { RiskResult, QuestionAnswer } from '@/types/leishcheck';
import { questions } from '@/data/questions';

const MARGIN = 18;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;

const COLORS = {
  low: {
    primary: [46, 125, 50],
    secondary: [76, 175, 80],
    badgeBg: [237, 247, 237],
    badgeText: [27, 94, 32],
    light: [200, 230, 201],
  },
  medium: {
    primary: [245, 166, 35],
    secondary: [255, 193, 7],
    badgeBg: [255, 248, 225],
    badgeText: [230, 81, 0],
    light: [255, 236, 179],
  },
  high: {
    primary: [211, 47, 47],
    secondary: [244, 67, 54],
    badgeBg: [255, 235, 238],
    badgeText: [183, 28, 28],
    light: [255, 205, 210],
  },
};

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const h = doc.internal.pageSize.getHeight();
  // Thin accent line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, h - 16, PAGE_W - MARGIN, h - 16);
  doc.setFontSize(7);
  doc.setTextColor(160);
  doc.setFont('helvetica', 'normal');
  doc.text('LeishCheck — Triagem Clínica Digital', MARGIN, h - 10);
  doc.text(`${pageNum}/${totalPages}`, PAGE_W - MARGIN, h - 10, { align: 'right' });
}

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > doc.internal.pageSize.getHeight() - 22) {
    doc.addPage();
    return 22;
  }
  return y;
}

export function generateResultPDF(
  result: RiskResult,
  answers: QuestionAnswer[],
  userData?: { age?: number; gender?: string; city?: string; state?: string }
) {
  const doc = new jsPDF();
  const w = PAGE_W;
  const colors = COLORS[result.level] || COLORS.low;
  let y = 0;

  // ─── HEADER ───
  // Gradient simulation with overlapping rectangles
  const headerH = 44;
  for (let i = 0; i < 12; i++) {
    const ratio = i / 11;
    const r = Math.round(colors.primary[0] * (1 - ratio) + colors.secondary[0] * ratio);
    const g = Math.round(colors.primary[1] * (1 - ratio) + colors.secondary[1] * ratio);
    const b = Math.round(colors.primary[2] * (1 - ratio) + colors.secondary[2] * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(0, (headerH / 12) * i, w, headerH / 12 + 1, 'F');
  }

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('LEISHCHECK', MARGIN, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório de Triagem Clínica', MARGIN, 26);
  doc.setFontSize(8);
  const dateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  doc.text(dateStr, MARGIN, 34);
  // Version badge
  doc.setFontSize(7);
  doc.text('v1.0', w - MARGIN, 34, { align: 'right' });

  y = headerH + 14;

  // ─── RISK RESULT CARD ───
  const cardH = 42;
  // Card shadow
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(MARGIN + 1, y + 1, CONTENT_W, cardH, 6, 6, 'F');
  // Card body
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(MARGIN, y, CONTENT_W, cardH, 6, 6, 'F');
  // Left accent bar
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.roundedRect(MARGIN, y, 4, cardH, 2, 2, 'F');

  // Risk circle
  const circleX = MARGIN + 28;
  const circleY = y + cardH / 2;
  const circleR = 14;
  // Circle bg
  doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
  doc.circle(circleX, circleY, circleR, 'F');
  // Circle border
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(2);
  doc.circle(circleX, circleY, circleR, 'S');
  // Percentage
  doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.percentage}%`, circleX, circleY + 1, { align: 'center' });

  // Title + description
  const textX = circleX + circleR + 12;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
  doc.text(result.title, textX, y + 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const descLines = doc.splitTextToSize(result.description, CONTENT_W - (textX - MARGIN) - 8);
  doc.text(descLines, textX, y + 22);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const orientLines = doc.splitTextToSize(result.orientation, CONTENT_W - (textX - MARGIN) - 8);
  doc.text(orientLines, textX, y + 30);

  y += cardH + 12;

  // ─── PATIENT DATA ───
  if (userData && (userData.age || userData.gender || userData.city)) {
    y = checkPage(doc, y, 28);
    // Section header
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(MARGIN, y, CONTENT_W, 7, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('DADOS DO PACIENTE', MARGIN + 6, y + 5);
    y += 12;

    // Data pills
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    let pillX = MARGIN;
    const pillData: string[] = [];
    if (userData.age) pillData.push(`Idade: ${userData.age}`);
    if (userData.gender) pillData.push(`Gênero: ${userData.gender}`);
    if (userData.city || userData.state) pillData.push(`Local: ${[userData.city, userData.state].filter(Boolean).join(' — ')}`);

    pillData.forEach((pill) => {
      const pillW = doc.getTextWidth(pill) + 10;
      doc.setFillColor(colors.badgeBg[0], colors.badgeBg[1], colors.badgeBg[2]);
      doc.roundedRect(pillX, y - 3.5, pillW, 7, 3, 3, 'F');
      doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
      doc.text(pill, pillX + 5, y + 1);
      pillX += pillW + 4;
    });

    y += 14;
  }

  // ─── QUESTIONNAIRE TABLE ───
  y = checkPage(doc, y, 20);
  // Section header
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.roundedRect(MARGIN, y, CONTENT_W, 7, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('RESPOSTAS DO QUESTIONÁRIO', MARGIN + 6, y + 5);
  y += 12;

  // Table header
  doc.setFillColor(248, 248, 248);
  doc.rect(MARGIN, y - 4, CONTENT_W, 8, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Nº', MARGIN + 3, y);
  doc.text('PERGUNTA', MARGIN + 14, y);
  doc.text('RESPOSTA', w - MARGIN - 18, y);
  y += 8;

  // Table rows
  questions.forEach((q, i) => {
    y = checkPage(doc, y, 9);

    // Zebra
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 252);
      doc.rect(MARGIN, y - 4, CONTENT_W, 8, 'F');
    }

    // Row separator
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(0.15);
    doc.line(MARGIN, y + 4, w - MARGIN, y + 4);

    // Number circle
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.circle(MARGIN + 6, y - 0.5, 3.2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.badgeText[0], colors.badgeText[1], colors.badgeText[2]);
    doc.text(`${i + 1}`, MARGIN + 6, y + 0.5, { align: 'center' });

    // Question text
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(q.text, MARGIN + 14, y, { maxWidth: CONTENT_W - 46 });

    // Answer pill
    const answer = answers.find((a) => a.questionIndex === i);
    if (answer) {
      const isYes = answer.answer;
      const label = isYes ? 'SIM' : 'NÃO';
      const pillW = 14;
      const pillX = w - MARGIN - pillW - 2;

      if (isYes) {
        doc.setFillColor(237, 247, 237);
        doc.setTextColor(27, 94, 32);
      } else {
        doc.setFillColor(255, 235, 238);
        doc.setTextColor(183, 28, 28);
      }
      doc.roundedRect(pillX, y - 3, pillW, 6, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(label, pillX + pillW / 2, y + 0.8, { align: 'center' });
    } else {
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(8);
      doc.text('—', w - MARGIN - 10, y);
    }

    y += 8;
  });

  y += 6;

  // ─── DISCLAIMER ───
  y = checkPage(doc, y, 28);
  // Warning box
  doc.setFillColor(255, 248, 225);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 4, 4, 'F');
  doc.setDrawColor(245, 166, 35);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, 22, 4, 4, 'S');

  // Warning icon area
  doc.setFillColor(245, 166, 35);
  doc.circle(MARGIN + 10, y + 7, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('!', MARGIN + 10, y + 8.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 100, 0);
  doc.text('AVISO LEGAL', MARGIN + 18, y + 7);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 100, 20);
  doc.text(
    'Este relatório é gerado por uma ferramenta de triagem e NÃO constitui diagnóstico médico.',
    MARGIN + 18, y + 13
  );
  doc.text(
    'Procure uma Unidade Básica de Saúde (UBS) para avaliação profissional. Tratamento gratuito pelo SUS.',
    MARGIN + 18, y + 18
  );

  // ─── FOOTER ON ALL PAGES ───
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
  }

  doc.save(`LeishCheck_Resultado_${new Date().toISOString().slice(0, 10)}.pdf`);
}
