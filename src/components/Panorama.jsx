import { useEffect, useState, useRef } from "react";

const localImages = [
  "/assets/test1.jpg",
  "/assets/test2.jpg",
  "/assets/test3.png",
  "/assets/test4.jpg",
];

export default function Panorama() {
  const [viewUrl, setViewUrl] = useState(localImages[0]);
  const [pannellumLoaded, setPannellumLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const panoContainerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (window.pannellum) {
      setPannellumLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => setPannellumLoaded(true);
    script.onerror = () => {
      console.error("Failed to load pannellum script");
      setPannellumLoaded(false);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!pannellumLoaded || !panoContainerRef.current) return;

    if (!viewerRef.current) {
      viewerRef.current = window.pannellum.viewer(panoContainerRef.current, {
        default: {
          type: "equirectangular",
          panorama: viewUrl,
          autoLoad: true,
          autoRotate: -2,
        },
        scene: "default",
      });
    }
  }, [pannellumLoaded, panoContainerRef]);

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current = window.pannellum.viewer(panoContainerRef.current, {
        default: {
          type: "equirectangular",
          panorama: viewUrl,
          autoLoad: true,
          autoRotate: -2,
        },
        scene: "default",
      });
    }
  }, [viewUrl]);

  useEffect(() => {
    const setHeight = () => {
      document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setViewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full" style={{ height: "var(--app-height)", overflow: "hidden" }}>
      <div ref={panoContainerRef} id="panorama" className="absolute inset-0 w-full h-full" />

      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        style={{
          position: "absolute",
          bottom: "80px",
          right: "20px",
          zIndex: 100,
          padding: "10px 15px",
          borderRadius: "8px",
          backgroundColor: "#000000cc",
          color: "white",
          border: "none",
          cursor: "pointer",
          userSelect: "none",
        }}
        aria-label="Toggle panorama thumbnails"
      >
        {drawerOpen ? "Close" : "Thumbnails"}
      </button>

      <div
        style={{
          position: "fixed",
          bottom: drawerOpen ? 0 : "-140px",
          left: 0,
          right: 0,
          height: "140px",
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          padding: "10px 20px",
          gap: "12px",
          transition: "bottom 0.3s ease",
          zIndex: 99,
        }}
      >
        {localImages.map((img, i) => (
          <div
            key={i}
            style={{
              width: "160px",
              height: "120px",
              borderRadius: "8px",
              overflow: "hidden",
              border: img === viewUrl ? "3px solid #4ade80" : "3px solid transparent",
              cursor: "pointer",
              flexShrink: 0,
              boxSizing: "border-box",
              transition: "border-color 0.3s",
            }}
            onClick={() => setViewUrl(img)}
            aria-label={`Select panorama thumbnail ${i + 1}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setViewUrl(img);
              }
            }}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                userSelect: "none",
              }}
              draggable={false}
            />
          </div>
        ))}

        {/* Uploaded image thumbnail */}
        {uploadedImage && (
          <div
            style={{
              width: "160px",
              height: "120px",
              borderRadius: "8px",
              overflow: "hidden",
              border: uploadedImage === viewUrl ? "3px solid #4ade80" : "3px solid transparent",
              cursor: "pointer",
              flexShrink: 0,
              boxSizing: "border-box",
              transition: "border-color 0.3s",
            }}
            onClick={() => setViewUrl(uploadedImage)}
          >
            <img
              src={uploadedImage}
              alt="Uploaded Thumbnail"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                userSelect: "none",
              }}
              draggable={false}
            />
          </div>
        )}

        {/* Upload Image Card */}
        <label
          style={{
            width: "160px",
            height: "120px",
            borderRadius: "8px",
            border: "2px dashed #888",
            color: "#ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
}
