export default function EventDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>

        {/* Event Details Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-center sm:text-right">
                <div className="mb-4">
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto sm:mx-0 mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto sm:mx-0 animate-pulse"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded w-full sm:w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-5 h-5 bg-gray-200 rounded mr-3 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="h-6 bg-gray-200 rounded w-40 mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}