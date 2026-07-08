import { X, User, Package, Wrench, Syringe, Bot, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { PHC } from '../types';
import clsx from 'clsx';

interface PHCModalProps {
  phc: PHC;
  onClose: () => void;
}

const riskColors: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
};

const stockBarColor: Record<string, string> = {
  Good: 'bg-green-500',
  Low: 'bg-yellow-500',
  Critical: 'bg-red-500',
};

const equipStatusConfig = {
  Operational: {
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    cls: 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
  },
  'Under Repair': {
    icon: <Clock className="w-4 h-4 text-yellow-500" />,
    cls: 'text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400',
  },
  'Non-Functional': {
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    cls: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
  },
};

export default function PHCModal({ phc, onClose }: PHCModalProps) {
  const totalTarget = phc.vaccinations.reduce((acc, v) => acc + v.target, 0);
  const totalAchieved = phc.vaccinations.reduce((acc, v) => acc + v.achieved, 0);
  const overallVaxPct = totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800 animate-slide-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-950 to-blue-700 text-white p-6 rounded-t-2xl flex items-start justify-between z-10">
          <div>
            <h2 className="text-xl font-bold">{phc.name}</h2>
            <p className="text-blue-200 text-sm mt-1">{phc.block}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <span className={clsx('badge border text-xs', riskColors[phc.riskLevel])}>
                {phc.riskLevel} Risk
              </span>
              <span className="text-blue-200 text-xs bg-white/10 px-2 py-0.5 rounded-full">{phc.beds} Beds</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white hover:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Doctors', value: phc.doctors, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Patients Today', value: phc.patientsToday, color: 'text-purple-700 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { label: 'Active Cases', value: phc.activeCases, color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={clsx('text-center py-4 rounded-xl', bg)}>
                <p className={clsx('text-2xl font-bold tabular-nums', color)}>{value}</p>
                <p className={clsx('text-xs mt-0.5', color.replace('700', '600').replace('400', '400'))}>{label}</p>
              </div>
            ))}
          </div>

          {/* Medicine Stock */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-indigo-500" />
              </div>
              Medicine Stock
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {phc.medicineStock} ({phc.medicineStockPercent}%)
                </span>
                <span className={clsx('badge text-xs',
                  phc.medicineStock === 'Good' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  phc.medicineStock === 'Low' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  {phc.medicineStock}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={clsx('h-full rounded-full transition-all duration-700', stockBarColor[phc.medicineStock])}
                  style={{ width: `${phc.medicineStockPercent}%` }}
                />
              </div>
              {phc.medicineStockPercent < 30 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  Emergency resupply required immediately
                </p>
              )}
            </div>
          </section>

          {/* Equipment Status */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Wrench className="w-4 h-4 text-orange-500" />
              </div>
              Equipment Status
            </h3>
            <div className="space-y-2">
              {phc.equipment.map((eq, i) => {
                const cfg = equipStatusConfig[eq.status];
                return (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      {cfg.icon}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{eq.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Checked: {eq.lastChecked}</p>
                      </div>
                    </div>
                    <span className={clsx('badge text-xs', cfg.cls)}>{eq.status}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Vaccination Progress */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                <Syringe className="w-4 h-4 text-teal-500" />
              </div>
              Vaccination Progress
            </h3>
            <div className="mb-3 p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl flex items-center gap-4">
              <div className="text-center shrink-0">
                <p className="text-2xl font-bold text-teal-700 dark:text-teal-400 tabular-nums">{overallVaxPct}%</p>
                <p className="text-xs text-teal-600 dark:text-teal-500">Overall</p>
              </div>
              <div className="flex-1">
                <div className="w-full h-2.5 bg-teal-200 dark:bg-teal-900 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all duration-700" style={{ width: `${overallVaxPct}%` }} />
                </div>
                <p className="text-xs text-teal-600 dark:text-teal-500 mt-1 tabular-nums">
                  {totalAchieved.toLocaleString()} / {totalTarget.toLocaleString()} doses
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              {phc.vaccinations.map((vax, i) => {
                const pct = vax.target > 0 ? Math.round((vax.achieved / vax.target) * 100) : 0;
                const barColor = pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-teal-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
                return (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{vax.name}</span>
                      <span className="text-gray-500 dark:text-gray-400 tabular-nums">{vax.achieved}/{vax.target} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full transition-all duration-700', barColor)} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AI Recommendation */}
          <section>
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-500" />
              </div>
              AI Recommendation
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-900 dark:text-blue-300 leading-relaxed">{phc.aiRecommendation}</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
