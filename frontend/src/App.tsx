import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to DebateHub
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A Gamified Debate Platform
        </p>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-2">Unmoderated Mode</h2>
            <p className="text-gray-600">Free-for-all discussions without AI intervention</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-2">Moderated Mode</h2>
            <p className="text-gray-600">AI fact-checked conversations</p>
          </div>
        </div>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="mt-8 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
