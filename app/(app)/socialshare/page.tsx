"use client";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useRef, useState } from "react";
const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Youtube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("api/imageUpload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image. Try again");
      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat.replace(/\s+/g, "_")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
        alert(
          "An error occurred while downloading the image. Please try again."
        );
      });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Social Media Image Generator
      </h1>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Upload an image</h2>
          <div className="form-control">
            <input
              type="file"
              className="file-input w-full file-input-primary"
              onChange={handleFileUpload}
            />
          </div>

          {isUploading && (
            <progress className="progress m-auto mt-6 progress-accent"></progress>
          )}

          {uploadedImage && (
            <div className="mt-6">
              <div className="card-title mb-4">Select Social Media Format</div>
              <div className="form-control">
                <select
                  className="select select-bordered select-primary w-full"
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format, index) => (
                    <option key={index} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransforming && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage}
                    sizes="100vw"
                    alt="transformed image"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download for {selectedFormat}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
