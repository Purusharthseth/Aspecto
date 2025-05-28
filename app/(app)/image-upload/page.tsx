"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const Router = useRouter();

  const max_size = 10 * 1024 * 1024; // 10 MB

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    if (file.size > max_size) {
      alert("File size too large.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/imageUpload", formData);
      if (response.status !== 200) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      Router.push("/home/images");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Select Image</span>
          </label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
             className="file-input w-full file-input-primary"
            required
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${isUploading ? "loading" : ""}`}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
