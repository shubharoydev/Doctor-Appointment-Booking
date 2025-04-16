import React from 'react';

function MedicalLoader({ text = 'Processing...' }) {
  return (
    <div className="fixed inset-0 bg-blue-100 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-4">
          {/* Heartbeat Pulse Animation */}
          <div className="absolute w-16 h-16 border-4 border-blue-200 rounded-full animate-ping"></div>
          {/* Heart Icon with Beat Animation */}
          <svg
            className="w-10 h-10 text-blue-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            ></path>
          </svg>
          {/* ECG Line Animation */}
          <div className="absolute -bottom-2 w-24 h-6">
            <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path
                d="M0 10 H20 L30 2 L40 18 L50 2 L60 18 L70 2 L80 10 H100"
                stroke="#10B981"
                strokeWidth="2"
                fill="none"
                className="animate-ecg"
              />
            </svg>
          </div>
        </div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
      <style jsx>{`
        @keyframes ecg {
          0% {
            stroke-dasharray: 0 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 200 200;
            stroke-dashoffset: -50;
          }
          100% {
            stroke-dasharray: 200 200;
            stroke-dashoffset: -100;
          }
        }
        .animate-ecg {
          stroke-dasharray: 200;
          animation: ecg 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default MedicalLoader;