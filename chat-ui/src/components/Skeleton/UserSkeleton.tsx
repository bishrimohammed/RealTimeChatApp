const UserSkeleton = () => {
  return (
    <div className="flex items-center space-y-2 py-2 gap-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
      <div className="ml-2">
        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export default UserSkeleton;
