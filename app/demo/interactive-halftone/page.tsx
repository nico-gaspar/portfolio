"use client";

import { InteractiveHalftoneBg } from "@/components/interactive-halftone-bg";
import { ExportHtml } from "@/components/export-html";
import Link from "next/link";
import { ArrowLeft, Upload, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function InteractiveHalftonePage() {
  const [settings, setSettings] = useState({
    dotSpacing: 4,
    maxDotSize: 3,
    hoverRadius: 40,
    hoverScale: 0.3,
    dotColor: "#000000",
    backgroundColor: "#ffffff",
    hoverColor: "#ff0000",
    pattern: "uniform" as "vignette" | "uniform" | "image",
  });
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const lastPanPos = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setSourceImage(img);
        setSettings({ ...settings, pattern: "image" });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSourceImage(null);
    setSettings({ ...settings, pattern: "vignette" });
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle click or Shift+Left click
      e.preventDefault();
      setIsPanning(true);
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastPanPos.current.x;
      const dy = e.clientY - lastPanPos.current.y;
      setPanX(panX + dx);
      setPanY(panY + dy);
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div className="h-screen overflow-hidden bg-white">
      {/* Back navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-6 top-6 z-50 sm:left-12 sm:top-12"
      >
        <Link 
          href="/"
          className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </motion.div>

      <div className="flex h-screen">
        {/* Interactive Background Area */}
        <div 
          className="relative flex-1" 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <InteractiveHalftoneBg
            dotSpacing={settings.dotSpacing}
            maxDotSize={settings.maxDotSize}
            hoverRadius={settings.hoverRadius}
            hoverScale={settings.hoverScale}
            dotColor={settings.dotColor}
            backgroundColor={settings.backgroundColor}
            hoverColor={settings.hoverColor}
            sourceImage={sourceImage}
            pattern={settings.pattern}
            zoom={zoom}
            panX={panX}
            panY={panY}
          />
          
          {/* Zoom Controls */}
          <div className="pointer-events-auto absolute right-6 top-6 flex flex-col gap-2">
            <button
              onClick={() => setZoom(Math.min(5, zoom + 0.2))}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={resetView}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50"
              title="Reset View"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <div className="mt-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-xs font-medium shadow-sm">
              {(zoom * 100).toFixed(0)}%
            </div>
          </div>

          {/* Pan Instructions */}
          {sourceImage && (
            <div className="pointer-events-none absolute bottom-6 left-6 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs text-gray-600 shadow-sm">
              <p className="font-medium">Controls:</p>
              <p>Use buttons or slider to zoom</p>
              <p>Shift+Click & drag to pan</p>
            </div>
          )}
          
          {/* Content Overlay - Only show when no image is uploaded */}
          <AnimatePresence>
            {!sourceImage && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-3xl px-8 text-center"
                >
                  <h1 className="mb-6 text-5xl font-medium leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                    Interactive Halftone Background
                  </h1>
                  <p className="text-lg text-gray-600 sm:text-xl">
                    Move your mouse to interact. Upload an image to create custom patterns at original size.
                  </p>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex h-screen w-80 flex-col border-l border-gray-200 bg-white"
        >
          <div className="flex-shrink-0 border-b border-gray-200 px-8 py-6">
            <h2 className="text-lg font-medium">Settings</h2>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
            {/* Pattern Mode */}
            <div>
              <label className="mb-3 block text-xs text-gray-600">Pattern Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(["vignette", "uniform", "image"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings({ ...settings, pattern: mode })}
                    disabled={mode === "image" && !sourceImage}
                    className={`
                      flex items-center justify-center rounded-md border py-2.5 text-xs capitalize transition-all
                      ${settings.pattern === mode 
                        ? "border-black bg-black text-white" 
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-40"
                      }
                    `}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-medium">Background Image</h3>
              
              {!sourceImage ? (
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-100"
                  >
                    <Upload className="h-5 w-5" />
                    <span className="font-medium">Upload Image</span>
                    <span className="text-xs text-gray-500">PNG, JPG, SVG, GIF, WebP</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-md border border-gray-300">
                    <img 
                      src={sourceImage.src} 
                      alt="Source" 
                      className="h-32 w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={clearImage}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Zoom & Pan Controls (only show when image is uploaded) */}
            {sourceImage && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="mb-4 text-sm font-medium">View Controls</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                      <span>Zoom</span>
                      <span className="font-medium text-gray-900">{(zoom * 100).toFixed(0)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
                    />
                  </div>
                  
                  <button
                    onClick={resetView}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Reset View
                  </button>
                </div>
              </div>
            )}

            {/* Dot Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-sm font-medium">Dot Settings</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Dot Spacing</span>
                    <span className="font-medium text-gray-900">{settings.dotSpacing}px</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="40"
                    value={settings.dotSpacing}
                    onChange={(e) => setSettings({ ...settings, dotSpacing: Number(e.target.value) })}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
                  />
                </div>

                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Max Dot Size</span>
                    <span className="font-medium text-gray-900">{settings.maxDotSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={settings.maxDotSize}
                    onChange={(e) => setSettings({ ...settings, maxDotSize: Number(e.target.value) })}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
                  />
                </div>

                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Hover Radius</span>
                    <span className="font-medium text-gray-900">{settings.hoverRadius}px</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={settings.hoverRadius}
                    onChange={(e) => setSettings({ ...settings, hoverRadius: Number(e.target.value) })}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
                  />
                </div>

                <div>
                  <label className="mb-3 flex items-center justify-between text-xs text-gray-600">
                    <span>Hover Scale</span>
                    <span className="font-medium text-gray-900">{settings.hoverScale.toFixed(1)}x</span>
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={settings.hoverScale}
                    onChange={(e) => setSettings({ ...settings, hoverScale: Number(e.target.value) })}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-sm font-medium">Colors</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Dot Color</span>
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.dotColor}
                      onChange={(e) => setSettings({ ...settings, dotColor: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div 
                      className="h-8 w-20 rounded-md border border-gray-300"
                      style={{ backgroundColor: settings.dotColor }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Hover Color</span>
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.hoverColor}
                      onChange={(e) => setSettings({ ...settings, hoverColor: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div 
                      className="h-8 w-20 rounded-md border border-gray-300"
                      style={{ backgroundColor: settings.hoverColor }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Background</span>
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <div 
                      className="h-8 w-20 rounded-md border border-gray-300"
                      style={{ backgroundColor: settings.backgroundColor }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-medium">Presets</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSettings({
                    ...settings,
                    dotColor: "#000000",
                    backgroundColor: "#ffffff",
                    hoverColor: "#ff0000",
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                >
                  Classic Black & White
                </button>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    dotColor: "#ffffff",
                    backgroundColor: "#000000",
                    hoverColor: "#00ff00",
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                >
                  Inverted
                </button>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    dotColor: "#3b82f6",
                    backgroundColor: "#f8fafc",
                    hoverColor: "#ef4444",
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                >
                  Blue on Light
                </button>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    dotColor: "#00ff88",
                    backgroundColor: "#0a0a0a",
                    hoverColor: "#ff00ff",
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-all hover:border-gray-400 hover:bg-gray-50"
                >
                  Matrix Green
                </button>
              </div>
            </div>

            {/* Export */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-medium">Export</h3>
              <ExportHtml settings={settings} sourceImage={sourceImage} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

