import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Clock, User, Search, Filter, ChevronDown } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface Lesson {
  id: string;
  title: string;
  subject: string;
  topic: string;
  duration_minutes: number;
  description: string;
  thumbnail_url: string;
  instructor_name: string;
  is_completed: boolean;
  progress_percentage: number;
}

const VideoLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'progress' | 'duration'>('recent');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/videos/lessons', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setLessons(Array.isArray(data) ? data : []);
      setFilteredLessons(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...lessons];

    // Filter by subject
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(lesson => lesson.subject === selectedSubject);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        lesson =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'progress':
        filtered.sort((a, b) => b.progress_percentage - a.progress_percentage);
        break;
      case 'duration':
        filtered.sort((a, b) => b.duration_minutes - a.duration_minutes);
        break;
      case 'recent':
      default:
        break;
    }

    setFilteredLessons(filtered);
  }, [searchQuery, selectedSubject, lessons, sortBy]);

  const handleProgressUpdate = async (watchedDuration: number) => {
    if (selectedLesson) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `http://localhost:8000/api/videos/lessons/${selectedLesson.id}/progress`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ watched_duration: watchedDuration })
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSelectedLesson(prev => prev ? {
            ...prev,
            progress_percentage: data.progress_percentage,
            is_completed: data.is_completed
          } : null);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const stats = {
    total: lessons.length,
    completed: lessons.filter(l => l.is_completed).length,
    avgProgress: lessons.length > 0 
      ? Math.round(lessons.reduce((sum, l) => sum + l.progress_percentage, 0) / lessons.length)
      : 0
  };

  if (selectedLesson) {
    return (
      <div className="w-full bg-gray-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedLesson(null)}
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <ChevronDown size={18} className="rotate-90" />
            <span>Back to Lessons</span>
          </button>

          <VideoPlayer
            videoUrl={selectedLesson.thumbnail_url}
            title={selectedLesson.title}
            duration={selectedLesson.duration_minutes}
            onProgress={handleProgressUpdate}
            onClose={() => setSelectedLesson(null)}
          />

          <div className="mt-6 bg-white rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{selectedLesson.title}</h1>
                <p className="text-gray-500 text-sm">{selectedLesson.topic}</p>
              </div>
              {selectedLesson.is_completed && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                  ✓ Completed
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User size={18} />
                <span>{selectedLesson.instructor_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={18} />
                <span>{selectedLesson.duration_minutes} minutes</span>
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {selectedLesson.subject}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">Progress</h3>
                <span className="text-sm font-bold text-blue-600">{Math.round(selectedLesson.progress_percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${selectedLesson.progress_percentage}%` }}
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{selectedLesson.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen size={36} className="text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold">Video Lessons</h1>
              <p className="text-gray-600">Master IIT JEE topics through comprehensive video lessons</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {lessons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-600 text-sm">Total Lessons</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p className="text-gray-600 text-sm">Average Progress</p>
              <p className="text-3xl font-bold text-orange-600">{stats.avgProgress}%</p>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Subject Filter */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none flex items-center space-x-2"
            >
              <option value="all">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="recent">Recent</option>
              <option value="progress">By Progress</option>
              <option value="duration">By Duration</option>
            </select>
          </div>
        </div>

        {/* Lessons Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading lessons...</p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg">
            <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No lessons found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:scale-105 duration-300"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden h-40 bg-gray-200">
                  <img
                    src={lesson.thumbnail_url || 'https://via.placeholder.com/400x225?text=Video+Lesson'}
                    alt={lesson.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition">
                      <Play size={32} className="text-white" fill="white" />
                    </div>
                  </div>
                  {lesson.is_completed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <span>✓</span>
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                      <Clock size={14} />
                      <span>{lesson.duration_minutes} min</span>
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold text-xs">
                      {lesson.subject}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-700">Progress</span>
                      <span className="text-xs font-bold text-blue-600">
                        {Math.round(lesson.progress_percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${lesson.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
                    {lesson.is_completed ? 'Review' : 'Start Learning'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLessons;