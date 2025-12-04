"use client";

import { Download } from "lucide-react";

interface ExportHtmlProps {
  settings: {
    dotSpacing: number;
    maxDotSize: number;
    hoverRadius: number;
    hoverScale: number;
    dotColor: string;
    backgroundColor: string;
    hoverColor: string;
    pattern: "vignette" | "uniform" | "image";
  };
  sourceImage?: HTMLImageElement | null;
}

export function ExportHtml({ settings, sourceImage }: ExportHtmlProps) {
  const generateHtml = () => {
    // Convert image to base64 if available
    let imageDataUrl = "";
    if (sourceImage) {
      const canvas = document.createElement("canvas");
      canvas.width = sourceImage.width;
      canvas.height = sourceImage.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(sourceImage, 0, 0);
        imageDataUrl = canvas.toDataURL("image/png");
      }
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Halftone Background</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body, html {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: ${settings.backgroundColor};
    }
    #halftone-canvas {
      display: block;
      width: 100%;
      height: 100%;
      cursor: none;
    }
  </style>
</head>
<body>
  <canvas id="halftone-canvas"></canvas>
  
  <script>
    // Settings
    const settings = {
      dotSpacing: ${settings.dotSpacing},
      maxDotSize: ${settings.maxDotSize},
      hoverRadius: ${settings.hoverRadius},
      hoverScale: ${settings.hoverScale},
      dotColor: "${settings.dotColor}",
      backgroundColor: "${settings.backgroundColor}",
      hoverColor: "${settings.hoverColor}",
      pattern: "${settings.pattern}"
    };

    ${imageDataUrl ? `
    // Load background image
    const backgroundImage = new Image();
    backgroundImage.src = "${imageDataUrl}";
    ` : ''}

    const canvas = document.getElementById('halftone-canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let dots = [];
    const mousePos = { x: -1000, y: -1000 };

    // Calculate luminosity
    function getLuminosity(r, g, b) {
      return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Initialize dots
    function initDots() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dots = [];

      let workingWidth = canvas.width;
      let workingHeight = canvas.height;
      let imageData = null;

      ${imageDataUrl ? `
      if (backgroundImage.complete && settings.pattern === 'image') {
        workingWidth = backgroundImage.width;
        workingHeight = backgroundImage.height;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = backgroundImage.width;
        tempCanvas.height = backgroundImage.height;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        tempCtx.drawImage(backgroundImage, 0, 0);
        imageData = tempCtx.getImageData(0, 0, backgroundImage.width, backgroundImage.height);
      }
      ` : ''}

      const cols = Math.ceil(workingWidth / settings.dotSpacing);
      const rows = Math.ceil(workingHeight / settings.dotSpacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * settings.dotSpacing + settings.dotSpacing / 2;
          const y = row * settings.dotSpacing + settings.dotSpacing / 2;

          let baseSize = settings.maxDotSize * 0.3;

          if (settings.pattern === 'image' && imageData) {
            let totalLuminosity = 0;
            let pixelCount = 0;
            const cellStartX = Math.floor(col * settings.dotSpacing);
            const cellStartY = Math.floor(row * settings.dotSpacing);

            for (let cy = 0; cy < settings.dotSpacing && cellStartY + cy < workingHeight; cy++) {
              for (let cx = 0; cx < settings.dotSpacing && cellStartX + cx < workingWidth; cx++) {
                const pixelIndex = ((cellStartY + cy) * workingWidth + (cellStartX + cx)) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                totalLuminosity += getLuminosity(r, g, b);
                pixelCount++;
              }
            }

            const avgLuminosity = totalLuminosity / pixelCount;
            const luminosity = avgLuminosity / 255;
            baseSize = settings.maxDotSize * (1 - luminosity);
          } else if (settings.pattern === 'vignette') {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distanceFromCenter = Math.sqrt(
              Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
            const maxDistance = Math.sqrt(
              Math.pow(centerX, 2) + Math.pow(centerY, 2)
            );
            const luminosity = 1 - (distanceFromCenter / maxDistance) * 0.6;
            baseSize = settings.maxDotSize * luminosity * 0.4;
          }

          dots.push({
            x,
            y,
            baseSize,
            currentSize: baseSize
          });
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center image in canvas if pattern is 'image'
      ctx.save();
      
      if (settings.pattern === 'image' && backgroundImage.complete) {
        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;
        const imageCenterX = backgroundImage.width / 2;
        const imageCenterY = backgroundImage.height / 2;
        const offsetX = canvasCenterX - imageCenterX;
        const offsetY = canvasCenterY - imageCenterY;
        
        ctx.translate(offsetX, offsetY);
      }

      dots.forEach(dot => {
        const dx = dot.x - mousePos.x;
        const dy = dot.y - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const influence = distance < settings.hoverRadius 
          ? Math.pow(1 - distance / settings.hoverRadius, 2)
          : 0;

        let targetSize = dot.baseSize;
        if (influence > 0) {
          targetSize = dot.baseSize + (settings.maxDotSize * settings.hoverScale - dot.baseSize) * influence;
        }

        dot.currentSize += (targetSize - dot.currentSize) * 0.15;

        if (dot.currentSize > 0.5) {
          if (influence > 0.01) {
            const blendFactor = influence;
            const dotR = parseInt(settings.dotColor.slice(1, 3), 16);
            const dotG = parseInt(settings.dotColor.slice(3, 5), 16);
            const dotB = parseInt(settings.dotColor.slice(5, 7), 16);
            const hoverR = parseInt(settings.hoverColor.slice(1, 3), 16);
            const hoverG = parseInt(settings.hoverColor.slice(3, 5), 16);
            const hoverB = parseInt(settings.hoverColor.slice(5, 7), 16);
            const blendedR = Math.round(dotR + (hoverR - dotR) * blendFactor);
            const blendedG = Math.round(dotG + (hoverG - dotG) * blendFactor);
            const blendedB = Math.round(dotB + (hoverB - dotB) * blendFactor);
            ctx.fillStyle = \`rgb(\${blendedR}, \${blendedG}, \${blendedB})\`;
          } else {
            ctx.fillStyle = settings.dotColor;
          }
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();
      requestAnimationFrame(animate);
    }

    // Mouse tracking
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    });

    // Resize handler
    window.addEventListener('resize', initDots);

    // Initialize
    ${imageDataUrl ? `
    backgroundImage.onload = () => {
      initDots();
      animate();
    };
    ` : `
    initDots();
    animate();
    `}
  </script>
</body>
</html>`;
  };

  const handleExport = () => {
    const html = generateHtml();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "halftone-interactive.html";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-all hover:border-gray-400 hover:bg-gray-50"
    >
      <Download className="h-4 w-4" />
      Export HTML
    </button>
  );
}

