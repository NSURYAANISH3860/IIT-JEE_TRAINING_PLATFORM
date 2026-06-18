import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle, Phone, Clock, MapPin } from 'lucide-react';

interface DoubtsModalProps {
  onClose: () => void;
}

const DoubtsModal: React.FC<DoubtsModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    subject: 'Physics',
    topic: '',
    doubt_description: '',
    scheduled_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    if (!formData.doubt_description.trim()) {
      setError('Please describe your doubt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/videos/doubts/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSessionDetails({
          session_id: data.session_id,
          status: data.status,
          created_time: new Date(),
          subject: formData.subject,
          topic: formData.topic
        });
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setFormData({
            subject: 'Physics',
            topic: '',
            doubt_description: '',
            scheduled_time: ''
          });
        }, 4000);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to submit doubt session');
      }
    } catch (error) {
      console.error('Error submitting doubt session:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in scale-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Phone size={24} />
              <span>1:1 Live Help</span>
            </h2>
            <p className="text-xs text-green-100 mt-1">Get help from expert instructors</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-500 p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted && sessionDetails ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in duration-500">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                <CheckCircle size={64} className="text-green-600 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-green-700">Request Submitted! ✨</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your doubt resolution request has been submitted successfully!
                <br />
                <br />
                An instructor will connect with you soon.
              </p>
              
              {/* Session Details */}
              <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3 my-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MapPin size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Subject & Topic</p>
                    <p className="font-semibold text-gray-900">{sessionDetails.subject} • {sessionDetails.topic}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Request Time</p>
                    <p className="font-semibold text-gray-900">{sessionDetails.created_time?.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left">
                <p className="text-sm text-blue-700 font-semibold mb-2">📞 Next Steps:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>✓ Your request is in queue</li>
                  <li>✓ Average wait time: 5-10 minutes</li>
                  <li>✓ You'll receive a notification when an instructor accepts</li>
                  <li>✓ Click the video link to join the session</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 italic">Closing in 4 seconds...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-in shake">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition hover:border-green-300"
                >
                  <option value="Physics">⚡ Physics</option>
                  <option value="Chemistry">🧪 Chemistry</option>
                  <option value="Mathematics">📐 Mathematics</option>
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specific Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., Kinematics, Chemical Bonding, Calculus"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition hover:border-green-300"
                />
              </div>

              {/* Doubt Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Doubt <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="doubt_description"
                  value={formData.doubt_description}
                  onChange={handleChange}
                  placeholder="Clearly describe what you're confused about. Include equations or examples if possible..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none transition hover:border-green-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.doubt_description.length}/500 characters
                </p>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition hover:border-green-300"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty for immediate assistance
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2 hover:shadow-lg disabled:shadow-none"
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Request Doubt Resolution'}</span>
              </button>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg text-left">
                <p className="text-xs font-semibold text-blue-900 mb-2">📞 How it works:</p>
                <ol className="text-xs text-blue-800 space-y-1">
                  <li>1️⃣ Submit your doubt</li>
                  <li>2️⃣ Wait for instructor assignment</li>
                  <li>3️⃣ Receive video call link</li>
                  <li>4️⃣ Join 1:1 session</li>
                  <li>5️⃣ Get your doubt resolved!</li>
                </ol>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubtsModal;