import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from "sonner";
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough
    };
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 11 digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isLongEnough) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!passwordValidation.hasUpperCase || !passwordValidation.hasLowerCase ||
        !passwordValidation.hasNumbers || !passwordValidation.hasSpecialChar) {
        newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
      }
    }

    // Confirm password validation
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
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
        const result = await dispatch(registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          phone: formData.phone,
          avatar: formData.avatar || undefined,
          role: 'user' // Default role
        })).unwrap();

        toast.success("Registration successful!");
        navigate('/');
      } catch (error) {
        const errorMessage = error?.message || 'Registration failed. Please try again.';
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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Rabbit</h1>
            <p className="text-lg mt-2 font-medium text-gray-700">Create an Account</p>
          </div>

          <p className="text-sm text-gray-600 mb-6">Fill in your details to get started with Rabbit</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="01123456789"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isLoading}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (Optional)</label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatar}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors`}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              {formData.password && !errors.password && (
                <div className="mt-2 text-xs text-gray-600">
                  <p>Password must contain:</p>
                  <ul className="list-disc list-inside">
                    <li className={formData.password.length >= 8 ? 'text-green-500' : 'text-gray-500'}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>One uppercase letter</li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>One lowercase letter</li>
                    <li className={/\d/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>One number</li>
                    <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-500' : 'text-gray-500'}>One special character</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  placeholder="••••••••"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'} rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-10`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.passwordConfirm && <p className="mt-1 text-xs text-red-500">{errors.passwordConfirm}</p>}
            </div>

            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1"
                  required
                />
                <span className="ml-2 text-xs text-gray-600">
                  By creating an account, you agree to our <Link to="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Already have an account?</span>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium ml-1">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="w-1/2 relative">
        <img
          src="https://picsum.photos/800/600?random=5"
          alt="Register visual"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center p-12">
          <h2 className="text-white text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-white text-center text-lg">Create an account today and unlock the full potential of our platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
