"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Image } from "@prisma/client";
import ImageCard from "@/components/ImageCard";

function HomeImages() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get("/api/images");
      setImages(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch Title");
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `aspecto.png`; // You can replace this with a dynamic filename if needed
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
        setLoading(true);
        const response = await axios.delete(`/api/deleteImage`, {
          data: { id },
        });
        if(response.data.success) {
          setImages((prevImages) => prevImages.filter((images) => images.id !== id));
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
      } finally { setLoading(false);}
    };  
    
  const onEdit = async (id: string) => {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
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
