"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Dot {
  x: number;
  y: number;
  baseSize: number;
  currentSize: number;
  luminosity: number;
}

interface InteractiveHalftoneBgProps {
  dotSpacing?: number;
  maxDotSize?: number;
  dotColor?: string;
  backgroundColor?: string;
  hoverColor?: string;
  hoverRadius?: number;
  hoverScale?: number;
  className?: string;
  sourceImage?: HTMLImageElement | null;
  pattern?: "vignette" | "uniform" | "image";
  zoom?: number;
  panX?: number;
  panY?: number;
}

export function InteractiveHalftoneBg({
  dotSpacing = 8,
  maxDotSize = 6,
  dotColor = "#000000",
  backgroundColor = "transparent",
  hoverColor = "#000000",
  hoverRadius = 30,
  hoverScale = 0.3,
  className = "",
  sourceImage = null,
  pattern = "vignette",
  zoom = 1,
  panX = 0,
  panY = 0,
}: InteractiveHalftoneBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | undefined>(undefined);

  // Calculate luminosity from RGB
  const getLuminosity = (r: number, g: number, b: number): number => {
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  // Initialize dots based on canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDots = async () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const newDots: Dot[] = [];
      
      // Determine working dimensions
      let workingWidth = canvas.width;
      let workingHeight = canvas.height;
      
      // If using image pattern, use original image dimensions
      if (pattern === "image" && sourceImage) {
        workingWidth = sourceImage.width;
        workingHeight = sourceImage.height;
      }
      
      const cols = Math.ceil(workingWidth / dotSpacing);
      const rows = Math.ceil(workingHeight / dotSpacing);

      // If using image pattern, get pixel data at original size
      let imageData: ImageData | null = null;
      if (pattern === "image" && sourceImage) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = sourceImage.width;
        tempCanvas.height = sourceImage.height;
        const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
        
        if (tempCtx) {
          tempCtx.drawImage(sourceImage, 0, 0);
          imageData = tempCtx.getImageData(0, 0, sourceImage.width, sourceImage.height);
        }
      }

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * dotSpacing + dotSpacing / 2;
          const y = row * dotSpacing + dotSpacing / 2;

          let luminosity = 1;
          let baseSize = maxDotSize * 0.4;

          if (pattern === "image" && imageData) {
            // Calculate average luminosity for the cell area
            let totalLuminosity = 0;
            let pixelCount = 0;

            const cellStartX = Math.floor(col * dotSpacing);
            const cellStartY = Math.floor(row * dotSpacing);

            for (let cy = 0; cy < dotSpacing && cellStartY + cy < workingHeight; cy++) {
              for (let cx = 0; cx < dotSpacing && cellStartX + cx < workingWidth; cx++) {
                const pixelIndex = ((cellStartY + cy) * workingWidth + (cellStartX + cx)) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                totalLuminosity += getLuminosity(r, g, b);
                pixelCount++;
              }
            }

            const avgLuminosity = totalLuminosity / pixelCount;
            luminosity = avgLuminosity / 255;
            // Invert: darker areas = larger dots
            baseSize = maxDotSize * (1 - luminosity);
          } else if (pattern === "vignette") {
            // Create a gradient/pattern effect - dots get smaller towards edges
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const distanceFromCenter = Math.sqrt(
              Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
            );
            const maxDistance = Math.sqrt(
              Math.pow(centerX, 2) + Math.pow(centerY, 2)
            );
            
            // Luminosity based on distance from center (creates vignette effect)
            luminosity = 1 - (distanceFromCenter / maxDistance) * 0.6;
            baseSize = maxDotSize * luminosity * 0.4;
          } else if (pattern === "uniform") {
            // Uniform dot sizes
            luminosity = 0.5;
            baseSize = maxDotSize * 0.3;
          }

          newDots.push({
            x,
            y,
            baseSize,
            currentSize: baseSize,
            luminosity,
          });
        }
      }

      setDots(newDots);
    };

    updateDots();

    const resizeObserver = new ResizeObserver(() => updateDots());
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [dotSpacing, maxDotSize, sourceImage, pattern]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dots.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context state
      ctx.save();
      
      // Apply transformations (center-based zoom and pan)
      const canvasCenterX = canvas.width / 2;
      const canvasCenterY = canvas.height / 2;
      
      // Calculate image dimensions for centering
      let imageWidth = canvas.width;
      let imageHeight = canvas.height;
      
      if (pattern === "image" && sourceImage) {
        imageWidth = sourceImage.width;
        imageHeight = sourceImage.height;
      }
      
      const imageCenterX = imageWidth / 2;
      const imageCenterY = imageHeight / 2;
      
      // Center the image in the canvas
      const offsetX = canvasCenterX - imageCenterX;
      const offsetY = canvasCenterY - imageCenterY;
      
      ctx.translate(canvasCenterX + panX, canvasCenterY + panY);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvasCenterX + offsetX, -canvasCenterY + offsetY);

      // Draw dots
      dots.forEach((dot) => {
        // Transform mouse position to match dot coordinate space
        const transformedMouseX = (mousePos.current.x - canvasCenterX - panX) / zoom + canvasCenterX - offsetX;
        const transformedMouseY = (mousePos.current.y - canvasCenterY - panY) / zoom + canvasCenterY - offsetY;
        
        // Calculate distance from mouse
        const dx = dot.x - transformedMouseX;
        const dy = dot.y - transformedMouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Primary influence zone (direct hover area)
        const primaryInfluence = distance < hoverRadius 
          ? Math.pow(1 - distance / hoverRadius, 2) // Squared for smoother falloff
          : 0;

        // Secondary influence zone (surrounding circles - creates ripple effect)
        const secondaryRadius = hoverRadius * 1.5; // Tighter radius matching hover size
        const secondaryInfluence = distance >= hoverRadius && distance < secondaryRadius
          ? Math.pow(1 - (distance - hoverRadius) / (secondaryRadius - hoverRadius), 1.5) * 0.5
          : 0;

        // Combine influences for total effect
        const totalInfluence = Math.max(primaryInfluence, secondaryInfluence);

        // Calculate target size based on mouse proximity with multi-layer effect
        let targetSize = dot.baseSize;
        if (primaryInfluence > 0) {
          // Primary zone: full scale effect
          targetSize = dot.baseSize + (maxDotSize * hoverScale - dot.baseSize) * primaryInfluence;
        } else if (secondaryInfluence > 0) {
          // Secondary zone: reduced scale effect for surrounding circles
          const secondaryScale = hoverScale * 0.4; // 40% of primary scale
          targetSize = dot.baseSize + (maxDotSize * secondaryScale - dot.baseSize) * secondaryInfluence;
        }

        // Smooth interpolation with faster response for better feel
        dot.currentSize += (targetSize - dot.currentSize) * 0.2;

        // Draw dot with gradient color blending
        if (dot.currentSize > 0.5) {
          // Blend between dot color and hover color based on total influence
          if (totalInfluence > 0.01) {
            // Parse colors and blend
            // Reduce color intensity for secondary zone
            const colorBlendFactor = primaryInfluence > 0 
              ? primaryInfluence 
              : secondaryInfluence * 0.5; // Secondary circles get more subtle color change
            
            // Use hover color blended with dot color for feathering effect
            const dotR = parseInt(dotColor.slice(1, 3), 16);
            const dotG = parseInt(dotColor.slice(3, 5), 16);
            const dotB = parseInt(dotColor.slice(5, 7), 16);
            
            const hoverR = parseInt(hoverColor.slice(1, 3), 16);
            const hoverG = parseInt(hoverColor.slice(3, 5), 16);
            const hoverB = parseInt(hoverColor.slice(5, 7), 16);
            
            const blendedR = Math.round(dotR + (hoverR - dotR) * colorBlendFactor);
            const blendedG = Math.round(dotG + (hoverG - dotG) * colorBlendFactor);
            const blendedB = Math.round(dotB + (hoverB - dotB) * colorBlendFactor);
            
            ctx.fillStyle = `rgb(${blendedR}, ${blendedG}, ${blendedB})`;
          } else {
            ctx.fillStyle = dotColor;
          }
          
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.currentSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Restore context state
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dots, dotColor, backgroundColor, hoverColor, hoverRadius, hoverScale, maxDotSize, zoom, panX, panY, sourceImage, pattern]);

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`block h-full w-full ${className}`}
      style={{ cursor: "none" }}
    />
  );
}

