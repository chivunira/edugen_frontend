import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { verifyCode, resendCode, setAuthState } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store/store';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';

const VerificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    verificationEmail,
    isLoading,
    verificationStatus
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Focus first input on mount
    inputs.current[0]?.focus();
  }, []);

  // Handle successful verification status
  useEffect(() => {
    if (verificationStatus === 'success') {
      navigate('/register-class');
    }
  }, [verificationStatus, navigate]);

  const handleCodeChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // Auto-focus next input with null check
    if (value && index < 3) {
      const nextInput = inputs.current[index + 1];
      nextInput?.focus();
    }

    // Auto-submit when all digits are filled
    if (index === 3 && value && newCode.every(digit => digit)) {
      handleVerify(newCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = inputs.current[index - 1];
      prevInput?.focus();
    }
  };

  const handleVerify = async (verificationCode: string[] = code) => {
  const codeString = verificationCode.join('');

  // Input validation
  if (codeString.length !== 4) {
    setError('Please enter the complete verification code');
    return;
  }

  if (!verificationEmail) {
    setError('Email address is missing');
    return;
  }

  try {
    const result = await dispatch(verifyCode({
      email: verificationEmail,
      code: codeString
    })).unwrap();

    if (result.access && result.refresh) {
      localStorage.setItem('accessToken', result.access);
      localStorage.setItem('refreshToken', result.refresh);

      dispatch(setAuthState({
        isAuthenticated: true,
        user: result.user
      }));
    } else {
      throw new Error('Invalid server response');
    }

  } catch (err) {
    const error = err as { message?: string; response?: { data?: { error?: string } } };
    const errorMessage = error.response?.data?.error ||
                        error.message ||
                        'Verification failed. Please try again.';

    setError(errorMessage);
    setCode(['', '', '', '']);
    inputs.current[0]?.focus();

    // Log error for debugging
    console.error('Verification error:', error);
  }
};

  const handleResendCode = async () => {
    if (!verificationEmail) {
      setError('Email address is missing');
      return;
    }

    setResendStatus('sending');
    try {
      await dispatch(resendCode(verificationEmail)).unwrap();
      setResendStatus('sent');
      setCode(['', '', '', '']);
      inputs.current[0]?.focus();
      setTimeout(() => setResendStatus('idle'), 3000);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
      setResendStatus('idle');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      <Logo />

      <div className="w-full h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-comic">
              {verificationStatus === 'success' ? 'Verification Successful!' : 'Verify Your Account'}
            </h2>

            <p className="text-gray-600 font-comic">
              Please enter the 4-digit code sent to<br />
              <span className="font-semibold">{verificationEmail}</span>
            </p>

            <div className="flex justify-center gap-4 my-8">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputs.current[idx] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-12 text-center text-2xl border-2 rounded-lg focus:border-blue-500 focus:outline-none"
                  aria-label={`Digit ${idx + 1}`}
                  disabled={verificationStatus === 'success'}
                />
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {resendStatus === 'sent' && (
              <div className="text-green-500 text-sm">
                New verification code sent!
              </div>
            )}

            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => handleVerify()}
                disabled={isLoading || !code.every(digit => digit) || verificationStatus === 'success'}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>

              {verificationStatus !== 'success' && (
                <button
                  onClick={handleResendCode}
                  disabled={resendStatus === 'sending'}
                  className="text-blue-500 text-sm hover:underline"
                >
                  {resendStatus === 'sending' ? 'Sending...' : 'Resend Code'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerificationPage;