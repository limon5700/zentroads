import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSignOutAlt, 
  FaEdit,
  FaCreditCard,
  FaHistory,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner
} from 'react-icons/fa';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      fetchUserData();
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        bio: data.bio || ''
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      if (error.message === 'No authentication token found') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleSubscriptionUpdate = async (plan) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/user/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan, autoRenew: true })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      const data = await response.json();
      setUser(prevUser => ({
        ...prevUser,
        subscription: data.subscription,
        paymentHistory: [...prevUser.paymentHistory, data.payment]
      }));
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionCancel = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/user/subscription/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await response.json();
      setUser(prevUser => ({
        ...prevUser,
        subscription: data.subscription
      }));
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'inactive':
        return 'text-red-500';
      case 'expired':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading && !user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (error && !user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Login
            </button>
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
            className="max-w-7xl mx-auto"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
                  <p className="text-gray-100 mt-2">Manage your account and subscription</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Dashboard Navigation */}
            <div className="bg-white border-b">
              <div className="flex space-x-4 md:space-x-8 px-4 md:px-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-2 border-b-2 font-medium ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`py-4 px-2 border-b-2 font-medium ${
                    activeTab === 'subscription'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Subscription
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`py-4 px-2 border-b-2 font-medium ${
                    activeTab === 'payments'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Payment History
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-medium ${
                    activeTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Settings
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-white rounded-b-lg shadow-lg p-8">
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <FaSpinner className="animate-spin text-2xl text-blue-600" />
                </div>
              )}

              {!loading && activeTab === 'overview' && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6 px-4 py-4 sm:px-0 sm:py-0">
                  {/* Subscription Status Card */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Subscription Status</h3>
                      <FaCreditCard className="text-blue-600 text-xl" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">Current Plan: <span className="font-medium">{user?.subscription?.plan || 'No Plan'}</span></p>
                      <p className="text-gray-600">Status: <span className={`font-medium ${getSubscriptionStatusColor(user?.subscription?.status)}`}>
                        {user?.subscription?.status || 'Inactive'}
                      </span></p>
                      {user?.subscription?.endDate && (
                        <p className="text-gray-600">Valid until: <span className="font-medium">
                          {new Date(user.subscription.endDate).toLocaleDateString()}
                        </span></p>
                      )}
                    </div>
                  </div>

                  {/* Account Status Card */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Account Status</h3>
                      <FaUser className="text-blue-600 text-xl" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-600">Email Verification: 
                        <span className={`ml-2 ${user?.isEmailVerified ? 'text-green-500' : 'text-red-500'}`}>
                          {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                        </span>
                      </p>
                      <p className="text-gray-600">Member since: <span className="font-medium">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </span></p>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Quick Actions</h3>
                      <FaChartLine className="text-blue-600 text-xl" />
                    </div>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('subscription')}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {user?.subscription?.plan ? 'Manage Plan' : 'Get Started'}
                      </button>
                      <button 
                        onClick={() => router.push('/analytics')}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        View Analytics
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!loading && activeTab === 'subscription' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Current Subscription</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-600 mb-2">Plan Details</p>
                        <div className="space-y-2">
                          <p className="font-medium">Plan: {user?.subscription?.plan || 'No Plan'}</p>
                          <p className="font-medium">Status: <span className={getSubscriptionStatusColor(user?.subscription?.status)}>
                            {user?.subscription?.status || 'Inactive'}
                          </span></p>
                          <p className="font-medium">Auto-renew: {user?.subscription?.autoRenew ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-2">Subscription Period</p>
                        <div className="space-y-2">
                          <p className="font-medium">Start Date: {user?.subscription?.startDate ? new Date(user.subscription.startDate).toLocaleDateString() : 'N/A'}</p>
                          <p className="font-medium">End Date: {user?.subscription?.endDate ? new Date(user.subscription.endDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    {user?.subscription?.status === 'active' && (
                      <div className="mt-6">
                        <button
                          onClick={handleSubscriptionCancel}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {['Starter', 'Professional', 'Enterprise'].map((plan) => (
                        <div key={plan} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                          <h4 className="text-lg font-semibold mb-2">{plan}</h4>
                          <p className="text-gray-600 mb-4">Perfect for {plan.toLowerCase()} businesses</p>
                          <button 
                            onClick={() => handleSubscriptionUpdate(plan)}
                            disabled={user?.subscription?.plan === plan}
                            className={`w-full px-4 py-2 rounded-md transition-colors ${
                              user?.subscription?.plan === plan
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {user?.subscription?.plan === plan ? 'Current Plan' : 'Upgrade'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!loading && activeTab === 'payments' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-xl font-semibold mb-4">Payment History</h3>
                    {user?.paymentHistory?.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4">Date</th>
                              <th className="text-left py-3 px-4">Amount</th>
                              <th className="text-left py-3 px-4">Plan</th>
                              <th className="text-left py-3 px-4">Status</th>
                              <th className="text-left py-3 px-4">Transaction ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.paymentHistory.map((payment, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-3 px-4">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="py-3 px-4">${payment.amount} {payment.currency}</td>
                                <td className="py-3 px-4">{payment.plan}</td>
                                <td className="py-3 px-4">
                                  <span className={getPaymentStatusColor(payment.status)}>
                                    {payment.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4">{payment.transactionId}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-4">No payment history available</p>
                    )}
                  </div>
                </div>
              )}

              {!loading && activeTab === 'profile' && (
                <div className="space-y-6">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        ></textarea>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <FaEdit />
                          <span>Edit Profile</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-4">
                          <FaUser className="text-blue-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{user?.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <FaEnvelope className="text-blue-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <FaPhone className="text-blue-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{user?.phone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <FaMapMarkerAlt className="text-blue-600 text-xl" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{user?.address || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                      {user?.bio && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-2">Bio</h3>
                          <p className="text-gray-600">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile; 