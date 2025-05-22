import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:5000/api/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now login.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"
          >
            <div className="text-center">
              {status === 'verifying' && (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold mb-4">Verifying your email...</h2>
                  <p className="text-gray-600">Please wait while we verify your email address.</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Login
                  </button>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="text-red-500 text-5xl mb-4">✕</div>
                  <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
                  <p className="text-gray-600 mb-6">{message}</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Back to Login
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail; 