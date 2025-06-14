"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Image } from "@prisma/client";
import ImageCard from "@/components/ImageCard";
import Editpage from "@/components/Editpage";

function HomeImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get("/api/images");
      setImages(response.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDownload = useCallback(async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `aspecto.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed. Check browser console for more info.");
    }
  }, []);

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/deleteImage`, { data: { id } });
      setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    } catch (error) {
      setError("Failed to delete image. Please try again.");
      console.log(error);
    }
  };

  const onEdit = async (id: string) => {
    setEditId(id);
  };

  if (loading) {
    // Skeleton loader grid (like videos)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Images</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-base-200 h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if(editId) return <Editpage editId={editId} setEditId={setEditId} />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      {error && (
        <div className="text-center text-red-500 mb-4">{error}</div>
      )}
      {images.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No image available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onDownload={handleDownload}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomeImages;