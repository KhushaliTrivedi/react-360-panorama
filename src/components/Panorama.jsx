import { useEffect, useState, useRef } from "react";

const localImages = [
  "/assets/test.png",
  "/assets/test7.png",
  "/assets/test6.png",
  "/assets/test2.png",
  "/assets/test3.jpg",
  "/assets/test4.jpg",
  "/assets/test5.png",
  "/assets/test8.jpg",
  "/assets/test9.jpg",
  "/assets/test10.jpg",
  "/assets/test11.png",
  "/assets/test12.png",
];

export default function Panorama() {
  const [viewUrl, setViewUrl] = useState(localImages[0]);
  const [pannellumLoaded, setPannellumLoaded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const panoContainerRef = useRef(null);
  const viewerRef = useRef(null);

  // Load pannellum script only once
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

  // Initialization effect stays same
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

  // Update image on viewUrl change
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
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return (
    <div
      className="relative w-full"
      style={{ height: "var(--app-height)", overflow: "hidden" }}
    >
      <div
        ref={panoContainerRef}
        id="panorama"
        className="absolute inset-0 w-full h-full"
      />

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
          fontWeight: "bold",
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
              width: "160px",       // fixed width
              height: "120px",      // fixed height
              borderRadius: "8px",
              overflow: "hidden",   // clip overflow
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
                objectFit: "cover",  // this makes image cover container area
                display: "block",
                userSelect: "none",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
