"use client";

import { useState, useRef, useEffect } from "react";
import {
  EditIcon,
  TrashIcon,
  UploadIcon,
  ImagesIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XIcon,
  FolderPlusIcon,
  ImagePlusIcon,
} from "lucide-react";
import { toast } from "@/components/toast";
import ConfirmDialog from "@/components/confirm-dialog";
import type { IPhotoGallery } from "@/types";
import { resolveImageUrl } from "@/lib/image-url";

interface GalleryManagerProps {
  galleries: IPhotoGallery[];
  onRefresh: () => void;
}

export default function GalleryManager({ galleries, onRefresh }: GalleryManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<number | null>(
    galleries.length > 0 ? galleries[0].id : null
  );
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<IPhotoGallery | null>(null);
  const [sessionForm, setSessionForm] = useState({ title: "", description: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const sortedGalleries = [...galleries].sort((a, b) => a.display_order - b.display_order);
  const selectedGallery = sortedGalleries.find((g) => g.id === selectedId) ?? null;

  useEffect(() => {
    if (galleries.length === 0) {
      setSelectedId(null);
      return;
    }
    const sorted = [...galleries].sort((a, b) => a.display_order - b.display_order);
    if (!selectedId || !sorted.some((g) => g.id === selectedId)) {
      setSelectedId(sorted[0].id);
    }
  }, [galleries, selectedId]);

  const resetSessionForm = () => {
    setSessionForm({ title: "", description: "" });
    setEditingGallery(null);
    setShowSessionForm(false);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionForm.title.trim()) {
      toast.error("Please enter a session title (e.g. Annual Conference 2026)");
      return;
    }

    try {
      const url = editingGallery ? `/api/galleries/${editingGallery.id}` : "/api/galleries";
      const method = editingGallery ? "PUT" : "POST";
      const body = editingGallery
        ? {
            title: sessionForm.title,
            description: sessionForm.description,
            display_order: editingGallery.display_order,
          }
        : {
            title: sessionForm.title,
            description: sessionForm.description,
            display_order: sortedGalleries.length,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save session");
        return;
      }

      toast.success(editingGallery ? "Session updated" : "Session created");
      resetSessionForm();
      onRefresh();
      if (!editingGallery && data.id) setSelectedId(data.id);
    } catch {
      toast.error("Failed to save session");
    }
  };

  const handleDeleteSession = (gallery: IPhotoGallery) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Session",
      message: `Delete "${gallery.title}" and all ${gallery.photos?.length ?? 0} photos? This cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
        try {
          const res = await fetch(`/api/galleries/${gallery.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            toast.success("Session deleted");
            if (selectedId === gallery.id) setSelectedId(null);
            onRefresh();
          } else {
            toast.error("Failed to delete session");
          }
        } catch {
          toast.error("Failed to delete session");
        }
      },
    });
  };

  const handleMoveSession = async (galleryId: number, direction: "up" | "down") => {
    const list = [...sortedGalleries];
    const idx = list.findIndex((g) => g.id === galleryId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === list.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];

    try {
      await Promise.all(
        list.map((g, i) =>
          fetch(`/api/galleries/${g.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              title: g.title,
              description: g.description || "",
              display_order: i,
            }),
          })
        )
      );
      onRefresh();
    } catch {
      toast.error("Failed to reorder sessions");
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) return null;
    if (file.size > 5 * 1024 * 1024) return null;

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    return res.ok ? data.url : null;
  };

  const handleMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedGallery) {
      toast.error("Select or create a session first");
      return;
    }

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const urls: string[] = [];
    let skipped = 0;

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
      const url = await uploadFile(files[i]);
      if (url) urls.push(url);
      else skipped++;
    }

    if (urls.length > 0) {
      const res = await fetch(`/api/galleries/${selectedGallery.id}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ images: urls }),
      });

      if (res.ok) {
        toast.success(`${urls.length} photo${urls.length > 1 ? "s" : ""} added`);
        // Brief delay so filesystem write is flushed before we re-fetch previews
        await new Promise((r) => setTimeout(r, 100));
        onRefresh();
      } else {
        toast.error("Failed to save photos to session");
      }
    }

    if (skipped > 0) {
      toast.error(`${skipped} file(s) skipped (invalid type or over 5MB)`);
    }

    setUploading(false);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePhoto = (photoId: number) => {
    if (!selectedGallery) return;
    setConfirmDialog({
      isOpen: true,
      title: "Remove Photo",
      message: "Remove this photo from the session?",
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
        try {
          const res = await fetch(
            `/api/galleries/${selectedGallery.id}/photos/${photoId}`,
            { method: "DELETE", credentials: "include" }
          );
          if (res.ok) {
            toast.success("Photo removed");
            onRefresh();
          } else {
            toast.error("Failed to remove photo");
          }
        } catch {
          toast.error("Failed to remove photo");
        }
      },
    });
  };

  const openEditSession = (gallery: IPhotoGallery) => {
    setEditingGallery(gallery);
    setSessionForm({
      title: gallery.title,
      description: gallery.description || "",
    });
    setShowSessionForm(true);
  };

  return (
    <div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, isOpen: false }))}
        type="danger"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#762727" }}>
            Photo Galleries
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create event sessions, then upload multiple photos to each one.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetSessionForm();
            setShowSessionForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all hover:scale-105 hover:shadow-lg"
          style={{ backgroundColor: "#762727" }}
        >
          <FolderPlusIcon size={16} />
          New Session
        </button>
      </div>

      {/* Session form */}
      {showSessionForm && (
        <div
          className="bg-white rounded-2xl shadow-lg p-5 md:p-6 mb-6 border-2"
          style={{ borderColor: "#762727" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: "#762727" }}>
              {editingGallery ? "Edit Session" : "Create New Session"}
            </h3>
            <button type="button" onClick={resetSessionForm} className="text-gray-500 hover:text-gray-700">
              <XIcon size={20} />
            </button>
          </div>
          <form onSubmit={handleSaveSession} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#762727" }}>
                Session / Conference Title *
              </label>
              <input
                type="text"
                value={sessionForm.title}
                onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                placeholder="e.g. Annual Nursing Conference 2026"
                className="w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1"
                style={{ borderColor: "#762727" }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#762727" }}>
                Short Description
              </label>
              <textarea
                value={sessionForm.description}
                onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                placeholder="Brief description of this event or session..."
                rows={2}
                className="w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none resize-none"
                style={{ borderColor: "#762727" }}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-white text-sm font-semibold"
                style={{ backgroundColor: "#762727" }}
              >
                {editingGallery ? "Save Changes" : "Create Session"}
              </button>
              <button
                type="button"
                onClick={resetSessionForm}
                className="px-5 py-2 rounded-full border-2 text-sm font-semibold"
                style={{ borderColor: "#762727", color: "#762727" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {sortedGalleries.length === 0 ? (
        <div
          className="text-center py-16 rounded-2xl border-2 border-dashed bg-white"
          style={{ borderColor: "rgba(118, 39, 39, 0.3)" }}
        >
          <ImagesIcon size={48} className="mx-auto mb-4" style={{ color: "#762727" }} />
          <p className="text-gray-600 font-medium">No sessions yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Click &quot;New Session&quot; to create your first conference or event gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Session list */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Your Sessions ({sortedGalleries.length})
            </p>
            {sortedGalleries.map((gallery, index) => {
              const isSelected = selectedId === gallery.id;
              const count = gallery.photos?.length ?? 0;
              return (
                <div
                  key={gallery.id}
                  className={`rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected ? "shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={isSelected ? { borderColor: "#762727", backgroundColor: "rgba(118,39,39,0.04)" } : {}}
                  onClick={() => setSelectedId(gallery.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm truncate" style={{ color: "#762727" }}>
                          {gallery.title}
                        </h4>
                        {gallery.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{gallery.description}</p>
                        )}
                        <span className="text-xs text-gray-400 mt-1 inline-block">
                          {count} photo{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMoveSession(gallery.id, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ChevronUpIcon size={14} style={{ color: "#762727" }} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSession(gallery.id, "down")}
                          disabled={index === sortedGalleries.length - 1}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                        >
                          <ChevronDownIcon size={14} style={{ color: "#762727" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Session detail + photos */}
          <div className="lg:col-span-8">
            {selectedGallery ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div
                  className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3"
                  style={{ backgroundColor: "rgba(118, 39, 39, 0.04)" }}
                >
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: "#762727" }}>
                      {selectedGallery.title}
                    </h3>
                    {selectedGallery.description && (
                      <p className="text-sm text-gray-600 mt-0.5">{selectedGallery.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditSession(selectedGallery)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border-2 font-semibold"
                      style={{ borderColor: "#762727", color: "#762727" }}
                    >
                      <EditIcon size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSession(selectedGallery)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50"
                    >
                      <TrashIcon size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Multi upload zone */}
                <div className="p-5 border-b border-gray-100">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    className="hidden"
                    id="gallery-multi-upload"
                    onChange={handleMultiUpload}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="gallery-multi-upload"
                    className={`flex flex-col items-center justify-center w-full py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      uploading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
                    }`}
                    style={{ borderColor: uploading ? "#9ca3af" : "#762727" }}
                  >
                    {uploading ? (
                      <div className="text-center">
                        <div
                          className="animate-spin rounded-full h-8 w-8 border-3 border-t-transparent mx-auto mb-2"
                          style={{ borderColor: "#762727" }}
                        />
                        <p className="text-sm font-medium" style={{ color: "#762727" }}>
                          {uploadProgress}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div
                          className="p-3 rounded-full mb-3"
                          style={{ backgroundColor: "rgba(118, 39, 39, 0.1)" }}
                        >
                          <ImagePlusIcon size={28} style={{ color: "#762727" }} />
                        </div>
                        <p className="text-sm font-semibold" style={{ color: "#762727" }}>
                          Upload Photos to This Session
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Select multiple images at once · PNG, JPG · Max 5MB each
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Photo grid */}
                <div className="p-5">
                  {(selectedGallery.photos?.length ?? 0) > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {selectedGallery.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                        >
                          <img
                            src={resolveImageUrl(photo.image)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Remove photo"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <UploadIcon size={32} className="mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No photos yet — use the upload area above</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">
                Select a session from the left to manage its photos
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
