"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
 const [title, setTitle] = useState<string>("");          
const [description, setDescription] = useState<string>(""); 
  const [isUploading, setIsUploading] = useState(false);

  const Router = useRouter();

  const max_size = 60 * 1024 * 1024;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { //using html form element lets you acess html properties
    e.preventDefault();
    if (!file) return;

    if (file.size > max_size) alert("File size too large.");
    setIsUploading(true);
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("title", title || "");
    formdata.append("description", description || "");
    formdata.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/videoUpload", formdata);
      if (response.status !== 200) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      Router.push('/');
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label"> <span className="label-text">Title</span></label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full input-primary" required/>
      </div>
      <div>
        <label className="label"> <span className="label-text">Description</span></label>
        <textarea  value={description} onChange={(e) => setDescription(e.target.value)} className="textarea w-full textarea-primary" required/>
      </div>
      <div>
        <label className="label"> <span className="label-text">Upload video file</span></label>
        <br />
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="file-input file-input-primary" required/>
      </div>
      <button type="submit" className="btn btn-accent" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload Video"}</button>
    </form>
  </div>);
}
