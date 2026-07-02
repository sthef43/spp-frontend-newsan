import React, { useRef, useState } from "react";
import "./ImageZoom.css"; // archivo CSS para el estilo del componente
interface IZProps {
  src: string;
  alt: string;
}
function ImageZoom({ src, alt }: IZProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [xPos, setXPos] = useState(0);
  const [yPos, setYPos] = useState(0);
  const originalImgRef = useRef(null);

  const handleMouseMove = (e) => {
    const original = originalImgRef.current;
    const magnified = document.getElementById("large-img");
    const style = magnified.style;
    const x = e.pageX - original.offsetLeft;
    const y = e.pageY - original.offsetTop;
    const imgWidth = original.width;
    const imgHeight = original.height;
    let xperc = (x / imgWidth) * 100;
    let yperc = (y / imgHeight) * 100;
    // Add some margin for right edge
    if (x > 0.01 * imgWidth) {
      xperc += 0.15 * xperc;
    }

    // Add some margin for bottom edge
    if (y >= 0.01 * imgHeight) {
      yperc += 0.15 * yperc;
    }

    // Set the background of the magnified image horizontal
    style.backgroundPositionX = xperc - 9 + "%";
    // Set the background of the magnified image vertical
    style.backgroundPositionY = yperc - 9 + "%";

    // Move the magnifying glass with the mouse movement.
    setXPos(x - 50);
    setYPos(y - 50);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div className="image-zoom-container border-2 rounded-lg  border-red-400 ">
      <img
        src={src}
        alt={alt}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        id="main-img"
      />
      {isZoomed && (
        <div
          id="large-image"
          className="zoom-box"
          style={{
            backgroundImage: `url(${src})`,
            left: xPos + "px",
            top: yPos + "px"
          }}
        />
      )}
    </div>
  );
}

export default ImageZoom;
