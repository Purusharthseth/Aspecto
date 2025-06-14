import React, { useState, useCallback } from "react";
import { getCldImageUrl } from "next-cloudinary";
import { ArrowDownToLine, Trash2, Pencil } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Image } from "@prisma/client";

dayjs.extend(relativeTime);

interface ImageCardProps {
  image: Image;
  onDownload: (url: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDownload, onDelete, onEdit }) => {
  const [wannaDelete, setWannaDelete] = useState(false);

  const getImageUrl = useCallback(
    (id: string) => {
      return getCldImageUrl({
        src: id,
      });
    },
    []
  );
  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <figure className="aspect-video relative">
        <img
          src={getImageUrl(image.id)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </figure>
      <div className="card-body p-4">
        <p className="text-sm text-base-content opacity-70 mb-4">
          Uploaded {dayjs(image.createdAt).fromNow()}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => onEdit(image.id)}
              title="Edit"
            >
              <Pencil size={16} /> EDIT
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onDownload(getImageUrl(image.id))}
              title="Download"
            >
              <ArrowDownToLine size={16} />
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={() => setWannaDelete(true)}
              title="Delete"
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
              Are you sure you want to delete <strong>this image</strong>?
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
                    onDelete(image.id);
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

export default ImageCard;