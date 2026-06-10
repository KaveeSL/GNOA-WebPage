"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlusIcon, EditIcon, TrashIcon, LogOutIcon, ImageIcon, VideoIcon, MegaphoneIcon, ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
import { toast } from '@/components/toast';
import ToastContainer from '@/components/toast';
import ConfirmDialog from '@/components/confirm-dialog';
import GalleryManager from '@/components/admin/gallery-manager';
import type { IPhotoGallery } from '@/types';

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
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'banner'>('photos');
  const [galleries, setGalleries] = useState<IPhotoGallery[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteError, setDeleteError] = useState<string>('');
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    video_id: '',
    title: '',
    description: '',
    display_order: 0
  });

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    message: '',
    link_text: '',
    link_url: '',
    is_active: true
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/auth/verify');
    const data = await res.json();
    if (!data.authenticated) {
      router.push('/admin/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [galleriesRes, videosRes, bannersRes] = await Promise.all([
        fetch('/api/galleries'),
        fetch('/api/videos'),
        fetch('/api/banners', { credentials: 'include' })
      ]);
      const galleriesData = await galleriesRes.json();
      const videos = await videosRes.json();
      const banners = await bannersRes.json();
      setGalleries(galleriesData);
      setVideos(videos);
      setBanners(banners);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout? You will need to login again to access the dashboard.',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out successfully');
        router.push('/admin/login');
      },
    });
  };

  // Extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (urlOrId: string): string => {
    if (!urlOrId) return '';
    
    // If it's already just an ID (11 characters, alphanumeric with hyphens/underscores)
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId.trim())) {
      return urlOrId.trim();
    }

    // Try to extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = urlOrId.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If no pattern matches, return the original (might be invalid, but let backend handle it)
    return urlOrId.trim();
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract and validate video ID
    const extractedVideoId = extractYouTubeVideoId(videoForm.video_id);
    if (!extractedVideoId || extractedVideoId.length !== 11) {
      toast.error('Please enter a valid YouTube video URL or video ID (11 characters)');
      return;
    }

    const url = editingVideo 
      ? `/api/videos/${editingVideo.id}`
      : '/api/videos';
    const method = editingVideo ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...videoForm,
          video_id: extractedVideoId
        })
      });

      if (res.ok) {
        setShowVideoForm(false);
        setEditingVideo(null);
        setVideoForm({ video_id: '', title: '', description: '', display_order: 0 });
        fetchData();
        toast.success(editingVideo ? 'Video updated successfully' : 'Video created successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save video');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    }
  };

  const handleDeleteVideo = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Video',
      message: 'Are you sure you want to delete this video? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        setDeleteError('');
        try {
          const res = await fetch(`/api/videos/${id}`, { 
            method: 'DELETE',
            credentials: 'include'
          });
          
          const data = await res.json();
          
          if (res.ok) {
            fetchData();
            toast.success('Video deleted successfully');
          } else {
            const errorMsg = data.error || data.message || 'Failed to delete video';
            setDeleteError(errorMsg);
            toast.error(errorMsg);
          }
        } catch (error: any) {
          console.error('Error deleting video:', error);
          const errorMsg = error.message || 'Failed to delete video. Please try again.';
          setDeleteError(errorMsg);
          toast.error(errorMsg);
        }
      },
    });
  };

  const openEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVideoForm({
      video_id: video.video_id,
      title: video.title,
      description: video.description || '',
      display_order: video.display_order
    });
    setShowVideoForm(true);
    setTimeout(() => {
      document.getElementById('video-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate word count (max 35 words)
    const wordCount = bannerForm.message.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 35) {
      toast.error('Banner message cannot exceed 35 words. Please reduce the message length.');
      return;
    }
    
    try {
      const url = editingBanner 
        ? `/api/banner/${editingBanner.id}`
        : '/api/banner';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bannerForm)
      });

      if (res.ok) {
        fetchData();
        setShowBannerForm(false);
        setEditingBanner(null);
        setBannerForm({ message: '', link_text: '', link_url: '', is_active: true });
        toast.success(editingBanner ? 'Banner updated successfully' : 'Banner created successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id: number) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Banner',
      message: 'Are you sure you want to delete this banner? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
        try {
          const res = await fetch(`/api/banner/${id}`, { 
            method: 'DELETE',
            credentials: 'include'
          });
          
          if (res.ok) {
            fetchData();
            toast.success('Banner deleted successfully');
          } else {
            const data = await res.json();
            toast.error(data.error || 'Failed to delete banner');
          }
        } catch (error: any) {
          console.error('Error deleting banner:', error);
          toast.error('Failed to delete banner. Please try again.');
        }
      },
    });
  };

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      message: banner.message,
      link_text: banner.link_text || '',
      link_url: banner.link_url || '',
      is_active: banner.is_active
    });
    setShowBannerForm(true);
    setTimeout(() => {
      document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cancelBannerForm = () => {
    setShowBannerForm(false);
    setEditingBanner(null);
    setBannerForm({ message: '', link_text: '', link_url: '', is_active: true });
  };

  const handleMoveVideo = async (videoId: number, direction: 'up' | 'down') => {
    const sortedVideos = [...videos].sort((a, b) => {
      // Primary sort by display_order, secondary by id for consistency
      if (a.display_order !== b.display_order) {
        return a.display_order - b.display_order;
      }
      return a.id - b.id;
    });
    
    const currentIndex = sortedVideos.findIndex(v => v.id === videoId);
    
    if (currentIndex === -1) {
      console.error('Video not found:', videoId);
      return;
    }
    
    if (direction === 'up' && currentIndex === 0) {
      return;
    }
    if (direction === 'down' && currentIndex === sortedVideos.length - 1) {
      return;
    }
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Create new array with swapped items
    const newOrder = [...sortedVideos];
    [newOrder[currentIndex], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[currentIndex]];
    
    // Reassign sequential display_order values (0, 1, 2, 3...)
    const updates = newOrder.map((video, idx) => ({
      ...video,
      display_order: idx
    }));
    
    try {
      // Update all videos with new sequential display_order values
      const updatePromises = updates.map(video => 
        fetch(`/api/videos/${video.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            video_id: video.video_id,
            title: video.title,
            description: video.description || null,
            display_order: video.display_order
          })
        })
      );
      
      const responses = await Promise.all(updatePromises);
      const results = await Promise.all(responses.map(r => r.json()));
      
      const failed = results.filter((r, i) => !responses[i].ok);
      if (failed.length > 0) {
        throw new Error(failed[0].error || 'Failed to update some videos');
      }
      
      fetchData();
    } catch (error: any) {
      console.error('Error reordering video:', error);
      toast.error(error.message || 'Failed to reorder video');
    }
  };

  const handleSetActiveBanner = async (id: number) => {
    try {
      // First, get the banner to update
      const banner = banners.find(b => b.id === id);
      if (!banner) return;

      const res = await fetch(`/api/banner/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: banner.message,
          link_text: banner.link_text || '',
          link_url: banner.link_url || '',
          is_active: true
        })
      });

      if (res.ok) {
        fetchData();
        toast.success('Banner activated successfully');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to activate banner');
      }
    } catch (error) {
      console.error('Error activating banner:', error);
      toast.error('Failed to activate banner');
    }
  };

  const cancelVideoForm = () => {
    setShowVideoForm(false);
    setEditingVideo(null);
    setVideoForm({ video_id: '', title: '', description: '', display_order: 0 });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl font-semibold" style={{ color: '#762727' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image src="/assets/gnoalogo.png" alt="GNOA Logo" width={40} height={40} className="h-10 w-auto" />
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide" style={{ color: '#762727' }}>GNOA Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: '#762727' }}
          >
            <LogOutIcon size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="px-4 md:px-16 lg:px-24 xl:px-32 border-x border-gray-200">
        <div className="max-w-7xl mx-auto p-4 pt-8 md:p-8 md:pt-12">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-300 overflow-x-auto">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2.5 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 text-sm ${
                activeTab === 'photos'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'photos' ? { borderBottom: '3px solid #762727', color: '#762727' } : {}}
            >
              <ImageIcon size={18} />
              Photo Galleries ({galleries.length})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2.5 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 text-sm ${
                activeTab === 'videos'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'videos' ? { borderBottom: '3px solid #762727', color: '#762727' } : {}}
            >
              <VideoIcon size={18} />
              Videos ({videos.length})
            </button>
            <button
              onClick={() => setActiveTab('banner')}
              className={`px-4 py-2.5 font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 text-sm ${
                activeTab === 'banner'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'banner' ? { borderBottom: '3px solid #762727', color: '#762727' } : {}}
            >
              <MegaphoneIcon size={18} />
              Banner ({banners.length})
            </button>
          </div>

          {deleteError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {deleteError}
            </div>
          )}

          {activeTab === 'photos' && (
            <GalleryManager galleries={galleries} onRefresh={fetchData} />
          )}

          {activeTab === 'videos' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#762727' }}>Manage Videos</h2>
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoForm({ video_id: '', title: '', description: '', display_order: 0 });
                    setShowVideoForm(!showVideoForm);
                    if (!showVideoForm) {
                      setTimeout(() => {
                        document.getElementById('video-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#762727' }}
                >
                  <PlusIcon size={16} />
                  {showVideoForm ? 'Cancel' : 'Add Video'}
                </button>
              </div>

              {/* Video Form */}
              {showVideoForm && (
                <div id="video-form" className="bg-white/70 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-4 md:p-6 mb-6 border-2 transition-all duration-300 hover:shadow-xl" style={{ borderColor: '#762727' }}>
                  <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#762727' }}>
                    {editingVideo ? 'Edit Video' : 'Add New Video'}
                  </h3>
                  <form onSubmit={handleVideoSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>YouTube Video URL or ID *</label>
                      <input
                        type="text"
                        value={videoForm.video_id}
                        onChange={(e) => {
                          const input = e.target.value;
                          // Auto-extract video ID when user pastes a URL
                          const extracted = extractYouTubeVideoId(input);
                          setVideoForm({ ...videoForm, video_id: extracted || input });
                        }}
                        onBlur={(e) => {
                          // Extract video ID on blur to clean up the input
                          const extracted = extractYouTubeVideoId(e.target.value);
                          if (extracted && extracted !== e.target.value) {
                            setVideoForm({ ...videoForm, video_id: extracted });
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                        style={{ borderColor: '#762727' }}
                        placeholder="e.g., https://youtu.be/el0tnpG7xqw or el0tnpG7xqw"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Paste the full YouTube URL or just the video ID. The video ID will be automatically extracted.
                      </p>
                      {videoForm.video_id && extractYouTubeVideoId(videoForm.video_id) && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Video ID: {extractYouTubeVideoId(videoForm.video_id)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>Title *</label>
                      <input
                        type="text"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                        style={{ borderColor: '#762727' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>Description</label>
                      <textarea
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all resize-none"
                        style={{ borderColor: '#762727' }}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>Display Order</label>
                      <input
                        type="number"
                        value={videoForm.display_order}
                        onChange={(e) => setVideoForm({ ...videoForm, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                        style={{ borderColor: '#762727' }}
                        min="0"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t-2" style={{ borderColor: '#762727' }}>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: '#762727' }}
                      >
                        {editingVideo ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelVideoForm}
                        className="px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                        style={{ borderColor: '#762727', color: '#762727' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Videos Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...videos].sort((a, b) => a.display_order - b.display_order).map((video, index, sortedArray) => (
                  <div key={video.id} className="bg-white/70 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] overflow-hidden transition-all duration-300">
                    <div className="aspect-video bg-gray-200 relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.video_id}?rel=0&modestbranding=1&showinfo=0&controls=1`}
                        className="w-full h-full absolute top-0 left-0"
                        frameBorder="0"
                        allowFullScreen
                        style={{ border: 'none' }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-base flex-1" style={{ color: '#762727' }}>{video.title}</h3>
                        <div className="flex flex-col gap-1 ml-2">
                          <button
                            onClick={() => handleMoveVideo(video.id, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ChevronUpIcon size={16} style={{ color: '#762727' }} />
                          </button>
                          <button
                            onClick={() => handleMoveVideo(video.id, 'down')}
                            disabled={index === sortedArray.length - 1}
                            className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ChevronDownIcon size={16} style={{ color: '#762727' }} />
                          </button>
                        </div>
                      </div>
                      {video.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Order: {video.display_order}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditVideo(video)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border-2 transition-all duration-300 hover:scale-105 font-semibold"
                          style={{ borderColor: '#762727', color: '#762727' }}
                        >
                          <EditIcon size={14} className="inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white transition-all duration-300 hover:scale-105 hover:bg-red-600 font-semibold"
                        >
                          <TrashIcon size={14} className="inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banner' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: '#762727' }}>Manage Banner</h2>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerForm({ message: '', link_text: '', link_url: '', is_active: true });
                    setShowBannerForm(!showBannerForm);
                    if (!showBannerForm) {
                      setTimeout(() => {
                        document.getElementById('banner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#762727' }}
                >
                  <PlusIcon size={16} />
                  {showBannerForm ? 'Cancel' : 'Add Banner'}
                </button>
              </div>

              {/* Banner Form */}
              {showBannerForm && (
                <div id="banner-form" className="bg-white/70 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-4 md:p-6 mb-6 border-2 transition-all duration-300 hover:shadow-xl" style={{ borderColor: '#762727' }}>
                  <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: '#762727' }}>
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h3>
                  <form onSubmit={handleBannerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>
                        Message * (Max 35 words)
                        {bannerForm.message && (
                          <span className={`ml-2 text-xs ${bannerForm.message.trim().split(/\s+/).filter(word => word.length > 0).length > 35 ? 'text-red-600' : 'text-gray-500'}`}>
                            ({bannerForm.message.trim().split(/\s+/).filter(word => word.length > 0).length}/35 words)
                          </span>
                        )}
                      </label>
                      <textarea
                        value={bannerForm.message}
                        onChange={(e) => {
                          const words = e.target.value.trim().split(/\s+/).filter(word => word.length > 0);
                          if (words.length <= 35) {
                            setBannerForm({ ...bannerForm, message: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                        style={{ borderColor: bannerForm.message.trim().split(/\s+/).filter(word => word.length > 0).length > 35 ? '#ef4444' : '#762727' }}
                        placeholder="Enter banner message (max 35 words)"
                        rows={3}
                        required
                      />
                      {bannerForm.message.trim().split(/\s+/).filter(word => word.length > 0).length > 35 && (
                        <p className="text-xs text-red-600 mt-1">Maximum 35 words allowed. Please reduce the message length.</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>Link Text (Optional)</label>
                      <input
                        type="text"
                        value={bannerForm.link_text}
                        onChange={(e) => setBannerForm({ ...bannerForm, link_text: e.target.value })}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                        style={{ borderColor: '#762727' }}
                        placeholder="e.g., Register now"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#762727' }}>Link URL (Optional)</label>
                      <input
                        type="url"
                        value={bannerForm.link_url}
                        onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                        className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all"
                        style={{ borderColor: '#762727' }}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={bannerForm.is_active}
                        onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#762727' }}
                      />
                      <label htmlFor="is_active" className="text-xs font-semibold" style={{ color: '#762727' }}>
                        Active (Only one active banner will be displayed)
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: '#762727' }}
                      >
                        {editingBanner ? 'Update Banner' : 'Create Banner'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelBannerForm}
                        className="px-6 py-2 rounded-full border-2 text-sm font-semibold transition-all duration-300 hover:scale-105"
                        style={{ borderColor: '#762727', color: '#762727' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Banner List */}
              <div className="space-y-4">
                {banners.length === 0 ? (
                  <div className="text-center py-12 bg-white/70 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)]">
                    <MegaphoneIcon size={48} className="mx-auto mb-4 opacity-50" style={{ color: '#762727' }} />
                    <p className="text-gray-600">No banners yet. Create your first banner!</p>
                  </div>
                ) : (
                  banners.map((banner) => (
                    <div key={banner.id} className={`bg-white/70 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.10)] p-4 md:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${banner.is_active ? 'ring-2 ring-[#762727]' : ''}`}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">{banner.message}</p>
                            {banner.is_active ? (
                              <span className="px-3 py-1 text-xs font-bold rounded-full text-white shadow-md bg-green-500">
                                ✓ LIVE NOW
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-300 text-gray-700">
                                Inactive
                              </span>
                            )}
                          </div>
                          {banner.link_text && banner.link_url && (
                            <p className="text-xs text-gray-600">
                              Link: <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#762727' }}>{banner.link_text}</a>
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Created: {new Date(banner.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {!banner.is_active && (
                            <button
                              onClick={() => handleSetActiveBanner(banner.id)}
                              className="px-4 py-2 text-xs rounded-lg text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              style={{ backgroundColor: '#762727' }}
                            >
                              Set as Live
                            </button>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditBanner(banner)}
                              className="px-3 py-1.5 text-xs rounded-lg border-2 transition-all duration-300 hover:scale-105 font-semibold"
                              style={{ borderColor: '#762727', color: '#762727' }}
                            >
                              <EditIcon size={14} className="inline mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white transition-all duration-300 hover:scale-105 hover:bg-red-600 font-semibold"
                            >
                              <TrashIcon size={14} className="inline" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
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
