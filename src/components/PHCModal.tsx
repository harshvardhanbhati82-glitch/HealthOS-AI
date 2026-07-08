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

const equipStatusIcon = {
  Operational: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  'Under Repair': <Clock className="w-4 h-4 text-yellow-500" />,
  'Non-Functional': <AlertTriangle className="w-4 h-4 text-red-500" />,
};

const equipStatusClass = {
  Operational: 'text-green-700 bg-green-50',
  'Under Repair': 'text-yellow-700 bg-yellow-50',
  'Non-Functional': 'text-red-700 bg-red-50',
};

export default function PHCModal({ phc, onClose }: PHCModalProps) {
  const totalVaccinationTarget = phc.vaccinations.reduce((acc, v) => acc + v.target, 0);
  const totalVaccinationAchieved = phc.vaccinations.reduce((acc, v) => acc + v.achieved, 0);
  const overallVaxPercent = Math.round((totalVaccinationAchieved / totalVaccinationTarget) * 100);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-2xl flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">{phc.name}</h2>
            <p className="text-blue-200 text-sm mt-1">{phc.block}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={clsx('badge border', riskColors[phc.riskLevel])}>
                {phc.riskLevel} Risk
              </span>
              <span className="text-blue-100 text-xs">{phc.beds} Beds</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <User className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-blue-900">{phc.doctors}</p>
              <p className="text-xs text-blue-600">Doctors</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-900">{phc.patientsToday}</p>
              <p className="text-xs text-purple-600">Patients Today</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-900">{phc.activeCases}</p>
              <p className="text-xs text-red-600">Active Cases</p>
            </div>
          </div>

          {/* Medicine Stock */}
          <section>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-indigo-500" />
              Medicine Stock
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">{phc.medicineStock} ({phc.medicineStockPercent}%)</span>
                <span
                  className={clsx(
                    'badge',
                    phc.medicineStock === 'Good' ? 'bg-green-100 text-green-700' :
                    phc.medicineStock === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}
                >
                  {phc.medicineStock}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className={clsx('h-3 rounded-full transition-all', stockBarColor[phc.medicineStock])}
                  style={{ width: `${phc.medicineStockPercent}%` }}
                />
              </div>
              {phc.medicineStockPercent < 30 && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Emergency resupply needed immediately
                </p>
              )}
            </div>
          </section>

          {/* Equipment Status */}
          <section>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-orange-500" />
              Equipment Status
            </h3>
            <div className="space-y-2">
              {phc.equipment.map((eq, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {equipStatusIcon[eq.status]}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{eq.name}</p>
                      <p className="text-xs text-gray-400">Checked: {eq.lastChecked}</p>
                    </div>
                  </div>
                  <span className={clsx('badge text-xs', equipStatusClass[eq.status])}>
                    {eq.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Vaccination Progress */}
          <section>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Syringe className="w-5 h-5 text-teal-500" />
              Vaccination Progress
            </h3>
            <div className="mb-3 p-3 bg-teal-50 rounded-xl flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-700">{overallVaxPercent}%</p>
                <p className="text-xs text-teal-600">Overall</p>
              </div>
              <div className="flex-1">
                <div className="w-full h-3 bg-teal-200 rounded-full">
                  <div
                    className="h-3 bg-teal-500 rounded-full"
                    style={{ width: `${overallVaxPercent}%` }}
                  />
                </div>
                <p className="text-xs text-teal-600 mt-1">
                  {totalVaccinationAchieved} / {totalVaccinationTarget} doses
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {phc.vaccinations.map((vax, i) => {
                const pct = Math.round((vax.achieved / vax.target) * 100);
                return (
                  <div key={i} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{vax.name}</span>
                      <span className="text-gray-500">{vax.achieved}/{vax.target} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={clsx(
                          'h-2 rounded-full',
                          pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-teal-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AI Recommendation */}
          <section>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-blue-500" />
              AI Recommendation
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900 leading-relaxed">{phc.aiRecommendation}</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
