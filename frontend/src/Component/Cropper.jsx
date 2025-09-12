import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

// helper function to create an Image object
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

// helper to get cropped blob
async function getCroppedImg(imageSrc, cropPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 400; // fixed output width
  canvas.height = 400; // fixed output height

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg", 0.9);
  });
}

export default function CropModal({ isOpen, imageFile, onCropComplete, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (imageFile) {
      setImageSrc(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedBlob);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl relative w-full max-w-md h-[500px] flex flex-col">
        <div className="relative flex-1 w-full bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
            cropShape="rect"
            showGrid={true}
            objectFit="horizontal-cover"
          />
        </div>

        <div className="mt-4 flex justify-between items-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full mr-4"
          />
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
