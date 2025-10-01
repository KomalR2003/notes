// components/PasswordModal.jsx
import React, { useState } from 'react';
import { Lock, Unlock, X, Eye, EyeOff } from 'lucide-react';

const PasswordModal = ({ isOpen, onClose, onSubmit, mode = 'lock', title }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setPassword(''); 
    setConfirmPassword(''); 
    setError(''); 
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password) return setError('Password is required');
    if (mode === 'lock') {
      if (password.length < 4) return setError('Password must be at least 4 characters');
      if (password !== confirmPassword) return setError('Passwords do not match');
    }

    onSubmit(password);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {mode === 'lock' ? <Lock className="w-5 h-5 text-blue-600" /> : <Unlock className="w-5 h-5 text-green-600" />}
            <h2 className="text-xl font-semibold">{mode === 'lock' ? 'Lock Note' : 'Unlock Note'}</h2>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Note Title */}
        {title && <p className="text-sm text-gray-600 mb-4">Note: <span className="font-medium">{title}</span></p>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field - Only for lock mode */}
          {mode === 'lock' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

          {/* Info Message */}
          {mode === 'lock' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-600">
              💡 Make sure to remember your password. There's no way to recover it if forgotten.
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${mode === 'lock' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {mode === 'lock' ? 'Lock Note' : 'Unlock Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;