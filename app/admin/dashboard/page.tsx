"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LogOutIcon,
  ImageIcon,
  VideoIcon,
  MegaphoneIcon,
  NewspaperIcon,
} from "lucide-react";
import { toast } from "@/components/toast";
import ToastContainer from "@/components/toast";
import ConfirmDialog from "@/components/confirm-dialog";
import GalleryManager from "@/components/admin/gallery-manager";
import NewsManager from "@/components/admin/news-manager";
import VideoManager from "@/components/admin/video-manager";
import BannerManager from "@/components/admin/banner-manager";
import type { IPhotoGallery, INewsItem } from "@/types";

interface Video {
  id: number;
  video_id: string;
  title: string;
  description?: string;
  display_order: number;
}

interface Banner {
  id: number;
  message: string;
  link_text?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"photos" | "news" | "videos" | "banner">("photos");
  const [galleries, setGalleries] = useState<IPhotoGallery[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [news, setNews] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnceRef = useRef(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    type?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const res = await fetch("/api/auth/verify");
    const data = await res.json();
    if (!data.authenticated) {
      router.push("/admin/login");
    }
  };

  const fetchData = async () => {
    // Only show full-page loading on first visit — silent refresh keeps scroll position
    // (e.g. when toggling "Show on website")
    const isFirstLoad = !hasLoadedOnceRef.current;
    if (isFirstLoad) {
      setLoading(true);
    }
    try {
      const [galleriesRes, videosRes, bannersRes, newsRes] = await Promise.all([
        fetch("/api/galleries"),
        fetch("/api/videos"),
        fetch("/api/banners", { credentials: "include" }),
        fetch("/api/news", { credentials: "include" }),
      ]);
      const galleriesData = await galleriesRes.json();
      const videosData = await videosRes.json();
      const bannersData = await bannersRes.json();
      const newsData = await newsRes.json();
      setGalleries(Array.isArray(galleriesData) ? galleriesData : []);
      setVideos(Array.isArray(videosData) ? videosData : []);
      setBanners(Array.isArray(bannersData) ? bannersData : []);
      setNews(Array.isArray(newsData) ? newsData : []);
      hasLoadedOnceRef.current = true;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (isFirstLoad) setLoading(false);
    }
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Confirm Logout",
      message: "Are you sure you want to logout? You will need to login again to access the dashboard.",
      confirmText: "Logout",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
        await fetch("/api/auth/logout", { method: "POST" });
        toast.success("Logged out successfully");
        router.push("/admin/login");
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl font-semibold" style={{ color: "#762727" }}>
          Loading...
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "photos" as const,
      label: "Photo Galleries",
      singular: "session",
      plural: "sessions",
      count: galleries.length,
      icon: ImageIcon,
    },
    {
      id: "news" as const,
      label: "News",
      singular: "story",
      plural: "stories",
      count: news.length,
      icon: NewspaperIcon,
    },
    {
      id: "videos" as const,
      label: "Videos",
      singular: "video",
      plural: "videos",
      count: videos.length,
      icon: VideoIcon,
    },
    {
      id: "banner" as const,
      label: "Banner",
      singular: "banner",
      plural: "banners",
      count: banners.length,
      icon: MegaphoneIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f4]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-[#762727]/10 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-3 md:py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#762727]/[0.06] ring-1 ring-[#762727]/10">
              <Image
                src="/assets/gnoalogo.png"
                alt="GNOA Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#762727]/70">
                Admin
              </p>
              <h1 className="font-urbanist text-base sm:text-lg md:text-xl font-bold text-[#762727] truncate leading-tight">
                GNOA Dashboard
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-[#762727]/20 bg-white px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#762727] transition-colors hover:bg-[#762727] hover:text-white hover:border-[#762727]"
          >
            <LogOutIcon size={15} />
            Logout
          </button>
        </div>
      </header>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto py-6 md:py-10">
          {/* Section tabs */}
          <nav
            aria-label="Admin sections"
            className="mb-6 md:mb-8 rounded-2xl border border-[#762727]/10 bg-white p-1.5 sm:p-2 shadow-[0_4px_24px_rgba(118,39,39,0.06)]"
          >
            <div className="flex gap-1 sm:gap-1.5 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex flex-1 min-w-[9.5rem] sm:min-w-0 items-center gap-2.5 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all ${
                      active
                        ? "bg-[#762727] text-white shadow-md shadow-[#762727]/25"
                        : "text-gray-600 hover:bg-[#762727]/[0.06] hover:text-[#762727]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-[#762727]/[0.08] text-[#762727]"
                      }`}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold leading-tight truncate ${
                          active ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span
                        className={`mt-0.5 block text-[11px] font-medium ${
                          active ? "text-white/75" : "text-gray-500"
                        }`}
                      >
                        {tab.count} {tab.count === 1 ? tab.singular : tab.plural}
                      </span>
                    </span>
                    <span
                      className={`ml-auto flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${
                        active
                          ? "bg-white text-[#762727]"
                          : "bg-gray-100 text-gray-600 group-hover:bg-[#762727]/10 group-hover:text-[#762727]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {activeTab === "photos" && (
            <GalleryManager galleries={galleries} onRefresh={fetchData} />
          )}
          {activeTab === "news" && <NewsManager news={news} onRefresh={fetchData} />}
          {activeTab === "videos" && (
            <VideoManager videos={videos} onRefresh={fetchData} />
          )}
          {activeTab === "banner" && (
            <BannerManager banners={banners} onRefresh={fetchData} />
          )}
        </div>
      </div>

      <ToastContainer />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
}
