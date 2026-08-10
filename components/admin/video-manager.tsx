"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EditIcon,
  HelpCircleIcon,
  PlusIcon,
  TrashIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { toast } from "@/components/toast";
import ConfirmDialog from "@/components/confirm-dialog";

interface Video {
  id: number;
  video_id: string;
  title: string;
  description?: string;
  display_order: number;
}

interface VideoManagerProps {
  videos: Video[];
  onRefresh: () => void;
}

function extractYouTubeVideoId(urlOrId: string): string {
  if (!urlOrId) return "";
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return trimmed;
}

export default function VideoManager({ videos, onRefresh }: VideoManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ video_id: "", title: "", description: "" });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const sorted = [...videos].sort((a, b) => {
    if (a.display_order !== b.display_order) return a.display_order - b.display_order;
    return a.id - b.id;
  });

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  const resetForm = () => {
    setForm({ video_id: "", title: "", description: "" });
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ video_id: "", title: "", description: "" });
    setShowForm(true);
  };

  const openEdit = (video: Video) => {
    setEditing(video);
    setForm({
      video_id: video.video_id,
      title: video.title,
      description: video.description || "",
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const extracted = extractYouTubeVideoId(form.video_id);
    if (!extracted || extracted.length !== 11) {
      toast.error("Paste a valid YouTube link or 11-character video ID");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/videos/${editing.id}` : "/api/videos";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          video_id: extracted,
          title: form.title.trim(),
          description: form.description.trim() || null,
          display_order: editing ? editing.display_order : sorted.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save video");
        return;
      }
      toast.success(editing ? "Video updated" : "Video added to the website");
      resetForm();
      onRefresh();
    } catch {
      toast.error("Failed to save video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (video: Video) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete this video?",
      message: `"${video.title}" will be removed from the website. This cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
        try {
          const res = await fetch(`/api/videos/${video.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            toast.success("Video deleted");
            onRefresh();
          } else {
            const data = await res.json();
            toast.error(data.error || "Failed to delete video");
          }
        } catch {
          toast.error("Failed to delete video");
        }
      },
    });
  };

  const reorder = async (id: number, direction: "up" | "down") => {
    const index = sorted.findIndex((v) => v.id === id);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];

    try {
      await Promise.all(
        next.map((video, i) =>
          fetch(`/api/videos/${video.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              video_id: video.video_id,
              title: video.title,
              description: video.description || null,
              display_order: i,
            }),
          })
        )
      );
      toast.success("Order updated");
      onRefresh();
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const cleanId = extractYouTubeVideoId(form.video_id);
  const idLooksValid = cleanId.length === 11;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-[#762727]">Manage Videos</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            Add YouTube videos for the homepage Videos section. Top items appear first.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold w-full sm:w-auto bg-[#762727]"
          >
            <PlusIcon size={16} />
            Add video
          </button>
        )}
      </div>

      {!showForm && (
        <div className="rounded-xl border border-[#762727]/20 bg-[#762727]/[0.04] p-4 sm:p-5">
          <div className="flex items-start gap-2 mb-3">
            <HelpCircleIcon size={18} className="text-[#762727] mt-0.5 flex-shrink-0" />
            <p className="text-sm font-semibold text-[#762727]">How to use (quick guide)</p>
          </div>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
            <li>
              Click <strong>Add video</strong> and paste a YouTube link (or video ID).
            </li>
            <li>Give it a clear title visitors will understand.</li>
            <li>
              Use <strong>Move up / Move down</strong> to change the order on the website.
            </li>
          </ol>
        </div>
      )}

      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="bg-white rounded-xl border-2 border-[#762727] p-4 sm:p-6 space-y-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#762727]">
                {editing ? "Edit video" : "Add a YouTube video"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Fields marked * are required. Paste any YouTube link — we extract the ID for you.
              </p>
            </div>
            <button type="button" onClick={resetForm} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
              <XIcon size={18} />
            </button>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2 text-[#762727]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                1
              </span>
              Paste the YouTube link
            </legend>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                YouTube link or ID <span className="text-red-600">*</span>
              </label>
              <input
                value={form.video_id}
                onChange={(e) => setForm((p) => ({ ...p, video_id: e.target.value }))}
                onBlur={(e) => {
                  const extracted = extractYouTubeVideoId(e.target.value);
                  if (extracted && extracted !== e.target.value) {
                    setForm((p) => ({ ...p, video_id: extracted }));
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="https://youtu.be/el0tnpG7xqw"
                required
              />
              {form.video_id && (
                <p className={`text-xs mt-1.5 ${idLooksValid ? "text-emerald-600" : "text-amber-600"}`}>
                  {idLooksValid ? `✓ Video ID ready: ${cleanId}` : "Waiting for a valid YouTube link…"}
                </p>
              )}
              {idLooksValid && (
                <div className="mt-3 w-40 sm:w-48 aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={`https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2 text-[#762727]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                2
              </span>
              Title & details
            </legend>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="e.g. GNOA Conference Highlights"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Short description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="Optional note shown under the video"
              />
            </div>
          </fieldset>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 border-[#762727] text-sm font-semibold text-[#762727]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-[#762727] disabled:opacity-60"
            >
              {saving ? "Saving…" : editing ? "Save changes" : "Add video"}
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-xl border border-gray-200 px-4">
          <VideoIcon className="mx-auto mb-3 text-gray-300" size={40} />
          <p className="text-gray-700 font-medium text-sm">No videos yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Add your first YouTube video for the homepage.</p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-[#762727]"
          >
            <PlusIcon size={16} />
            Add video
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Your videos ({sorted.length})
          </p>
          {sorted.map((video, index) => (
            <div
              key={video.id}
              className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col gap-3"
            >
              <div className="flex gap-3 sm:gap-4">
                <div className="w-28 sm:w-36 aspect-video rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  <img
                    src={`https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-[#762727] underline"
                  >
                    Open on YouTube
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => reorder(video.id, "up")}
                  disabled={index === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                >
                  <ArrowUpIcon size={14} />
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => reorder(video.id, "down")}
                  disabled={index === sorted.length - 1}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                >
                  <ArrowDownIcon size={14} />
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(video)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#762727]/30 text-[#762727] hover:bg-[#762727]/5"
                >
                  <EditIcon size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(video)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <TrashIcon size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Keep it"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, isOpen: false }))}
        type="danger"
      />
    </div>
  );
}
