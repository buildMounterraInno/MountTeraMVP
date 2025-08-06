export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Simple Test Page
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p>✅ This page loads successfully!</p>
          <p>Environment URL: {import.meta.env.VITE_SUPABASE_URL || 'Not found'}</p>
          <p>Environment Key exists: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}