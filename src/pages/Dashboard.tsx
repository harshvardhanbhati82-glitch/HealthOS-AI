import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, UserCheck, AlertTriangle,
  Syringe, Package, TrendingUp, TrendingDown, Minus,
  ChevronRight, Activity, RefreshCw,
} from 'lucide-react';
import { DASHBOARD_STATS, PHC_DATA, PREDICTION_DATA } from '../data/phcData';
import { StatCardSkeleton } from '../components/Skeleton';
import clsx from 'clsx';

const riskColor: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const stockColor: Record<string, string> = {
  Good: 'bg-green-500',
  Low: 'bg-yellow-500',
  Critical: 'bg-red-500',
};

const STAT_CARDS = [
  { label: 'Total PHCs', value: DASHBOARD_STATS.totalPHCs, icon: Building2, color: 'bg-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-900/30', sub: 'Across Kanpur District' },
  { label: 'Active Doctors', value: DASHBOARD_STATS.activeDoctors, icon: UserCheck, color: 'bg-green-500', iconBg: 'bg-green-50 dark:bg-green-900/30', sub: 'On duty today' },
  { label: 'Patients Today', value: DASHBOARD_STATS.patientsToday, icon: Users, color: 'bg-purple-500', iconBg: 'bg-purple-50 dark:bg-purple-900/30', sub: 'District total' },
  { label: 'Critical Alerts', value: DASHBOARD_STATS.criticalAlerts, icon: AlertTriangle, color: 'bg-red-500', iconBg: 'bg-red-50 dark:bg-red-900/30', sub: 'Require immediate action' },
  { label: 'Vaccination Rate', value: `${DASHBOARD_STATS.vaccinationRate}%`, icon: Syringe, color: 'bg-teal-500', iconBg: 'bg-teal-50 dark:bg-teal-900/30', sub: 'District average' },
  { label: 'Stock Health', value: `${DASHBOARD_STATS.medicineStockHealth}%`, icon: Package, color: 'bg-indigo-500', iconBg: 'bg-indigo-50 dark:bg-indigo-900/30', sub: 'Medicine availability' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setLastRefreshed(new Date()); }, 800);
  };

  const criticalPHCs = PHC_DATA.filter((p) => p.riskLevel === 'Critical' || p.riskLevel === 'High');
  const topPredictions = PREDICTION_DATA.filter((p) => p.riskScore > 60).slice(0, 3);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">District Health Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Kanpur District — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Updated {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-3 py-1.5">
            <Activity className="w-3.5 h-3.5 text-green-500" />
            <span className="text-green-700 dark:text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          : STAT_CARDS.map(({ label, value, icon: Icon, color, iconBg, sub }) => (
            <div key={label} className="card flex items-start gap-4 hover:scale-[1.01] transition-transform cursor-default">
              <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
                <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert PHCs */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              High-Risk PHCs
            </h2>
            <button
              onClick={() => navigate('/map')}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 font-medium"
            >
              View Map <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {criticalPHCs.map((phc) => (
              <div
                key={phc.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => navigate('/map')}
              >
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{phc.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {phc.block} · {phc.doctors} Dr · {phc.patientsToday} pts
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={clsx('badge', riskColor[phc.riskLevel])}>{phc.riskLevel}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full transition-all', stockColor[phc.medicineStock])}
                        style={{ width: `${phc.medicineStockPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums w-7">
                      {phc.medicineStockPercent}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Predictions */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              AI Predictions
            </h2>
            <button
              onClick={() => navigate('/predictions')}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 font-medium"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {topPredictions.map((pred) => {
              const TrendIcon = pred.trend === 'up' ? TrendingUp : pred.trend === 'down' ? TrendingDown : Minus;
              const trendClass = pred.trend === 'up' ? 'text-red-500' : pred.trend === 'down' ? 'text-green-500' : 'text-gray-400';
              return (
                <div
                  key={pred.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigate('/predictions')}
                >
                  <div className="w-12 h-12 shrink-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{pred.riskScore}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">risk</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{pred.title}</p>
                      <TrendIcon className={clsx('w-4 h-4 shrink-0', trendClass)} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{pred.description}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">{pred.confidence}% confidence</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PHC Overview Table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="font-bold text-gray-900 dark:text-white">All PHCs Overview</h2>
          <button
            onClick={() => navigate('/reports')}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 font-medium"
          >
            Export Report <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800">
              <tr>
                {['PHC Name', 'Doctors', 'Patients Today', 'Stock', 'Risk'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PHC_DATA.map((phc) => (
                <tr
                  key={phc.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                  onClick={() => navigate('/map')}
                >
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{phc.name}</td>
                  <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 tabular-nums">{phc.doctors}</td>
                  <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 tabular-nums">{phc.patientsToday}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full', stockColor[phc.medicineStock])}
                          style={{ width: `${phc.medicineStockPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums w-8">{phc.medicineStockPercent}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={clsx('badge', riskColor[phc.riskLevel])}>{phc.riskLevel}</span>
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
