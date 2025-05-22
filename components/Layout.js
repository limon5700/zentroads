import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBars, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!auth && !!token);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();

    // Check auth status when storage changes
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    const auth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');
    
    if (auth && token) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 z-50">
              <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
              <span className={`text-xl font-bold ${
                 isScrolled ? 'text-gray-800' : 'text-white'
              }`}>ZentroAds</span>
            </Link>

            <div className="md:hidden flex items-center">
              <button onClick={toggleMobileMenu} className={`text-xl focus:outline-none ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`hover:text-blue-600 transition-colors ${
                 isScrolled ? 'text-gray-800' : 'text-white'
              }`}>Home</Link>
              <Link href="/services" className={`hover:text-blue-600 transition-colors ${
                 isScrolled ? 'text-gray-800' : 'text-white'
              }`}>Services</Link>
              <Link href="/packages" className={`hover:text-blue-600 transition-colors ${
                 isScrolled ? 'text-gray-800' : 'text-white'
              }`}>Packages</Link>
              <Link href="/about" className={`hover:text-blue-600 transition-colors ${
                 isScrolled ? 'text-gray-800' : 'text-white'
              }`}>About</Link>
              <Link href="/faq" className={`hover:text-blue-600 transition-colors ${
                 isScrolled ? 'text-gray-800' : 'text-white'
              }`}>FAQ</Link>
              {isAuthenticated ? (
                <button
                  onClick={handleProfileClick}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Profile
                </button>
              ) : (
                <>
                  <Link href="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">Sign Up</Link>
                  <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.2 }}
          className={`md:hidden absolute top-0 left-0 w-full bg-white shadow-lg py-8 px-6 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          style={{ paddingTop: isScrolled ? '5rem' : '6rem' }}
        >
           <div className="flex justify-end mb-4">
             <button onClick={toggleMobileMenu} className="text-gray-800 text-xl focus:outline-none">
               <FaTimes />
             </button>
           </div>
          <nav className="flex flex-col items-center space-y-4">
            <Link href="/" className="text-gray-800 hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>Home</Link>
            <Link href="/services" className="text-gray-800 hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>Services</Link>
            <Link href="/packages" className="text-gray-800 hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>Packages</Link>
            <Link href="/about" className="text-gray-800 hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>About</Link>
            <Link href="/faq" className="text-gray-800 hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>FAQ</Link>
            {isAuthenticated ? (
                <button
                  onClick={() => { handleProfileClick(event); toggleMobileMenu(); }}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Profile
                </button>
              ) : (
                <>
                  <Link href="/signup" className="w-full text-center bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors" onClick={toggleMobileMenu}>Sign Up</Link>
                  <Link href="/login" className="w-full text-center bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors" onClick={toggleMobileMenu}>
                    Login
                  </Link>
                </>
              )}
          </nav>
        </motion.div>
      </motion.header>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ZentroAds</h3>
              <p className="text-gray-400">Your trusted partner in digital advertising solutions.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link href="/packages" className="text-gray-400 hover:text-white">Packages</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@zentroads.com</li>
                <li>Phone: +1 234 567 890</li>
                <li>Address: Your Address Here</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ZentroAds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 