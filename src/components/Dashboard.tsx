
import {
  Activity,
  AlertCircle,
  Bed,
  Pill,
  Stethoscope,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const patientData = [
  { name: 'Mon', patients: 145 },
  { name: 'Tue', patients: 168 },
  { name: 'Wed', patients: 152 },
  { name: 'Thu', patients: 189 },
  { name: 'Fri', patients: 195 },
  { name: 'Sat', patients: 125 },
  { name: 'Sun', patients: 110 },
];

const resourceData = [
  { name: 'PHC North', medicine: 85, beds: 65 },
  { name: 'PHC South', medicine: 45, beds: 80 },
  { name: 'PHC East', medicine: 90, beds: 40 },
  { name: 'PHC West', medicine: 30, beds: 95 },
  { name: 'Central', medicine: 75, beds: 85 },
];

const alerts = [
  {
    id: 1,
    title: 'Low Oxygen Supply',
    location: 'PHC West',
    time: '10 mins ago',
    severity: 'critical',
  },
  {
    id: 2,
    title: 'High Dengue Cases',
    location: 'PHC South',
    time: '1 hour ago',
    severity: 'warning',
  },
  {
    id: 3,
    title: 'Staff Shortage',
    location: 'PHC East',
    time: '2 hours ago',
    severity: 'warning',
  },
];

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-end justify-between">
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      {trend && (
        <div
          className={`text-sm font-medium ${
            trendUp ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {trendUp ? '+' : '-'}{trend}
        </div>
      )}
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HealthOS-AI Overview</h1>
            <p className="text-gray-500 mt-1">District Health Command Center</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              System Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title="Overall Health Score"
            value="86/100"
            icon={Activity}
            trend="2.4%"
            trendUp={true}
          />
          <StatCard
            title="Today's Patients"
            value="1,284"
            icon={Users}
            trend="12%"
            trendUp={true}
          />
          <StatCard
            title="Bed Occupancy"
            value="78%"
            icon={Bed}
            trend="5%"
            trendUp={false}
          />
          <StatCard
            title="Doctor Availability"
            value="92%"
            icon={Stethoscope}
            trend="1%"
            trendUp={true}
          />
          <StatCard
            title="Medicine Stock"
            value="85%"
            icon={Pill}
            trend="3%"
            trendUp={false}
          />
          <StatCard
            title="Critical PHCs"
            value="2"
            icon={AlertCircle}
            trend="1"
            trendUp={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Patient Admissions Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={patientData}>
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" isAnimationActive={false} dataKey="patients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Resource Status by PHC</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                    <Tooltip
                      cursor={{fill: '#f3f4f6'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="medicine" isAnimationActive={false} name="Medicine Stock (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="beds" isAnimationActive={false} name="Bed Occupancy (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Recent Alerts</h2>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                  {alerts.length} New
                </span>
              </div>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start p-4 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full mr-4 ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{alert.location} • {alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                View All Alerts
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm text-white">
              <h2 className="text-lg font-semibold mb-2">AI Insights Ready</h2>
              <p className="text-indigo-100 text-sm mb-6">
                Gemini AI has analyzed the latest district health data and identified 3 resource optimization opportunities.
              </p>
              <button className="w-full bg-white text-indigo-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm">
                View Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
