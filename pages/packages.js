import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Packages = () => {
  const router = useRouter();

  const packages = [
    {
      name: "Starter",
      price: "499",
      description: "Perfect for small businesses just getting started",
      features: [
        "Basic SEO Optimization",
        "Social Media Management (2 platforms)",
        "Monthly Content Creation",
        "Basic Analytics Report",
        "Email Support",
        "Monthly Strategy Call"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "999",
      description: "Ideal for growing businesses",
      features: [
        "Advanced SEO Optimization",
        "Social Media Management (4 platforms)",
        "Weekly Content Creation",
        "Detailed Analytics Report",
        "Priority Email Support",
        "Weekly Strategy Call",
        "PPC Campaign Management",
        "Email Marketing"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "1999",
      description: "For established businesses seeking maximum growth",
      features: [
        "Comprehensive SEO Strategy",
        "Social Media Management (All platforms)",
        "Daily Content Creation",
        "Advanced Analytics & Reporting",
        "24/7 Priority Support",
        "Weekly Strategy Call",
        "Full PPC Campaign Management",
        "Advanced Email Marketing",
        "Content Marketing Strategy",
        "Custom Marketing Solutions"
      ],
      popular: false
    }
  ];

  const handleGetStartedClick = (pkg) => {
    // Redirect to a new page to collect user and company details,
    // passing the selected package data.
    router.push({
      pathname: '/checkout/details',
      query: { packageName: pkg.name, packagePrice: pkg.price },
    });
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Packages</h1>
            <p className="text-xl text-gray-100">
              Choose the perfect package for your business needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white p-8 rounded-lg shadow-lg border-t-4 ${pkg.popular ? 'border-blue-600' : 'border-gray-200'}`}
              >
                {pkg.popular && (
                  <div className="bg-blue-600 text-white text-center py-2">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${pkg.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <FaCheck className="text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-full font-semibold transition-all ${
                        pkg.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                      }`}
                      onClick={() => handleGetStartedClick(pkg)}
                    >
                      Get Started
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: "Can I upgrade or downgrade my package?",
                answer: "Yes, you can change your package at any time. Changes will be reflected in your next billing cycle."
              },
              {
                question: "Do you offer custom packages?",
                answer: "Yes, we can create custom packages tailored to your specific business needs. Contact us to discuss your requirements."
              },
              {
                question: "What's included in the setup fee?",
                answer: "The setup fee covers initial strategy development, account setup, and onboarding process."
              },
              {
                question: "How long is the contract?",
                answer: "We offer flexible month-to-month contracts with no long-term commitments required."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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
            <h2 className="text-3xl font-bold mb-6">Need a Custom Solution?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us to discuss your specific requirements and get a tailored package.
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

export default Packages; 