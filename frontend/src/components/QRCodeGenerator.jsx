import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';

import { FaWhatsapp, FaFacebook, FaInstagram, FaDownload } from 'react-icons/fa';

function QRCodeGenerator({ url, doctorName }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const qrCodeRef = useRef(null);

  // URL encode the share text
  const shareText = encodeURIComponent(`Check out Dr. ${doctorName}'s profile: ${url}`);
  
  // Create share URLs
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const instagramCaption = `Check out Dr. ${doctorName}'s profile`;

  const downloadQRCode = (format) => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    let dataUrl;
    
    if (format === 'png') {
      dataUrl = canvas.toDataURL('image/png');
    } else if (format === 'jpg') {
      dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    }
    
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Dr-${doctorName.replace(/\s+/g, '-')}-QRCode.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Profile QR Code</h3>
      <div className="flex flex-col items-center mb-4">
        <div ref={qrCodeRef} className="bg-white p-4 rounded-lg">
          <QRCode 
            value={url} 
            size={200} 
            bgColor="#FFFFFF"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>
        <p className="text-gray-600 text-sm mt-2">Scan to view profile</p>
      </div>
      
      <div className="flex flex-col space-y-3">
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center justify-center"
        >
          <span className="mr-2">Share Profile</span>
        </button>
        
        {showShareOptions && (
          <div className="flex justify-around mt-2">
            <a 
              href={whatsappShareUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-700"
            >
              <FaWhatsapp size={24} />
            </a>
            <a 
              href={facebookShareUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <FaFacebook size={24} />
            </a>
            <button
              onClick={() => {
                alert(`To share on Instagram, save this QR code and upload it with the caption: ${instagramCaption}`);
              }}
              className="text-pink-600 hover:text-pink-800"
            >
              <FaInstagram size={24} />
            </button>
          </div>
        )}
        
        <div className="flex justify-around mt-2">
          <button
            onClick={() => downloadQRCode('png')}
            className="bg-gray-200 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-300 text-sm flex items-center"
          >
            <FaDownload className="mr-1" /> PNG
          </button>
          <button
            onClick={() => downloadQRCode('jpg')}
            className="bg-gray-200 text-gray-800 py-1 px-3 rounded-md hover:bg-gray-300 text-sm flex items-center"
          >
            <FaDownload className="mr-1" /> JPG
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCodeGenerator; 