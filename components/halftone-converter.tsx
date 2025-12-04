"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, RefreshCw } from "lucide-react";

interface HalftoneSettings {
  dotSize: number;
  spacing: number;
  contrast: number;
  brightness: number;
  dotColor: string;
  backgroundColor: string;
  invert: boolean;
  shape: "circle" | "square" | "diamond";
  resolution: "standard" | "high" | "ultra";
}

const defaultSettings: HalftoneSettings = {
  dotSize: 6,
  spacing: 8,
  contrast: 1.2,
  brightness: 0,
  dotColor: "#000000",
  backgroundColor: "#ffffff",
  invert: false,
  shape: "circle",
  resolution: "high",
};

export function HalftoneConverter() {
  const [settings, setSettings] = useState<HalftoneSettings>(defaultSettings);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent hydration mismatch with random values
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate luminosity from RGB
  const getLuminosity = (r: number, g: number, b: number): number => {
    // Using perceived luminosity formula
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  // Apply contrast and brightness adjustments
  const adjustLuminosity = (lum: number, contrast: number, brightness: number): number => {
    // Apply brightness
    let adjusted = lum + brightness * 255;
    // Apply contrast
    adjusted = ((adjusted - 128) * contrast) + 128;
    // Clamp to valid range
    return Math.max(0, Math.min(255, adjusted));
  };

  // Process image and create halftone pattern
  const processImage = useCallback(() => {
    if (!originalImage || !canvasRef.current) return;
    
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { 
      willReadFrequently: true,
      alpha: true,
      desynchronized: false,
    });
    if (!ctx) return;

    // Set canvas dimensions based on resolution quality
    const maxSizes = {
      standard: 1600,
      high: 4400,
      ultra: 6000,
    };
    const maxSize = maxSizes[settings.resolution];
    
    let width = originalImage.width;
    let height = originalImage.height;
    
    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw original image to get pixel data
    ctx.drawImage(originalImage, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    // Clear canvas and fill with background color
    ctx.fillStyle = settings.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const { dotSize, spacing, contrast, brightness, dotColor, invert, shape } = settings;
    const cellSize = spacing;
    const maxDotRadius = dotSize / 2;

    // Enable anti-aliasing for smooth dots
    ctx.fillStyle = dotColor;
    ctx.strokeStyle = dotColor;
    ctx.lineWidth = 0;

    // Process each cell
    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        // Calculate average luminosity for this cell
        let totalLuminosity = 0;
        let pixelCount = 0;

        for (let cy = 0; cy < cellSize && y + cy < height; cy++) {
          for (let cx = 0; cx < cellSize && x + cx < width; cx++) {
            const pixelIndex = ((y + cy) * width + (x + cx)) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            totalLuminosity += getLuminosity(r, g, b);
            pixelCount++;
          }
        }

        const avgLuminosity = totalLuminosity / pixelCount;
        const adjustedLuminosity = adjustLuminosity(avgLuminosity, contrast, brightness);
        
        // Calculate dot size based on luminosity
        // Darker areas = larger dots (unless inverted)
        let normalizedLuminosity = adjustedLuminosity / 255;
        if (invert) {
          normalizedLuminosity = 1 - normalizedLuminosity;
        }
        
        const dotRadius = maxDotRadius * (1 - normalizedLuminosity);
        
        if (dotRadius > 0.5) {
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;

          ctx.beginPath();
          
          if (shape === "circle") {
            ctx.arc(centerX, centerY, dotRadius, 0, Math.PI * 2);
          } else if (shape === "square") {
            const halfSize = dotRadius;
            ctx.rect(centerX - halfSize, centerY - halfSize, halfSize * 2, halfSize * 2);
          } else if (shape === "diamond") {
            ctx.moveTo(centerX, centerY - dotRadius);
            ctx.lineTo(centerX + dotRadius, centerY);
            ctx.lineTo(centerX, centerY + dotRadius);
            ctx.lineTo(centerX - dotRadius, centerY);
            ctx.closePath();
          }
          
          ctx.fill();
        }
      }
    }

    setIsProcessing(false);
  }, [originalImage, settings]);

  // Re-process when settings change
  useEffect(() => {
    if (originalImage) {
      const timer = setTimeout(processImage, 50);
      return () => clearTimeout(timer);
    }
  }, [processImage, originalImage, settings]);

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  // Download result
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `halftone-pattern-${settings.resolution}.png`;
    // Use maximum quality for PNG export
    link.href = canvasRef.current.toDataURL("image/png", 1.0);
    link.click();
  };

  // Download as SVG (vector)
  const handleDownloadSVG = () => {
    if (!originalImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // Get pixel data from original with high quality
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d", { 
      willReadFrequently: true,
      alpha: true,
    });
    if (!tempCtx) return;
    
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.drawImage(originalImage, 0, 0, width, height);
    const imageData = tempCtx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    
    const { dotSize, spacing, contrast, brightness, dotColor, backgroundColor, invert, shape } = settings;
    const cellSize = spacing;
    const maxDotRadius = dotSize / 2;
    
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svgContent += `<rect width="100%" height="100%" fill="${backgroundColor}"/>`;
    
    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        let totalLuminosity = 0;
        let pixelCount = 0;

        for (let cy = 0; cy < cellSize && y + cy < height; cy++) {
          for (let cx = 0; cx < cellSize && x + cx < width; cx++) {
            const pixelIndex = ((y + cy) * width + (x + cx)) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            totalLuminosity += getLuminosity(r, g, b);
            pixelCount++;
          }
        }

        const avgLuminosity = totalLuminosity / pixelCount;
        const adjustedLuminosity = adjustLuminosity(avgLuminosity, contrast, brightness);
        
        let normalizedLuminosity = adjustedLuminosity / 255;
        if (invert) {
          normalizedLuminosity = 1 - normalizedLuminosity;
        }
        
        const dotRadius = maxDotRadius * (1 - normalizedLuminosity);
        
        if (dotRadius > 0.5) {
          const centerX = x + cellSize / 2;
          const centerY = y + cellSize / 2;
          
          if (shape === "circle") {
            svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${dotRadius}" fill="${dotColor}"/>`;
          } else if (shape === "square") {
            svgContent += `<rect x="${centerX - dotRadius}" y="${centerY - dotRadius}" width="${dotRadius * 2}" height="${dotRadius * 2}" fill="${dotColor}"/>`;
          } else if (shape === "diamond") {
            svgContent += `<polygon points="${centerX},${centerY - dotRadius} ${centerX + dotRadius},${centerY} ${centerX},${centerY + dotRadius} ${centerX - dotRadius},${centerY}" fill="${dotColor}"/>`;
          }
        }
      }
    }
    
    svgContent += "</svg>";
    
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `halftone-pattern-${settings.resolution}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateSetting = <K extends keyof HalftoneSettings>(
    key: K,
    value: HalftoneSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white text-black pb-safe">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-12 sm:px-12 sm:py-20">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 sm:mb-24"
        >
          <h1 className="mb-3 text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
            Halftone
          </h1>
          <p className="text-base text-gray-600 sm:text-lg">
            Convert images to dot pattern halftones
          </p>
        </motion.header>

        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Main canvas area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {!originalImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center 
                  overflow-hidden rounded-lg border transition-all duration-200
                  ${isDragging 
                    ? "border-black bg-gray-50" 
                    : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-100/50"
                  }
                `}
              >
                <motion.div
                  animate={{ y: isDragging ? -8 : 0 }}
                  className="flex flex-col items-center px-4"
                >
                  <Upload className="mb-6 h-10 w-10 text-gray-400 transition-colors group-hover:text-black sm:h-12 sm:w-12" />
                  <p className="mb-2 text-center text-base text-gray-900 sm:text-lg">
                    Drop image to convert
                  </p>
                  <p className="text-center text-sm text-gray-500">
                    or click to browse
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="relative">
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                    >
                      <RefreshCw className="h-6 w-6 animate-spin text-black sm:h-8 sm:w-8" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <canvas
                  ref={canvasRef}
                  className="mx-auto block max-h-[60vh] w-auto rounded-lg border border-gray-200 sm:max-h-[70vh]"
                  style={{ imageRendering: "auto" }}
                />
                
                {/* Action buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    New Image
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-md bg-black px-4 py-2.5 text-sm text-white transition-all hover:bg-gray-800"
                  >
                    <Download className="h-4 w-4" />
                    Download PNG
                  </button>
                  <button
                    onClick={handleDownloadSVG}
                    className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    Download SVG
                  </button>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
          </motion.div>

          {/* Controls panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Dot Settings */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-900">
                Dot Settings
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Max Dot Size</span>
                    <span className="font-medium text-gray-900">{settings.dotSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={settings.dotSize}
                    onChange={(e) => updateSetting("dotSize", Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>
                
                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Grid Spacing</span>
                    <span className="font-medium text-gray-900">{settings.spacing}px</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.spacing}
                    onChange={(e) => updateSetting("spacing", Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>

                <div>
                  <label className="mb-3 block text-xs text-gray-600">Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["circle", "square", "diamond"] as const).map((shape) => (
                      <button
                        key={shape}
                        onClick={() => updateSetting("shape", shape)}
                        className={`
                          flex items-center justify-center rounded-md border py-2.5 text-xs capitalize transition-all touch-manipulation
                          ${settings.shape === shape 
                            ? "border-black bg-black text-white" 
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                          }
                        `}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs text-gray-600">
                    Resolution
                    <span className="ml-2 font-medium text-gray-900">
                      ({settings.resolution === "standard" ? "1600px" : settings.resolution === "high" ? "4400px" : "6000px"})
                    </span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["standard", "high", "ultra"] as const).map((res) => (
                      <button
                        key={res}
                        onClick={() => updateSetting("resolution", res)}
                        className={`
                          flex items-center justify-center rounded-md border py-2.5 text-xs capitalize transition-all touch-manipulation
                          ${settings.resolution === res 
                            ? "border-black bg-black text-white" 
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                          }
                        `}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Adjustments */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-900">
                Adjustments
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Contrast</span>
                    <span className="font-medium text-gray-900">{settings.contrast.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={settings.contrast}
                    onChange={(e) => updateSetting("contrast", Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>
                
                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Brightness</span>
                    <span className="font-medium text-gray-900">{settings.brightness > 0 ? "+" : ""}{Math.round(settings.brightness * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.05"
                    value={settings.brightness}
                    onChange={(e) => updateSetting("brightness", Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-5">
                  <span className="text-xs text-gray-600">Invert Pattern</span>
                  <button
                    onClick={() => updateSetting("invert", !settings.invert)}
                    className={`
                      relative h-6 w-11 rounded-full transition-colors touch-manipulation
                      ${settings.invert ? "bg-black" : "bg-gray-300"}
                    `}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <motion.div
                      animate={{ x: settings.invert ? 20 : 2 }}
                      className={`
                        absolute top-1 h-4 w-4 rounded-full shadow-sm
                        ${settings.invert ? "bg-white" : "bg-white"}
                      `}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-900">
                Colors
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Dot Color</span>
                  <div className="relative touch-manipulation">
                    <input
                      type="color"
                      value={settings.dotColor}
                      onChange={(e) => updateSetting("dotColor", e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    />
                    <div 
                      className="h-8 w-20 rounded-md border border-gray-300"
                      style={{ backgroundColor: settings.dotColor }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Background</span>
                  <div className="relative touch-manipulation">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => updateSetting("backgroundColor", e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    />
                    <div 
                      className="h-8 w-20 rounded-md border border-gray-300"
                      style={{ backgroundColor: settings.backgroundColor }}
                    />
                  </div>
                </div>

                {/* Quick presets */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="mb-3 text-xs text-gray-600">Presets</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { dot: "#000000", bg: "#ffffff", name: "B/W" },
                      { dot: "#ffffff", bg: "#000000", name: "W/B" },
                      { dot: "#00ff88", bg: "#0a0a0a", name: "Matrix" },
                      { dot: "#ff6b35", bg: "#1a1a2e", name: "Neon" },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          updateSetting("dotColor", preset.dot);
                          updateSetting("backgroundColor", preset.bg);
                        }}
                        className="group relative overflow-hidden rounded-md border border-gray-300 p-2 transition-all touch-manipulation hover:border-gray-400"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <div 
                          className="mb-1.5 aspect-square rounded-sm"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${preset.dot} 20%, transparent 20%), 
                                         radial-gradient(circle at 70% 70%, ${preset.dot} 15%, transparent 15%), 
                                         ${preset.bg}`,
                          }}
                        />
                        <p className="text-[10px] text-gray-600 group-hover:text-gray-900">
                          {preset.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset button */}
            <button
              onClick={() => setSettings(defaultSettings)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2.5 text-xs text-gray-700 transition-all touch-manipulation hover:border-gray-400 hover:bg-gray-50"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset to Defaults
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

