// src/components/common/UserAvatar.tsx
import React from 'react';

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg';
  profilePhoto?: string | null;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName = '',
  lastName = '',
  size = 'md',
  profilePhoto
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-24 h-24 text-3xl'
  };

  const getInitials = () => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-blue-100 text-primary font-bold overflow-hidden`}>
      {profilePhoto ? (
        <img
          src={profilePhoto}
          alt={`${firstName} ${lastName}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
};

export default UserAvatar;