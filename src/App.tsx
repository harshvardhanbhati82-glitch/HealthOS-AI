import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AICopilot } from './components/AICopilot';
import { LayoutDashboard, BotMessageSquare } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'copilot'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 h-16 flex-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between h-full">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">HealthOS</span>
                <span className="font-bold text-xl text-indigo-600 tracking-tight ml-1">-AI</span>
              </div>
              <div className="ml-10 flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('copilot')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === 'copilot'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <BotMessageSquare className="w-4 h-4 mr-2" />
                  AI Copilot
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                  <span className="text-sm font-medium text-indigo-700">Dr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' ? <Dashboard /> : <AICopilot />}
      </main>
    </div>
  )
}

export default App
