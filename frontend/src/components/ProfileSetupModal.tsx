import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { useCustomer } from '../contexts/CustomerContext';
import { useAuth } from '../contexts/AuthContext';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ProfileData {
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
}

const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { createCustomer } = useCustomer();
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    gender: '',
    date_of_birth: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileData & { general: string }>>({});

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileData> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.date_of_birth = 'You must be at least 13 years old';
      }
    }

    // Phone validation (optional)
    if (formData.phone_number && !/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!user?.id) {
      setErrors({ general: 'User not authenticated' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await createCustomer({
        auth_user_id: user.id,
        email: user.email!,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number || undefined,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        profile_completion_percentage: 100
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error completing profile setup:', error);
      setErrors({ general: 'Failed to complete profile setup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Modal Content */}
          <div className="p-6">
            {/* Title */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
              <p className="text-gray-600 mt-2">Please complete your profile to continue</p>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {errors.general}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.first_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                    required
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                      errors.last_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                    required
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                    errors.phone_number ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Your phone number"
                />
                {errors.phone_number && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone_number}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${
                    errors.date_of_birth ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-xs text-red-600">{errors.date_of_birth}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 mt-6"
              >
                {isLoading ? 'Setting up profile...' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSetupModal;