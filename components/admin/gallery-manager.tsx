"use client";

import { useState, useRef, useEffect } from "react";
import {
  EditIcon,
  TrashIcon,
  UploadIcon,
  ImagesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XIcon,
  FolderPlusIcon,
  ImagePlusIcon,
  HelpCircleIcon,
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
  const pendingSelectIdRef = useRef<number | null>(null);
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
      pendingSelectIdRef.current = null;
      return;
    }
    const sorted = [...galleries].sort((a, b) => a.display_order - b.display_order);

    // After creating a session, keep that one selected (don't jump back to the top)
    const pending = pendingSelectIdRef.current;
    if (pending != null && sorted.some((g) => g.id === pending)) {
      setSelectedId(pending);
      pendingSelectIdRef.current = null;
      requestAnimationFrame(() => {
        document
          .getElementById(`gallery-session-${pending}`)
          ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      return;
    }

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

      toast.success(editingGallery ? "Session updated" : "Session created — now add photos");
      const createdId =
        !editingGallery && data.id != null ? Number(data.id) : null;
      if (createdId != null && !Number.isNaN(createdId)) {
        pendingSelectIdRef.current = createdId;
        setSelectedId(createdId);
      }
      resetSessionForm();
      onRefresh();
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
          <h2 className="text-lg md:text-xl font-bold" style={{ color: "#762727" }}>
            Photo Galleries
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Create an event session first, then upload photos into it.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetSessionForm();
            setShowSessionForm(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold w-full sm:w-auto"
          style={{ backgroundColor: "#762727" }}
        >
          <FolderPlusIcon size={16} />
          New session
        </button>
      </div>

      {!showSessionForm && (
        <div className="rounded-xl border border-[#762727]/20 bg-[#762727]/[0.04] p-4 sm:p-5 mb-6">
          <div className="flex items-start gap-2 mb-3">
            <HelpCircleIcon size={18} className="text-[#762727] mt-0.5 flex-shrink-0" />
            <p className="text-sm font-semibold text-[#762727]">How to use (quick guide)</p>
          </div>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
            <li>
              Click <strong>New session</strong> and name the event (e.g. Annual Conference 2026).
            </li>
            <li>
              Select that session on the left, then use <strong>Upload photos</strong> (multiple at once).
            </li>
            <li>
              Use <strong>Move up / Move down</strong> to change session order on the website.
            </li>
          </ol>
        </div>
      )}

      {/* Session form — same stepped style as News */}
      {showSessionForm && (
        <form
          onSubmit={handleSaveSession}
          className="bg-white rounded-xl border-2 border-[#762727] p-4 sm:p-6 mb-6 space-y-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#762727]">
                {editingGallery ? "Edit session" : "Create a new session"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                A session is one event or conference. You upload photos into it after creating.
              </p>
            </div>
            <button
              type="button"
              onClick={resetSessionForm}
              className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
              aria-label="Close form"
            >
              <XIcon size={18} />
            </button>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2 text-[#762727]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                1
              </span>
              Name the session
            </legend>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Session / conference title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={sessionForm.title}
                onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                placeholder="e.g. Annual Nursing Conference 2026"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                required
              />
              <p className="mt-1 text-[11px] text-gray-500">Shown as the gallery heading on the website.</p>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2 text-[#762727]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                2
              </span>
              Optional details
            </legend>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Short description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={sessionForm.description}
                onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                placeholder="Brief description of this event or session…"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30 resize-none"
              />
            </div>
          </fieldset>

          <div className="rounded-xl border border-[#762727]/15 bg-[#762727]/[0.04] p-3 text-xs text-gray-600">
            <strong className="text-[#762727]">Next step:</strong> after you save, select this session and
            upload photos from the panel on the right.
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={resetSessionForm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-[#762727] text-sm font-semibold text-[#762727]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-[#762727]"
            >
              {editingGallery ? "Save changes" : "Create session"}
            </button>
          </div>
        </form>
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
                  id={`gallery-session-${gallery.id}`}
                  className={`rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected ? "shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={isSelected ? { borderColor: "#762727", backgroundColor: "rgba(118,39,39,0.04)" } : {}}
                  onClick={() => setSelectedId(gallery.id)}
                >
                  <div className="p-4">
                    <div className="min-w-0">
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
                    <div
                      className="flex flex-wrap gap-1.5 mt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleMoveSession(gallery.id, "up")}
                        disabled={index === 0}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ArrowUpIcon size={12} />
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSession(gallery.id, "down")}
                        disabled={index === sortedGalleries.length - 1}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                      >
                        <ArrowDownIcon size={12} />
                        Down
                      </button>
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
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-red-500 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg"
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
