import BackendApi from "@/app/api/api"

// signup_ASHA_Worker

export const signup = async (formData) => {
  // Always log the form data (excluding sensitive information)
  console.log('Signup Form Data:', {
    name: formData.name,
    gender: formData.gender,
    mobile: formData.mobile,
    email: formData.email,
    role: formData.role,
    ashaId: formData.role === "asha-worker" ? formData.ashaId : undefined,
    docId: formData.role === "doctor" ? formData.docId : undefined,
    // Not logging password for security reasons
  });

  try {
    // Prepare the data to send to the backend
    const signupData = {
      name: formData.name,
      gender: formData.gender,
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      // Include role-specific ID
      ...(formData.role === "asha-worker" && { ashaId: formData.ashaId }),
      ...(formData.role === "doctor" && { docId: formData.docId })
    };

    const res = await BackendApi.post('/api/v1/auth/signup', signupData);
    
    console.log('Signup API Response:', {
      success: res.data?.success,
      // Not logging sensitive data
    });

    // Log the token received from backend
    console.log('Token received from backend:', res.data?.token);
    console.log('Full response data:', res.data);

    if (res && res.data) {
      return {
        success: res.data.success !== undefined ? res.data.success : true,
        data: res.data.data || res.data,
        token: res.data.token,
        user: res.data.user
      };
    } else {
      return {
        success: false,
        message: 'No response data from server',
        token: null,
        user: null
      };
    }
  } catch (error) {
    console.error('Signup API Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || "Signup failed",
      token: null,
      user: null
    };
  }
};





// signin function
export const signin = async (credentials) => {
  // Log only non-sensitive data
  console.log('Signin attempt for email:', credentials.email);
  
  try {
    const res = await BackendApi.post('/api/v1/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    console.log('Signin API Response:', {
      success: res.data?.success,
      // Not logging sensitive data
    });

    // Log the token received from backend
    console.log('Token received from backend:', res.data?.token);
    console.log('Full response data:', res.data);

    if (res && res.data) {
      return {
        success: res.data.success,
        message: res.data.message,
        token: res.data.token,
        user: res.data.user
      };
    } else {
      return {
        success: false,
        message: 'No response data from server',
        token: null,
        user: null
      };
    }
  } catch (error) {
    console.error('Signin API Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || "Signin failed",
      token: null,
      user: null
    };
  }
};
