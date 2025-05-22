import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaRocket, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa';
import { useRouter } from 'next/router';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(!!auth);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/packages');
    } else {
      router.push('/login');
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to ZentroAds</h1>
          <p className="text-xl md:text-2xl mb-8">Your Partner in Digital Advertising Excellence</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            onClick={handleGetStarted}
          >
            {isAuthenticated ? 'View Packages' : 'Get Started'}
          </motion.button>
        </motion.div>
      </section>

      {/* Future Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Our Future Plans
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaRocket className="text-4xl text-blue-600" />,
                title: "Global Expansion",
                description: "Expanding our services to international markets"
              },
              {
                icon: <FaChartLine className="text-4xl text-blue-600" />,
                title: "Advanced Analytics",
                description: "Implementing cutting-edge analytics tools"
              },
              {
                icon: <FaUsers className="text-4xl text-blue-600" />,
                title: "Community Growth",
                description: "Building a strong community of advertisers"
              },
              {
                icon: <FaLightbulb className="text-4xl text-blue-600" />,
                title: "Innovation Hub",
                description: "Creating an innovation center for new ideas"
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{plan.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Our Services
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Digital Marketing",
                description: "Comprehensive digital marketing solutions for your business"
              },
              {
                title: "Social Media Management",
                description: "Expert social media management and content creation"
              },
              {
                title: "SEO Optimization",
                description: "Improve your search engine rankings and visibility"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8">Let's create something amazing together</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
