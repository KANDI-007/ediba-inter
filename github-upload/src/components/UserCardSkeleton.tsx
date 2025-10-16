import React from 'react';

interface UserCardSkeletonProps {
  count?: number;
  className?: string;
}

const UserCardSkeleton: React.FC<UserCardSkeletonProps> = ({
  count = 1,
  className = ''
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-6 border border-gray-200 animate-pulse ${className}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Avatar skeleton */}
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            {/* Actions skeleton */}
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Badges skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            </div>
            
            {/* Email skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            
            {/* Last login skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserCardSkeleton;
