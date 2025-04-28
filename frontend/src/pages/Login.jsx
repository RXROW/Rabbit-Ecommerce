import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const result = await dispatch(loginUser({
          email: formData.email,
          password: formData.password
        })).unwrap();

        toast.success("Login successful!");
        navigate('/'); // Redirect after successful login
      } catch (error) {
        const errorMessage = error?.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section (Form) */}
      <div className="w-1/2 flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Rabbit</h1>
            <p className="text-lg mt-2 font-medium text-gray-700">Welcome back! 👋</p>
          </div>

          <p className="text-sm text-gray-600 mb-6">Please enter your credentials to access your account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">Forgot password?</Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isLoading}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className={`w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium ml-1">Register</Link>
          </div>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="w-1/2 relative">
        <img
          src="https://picsum.photos/800/600?random=5"
          alt="Login visual"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center p-12">
          <h2 className="text-white text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-white text-center text-lg">Access your personalized dashboard and manage your projects with ease.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;