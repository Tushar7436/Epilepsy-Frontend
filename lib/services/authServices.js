import api from '@/lib/api/api';

// signup_ASHA_Worker
export const signupASHAWorker = async (formData) => {
  try {
    const response = await api.post('/auth/signup/asha', formData);

    return {
      success: true,
      data: response.data, // e.g., token or user info
      console.log(response.data);
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Something went wrong. Please try again.',
    };
  }
};
