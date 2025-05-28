import React, { useState, useEffect, useCallback } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { ArrowDownToLine, File, Clock, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@prisma/client";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
  onDelete: (id: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [wannaDelete, setWannaDelete] = useState(false);

  const getThumbnailUrl = useCallback(
    (publicId: string) => {
      return getCldImageUrl({
        src: publicId,
        width: 400,
        height: 225,
        crop: "fill",
        quality: "auto",
        format: "jpg",
        assetType: "video",
      });
    },
    [video]
  );

  const getVideoUrl = useCallback(
    (publicId: string) => {
      return getCldVideoUrl({
        src: publicId,
        format: "mp4",
        width: 1920,
        height: 1080,
      });
    },
    [video]
  );

  const getPriviewVideoUrl = useCallback(
    (publicId: string) => {
      return getCldVideoUrl({
        src: publicId,
        width: 400,
        height: 225,
        rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
      });
    },
    [video]
  );

  const formatSize = useCallback((size: number) => {
    return filesize(size);
  }, []);

  const formatDuration = useCallback((duration: number) => {
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor(duration / 3600);
    return `${hours > 0 ? `${hours}h ` : ""}${
      minutes > 0 ? `${minutes}m ` : ""
    }${seconds}s`;
  }, []);

  const CompressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  useEffect(() => {
    setPreviewError(false);
  }, [isHovered]);
  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div
      className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="aspect-video relative">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-red-500">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPriviewVideoUrl(video.id)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.id)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 right-2 bg-base-100 bg-opacity-70 px-2 py-1 rounded-lg text-sm flex items-center">
          <Clock size={16} className="mr-1" />
          {formatDuration(video.duration)}
        </div>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">{video.title}</h2>
        <p className="text-sm text-base-content opacity-70 mb-4">
          {video.description}
        </p>
        <p className="text-sm text-base-content opacity-70 mb-4">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <File size={18} className="mr-2 text-primary" />
            <div>
              <div className="font-semibold">Original</div>
              <div>{formatSize(Number(video.originalSize))}</div>
            </div>
          </div>
          <div className="flex items-center">
            <File size={18} className="mr-2 text-accent" />
            <div>
              <div className="font-semibold">Compressed</div>
              <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-semibold">
            Compression:{" "}
            <span className="text-accent">{CompressionPercentage}%</span>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm mx-4"
              onClick={() =>
                onDownload(getVideoUrl(video.id), video.title)
              }
            >
              <ArrowDownToLine size={16} />
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={() => {
                setWannaDelete(true);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {wannaDelete && (
        <dialog id="confirm_delete_modal" className="modal modal-open z-50">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete <strong>{video.title}</strong>?
              This cannot be undone.
            </p>
            <div className="modal-action">
              <form method="dialog" className="space-x-2">
                <button className="btn" onClick={() => setWannaDelete(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => {
                    onDelete(video.id);
                    setWannaDelete(false);
                  }}
                >
                  Yes, Delete
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default VideoCard;
