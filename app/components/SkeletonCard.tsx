// Composant skeleton pour le chargement

export const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col h-full">
    <div className="flex-1 flex items-center justify-center mb-4">
      <div className="bg-gray-200 rounded h-48 w-full animate-pulse" />
    </div>
    <div className="flex flex-col gap-2 mt-auto">
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
    </div>
  </div>
);
