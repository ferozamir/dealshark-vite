import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🦈 DealShark
          </h1>
          <p className="text-gray-600">
            Your React + Vite + Tailwind CSS project is ready!
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-6xl font-bold text-indigo-600 mb-4">
            {count}
          </div>
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Click me!
          </button>
        </div>
        
        <p className="text-sm text-gray-500">
          Edit <code className="bg-gray-100 px-2 py-1 rounded text-xs">src/App.jsx</code> and save to test HMR
        </p>
        
        <div className="mt-6 flex justify-center space-x-4 text-xs text-gray-400">
          <span>⚡ Vite</span>
          <span>⚛️ React</span>
          <span>🎨 Tailwind</span>
        </div>
      </div>
    </div>
  )
}

export default App
