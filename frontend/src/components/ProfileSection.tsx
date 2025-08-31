import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Edit2, 
  Save, 
  X, 
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Customer {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
  profile_completion_percentage?: number;
}

interface ProfileSectionProps {
  customer?: Customer | null;
  onUpdateCustomer?: (updates: Partial<Customer>) => Promise<void>;
  isLoading?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  customer, 
  onUpdateCustomer, 
  isLoading = false 
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Customer>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleEdit = () => {
    setEditedData(customer || {});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedData({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (onUpdateCustomer) {
      try {
        await onUpdateCustomer(editedData);
        setIsEditing(false);
        setEditedData({});
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here you would implement the actual file upload logic
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the avatar URL in the edited data
      const fakeAvatarUrl = URL.createObjectURL(file);
      handleInputChange('avatar_url', fakeAvatarUrl);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getDisplayData = () => {
    return isEditing ? { ...customer, ...editedData } : customer;
  };

  const data = getDisplayData();

  const renderPersonalTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <div className="relative group">
          {data?.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={`${data.first_name} ${data.last_name}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
              {data?.first_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </div>
          )}
          
          {isEditing && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                {isUploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">
            {data?.first_name && data?.last_name 
              ? `${data.first_name} ${data.last_name}` 
              : 'Complete Your Profile'
            }
          </h3>
          <p className="text-gray-600 mt-1">{user?.email}</p>
          
          {/* Profile Completion */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-bold text-blue-600">
                {data?.profile_completion_percentage || 20}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${data?.profile_completion_percentage || 20}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.first_name || ''}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your first name"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {data?.first_name || 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.last_name || ''}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your last name"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {data?.last_name || 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={editedData.phone_number || ''}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {data?.phone_number || 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              value={editedData.date_of_birth || ''}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
              {data?.date_of_birth ? new Date(data.date_of_birth).toLocaleDateString() : 'Not provided'}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          {isEditing ? (
            <select
              value={editedData.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
              {data?.gender?.replace('_', ' ') || 'Not provided'}
            </p>
          )}
        </div>
      </div>

    </div>
  );


  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
          </div>
          
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <nav className="flex space-x-8 overflow-x-auto px-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'personal' && renderPersonalTab()}
          {/* Security tab would be implemented here */}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;