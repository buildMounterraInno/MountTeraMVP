import React, { useState, useRef } from 'react';
import { 
  User, 
  ArrowRight, 
  ArrowLeft,
  Camera,
  MapPin,
  Phone,
  Mountain,
  Check,
  Upload,
  X,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OnboardingData {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  avatar_url?: string;
  bio: string;
  address_line_1: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  fitness_level: string;
  trekking_experience_years: number;
  preferred_trek_difficulty: string;
  preferred_trek_duration: string;
  medical_conditions: string;
  dietary_restrictions: string;
}

interface CustomerOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => Promise<void>;
  isLoading?: boolean;
}

const CustomerOnboarding: React.FC<CustomerOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete,
  isLoading = false
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    bio: '',
    address_line_1: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: 'India',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    fitness_level: '',
    trekking_experience_years: 0,
    preferred_trek_difficulty: '',
    preferred_trek_duration: '',
    medical_conditions: '',
    dietary_restrictions: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Personal Info', icon: User, description: 'Basic information about you' },
    { id: 2, title: 'Avatar & Bio', icon: Camera, description: 'Add your photo and tell us about yourself' },
    { id: 3, title: 'Address', icon: MapPin, description: 'Your location details' },
    { id: 4, title: 'Emergency Contact', icon: Phone, description: 'Someone to contact in emergencies' },
    { id: 5, title: 'Trekking Profile', icon: Mountain, description: 'Your adventure preferences' }
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'File size must be less than 5MB' }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
      return;
    }

    setIsUploading(true);
    try {
      // Here you would implement the actual file upload logic
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fakeAvatarUrl = URL.createObjectURL(file);
      handleInputChange('avatar_url', fakeAvatarUrl);
      setErrors(prev => ({ ...prev, avatar: '' }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrors(prev => ({ ...prev, avatar: 'Failed to upload image. Please try again.' }));
    } finally {
      setIsUploading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
        if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
        if (!formData.phone_number.trim()) newErrors.phone_number = 'Phone number is required';
        if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        break;
      case 3:
        if (!formData.address_line_1.trim()) newErrors.address_line_1 = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state_province.trim()) newErrors.state_province = 'State/Province is required';
        if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
        break;
      case 4:
        if (!formData.emergency_contact_name.trim()) newErrors.emergency_contact_name = 'Emergency contact name is required';
        if (!formData.emergency_contact_phone.trim()) newErrors.emergency_contact_phone = 'Emergency contact phone is required';
        if (!formData.emergency_contact_relationship.trim()) newErrors.emergency_contact_relationship = 'Relationship is required';
        break;
      case 5:
        if (!formData.fitness_level) newErrors.fitness_level = 'Fitness level is required';
        if (!formData.preferred_trek_difficulty) newErrors.preferred_trek_difficulty = 'Preferred difficulty is required';
        if (!formData.preferred_trek_duration) newErrors.preferred_trek_duration = 'Preferred duration is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (validateStep(currentStep)) {
      try {
        await onComplete(formData);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        setErrors(prev => ({ ...prev, general: 'Failed to save your information. Please try again.' }));
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-2">Tell us a bit about yourself to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.first_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.last_name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone_number}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.date_of_birth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date_of_birth && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.date_of_birth}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.gender}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Avatar & Bio</h2>
        <p className="text-gray-600 mt-2">Add a profile picture and tell us about yourself</p>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          {formData.avatar_url ? (
            <img
              src={formData.avatar_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
              {formData.first_name.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            {isUploading ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {formData.avatar_url ? 'Change Photo' : 'Upload Photo'}
          </button>
          <p className="text-gray-500 text-sm mt-1">Optional, but helps personalize your experience</p>
        </div>

        {errors.avatar && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.avatar}
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tell us about yourself
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Share your interests, trekking goals, or anything else you'd like us to know..."
        />
        <p className="text-gray-500 text-sm mt-1">This helps us recommend the best experiences for you</p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mountain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Trekking Profile</h2>
        <p className="text-gray-600 mt-2">Help us recommend the perfect adventures for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fitness Level <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.fitness_level}
            onChange={(e) => handleInputChange('fitness_level', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.fitness_level ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your fitness level</option>
            <option value="beginner">Beginner - New to fitness</option>
            <option value="intermediate">Intermediate - Regular exercise</option>
            <option value="advanced">Advanced - Very active</option>
            <option value="expert">Expert - Athletic/Professional</option>
          </select>
          {errors.fitness_level && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.fitness_level}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trekking Experience (Years)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.trekking_experience_years}
            onChange={(e) => handleInputChange('trekking_experience_years', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Years of trekking experience"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Trek Difficulty <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferred_trek_difficulty}
            onChange={(e) => handleInputChange('preferred_trek_difficulty', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.preferred_trek_difficulty ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select difficulty preference</option>
            <option value="easy">Easy - Relaxed pace, well-marked trails</option>
            <option value="moderate">Moderate - Some challenging sections</option>
            <option value="difficult">Difficult - Challenging terrain</option>
            <option value="extreme">Extreme - Very challenging expeditions</option>
          </select>
          {errors.preferred_trek_difficulty && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.preferred_trek_difficulty}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Trek Duration <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.preferred_trek_duration}
            onChange={(e) => handleInputChange('preferred_trek_duration', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.preferred_trek_duration ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select duration preference</option>
            <option value="day_trip">Day Trips</option>
            <option value="2-3_days">2-3 Days</option>
            <option value="4-7_days">4-7 Days</option>
            <option value="1-2_weeks">1-2 Weeks</option>
            <option value="2+_weeks">2+ Weeks</option>
          </select>
          {errors.preferred_trek_duration && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.preferred_trek_duration}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical Conditions
          </label>
          <textarea
            value={formData.medical_conditions}
            onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any medical conditions we should know about? (Optional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions
          </label>
          <textarea
            value={formData.dietary_restrictions}
            onChange={(e) => handleInputChange('dietary_restrictions', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any dietary restrictions or preferences? (Optional)"
          />
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome to Mounterra!</h1>
              <p className="text-blue-100 mt-1">Let's set up your adventure profile</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-blue-300 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    step.id === currentStep
                      ? 'bg-white/20 text-white'
                      : step.id < currentStep
                      ? 'bg-white/10 text-white'
                      : 'text-blue-200'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {/* Steps 3 and 4 would be similar implementations */}
          {currentStep === 5 && renderStep5()}

          {/* General Error */}
          {errors.general && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              {errors.general}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep === totalSteps ? (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Complete Setup
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOnboarding;