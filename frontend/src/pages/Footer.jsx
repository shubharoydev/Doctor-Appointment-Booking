const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Get to Know Us */}
            <div>
              <h3 className="font-semibold text-lg">Get to Know Us</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Press Releases</a></li>
              </ul>
            </div>
  
            {/* Centres of Excellence */}
            <div>
              <h3 className="font-semibold text-lg">Centres Of Excellence</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Psychiatrist</a></li>
                <li><a href="#" className="hover:underline">Cardiologist</a></li>
                <li><a href="#" className="hover:underline">Neurologists</a></li>
                <li><a href="#" className="hover:underline">Gastroenterologist</a></li>
                <li><a href="#" className="hover:underline">Pediatricians</a></li>
                <li><a href="#" className="hover:underline">Dermatologists</a></li>
                <li><a href="#" className="hover:underline">Radiologists</a></li>
                <li><a href="#" className="hover:underline">Obstetrics and Gynaecology</a></li>
              </ul>
            </div>
  
            {/* Patient Care */}
            <div>
              <h3 className="font-semibold text-lg">Patient Care</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Find a Doctor</a></li>
                <li><a href="#" className="hover:underline">Medical Services</a></li>
                <li><a href="#" className="hover:underline">Patient Testimonials</a></li>
                <li><a href="#" className="hover:underline">Pay Online</a></li>
              </ul>
            </div>
  
            {/* Contact Us */}
            <div>
              <h3 className="font-semibold text-lg">Contact Us</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Post A Query</a></li>
                <li><a href="#" className="hover:underline">Give Your Feedback</a></li>
                <li><a href="#" className="hover:underline">Help</a></li>
              </ul>
            </div>
          </div>
  
          {/* Social Media Links */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-lg">Connect with Us</h3>
            <div className="flex justify-center space-x-4 mt-2">
             <a href="mailto:medilink.79@gmail.com" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Email</a>
              <a href="https://www.facebook.com/share/QKzvPyFThtrYkxiX/" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"> Facebook</a>
              <a href="https://www.instagram.com/medilink_service" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"> Instagram</a>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-6 text-center text-gray-400">
            © 2024 MediLink. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  