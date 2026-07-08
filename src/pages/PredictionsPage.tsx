import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Brain, Shield, Clock, MapPin, Zap, AlertTriangle, Activity } from 'lucide-react';
import { PREDICTION_DATA } from '../data/phcData';
import type { PredictionCard } from '../types';
import clsx from 'clsx';

const categoryConfig: Record<string, { label: string; textColor: string; bg: string; border: string }> = {
  disease:     { label: 'Disease',     textColor: 'text-red-600 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-900/20',     border: 'border-red-200 dark:border-red-800' },
  resource:    { label: 'Resource',    textColor: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  vaccination: { label: 'Vaccination', textColor: 'text-teal-600 dark:text-teal-400',   bg: 'bg-teal-50 dark:bg-teal-900/20',   border: 'border-teal-200 dark:border-teal-800' },
  emergency:   { label: 'Emergency',   textColor: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' },
};

function getRiskStyle(score: number) {
  if (score >= 80) return { stroke: '#ef4444', text: 'text-red-500', borderLeft: 'border-l-red-500' };
  if (score >= 60) return { stroke: '#f97316', text: 'text-orange-500', borderLeft: 'border-l-orange-500' };
  if (score >= 40) return { stroke: '#f59e0b', text: 'text-yellow-500', borderLeft: 'border-l-yellow-500' };
  return { stroke: '#10b981', text: 'text-green-500', borderLeft: 'border-l-green-500' };
}

function RiskGauge({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const style = getRiskStyle(score);
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={style.stroke}
          strokeWidth="6"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className={clsx('text-xl font-bold leading-none tabular-nums', style.text)}>{score}</p>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

function PredCard({ pred }: { pred: PredictionCard }) {
  const [expanded, setExpanded] = useState(false);
  const TrendIcon = pred.trend === 'up' ? TrendingUp : pred.trend === 'down' ? TrendingDown : Minus;
  const trendCls = pred.trend === 'up'
    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
    : pred.trend === 'down'
    ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
    : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800';
  const catCfg = categoryConfig[pred.category];
  const style = getRiskStyle(pred.riskScore);

  return (
    <div className={clsx(
      'card border-l-4 hover:shadow-md transition-all duration-200',
      style.borderLeft
    )}>
      <div className="flex items-start gap-5">
        <RiskGauge score={pred.riskScore} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-base flex-1 leading-tight">{pred.title}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold', trendCls)}>
                <TrendIcon className="w-3 h-3" />
                {pred.trend === 'up' ? 'Rising' : pred.trend === 'down' ? 'Declining' : 'Stable'}
              </span>
              <span className={clsx('badge border text-xs', catCfg.bg, catCfg.textColor, catCfg.border)}>
                {catCfg.label}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{pred.description}</p>
          <div className="flex items-center gap-5 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Confidence:</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{pred.confidence}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(pred.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Confidence Level</span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tabular-nums">{pred.confidence}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${pred.confidence}%` }}
          />
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-4 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium"
      >
        <Zap className="w-3.5 h-3.5" />
        {expanded ? 'Hide Recommended Action' : 'Show Recommended Action & Affected Areas'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4 animate-fade-in">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-bold text-blue-900 dark:text-blue-300">Recommended Action</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{pred.recommendedAction}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Affected Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {pred.affectedAreas.map((area) => (
                <span key={area} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PredictionsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'risk' | 'confidence'>('risk');

  const filtered = PREDICTION_DATA
    .filter((p) => categoryFilter === 'All' || p.category === categoryFilter)
    .sort((a, b) => sortBy === 'risk' ? b.riskScore - a.riskScore : b.confidence - a.confidence);

  const highRiskCount = PREDICTION_DATA.filter((p) => p.riskScore >= 75).length;
  const avgConfidence = Math.round(PREDICTION_DATA.reduce((a, p) => a + p.confidence, 0) / PREDICTION_DATA.length);
  const avgRisk = Math.round(PREDICTION_DATA.reduce((a, p) => a + p.riskScore, 0) / PREDICTION_DATA.length);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-sm">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Health Predictions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Predictive analytics for Kanpur District</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Predictions</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{PREDICTION_DATA.length}</p>
        </div>
        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">High-Risk Alerts</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{highRiskCount}</p>
        </div>
        <div className="card border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Confidence</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{avgConfidence}%</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Avg risk score: {avgRisk}/100</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card py-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Category:</span>
          {['All', 'disease', 'resource', 'vaccination', 'emergency'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-all',
                categoryFilter === cat
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-purple-400'
              )}
            >
              {cat === 'All' ? 'All' : categoryConfig[cat]?.label ?? cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sort:</span>
          {(['risk', 'confidence'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-all',
                sortBy === s
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
              )}
            >
              {s === 'risk' ? 'Risk Score' : 'Confidence'}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((pred) => <PredCard key={pred.id} pred={pred} />)}
        {filtered.length === 0 && (
          <div className="card flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
            <Brain className="w-12 h-12 mb-3 opacity-30" />
            <p>No predictions match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
