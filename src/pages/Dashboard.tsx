import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, UserCheck, AlertTriangle,
  Syringe, Package, TrendingUp, TrendingDown, Minus,
  ChevronRight, Activity
} from 'lucide-react';
import { DASHBOARD_STATS, PHC_DATA, PREDICTION_DATA } from '../data/phcData';
import clsx from 'clsx';

const riskColor: Record<string, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

const stockColor: Record<string, string> = {
  Good: 'bg-green-500',
  Low: 'bg-yellow-500',
  Critical: 'bg-red-500',
};

const STAT_CARDS = [
  {
    label: 'Total PHCs',
    value: DASHBOARD_STATS.totalPHCs,
    icon: Building2,
    color: 'bg-blue-500',
    sub: 'Across Kanpur District',
  },
  {
    label: 'Active Doctors',
    value: DASHBOARD_STATS.activeDoctors,
    icon: UserCheck,
    color: 'bg-green-500',
    sub: 'On duty today',
  },
  {
    label: 'Patients Today',
    value: DASHBOARD_STATS.patientsToday,
    icon: Users,
    color: 'bg-purple-500',
    sub: 'District total',
  },
  {
    label: 'Critical Alerts',
    value: DASHBOARD_STATS.criticalAlerts,
    icon: AlertTriangle,
    color: 'bg-red-500',
    sub: 'Require immediate action',
  },
  {
    label: 'Vaccination Rate',
    value: `${DASHBOARD_STATS.vaccinationRate}%`,
    icon: Syringe,
    color: 'bg-teal-500',
    sub: 'District average',
  },
  {
    label: 'Stock Health',
    value: `${DASHBOARD_STATS.medicineStockHealth}%`,
    icon: Package,
    color: 'bg-indigo-500',
    sub: 'Medicine availability',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const criticalPHCs = PHC_DATA.filter(
    (p) => p.riskLevel === 'Critical' || p.riskLevel === 'High'
  );

  const topPredictions = PREDICTION_DATA.filter((p) => p.riskScore > 60).slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">District Health Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kanpur District — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-green-700 text-sm font-medium">Live Data</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="card flex items-start gap-4">
            <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', color)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert PHCs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              High-Risk PHCs
            </h2>
            <button
              onClick={() => navigate('/map')}
              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
            >
              View Map <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {criticalPHCs.map((phc) => (
              <div key={phc.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium text-sm text-gray-900">{phc.name}</p>
                  <p className="text-xs text-gray-500">{phc.block} · {phc.doctors} Dr · {phc.patientsToday} pts</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={clsx('badge', riskColor[phc.riskLevel])}>
                    {phc.riskLevel}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                      <div
                        className={clsx('h-1.5 rounded-full', stockColor[phc.medicineStock])}
                        style={{ width: `${phc.medicineStockPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{phc.medicineStockPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Predictions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              AI Predictions
            </h2>
            <button
              onClick={() => navigate('/predictions')}
              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {topPredictions.map((pred) => {
              const TrendIcon = pred.trend === 'up' ? TrendingUp : pred.trend === 'down' ? TrendingDown : Minus;
              const trendClass = pred.trend === 'up' ? 'text-red-500' : pred.trend === 'down' ? 'text-green-500' : 'text-gray-400';
              return (
                <div key={pred.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-12 h-12 shrink-0 flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200">
                    <span className="text-lg font-bold text-gray-900">{pred.riskScore}</span>
                    <span className="text-[10px] text-gray-400">risk</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-gray-900 truncate">{pred.title}</p>
                      <TrendIcon className={clsx('w-4 h-4 shrink-0', trendClass)} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{pred.description}</p>
                    <p className="text-xs text-blue-600 mt-1">{pred.confidence}% confidence</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PHC Overview Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">All PHCs Overview</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-blue-600 text-sm hover:underline flex items-center gap-1"
          >
            Export Report <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">PHC Name</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Doctors</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Patients Today</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Stock</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {PHC_DATA.map((phc) => (
                <tr key={phc.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-900">{phc.name}</td>
                  <td className="py-2.5 px-3 text-center text-gray-700">{phc.doctors}</td>
                  <td className="py-2.5 px-3 text-center text-gray-700">{phc.patientsToday}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className={clsx('h-1.5 rounded-full', stockColor[phc.medicineStock])}
                          style={{ width: `${phc.medicineStockPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{phc.medicineStockPercent}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={clsx('badge', riskColor[phc.riskLevel])}>
                      {phc.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
