const NotAvailable = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          We're Working On It!
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          Our service is currently undergoing maintenance to bring you an even better experience. We'll be back soon with exciting updates!
        </p>
        <div className="flex justify-center mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
        <p className="text-gray-300 text-sm">
          Thank you for your patience. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default NotAvailable;