import React, { useState, useRef, useEffect, useCallback } from "react";
import "./imageCropModal.scss";

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const ZoomInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2V7z" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7V9z" />
  </svg>
);

const RotateIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z" />
  </svg>
);

const ImageCropModal = ({ imageSrc, onCrop, onClose }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  // Crop area size
  const CROP_SIZE = 280;

  // Load the image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      // Fit the image to the crop area initially
      const scale = CROP_SIZE / Math.min(img.width, img.height);
      setZoom(scale);
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, w, h);

    // Save context for clipping the circular area
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(cx, cy, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw image inside the circular clip
    ctx.save();
    ctx.translate(cx + offset.x, cy + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    ctx.restore();

    // Draw circular border
    ctx.beginPath();
    ctx.arc(cx, cy, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 168, 132, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the image outside the circle with dark overlay
    // Re-draw image behind overlay for full preview
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.translate(cx + offset.x, cy + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.globalAlpha = 0.3;
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    // Dark background behind everything
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#111b21";
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }, [imageLoaded, zoom, rotation, offset]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse/touch drag handlers
  const handlePointerDown = (e) => {
    setDragging(true);
    const pos = getPointerPos(e);
    dragStart.current = pos;
    offsetStart.current = { ...offset };
    e.preventDefault();
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    const pos = getPointerPos(e);
    setOffset({
      x: offsetStart.current.x + (pos.x - dragStart.current.x),
      y: offsetStart.current.y + (pos.y - dragStart.current.y),
    });
    e.preventDefault();
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const getPointerPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // Zoom via scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.max(0.1, Math.min(5, prev + delta)));
  };

  // Zoom slider
  const handleZoomChange = (e) => {
    setZoom(parseFloat(e.target.value));
  };

  // Rotate
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Crop and output
  const handleCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputSize = 400; // output resolution
    const outCanvas = document.createElement("canvas");
    outCanvas.width = outputSize;
    outCanvas.height = outputSize;
    const ctx = outCanvas.getContext("2d");

    // Scale factor from display to output
    const scale = outputSize / CROP_SIZE;

    // Clip to circle
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw the image with the same transform as preview
    ctx.translate(outputSize / 2 + offset.x * scale, outputSize / 2 + offset.y * scale);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scale, zoom * scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    outCanvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onCrop(url, blob);
        }
      },
      "image/png",
      1
    );
  };

  return (
    <div className="cropModal">
      <div className="cropModal__backdrop" onClick={onClose} />
      <div className="cropModal__content">
        <div className="cropModal__header">
          <button className="cropModal__closeBtn" onClick={onClose}>
            <CloseIcon />
          </button>
          <h3>Crop & Position</h3>
        </div>

        <div
          className="cropModal__canvasWrapper"
          ref={containerRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onWheel={handleWheel}
        >
          <canvas
            ref={canvasRef}
            width={420}
            height={420}
            className="cropModal__canvas"
          />
          {!imageLoaded && (
            <div className="cropModal__loading">Loading image...</div>
          )}
        </div>

        <div className="cropModal__controls">
          <button className="cropModal__toolBtn" onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} title="Zoom out">
            <ZoomOutIcon />
          </button>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
            className="cropModal__slider"
          />
          <button className="cropModal__toolBtn" onClick={() => setZoom((z) => Math.min(5, z + 0.1))} title="Zoom in">
            <ZoomInIcon />
          </button>
          <button className="cropModal__toolBtn" onClick={handleRotate} title="Rotate 90°">
            <RotateIcon />
          </button>
        </div>

        <div className="cropModal__actions">
          <button className="cropModal__cancelBtn" onClick={onClose}>
            Cancel
          </button>
          <button className="cropModal__confirmBtn" onClick={handleCrop}>
            <CheckIcon />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
