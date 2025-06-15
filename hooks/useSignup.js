
// signup_ASHA_Worker

import { useState, useCallback } from 'react';
import { signupASHAWorker } from '@/lib/services/authServices';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = useCallback(async (formData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    const result = await signupASHAWorker(formData);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }
  }, []);

  return {
    handleSignup,
    loading,
    error,
    success,
  };
};
