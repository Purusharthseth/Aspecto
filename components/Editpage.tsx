"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { CldImage } from "next-cloudinary";

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

const editOptions = [
  { label: "Change Aspect Ratio", value: "aspect" },
  { label: "Remove Background", value: "removeBg" },
  { label: "Change Background", value: "changeBg" },
  { label: "Generative Remove", value: "remv" },
  { label: "Generative Replace", value: "repl" },
];

interface EditpageProps {
  editId: string | null;
  setEditId: (id: string | null) => void;
}

const Editpage: React.FC<EditpageProps> = ({ editId, setEditId }) => {
  const [selectedEdit, setSelectedEdit] = useState("aspect");
  const [aspect, setAspect] = useState<SocialFormat>("Instagram Square (1:1)");
  const [bgPrompt, setBgPrompt] = useState("");
  const [removeBg, setRemoveBg] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [injectedBgPrompt, setInjectedBgPrompt] = useState("");
  const [removePrompt, setRemovePrompt] = useState("");
  const [injectedRemovePrompt, setInjectedRemovePrompt] = useState("");
  const [replacePrompt1, setReplacePrompt1] = useState("");
  const [replacePrompt2, setReplacePrompt2] = useState("");
  const [injectedReplacePrompt1, setInjectedReplacePrompt1] = useState("");
  const [injectedReplacePrompt2, setInjectedReplacePrompt2] = useState("");
  const [originalDimensions, setOriginalDimensions] = useState({ width: 1200, height: 800 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Add function to get original image dimensions
  const getOriginalDimensions = (editId: string) => {
    const img = new Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
    };
    img.src = `https://res.cloudinary.com/mycloud/image/upload/${editId}`;
  };
  

  // Call getOriginalDimensions when editId changes
  useEffect(() => {
    if (editId) {
      getOriginalDimensions(editId);
    }
  }, [editId]);

  // Handle "Change Background" button click
  const handleChangeBg = () => {
    setProcessing(true);
    setInjectedBgPrompt(bgPrompt);
  };

  // Handle "Remove Background" button click
  const handleRemoveBg = () => {
    setRemoveBg(!removeBg);
    setProcessing(true);
  };

  // Handle "Generative Remove" button click
  const handleGenerativeRemove = () => {
    setInjectedRemovePrompt(removePrompt);
    setProcessing(true);
  };

  useEffect(() => {
    setProcessing(true);
  }, [selectedEdit]);

  const handleDownload = async () => {
    if (!imageRef.current) return;
    fetch(imageRef.current.src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `aspecto.png`;
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

  const handleGenerativeReplace = () => {
    setInjectedReplacePrompt1(replacePrompt1);
    setInjectedReplacePrompt2(replacePrompt2);
    setProcessing(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-start mb-4">
        <button onClick={() => setEditId(null)} className="btn btn-ghost">
          <ChevronLeft />
        </button>
        <h1 className="text-2xl font-bold ml-4">Edit Image</h1>
      </div>

      {/* Edit Option Dropdown */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Edit Option:</label>
        <select
          className="select select-bordered"
          value={selectedEdit}
          onChange={e => setSelectedEdit(e.target.value)}
        >
          {editOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Show controls based on selected edit */}
      {selectedEdit === "aspect" && (
        <div className="mb-4">
          <label className="font-semibold mr-2">Aspect Ratio:</label>
          <select
            className="select select-bordered"
            value={aspect}
            onChange={e => setAspect(e.target.value as SocialFormat)}
          >
            {Object.keys(socialFormats).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      )}

      {selectedEdit === "removeBg" && (
        <div className="mb-4">
          <button
            className="btn btn-warning"
            onClick={handleRemoveBg}
            disabled={processing}
          >
            {removeBg ? "Undo Remove Background" : "Remove Background"}
          </button>
        </div>
      )}

      {selectedEdit === "changeBg" && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Describe new background..."
            value={bgPrompt}
            onChange={e => setBgPrompt(e.target.value)}
            disabled={processing}
          />
          <button
            className="btn btn-info"
            onClick={handleChangeBg}
            disabled={!bgPrompt || processing}
          >
            Change Background
          </button>
        </div>
      )}
      {/* Generative Remove */}
      {selectedEdit === "remv" && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Describe what to remove"
            value={removePrompt}
            onChange={e => setRemovePrompt(e.target.value)}
            disabled={processing}
          />
          <button
            className="btn btn-info"
            onClick={handleGenerativeRemove}
            disabled={!removePrompt || processing}
          >
            Remove
          </button>
        </div>
      )}
      {selectedEdit === "repl" && (
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Describe what to replace"
            value={replacePrompt1}
            onChange={e => setReplacePrompt1(e.target.value)}
            disabled={processing}
          />
           <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Describe what to replace with"
            value={replacePrompt2}
            onChange={e => setReplacePrompt2(e.target.value)}
            disabled={processing}
          />
          <button
            className="btn btn-info"
            onClick={handleGenerativeReplace}
            disabled={!replacePrompt1 || !replacePrompt2 || processing}
          >
            Replace
          </button>
        </div>
      )}


      {/* Image Preview */}
      <div className="mb-4">
        <div className="relative">
          {(processing) && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          <CldImage
            src={editId || ""}
            alt="Edited image"
            crop={selectedEdit === "aspect" ? "fill" : undefined}
            gravity="auto"
            width={
              selectedEdit === "aspect"
                ? socialFormats[aspect].width
                : originalDimensions.width
            }
            height={
              selectedEdit === "aspect"
                ? socialFormats[aspect].height
                : originalDimensions.height
            }
            removeBackground={selectedEdit === "removeBg" && removeBg ? true : undefined}
            replaceBackground={selectedEdit === "changeBg" && injectedBgPrompt ? injectedBgPrompt : undefined}
            remove={selectedEdit === "remv" && injectedRemovePrompt ? { prompt: injectedBgPrompt, removeShadow: true } : undefined}
           replace={
              selectedEdit === "repl" && injectedReplacePrompt1 && injectedReplacePrompt2
                ? [injectedReplacePrompt1, injectedReplacePrompt2]
                : undefined
            }
            sizes="100vw"
            onLoad={() => setProcessing(false)}
            className="max-w-full rounded-lg border"
            ref={imageRef}
          />

          {!(processing) && (
             <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary" onClick={handleDownload}>
            Download
          </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editpage;