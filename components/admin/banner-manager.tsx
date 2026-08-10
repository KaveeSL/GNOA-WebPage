"use client";

import { useEffect, useRef, useState } from "react";
import {
  EditIcon,
  HelpCircleIcon,
  MegaphoneIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { toast } from "@/components/toast";
import ConfirmDialog from "@/components/confirm-dialog";

interface Banner {
  id: number;
  message: string;
  link_text?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BannerManagerProps {
  banners: Banner[];
  onRefresh: () => void;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function BannerManager({ banners, onRefresh }: BannerManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    message: "",
    link_text: "",
    link_url: "",
    is_active: true,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const words = wordCount(form.message);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm]);

  const resetForm = () => {
    setForm({ message: "", link_text: "", link_url: "", is_active: true });
    setEditing(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ message: "", link_text: "", link_url: "", is_active: true });
    setShowForm(true);
  };

  const openEdit = (banner: Banner) => {
    setEditing(banner);
    setForm({
      message: banner.message,
      link_text: banner.link_text || "",
      link_url: banner.link_url || "",
      is_active: !!banner.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      toast.error("Please enter a banner message");
      return;
    }
    if (words > 35) {
      toast.error("Banner message cannot exceed 35 words");
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/banner/${editing.id}` : "/api/banner";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save banner");
        return;
      }
      toast.success(
        editing
          ? "Banner updated"
          : form.is_active
            ? "Banner created and set live"
            : "Banner saved (inactive)"
      );
      resetForm();
      onRefresh();
    } catch {
      toast.error("Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (banner: Banner) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete this banner?",
      message: "This banner will be removed permanently.",
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
        try {
          const res = await fetch(`/api/banner/${banner.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (res.ok) {
            toast.success("Banner deleted");
            onRefresh();
          } else {
            const data = await res.json();
            toast.error(data.error || "Failed to delete banner");
          }
        } catch {
          toast.error("Failed to delete banner");
        }
      },
    });
  };

  const toggleShowOnWebsite = async (banner: Banner) => {
    const nextLive = !banner.is_active;
    try {
      const res = await fetch(`/api/banner/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: banner.message,
          link_text: banner.link_text || "",
          link_url: banner.link_url || "",
          is_active: nextLive,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to update visibility");
        return;
      }
      toast.success(nextLive ? "Banner is now live on website" : "Banner hidden from website");
      onRefresh();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-[#762727]">Manage Banner</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            The top site banner visitors see above the navbar. Only one banner can be live at a time.
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold w-full sm:w-auto bg-[#762727]"
          >
            <PlusIcon size={16} />
            Add banner
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
              Click <strong>Add banner</strong> and write a short message (max 35 words).
            </li>
            <li>Optional: add a button label + link (e.g. “Register now”).</li>
            <li>
              Use <strong>Show on website</strong> on each banner card to turn it live or hide it quickly.
            </li>
            <li>
              Or open <strong>Edit</strong> for full message/link changes.
            </li>
          </ol>
        </div>
      )}

      {showForm && (
        <form
          ref={formRef}
          onSubmit={handleSave}
          className="bg-white rounded-xl border-2 border-[#762727] p-4 sm:p-6 space-y-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#762727]">
                {editing ? "Edit banner" : "Create a banner"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Keep it short so it fits on mobile screens.
              </p>
            </div>
            <button type="button" onClick={resetForm} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close">
              <XIcon size={18} />
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 text-gray-800">
              Message <span className="text-red-600">*</span>{" "}
              <span className={`font-normal ${words > 35 ? "text-red-600" : "text-gray-500"}`}>
                ({words}/35 words)
              </span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => {
                if (wordCount(e.target.value) <= 35) {
                  setForm((p) => ({ ...p, message: e.target.value }));
                }
              }}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
              placeholder="e.g. Membership applications are now open"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Button text <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                value={form.link_text}
                onChange={(e) => setForm((p) => ({ ...p, link_text: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="e.g. Register now"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                Button link <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={form.link_url}
                onChange={(e) => setForm((p) => ({ ...p, link_url: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#762727]/30"
                placeholder="https://…"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="mt-1 rounded border-gray-300"
            />
            <span>
              <span className="block text-sm font-semibold text-gray-900">Show on website (live)</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Making this live will replace any currently active banner.
              </span>
            </span>
          </label>

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
              {saving ? "Saving…" : editing ? "Save changes" : "Create banner"}
            </button>
          </div>
        </form>
      )}

      {banners.length === 0 ? (
        <div className="text-center py-14 bg-white rounded-xl border border-gray-200 px-4">
          <MegaphoneIcon className="mx-auto mb-3 text-gray-300" size={40} />
          <p className="text-gray-700 font-medium text-sm">No banners yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">Create a top announcement for the website.</p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-[#762727]"
          >
            <PlusIcon size={16} />
            Add banner
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Your banners ({banners.length})
          </p>
          {banners.map((banner) => {
            const live = !!banner.is_active;
            return (
              <div
                key={banner.id}
                className={`bg-white rounded-xl border p-3 sm:p-4 ${
                  live ? "border-[#762727] ring-1 ring-[#762727]/20" : "border-gray-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      live ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {live ? "Live now" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-400">
                    Created {new Date(banner.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{banner.message}</p>
                {banner.link_text && banner.link_url && (
                  <p className="text-xs text-gray-500 mt-1">
                    Button:{" "}
                    <a
                      href={banner.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[#762727]"
                    >
                      {banner.link_text}
                    </a>
                  </p>
                )}
                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3 mt-3 items-center">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={live}
                      onChange={() => toggleShowOnWebsite(banner)}
                      className="rounded border-gray-300"
                      style={{ accentColor: "#762727" }}
                    />
                    <span className={live ? "text-emerald-700" : "text-gray-600"}>
                      Show on website
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => openEdit(banner)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#762727]/30 text-[#762727] hover:bg-[#762727]/5"
                  >
                    <EditIcon size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner)}
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
