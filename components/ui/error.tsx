export default function Error({ error }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-2">⚠️</div>
        <p className="text-gray-800 font-semibold">Error loading analytics</p>
        <p className="text-gray-600 text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}