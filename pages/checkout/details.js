import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

const CheckoutDetails = () => {
  const router = useRouter();
  const { packageName, packagePrice } = router.query;

  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    companyEmail: '',
    gstNumber: '',
    // Add other relevant company details
  });

  const [companyPhoneNumber, setCompanyPhoneNumber] = useState(''); // State for phone number without code
  const [selectedCountryCode, setSelectedCountryCode] = useState('+880'); // Default country code (Bangladesh)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [durationValue, setDurationValue] = useState(1); // State for duration value
  const [durationUnit, setDurationUnit] = useState('month'); // State for duration unit
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  // List of 5 specific country codes and typical number lengths (simplified)
  const countryCodes = [
    { code: '+1', country: 'USA', length: 10 }, // Example length for USA
    { code: '+44', country: 'UK', length: 10 }, // Example length for UK (mobile without leading 0)
    { code: '+880', country: 'Bangladesh', length: 10 }, // Example length for Bangladesh (mobile without leading 0)
    { code: '+91', country: 'India', length: 10 }, // Example length for India (mobile)
    { code: '+1', country: 'Canada', length: 10 }, // Example length for Canada
  ];

  useEffect(() => {
    // Calculate total amount whenever package price, duration value, or unit changes
    const price = parseFloat(packagePrice);
    if (!isNaN(price) && durationValue > 0) {
      let multiplier = durationValue;
      if (durationUnit === 'year') {
        multiplier = durationValue * 12; // Convert years to months for calculation
      }
      setTotalAmount(price * multiplier);
    }
  }, [packagePrice, durationValue, durationUnit]);

  useEffect(() => {
    // Fetch user data here to pre-fill the form if available
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Handle not authenticated - maybe redirect to login or show message
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          // Optionally pre-fill user-related fields if needed
          // setFormData(prev => ({ ...prev, companyEmail: data.email }));
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

   const handlePhoneChange = (e) => {
    setCompanyPhoneNumber(e.target.value);
   };

   const validatePhoneNumber = () => {
     const selectedCountry = countryCodes.find(country => country.code === selectedCountryCode);
     if (!selectedCountry) return false; // Should not happen with dropdown

     const phoneNumber = companyPhoneNumber.replace(/[^\d]/g, ''); // Remove non-digits

     // Basic length validation
     return phoneNumber.length === selectedCountry.length;
   };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation for required fields including phone number and email
    if (!formData.companyName || !formData.companyAddress || !companyPhoneNumber || !formData.companyEmail) {
      setError('Company Name, Address, Phone Number, and Email are required.');
      return;
    }

    // Validate phone number length
    if (!validatePhoneNumber()) {
      setError(`Invalid phone number length for selected country. Expected ${countryCodes.find(country => country.code === selectedCountryCode).length} digits.`);
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token missing. Please login again.');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/checkout/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          companyPhone: selectedCountryCode + companyPhoneNumber, // Combine code and number
          packageName,
          packagePrice: parseFloat(packagePrice), // Ensure price is a number
          packageDurationValue: parseInt(durationValue), // Ensure value is a number
          packageDurationUnit: durationUnit,
          totalAmount: totalAmount // Include total amount in the request
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save details');
      }

      // Redirect to payment page with the order ID
      router.push({
        pathname: '/checkout/payment',
        query: { orderId: data.orderId },
      });

    } catch (err) {
      console.error('Error saving details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!packageName || !packagePrice) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-600">No package selected. Please go back to the packages page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <h1 className="text-2xl font-bold mb-6 text-center">Checkout Details</h1>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Package Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Package and Duration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selected Package</label>
                    <input
                      type="text"
                      value={packageName}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price per month</label>
                    <input
                      type="text"
                      value={`$${packagePrice}`}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="durationValue" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select
                      id="durationValue"
                      name="durationValue"
                      value={durationValue}
                      onChange={(e) => setDurationValue(parseInt(e.target.value))}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value={1}>1</option>
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={12}>12</option>
                    </select>
                  </div>
                   <div>
                    <label htmlFor="durationUnit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      id="durationUnit"
                      name="durationUnit"
                      value={durationUnit}
                      onChange={(e) => setDurationUnit(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    >
                      <option value="month">Month(s)</option>
                      <option value="year">Year(s)</option>
                    </select>
                  </div>
                </div>
                 <div className="mt-4 text-lg font-bold text-right">
                    Total Amount: ${totalAmount.toFixed(2)}
                  </div>
              </div>


              {/* User Details (pre-filled from profile if available) */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled // User name is read-only from profile
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled // User email is read-only from profile
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Company Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyAddress"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                         {/* Display selected country code */}
                         <span className="px-4 py-2 border-y border-l border-gray-300 rounded-l-md bg-gray-100 flex items-center text-black h-full">
                           {selectedCountryCode}
                         </span>
                        <select
                          id="countryCode"
                          name="countryCode"
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                          className="px-2 py-2 border-y border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent h-full w-8 overflow-hidden text-transparent text-black"
                          style={{ flexGrow: 0, appearance: 'menulist', WebkitAppearance: 'menulist'}}
                        >
                          {countryCodes.map(country => (
                            <option key={country.code} value={country.code}>
                              {`${country.code} (${country.country})`} {/* Display Code (Country) in dropdown */}
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          id="companyPhone"
                          name="companyPhone"
                          value={companyPhoneNumber}
                          onChange={handlePhoneChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="companyEmail"
                        name="companyEmail"
                        value={formData.companyEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                  {/* Add more company fields as needed */}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Proceed to Payment'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutDetails; 