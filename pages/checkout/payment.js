import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { motion } from 'framer-motion';
import { FaSpinner, FaMoneyBillWave } from 'react-icons/fa';

const Payment = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bkashNumber, setBkashNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token missing. Please login again.');
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/order/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch order details');
        }

        setOrder(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  const handleBkashPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!bkashNumber || !transactionId) {
      setError('Please provide both bKash number and transaction ID');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/verify-bkash-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          bkashNumber,
          transactionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment verification failed');
      }

      alert('Payment successful!');
      router.push('/profile');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            {!orderId && (
              <button
                onClick={() => router.push('/packages')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
              >
                Select Package
              </button>
            )}
            {orderId && error !== 'Order ID is missing.' && (
              <button
                onClick={() => router.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors mt-4"
              >
                Retry
              </button>
            )}
          </div>
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
            <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Payment</h1>

            {/* Order Summary */}
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
              <p className="text-gray-700">Package: <span className="font-medium">{order.packageName}</span></p>
              <p className="text-gray-700">Price per month: <span className="font-medium">${order.packagePrice}/month</span></p>
              <p className="text-gray-700">Duration: <span className="font-medium">{order.packageDurationValue} {order.packageDurationUnit}{order.packageDurationValue > 1 && 's'}</span></p>
              <p className="text-gray-700">Total Amount: <span className="font-medium">${((order.packageDurationUnit === 'year' ? order.packageDurationValue * 12 : order.packageDurationValue) * order.packagePrice).toFixed(2)}</span></p>

              {order.company && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-1">Company Details</h3>
                  <p className="text-gray-700">Company Name: <span className="font-medium">{order.company.companyName}</span></p>
                  <p className="text-gray-700">Company Address: <span className="font-medium">{order.company.companyAddress}</span></p>
                </div>
              )}
            </div>

            {/* bKash Payment Form */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Pay with bKash</h2>
              <div className="bg-pink-50 p-4 rounded-lg mb-6">
                <p className="text-pink-800 font-medium mb-2">Send payment to:</p>
                <p className="text-2xl font-bold text-pink-600">01XXXXXXXXX</p>
                <p className="text-sm text-gray-600 mt-2">(Replace with your actual bKash merchant number)</p>
              </div>

              <form onSubmit={handleBkashPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your bKash Number
                  </label>
                  <input
                    type="text"
                    value={bkashNumber}
                    onChange={(e) => setBkashNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter bKash transaction ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-600 focus:border-transparent"
                    required
                  />
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-md font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Verify Payment'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment; 