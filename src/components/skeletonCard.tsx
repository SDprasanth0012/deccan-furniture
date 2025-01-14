const SkeletonCard = () => (
    <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4 space-y-2">
        <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
        <div className="w-1/4 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  export default SkeletonCard;
  