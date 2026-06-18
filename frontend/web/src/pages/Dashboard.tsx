import React, { useState, useEffect } from 'react';
import { BookOpen, Play, HelpCircle, BarChart3, Settings, LogOut, Menu, X, TrendingUp, Award, Zap } from 'lucide-react';

// Import components with error boundary
const VideoLessons = React.lazy(() => import('../components/VideoLessons/VideoLessons'));
const LiveDoubtButton = React.lazy(() => import('../components/DoubtsResolution/LiveDoubtButton'));
const VirtualAgent = React.lazy(() => import('../components/AITeaching/VirtualAgent'));

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface UserStats {
  totalClasses: number;
  videosCompleted: number;
  doubtsResolved: number;
  learningProgress: number;
  recentScore: number;
  rank: number;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [selectedClassForAI, setSelectedClassForAI] = useState<any>(null);
  const [aiSessionId, setAiSessionId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    totalClasses: 12,
    videosCompleted: 8,
    doubtsResolved: 5,
    learningProgress: 75,
    recentScore: 82,
    rank: 145
  });

  useEffect(() => {
    const getUserInfo = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setUserInfo(user);
    };
    getUserInfo();
  }, []);

  const tabs: DashboardTab[] = [
    { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'video-lessons', label: 'Video Lessons', icon: <Play size={20} /> },
    { id: 'doubts', label: 'Doubt Resolution', icon: <HelpCircle size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleStartClass = (classData: any) => {
    const topic = classData.name.split(': ')[1] || classData.name;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    setSelectedClassForAI({ 
      ...classData, 
      topic,
      sessionId 
    });
    setAiSessionId(sessionId);
    setShowAIAgent(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } bg-gray-900 shadow-2xl fixed lg:relative h-full overflow-hidden transition-all duration-300 z-40`}>
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Zap size={28} className="text-yellow-300" />
            <span>VALLURI™</span>
          </h2>
          <p className="text-xs text-blue-100 mt-1">AI-Powered Learning</p>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg">
              {userInfo?.name?.[0] || 'A'}
            </div>
            <div>
              <h3 className="font-bold text-gray-100 text-sm">{userInfo?.name || 'Aspirant'}</h3>
              <p className="text-xs text-gray-400 truncate">{userInfo?.email}</p>
              <p className="text-xs text-yellow-400 font-semibold mt-1">
                {userInfo?.class_level} • {userInfo?.target_exam}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${
                activeTab === tab.id
                  ? 'bg-yellow-500 text-gray-900 shadow-md'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}

          <div className="border-t border-gray-700 pt-4 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg sticky top-0 z-30 pt-16 lg:pt-0 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <div className="text-sm text-gray-400">
              Welcome back, <span className="font-semibold text-yellow-400">{userInfo?.name?.split(' ')[0]}</span>!
            </div>
          </div>
        </div>

        {/* Page Content - WITH PROPER SCROLLING */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Classes */}
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-blue-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Classes</p>
                        <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalClasses}</p>
                      </div>
                      <BarChart3 size={32} className="text-blue-100" />
                    </div>
                    <p className="text-xs text-gray-500">Keep learning regularly</p>
                  </div>

                  {/* Videos Completed */}
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-green-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Videos Watched</p>
                        <p className="text-4xl font-bold text-green-600 mt-2">{stats.videosCompleted}</p>
                      </div>
                      <Play size={32} className="text-green-100" />
                    </div>
                    <p className="text-xs text-gray-500">Great video engagement!</p>
                  </div>

                  {/* Doubts Resolved */}
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-purple-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Doubts Resolved</p>
                        <p className="text-4xl font-bold text-purple-600 mt-2">{stats.doubtsResolved}</p>
                      </div>
                      <HelpCircle size={32} className="text-purple-100" />
                    </div>
                    <p className="text-xs text-gray-500">Keep asking questions!</p>
                  </div>

                  {/* Learning Progress */}
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-orange-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Learning Progress</p>
                        <p className="text-4xl font-bold text-orange-600 mt-2">{stats.learningProgress}%</p>
                      </div>
                      <TrendingUp size={32} className="text-orange-100" />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${stats.learningProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Your Classes */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Classes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Physics: Kinematics', subject: 'Physics', icon: '⚡', color: 'from-yellow-400 to-orange-500' },
                    { name: 'Chemistry: Bonding', subject: 'Chemistry', icon: '🧪', color: 'from-green-400 to-blue-500' },
                    { name: 'Maths: Algebra', subject: 'Mathematics', icon: '📐', color: 'from-purple-400 to-pink-500' }
                  ].map((cls, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${cls.color} rounded-lg flex items-center justify-center text-3xl mb-4`}>
                        {cls.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{cls.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">Advanced concepts and practice problems</p>
                      <button
                        onClick={() => handleStartClass({ name: cls.name, subject: cls.subject })}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center space-x-2"
                      >
                        <Play size={18} />
                        <span>Start Class</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center space-x-2">
                    <Award size={24} className="text-yellow-600" />
                    <span>Recent Performance</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Recent Test Score</span>
                      <span className="text-2xl font-bold text-blue-600">{stats.recentScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${stats.recentScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold mb-4 text-gray-900">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('video-lessons')}
                      className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-blue-700 font-semibold flex items-center space-x-2"
                    >
                      <Play size={18} />
                      <span>Watch Videos</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('doubts')}
                      className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition text-green-700 font-semibold flex items-center space-x-2"
                    >
                      <HelpCircle size={18} />
                      <span>Ask a Doubt</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video-lessons' && (
            <React.Suspense fallback={<LoadingSpinner />}>
              <VideoLessons />
            </React.Suspense>
          )}

          {activeTab === 'doubts' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Live Doubt Resolution</h2>
              <div className="bg-white rounded-xl p-8 shadow-md text-center">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <HelpCircle size={56} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Get 1:1 Help</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Click the green button at the bottom right to request a live doubt resolution session with an instructor. Get personalized help tailored to your needs.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left max-w-md mx-auto rounded">
                  <p className="text-sm text-blue-700">
                    <strong>⏱️ Average Response Time:</strong> 5-10 minutes
                    <br />
                    <strong>📞 Session Type:</strong> 1:1 Video Call
                    <br />
                    <strong>🎯 Focus:</strong> Your Specific Doubt
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl p-8 shadow-md max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userInfo?.name || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userInfo?.email || ''}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class Level</label>
                    <input
                      type="text"
                      value={userInfo?.class_level || ''}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Exam</label>
                    <input
                      type="text"
                      value={userInfo?.target_exam || ''}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-700"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2 mt-6"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Doubt Button - FIXED Z-INDEX */}
      <React.Suspense fallback={null}>
        <LiveDoubtButton />
      </React.Suspense>

      {/* AI Teaching Agent - FIXED Z-INDEX */}
      {showAIAgent && selectedClassForAI && (
        <React.Suspense fallback={null}>
          <VirtualAgent
            subject={selectedClassForAI.subject}
            topic={selectedClassForAI.topic}
            sessionId={aiSessionId}
            onClose={() => {
              setShowAIAgent(false);
              setSelectedClassForAI(null);
              setAiSessionId('');
            }}
          />
        </React.Suspense>
      )}
    </div>
  );
};

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
  </div>
);

export default Dashboard;