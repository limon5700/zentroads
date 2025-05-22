import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaSearch, FaBullhorn, FaChartLine, FaUsers, FaEnvelope, FaMobile } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      icon: <FaSearch className="text-4xl text-blue-600" />,
      title: "Search Engine Optimization (SEO)",
      description: "Improve your website's visibility in search engine results and drive organic traffic to your business.",
      features: [
        "Keyword Research & Analysis",
        "On-page SEO Optimization",
        "Technical SEO Audit",
        "Content Strategy",
        "Link Building",
        "Local SEO"
      ]
    },
    {
      icon: <FaBullhorn className="text-4xl text-blue-600" />,
      title: "Social Media Marketing",
      description: "Build your brand presence and engage with your audience across all major social media platforms.",
      features: [
        "Social Media Strategy",
        "Content Creation",
        "Community Management",
        "Paid Social Advertising",
        "Influencer Marketing",
        "Social Media Analytics"
      ]
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: "PPC Advertising",
      description: "Drive targeted traffic and generate leads through strategic paid advertising campaigns.",
      features: [
        "Google Ads Management",
        "Facebook Ads",
        "Instagram Ads",
        "LinkedIn Ads",
        "Display Advertising",
        "Remarketing Campaigns"
      ]
    },
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "Content Marketing",
      description: "Create valuable, relevant content that attracts and engages your target audience.",
      features: [
        "Blog Content Creation",
        "Video Production",
        "Infographic Design",
        "Case Studies",
        "White Papers",
        "Content Strategy"
      ]
    },
    {
      icon: <FaEnvelope className="text-4xl text-blue-600" />,
      title: "Email Marketing",
      description: "Build and nurture relationships with your audience through targeted email campaigns.",
      features: [
        "Email Campaign Strategy",
        "Newsletter Design",
        "Automation Workflows",
        "List Management",
        "A/B Testing",
        "Performance Analytics"
      ]
    },
    {
      icon: <FaMobile className="text-4xl text-blue-600" />,
      title: "Mobile Marketing",
      description: "Reach your audience on their mobile devices with optimized campaigns and strategies.",
      features: [
        "Mobile-First Design",
        "SMS Marketing",
        "App Marketing",
        "Mobile SEO",
        "Location-Based Marketing",
        "Mobile Analytics"
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-100">
              Comprehensive digital marketing solutions to help your business grow and succeed online.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className="mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Our Process
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We analyze your business goals and current digital presence"
              },
              {
                step: "02",
                title: "Strategy",
                description: "We develop a customized digital marketing strategy"
              },
              {
                step: "03",
                title: "Implementation",
                description: "We execute the strategy with precision and care"
              },
              {
                step: "04",
                title: "Optimization",
                description: "We continuously monitor and improve results"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-600 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let's discuss how our services can help you achieve your goals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all"
            >
              Get Started
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services; 