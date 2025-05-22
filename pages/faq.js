import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { FaChevronDown } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What services does ZentroAds offer?",
      answer: "We offer a comprehensive range of digital advertising services including social media marketing, search engine optimization (SEO), pay-per-click (PPC) advertising, content marketing, and email marketing campaigns."
    },
    {
      question: "How long does it take to see results?",
      answer: "Results can vary depending on the service and your specific goals. Typically, you can expect to see initial results within 2-4 weeks, with significant improvements over 3-6 months of consistent effort."
    },
    {
      question: "What makes ZentroAds different from other agencies?",
      answer: "We combine data-driven strategies with creative excellence, backed by years of industry experience. Our team stays ahead of digital trends and uses cutting-edge tools to deliver measurable results for our clients."
    },
    {
      question: "How do you measure success?",
      answer: "We use a variety of metrics including ROI, conversion rates, engagement rates, and other KPIs specific to your business goals. We provide regular reports and analytics to track progress and make data-driven adjustments."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is customized based on your specific needs and goals. We offer flexible packages that can be tailored to businesses of all sizes. Contact us for a detailed quote based on your requirements."
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes, we work with clients globally and have experience in managing international marketing campaigns across different time zones and cultures."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply contact us through our website or give us a call. We'll schedule a consultation to understand your needs and create a customized strategy for your business."
    },
    {
      question: "What industries do you specialize in?",
      answer: "We have experience working with various industries including e-commerce, technology, healthcare, education, and professional services. Our strategies are adaptable to any industry's specific needs."
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-100">
              Find answers to common questions about our services and how we can help your business grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="text-lg font-semibold text-left">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="text-blue-600" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-gray-50 rounded-b-lg">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
            <p className="text-xl text-gray-600 mb-8">
              We're here to help! Contact us for more information.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ; 