"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink, Copy, Check } from "lucide-react";

interface QRCodeViewerProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  frameStyle?: "simple" | "badge" | "callout" | "poster";
  showActions?: boolean;
}

export function QRCodeViewer({
  value,
  size = 200,
  fgColor = "#0f172a",
  bgColor = "#ffffff",
  title,
  subtitle,
  ctaText,
  frameStyle = "badge",
  showActions = true,
}: QRCodeViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState(value);

  useEffect(() => {
    // If relative URL, prefix with origin if in browser
    if (typeof window !== "undefined" && value.startsWith("/")) {
      setFullUrl(`${window.location.origin}${value}`);
    } else {
      setFullUrl(value);
    }
  }, [value]);

  useEffect(() => {
    if (canvasRef.current && fullUrl) {
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor || "#0f172a",
          light: bgColor || "#ffffff",
        },
        errorCorrectionLevel: "H",
      }).catch((err) => {
        console.error("QR Code generation error:", err);
      });
    }
  }, [fullUrl, size, fgColor, bgColor]);

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${title ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "dental-qr"}.png`;
    link.href = url;
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Frame Container */}
      <div
        className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col items-center text-center transition-all duration-200 hover:shadow-md ${
          frameStyle === "poster"
            ? "border-2 border-dental-500 bg-gradient-to-b from-teal-50/50 to-white"
            : frameStyle === "callout"
            ? "border-amber-200 bg-amber-50/20"
            : "border-slate-200"
        }`}
      >
        {ctaText && (
          <div className="mb-3 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
            {ctaText}
          </div>
        )}

        {title && <h4 className="font-semibold text-slate-900 text-sm mb-1">{title}</h4>}
        {subtitle && <p className="text-xs text-slate-500 mb-3 max-w-[220px]">{subtitle}</p>}

        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-inner flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Instant Smart Scan Active</span>
        </div>
      </div>

      {/* Action buttons */}
      {showActions && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleDownloadPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-sm"
            title="Download PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-sm"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-sm"
            title="Test Link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Test</span>
          </a>
        </div>
      )}
    </div>
  );
}
