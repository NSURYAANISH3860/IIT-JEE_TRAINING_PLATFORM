import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: number; // in minutes
  onProgress: (watchedDuration: number) => void;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  duration,
  onProgress,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onProgress(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * (duration * 60);
    }
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const progressPercentage = (currentTime / (duration * 60)) * 100;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden shadow-2xl max-w-4xl mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <div className="relative group">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto block"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onMouseMove={handleMouseMove}
        />

        {/* Title and Close Button - Always Visible */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black to-transparent flex justify-between items-start">
          <h3 className="text-white font-semibold text-lg line-clamp-2 flex-1">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-red-600 p-2 rounded-full transition flex-shrink-0"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Controls - Show/Hide based on showControls */}
        {showControls && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-between transition-opacity duration-300">
            {/* Progress bar */}
            <div className="pt-16"></div>
            
            <div className="p-4 space-y-3">
              {/* Time and Progress */}
              <div className="flex items-center justify-between text-white text-sm">
                <span>
                  {formatTime(currentTime)} / {formatTime(duration * 60)}
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>

              {/* Progress Bar */}
              <div 
                className="w-full bg-gray-600 h-2 cursor-pointer group/progress hover:h-3 transition-all rounded"
                onClick={handleProgressClick}
              >
                <div
                  className="bg-red-600 h-full group-hover/progress:bg-red-500 transition-all rounded"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Skip Backward */}
                  <button
                    onClick={handleSkipBackward}
                    className="text-white hover:text-blue-400 transition"
                    title="Skip 10s back"
                  >
                    <SkipBack size={24} />
                  </button>

                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-blue-400 transition bg-red-600 hover:bg-red-700 p-2 rounded-full"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
                  </button>

                  {/* Skip Forward */}
                  <button
                    onClick={handleSkipForward}
                    className="text-white hover:text-blue-400 transition"
                    title="Skip 10s forward"
                  >
                    <SkipForward size={24} />
                  </button>

                  {/* Mute/Unmute */}
                  <button 
                    onClick={handleMute} 
                    className="text-white hover:text-blue-400 transition"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>

                  {/* Volume Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded cursor-pointer accent-red-600"
                  />
                </div>

                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="text-white hover:text-blue-400 transition"
                >
                  <Maximize size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;