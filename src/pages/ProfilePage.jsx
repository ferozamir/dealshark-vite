import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  ShieldCheckIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, business, userType, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form data
  const [formData, setFormData] = useState({
    // User fields
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profile_image_url: '',
    
    // Business fields
    business_name: '',
    business_email: '',
    business_phone: '',
    website: '',
    registration_no: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_country: '',
    business_industry: '',
    business_logo_url: '',
    business_cover_url: '',
    description: ''
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Initialize form data with current user/business data
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        profile_image_url: user.profile_image_url || ''
      }));
    }

    if (business) {
      setFormData(prev => ({
        ...prev,
        business_name: business.business_name || '',
        business_email: business.business_email || business.email || '',
        business_phone: business.business_phone || business.phone_number || '',
        website: business.website || '',
        registration_no: business.registration_no || '',
        business_address: business.business_address || '',
        business_city: business.business_city || '',
        business_state: business.business_state || '',
        business_country: business.business_country || '',
        business_industry: business.business_industry || '',
        business_logo_url: business.business_logo_url || '',
        business_cover_url: business.business_cover_url || '',
        description: business.description || ''
      }));
    }
  }, [user, business]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (userType === 'business') {
        result = await authService.updateBusiness(business.id, formData);
      } else {
        result = await authService.updateUser(user.id, formData);
      }

      if (result.success) {
        setSuccess('Profile updated successfully!');
        updateUser(result.data);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.changePassword(passwordData);
      
      if (result.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setIsChangingPassword(false);
        toast.success('Password changed successfully!');
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      // This would need to be implemented with actual file upload
      toast.success('File upload functionality coming soon');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.new_password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Profile Header */}
          <div className="profile-header auth-card mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                {/* Profile Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    {user?.profile_image_url ? (
                      <img
                        src={user.profile_image_url}
                        alt="Profile"
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-dealshark-yellow text-gray-900 p-2 rounded-full cursor-pointer hover:bg-yellow-400 transition-colors">
                      <CameraIcon className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profile_image_url')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                {/* Profile Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userType === 'business' 
                      ? (business?.business_name || 'Business Profile')
                      : `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User Profile'
                    }
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    {userType === 'business' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <GlobeAltIcon className="h-4 w-4" />
                          <span className="text-sm">{business?.industry || 'Business'}</span>
                        </div>
                        {business?.is_verified && (
                          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            <StarIcon className="h-3 w-3" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center space-x-2 animate-fade-in-up"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckIcon className="h-5 w-5" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="error-message mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-in-top">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="success-message mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in-top">
              <p className="text-green-600 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Profile Information */}
          <div className="profile-info auth-card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Personal Information */}
              <div className="personal-info-section">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-dealshark-blue" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label uppercase">FIRST NAME*</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="custom-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label uppercase">LAST NAME*</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="custom-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label uppercase">EMAIL ADDRESS*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="custom-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label uppercase">PHONE NUMBER</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="custom-input"
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information (for business users) */}
              {userType === 'business' && (
                <div className="business-info-section">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-dealshark-blue" />
                    Business Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label uppercase">BUSINESS NAME*</label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">BUSINESS EMAIL</label>
                      <input
                        type="email"
                        name="business_email"
                        value={formData.business_email}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter business email"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">BUSINESS PHONE</label>
                      <input
                        type="tel"
                        name="business_phone"
                        value={formData.business_phone}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter business phone"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">WEBSITE</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">REGISTRATION NUMBER</label>
                      <input
                        type="text"
                        name="registration_no"
                        value={formData.registration_no}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter registration number"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">INDUSTRY</label>
                      <select
                        name="business_industry"
                        value={formData.business_industry}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                      >
                        <option value="">Select Industry</option>
                        <option value="Food">Food</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Travel">Travel</option>
                        <option value="Home">Home</option>
                        <option value="Books">Books</option>
                        <option value="Crafting">Crafting</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Sports">Sports</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label uppercase">BUSINESS ADDRESS</label>
                      <input
                        type="text"
                        name="business_address"
                        value={formData.business_address}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter business address"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">CITY</label>
                      <input
                        type="text"
                        name="business_city"
                        value={formData.business_city}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">STATE</label>
                      <input
                        type="text"
                        name="business_state"
                        value={formData.business_state}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase">COUNTRY</label>
                      <input
                        type="text"
                        name="business_country"
                        value={formData.business_country}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Enter country"
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label uppercase">DESCRIPTION</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="custom-input"
                        disabled={!isEditing}
                        placeholder="Describe your business"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Security Settings */}
          <div className="security-settings auth-card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ShieldCheckIcon className="h-6 w-6 mr-2 text-dealshark-blue" />
              Security Settings
            </h2>

            <div className="space-y-6">
              {/* Change Password Section */}
              <div className="password-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <KeyIcon className="h-5 w-5 mr-2 text-dealshark-blue" />
                    Change Password
                  </h3>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="btn-secondary text-sm"
                    >
                      Change Password
                    </button>
                  )}
                </div>

                {isChangingPassword && (
                  <form onSubmit={handlePasswordChange} className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label className="form-label uppercase">CURRENT PASSWORD*</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            className="custom-input pr-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                          >
                            {showPasswords.current ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label uppercase">NEW PASSWORD*</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className="custom-input pr-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                          >
                            {showPasswords.new ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        
                        {/* Password Strength Indicator */}
                        {passwordData.new_password && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600 font-medium">
                                {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="form-group md:col-span-2">
                        <label className="form-label uppercase">CONFIRM NEW PASSWORD*</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            className="custom-input pr-12"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                          >
                            {showPasswords.confirm ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {passwordData.confirm_password && passwordData.new_password === passwordData.confirm_password && (
                          <div className="mt-2 flex items-center text-green-600 animate-fade-in-up">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Passwords match</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Account Information */}
              <div className="account-info-section">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-dealshark-blue" />
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="detail-item">
                    <div className="flex items-center space-x-3 mb-2">
                      <UserIcon className="h-5 w-5 text-dealshark-blue" />
                      <span className="font-medium text-gray-900">User Type</span>
                    </div>
                    <p className="text-gray-600 capitalize">{userType}</p>
                  </div>
                  
                  <div className="detail-item">
                    <div className="flex items-center space-x-3 mb-2">
                      <CalendarIcon className="h-5 w-5 text-dealshark-blue" />
                      <span className="font-medium text-gray-900">Member Since</span>
                    </div>
                    <p className="text-gray-600">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <div className="flex items-center space-x-3 mb-2">
                      <ShieldCheckIcon className="h-5 w-5 text-dealshark-blue" />
                      <span className="font-medium text-gray-900">Account Status</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </p>
                  </div>
                  
                  <div className="detail-item">
                    <div className="flex items-center space-x-3 mb-2">
                      <EnvelopeIcon className="h-5 w-5 text-dealshark-blue" />
                      <span className="font-medium text-gray-900">Email Verified</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;