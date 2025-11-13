"use client";

import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { useRef, useEffect } from "react";

export default function PreviewCanvas({
  image,
  background,
  brightness,
  contrast,
  saturation,
  temperature,
  sharpness,
  currentPreset,
}) {
  const [img] = useImage(image, "Anonymous");
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current || !img) return;

    const node = imgRef.current;

    node.cache();

    let filters = [];

    switch (currentPreset) {
      case "grayscale":
        filters = [Konva.Filters.Grayscale];
        break;
      case "sepia":
        filters = [Konva.Filters.Sepia];
        break;
      case "blur":
        filters = [Konva.Filters.Blur];
        node.blurRadius(8);
        break;
      case "invert":
        filters = [Konva.Filters.Invert];
        break;
      case "noise":
        filters = [Konva.Filters.Noise];
        node.noise(0.3);
        break;
      default:
        filters = [
          Konva.Filters.Brighten,
          Konva.Filters.Contrast,
          Konva.Filters.HSV,
        ];
        node.brightness(brightness / 100);
        node.contrast(contrast / 100);
        node.saturation(saturation / 100);
        node.hue(temperature);
        break;
    }

    node.filters(filters);

    node.getLayer()?.batchDraw();
  }, [
    img,
    brightness,
    contrast,
    saturation,
    temperature,
    sharpness,
    currentPreset,
  ]);

  const getScaledProps = (img, maxWidth, maxHeight) => {
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    return {
      width: newWidth,
      height: newHeight,
      x: (maxWidth - newWidth) / 2,
      y: (maxHeight - newHeight) / 2,
    };
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 rounded-lg p-2 shadow-inner">
      <Stage width={400} height={500}>
        <Layer>
          <Rect width={400} height={500} fill={background || "#fff"} />
          {img && (
            <KonvaImage
              ref={imgRef}
              image={img}
              {...getScaledProps(img, 400, 500)}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
