import React, { useState } from 'react';
import { HelpCircle, Phone } from 'lucide-react';
import DoubtsModal from './DoubtsModal';

const LiveDoubtButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full p-4 shadow-2xl hover:shadow-2xl transition transform hover:scale-110 flex items-center space-x-3 group z-40"
        title="Request 1:1 Live Doubt Resolution"
      >
        <div className="relative">
          <Phone size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="hidden group-hover:inline text-sm font-semibold whitespace-nowrap">
          Ask a Doubt
        </span>
      </button>

      {isOpen && <DoubtsModal onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default LiveDoubtButton;