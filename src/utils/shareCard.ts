export function downloadShareableCard(options: {
  arabicText: string;
  translation: string;
  reference: string;
  categoryLabel: string;
  filename: string;
  brandFooter?: string;
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Deep emerald background gradient
  const grad = ctx.createLinearGradient(0, 0, 1200, 900);
  grad.addColorStop(0, '#093a2b');
  grad.addColorStop(1, '#051f17');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 900);

  // Subtle gold inner border
  ctx.strokeStyle = '#d9ac4c';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, 1104, 804);
  ctx.strokeStyle = 'rgba(217, 172, 76, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(64, 64, 1072, 772);

  // Category header
  ctx.fillStyle = '#d9ac4c';
  ctx.font = '600 24px "Plus Jakarta Sans", "Noto Naskh Arabic", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(options.categoryLabel, 600, 125);

  const wrapLines = (text: string, maxWidth: number, font: string): string[] => {
    ctx.font = font;
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 8);
  };

  // Arabic text
  const arFont = '700 38px "Amiri", "Noto Naskh Arabic", serif';
  const arLines = wrapLines(options.arabicText, 960, arFont);
  ctx.fillStyle = '#f8f5ec';
  ctx.font = arFont;
  let y = 240;
  for (const line of arLines) {
    ctx.fillText(line, 600, y);
    y += 62;
  }

  // Divider line
  y += 20;
  ctx.strokeStyle = 'rgba(217, 172, 76, 0.5)';
  ctx.beginPath();
  ctx.moveTo(420, y);
  ctx.lineTo(780, y);
  ctx.stroke();

  // Translation
  const trFont = '400 26px "Plus Jakarta Sans", "Noto Naskh Arabic", sans-serif';
  const trLines = wrapLines(options.translation, 940, trFont);
  ctx.fillStyle = '#d4dfd9';
  ctx.font = trFont;
  y += 56;
  for (const line of trLines) {
    ctx.fillText(line, 600, y);
    y += 42;
  }

  // Reference & brand footer
  ctx.fillStyle = '#d9ac4c';
  ctx.font = '600 22px "Plus Jakarta Sans", "Noto Naskh Arabic", sans-serif';
  ctx.fillText(options.reference, 600, 765);

  ctx.fillStyle = 'rgba(248, 245, 236, 0.65)';
  ctx.font = '500 18px "Plus Jakarta Sans", "Noto Naskh Arabic", sans-serif';
  ctx.fillText(options.brandFooter || 'Eyad Al-Muslim', 600, 815);

  const link = document.createElement('a');
  link.download = `${options.filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
