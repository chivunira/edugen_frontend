// src/pages/SignUpPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, clearError } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any errors when user starts typing
    if (error) dispatch(clearError());
    if (validationError) setValidationError(null);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords don't match");
      return false;
    }
    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(signUp({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password
    }));

    if (signUp.fulfilled.match(result)) {
      navigate('/verify');
    }
  };

  return (
    <div className="min-h-screen w-full flex relative">
      <Logo />

      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="max-w-md w-full">
          <img
            src="/src/assets/images/signin.png"
            alt="Sign Up Illustration"
            className="w-full h-auto"
          />
          <p className="text-center mt-6 text-gray-600 font-comic">
            "Join us and Start Your AI Learning Journey"
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-comic text-center">Sign Up</h2>
            <p className="text-center text-gray-600 font-comic">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:text-blue-600 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          {(error || validationError) && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Input
              label="Password Confirmation"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;