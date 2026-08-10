"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EditIcon,
  HelpCircleIcon,
  ImagePlusIcon,
  NewspaperIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { toast } from "@/components/toast";
import ConfirmDialog from "@/components/confirm-dialog";
import type { INewsItem } from "@/types";
import { resolveImageUrl } from "@/lib/image-url";

const MAX_IMAGES = 5;

function toDateInputValue(value: string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

interface NewsManagerProps {
  news: INewsItem[];
  onRefresh: () => void;
}

export default function NewsManager({ news, onRefresh }: NewsManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<INewsItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    is_published: true,
    published_at: "",
    images: [] as string[],
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const sorted = [...news].sort((a, b) => a.display_order - b.display_order);

  useEffect(() => {
    if (!editing) return;
    setForm({
      title: editing.title,
      summary: editing.summary || "",
      content: editing.content,
      is_published: !!(editing.is_published === true || editing.is_published === 1),
      published_at: toDateInputValue(editing.published_at),
      images: (editing.images || []).map((img) => img.image),
    });
  }, [editing]);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  const resetForm = () => {
    setForm({
      title: "",
      summary: "",
      content: "",
      is_published: true,
      published_at: "",
      images: [],
    });
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      summary: "",
      content: "",
      is_published: true,
      published_at: "",
      images: [],
    });
    setShowForm(true);
  };

  const openEdit = (item: INewsItem) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleUpload = async (files: FileList | File[] | null) => {
    if (!files || (files as FileList).length === 0) return;
    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) {
      toast.error(`You already have ${MAX_IMAGES} images (maximum). Remove one to add another.`);
      return;
    }

    const list = Array.from(files as FileList).slice(0, remaining);
    const invalid = list.filter((f) => !["image/jpeg", "image/png"].includes(f.type));
    if (invalid.length) {
      toast.error("Only JPG and PNG images are allowed");
    }
    const selected = list.filter((f) => ["image/jpeg", "image/png"].includes(f.type));
    if (!selected.length) return;

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", credentials: "include", body });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || `Failed to upload ${file.name}`);
          continue;
        }
        uploaded.push(data.url);
      }
      if (uploaded.length) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
        toast.success(
          uploaded.length === 1
            ? "Image added. The first image is used as the cover."
            : `${uploaded.length} images added. The first image is used as the cover.`
        );
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    setForm((prev) => {
      const next = [...prev.images];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, images: next };
    });
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const next = [...prev.images];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return { ...prev, images: next };
    });
    toast.success("Cover image updated");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Please fill in Title and Full story (required fields)");
      return;
    }
    if (!form.published_at) {
      toast.error("Please choose a publish date");
      return;
    }
    if (form.images.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/news/${editing.id}` : "/api/news";
      const method = editing ? "PUT" : "POST";
      const payload = {
        title: form.title,
        summary: form.summary,
        content: form.content,
        is_published: form.is_published,
        published_at: form.published_at,
        images: form.images,
        display_order: editing ? editing.display_order : sorted.length,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save news");
        return;
      }
      toast.success(
        editing
          ? "News updated successfully"
          : form.is_published
            ? "News published on the website"
            : "News saved as draft"
      );
      resetForm();
      onRefresh();
    } catch {
      toast.error("Failed to save news");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: INewsItem) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete this news?",
      message: `"${item.title}" will be permanently deleted. This cannot be undone.`,
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
        try {
          const res = await fetch(`/api/news/${item.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            toast.success("News deleted");
            onRefresh();
          } else {
            toast.error("Failed to delete news");
          }
        } catch {
          toast.error("Failed to delete news");
        }
      },
    });
  };

  const reorder = async (id: number, direction: "up" | "down") => {
    const index = sorted.findIndex((n) => n.id === id);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sorted.length) return;

    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];

    try {
      await Promise.all(
        next.map((item, i) => {
          const publishedAt = toDateInputValue(item.published_at);
          return fetch(`/api/news/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              title: item.title,
              summary: item.summary || "",
              content: item.content,
              is_published: !!(item.is_published === true || item.is_published === 1),
              ...(publishedAt ? { published_at: publishedAt } : {}),
              images: (item.images || []).map((img) => img.image),
              display_order: i,
            }),
          });
        })
      );
      toast.success("Order updated — top item is the featured story");
      onRefresh();
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const togglePublished = async (item: INewsItem) => {
    const currentlyLive = item.is_published === true || item.is_published === 1;
    const nextLive = !currentlyLive;
    const publishedAt = toDateInputValue(item.published_at);
    if (nextLive && !publishedAt) {
      toast.error("Edit this story and set a publish date before showing it on the website");
      return;
    }
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: item.title,
          summary: item.summary || "",
          content: item.content,
          is_published: nextLive,
          ...(publishedAt ? { published_at: publishedAt } : {}),
          images: (item.images || []).map((img) => img.image),
          display_order: item.display_order,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update visibility");
        return;
      }
      toast.success(nextLive ? "Now showing on website" : "Hidden from website (draft)");
      onRefresh();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-bold" style={{ color: "#762727" }}>
            Manage News
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            Add stories for the website. The <strong>first item</strong> in this list becomes the
            big featured story on the homepage.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold w-full sm:w-auto flex-shrink-0"
            style={{ backgroundColor: "#762727" }}
          >
            <PlusIcon size={16} />
            Add new story
          </button>
        )}
      </div>

      {/* Quick how-to */}
      {!showForm && (
        <div className="rounded-xl border border-[#762727]/20 bg-[#762727]/[0.04] p-4 sm:p-5">
          <div className="flex items-start gap-2 mb-3">
            <HelpCircleIcon size={18} className="text-[#762727] mt-0.5 flex-shrink-0" />
            <p className="text-sm font-semibold" style={{ color: "#762727" }}>
              How to use (quick guide)
            </p>
          </div>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal pl-5">
            <li>
              Click <strong>Add new story</strong>, fill Title, Full story, and a{" "}
              <strong>Publish date</strong> (you choose it — it is not set automatically).
            </li>
            <li>
              Upload up to <strong>{MAX_IMAGES} photos</strong> — first photo = cover image.
            </li>
            <li>
              Use <strong>Show on website</strong> on each card to publish or hide quickly (no need to open Edit). A publish date must already be set.
            </li>
            <li>
              Use <strong>Move up / Move down</strong> to change homepage order (top = featured).
            </li>
            <li>
              Or open <strong>Edit</strong> for full changes (title, photos, content, date).
            </li>
          </ol>
        </div>
      )}

      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="bg-white rounded-xl border-2 p-4 sm:p-6 space-y-6 shadow-sm"
          style={{ borderColor: "#762727" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg" style={{ color: "#762727" }}>
                {editing ? "Edit story" : "Create a new story"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Fields marked * are required. You can save as draft anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
              aria-label="Close form"
            >
              <XIcon size={18} />
            </button>
          </div>

          {/* Step 1 */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2" style={{ color: "#762727" }}>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                1
              </span>
              Write the story
            </legend>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="e.g. GNOA Annual Conference 2026"
                required
              />
              <p className="mt-1 text-[11px] text-gray-500">Shown as the headline on the website.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Short summary <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="1–2 sentences for the homepage preview"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Full story <span className="text-red-600">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="Write the full article visitors will read…"
                required
              />
            </div>
          </fieldset>

          {/* Step 2 */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2" style={{ color: "#762727" }}>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                2
              </span>
              Add photos ({form.images.length}/{MAX_IMAGES})
            </legend>
            <p className="text-xs text-gray-500 -mt-1">
              JPG or PNG only. First photo = cover. Tap <strong>Set cover</strong> to change.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleUpload(e.dataTransfer.files);
              }}
              className={`rounded-xl border-2 border-dashed p-5 sm:p-6 text-center transition-colors ${
                dragOver ? "border-[#762727] bg-[#762727]/5" : "border-gray-300 bg-gray-50"
              }`}
            >
              <UploadIcon className="mx-auto mb-2 text-[#762727]/50" size={28} />
              <p className="text-sm text-gray-700 font-medium mb-1">
                {uploading ? "Uploading…" : "Drag & drop photos here"}
              </p>
              <p className="text-xs text-gray-500 mb-3">or</p>
              <button
                type="button"
                disabled={uploading || form.images.length >= MAX_IMAGES}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#762727" }}
              >
                <ImagePlusIcon size={16} />
                Choose photos
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                multiple
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {form.images.map((url, index) => (
                  <div
                    key={`${url}-${index}`}
                    className="rounded-xl overflow-hidden border border-gray-200 bg-white"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100">
                      <img src={resolveImageUrl(url)} alt="" className="w-full h-full object-cover" />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-white px-2 py-1 rounded-full shadow" style={{ color: "#762727" }}>
                          <StarIcon size={10} />
                          Cover
                        </span>
                      )}
                    </div>
                    <div className="p-2 flex flex-wrap gap-1.5">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsCover(index)}
                          className="flex-1 min-w-[5.5rem] px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-[#762727]/30 text-[#762727] hover:bg-[#762727]/5"
                        >
                          Set cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                        title="Move left / earlier"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, "down")}
                        disabled={index === form.images.length - 1}
                        className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                        title="Move right / later"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* Step 3 */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-bold flex items-center gap-2" style={{ color: "#762727" }}>
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#762727] text-white text-xs">
                3
              </span>
              Publish
            </legend>
            <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
                className="mt-1 rounded border-gray-300"
              />
              <span>
                <span className="block text-sm font-semibold text-gray-900">Show on website</span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  Uncheck to save as a draft (only admins can see it).
                </span>
              </span>
            </label>

            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Publish date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={form.published_at}
                onChange={(e) => setForm((p) => ({ ...p, published_at: e.target.value }))}
                required
                className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Choose the date shown on the website. It is not set automatically.
              </p>
            </div>
          </fieldset>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1">
            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border-2 text-sm font-semibold"
              style={{ borderColor: "#762727", color: "#762727" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-white text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: "#762727" }}
            >
              {saving
                ? "Saving…"
                : editing
                  ? "Save changes"
                  : form.is_published
                    ? "Publish story"
                    : "Save draft"}
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-14 sm:py-16 bg-white rounded-xl border border-gray-200 px-4">
          <NewspaperIcon className="mx-auto mb-3 text-gray-300" size={40} />
          <p className="text-gray-700 font-medium text-sm">No news yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Create your first story for the homepage.</p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: "#762727" }}
          >
            <PlusIcon size={16} />
            Add new story
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Your stories ({sorted.length}) — top = featured on homepage
          </p>
          {sorted.map((item, index) => {
            const cover = item.images?.[0]?.image;
            const published = item.is_published === true || item.is_published === 1;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col gap-3"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-20 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {cover ? (
                      <img src={resolveImageUrl(cover)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <NewspaperIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {index === 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#762727] text-white">
                          Featured
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {published ? "Live" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item.images?.length ?? 0}/{MAX_IMAGES} photos
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-0.5">
                      {item.summary || item.content}
                    </p>
                  </div>
                </div>

                {/* Always-visible labeled actions — mobile friendly */}
                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3 items-center">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={() => togglePublished(item)}
                      className="rounded border-gray-300"
                      style={{ accentColor: "#762727" }}
                    />
                    <span className={published ? "text-emerald-700" : "text-gray-600"}>
                      Show on website
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => reorder(item.id, "up")}
                    disabled={index === 0}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ArrowUpIcon size={14} />
                    Move up
                  </button>
                  <button
                    type="button"
                    onClick={() => reorder(item.id, "down")}
                    disabled={index === sorted.length - 1}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ArrowDownIcon size={14} />
                    Move down
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#762727]/30 text-[#762727] hover:bg-[#762727]/5"
                  >
                    <EditIcon size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
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
