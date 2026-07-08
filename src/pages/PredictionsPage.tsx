import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Brain, Shield,
  Clock, MapPin, Zap, AlertTriangle, Activity
} from 'lucide-react';
import { PREDICTION_DATA } from '../data/phcData';
import type { PredictionCard } from '../types';
import clsx from 'clsx';

const categoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  disease: { label: 'Disease', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  resource: { label: 'Resource', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  vaccination: { label: 'Vaccination', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200' },
  emergency: { label: 'Emergency', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
};

function getRiskColor(score: number) {
  if (score >= 80) return { ring: 'stroke-red-500', text: 'text-red-600', bg: 'bg-red-50' };
  if (score >= 60) return { ring: 'stroke-orange-500', text: 'text-orange-600', bg: 'bg-orange-50' };
  if (score >= 40) return { ring: 'stroke-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50' };
  return { ring: 'stroke-green-500', text: 'text-green-600', bg: 'bg-green-50' };
}

function RiskGauge({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const colors = getRiskColor(score);
  return (
    <div className={clsx('relative w-20 h-20 rounded-full flex items-center justify-center', colors.bg)}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          className={colors.ring}
          strokeWidth="6"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="relative text-center">
        <p className={clsx('text-xl font-bold leading-none', colors.text)}>{score}</p>
        <p className="text-[10px] text-gray-400 leading-none mt-0.5">/ 100</p>
      </div>
    </div>
  );
}

function PredictionCardComponent({ pred }: { pred: PredictionCard }) {
  const [expanded, setExpanded] = useState(false);
  const TrendIcon = pred.trend === 'up' ? TrendingUp : pred.trend === 'down' ? TrendingDown : Minus;
  const trendClass = pred.trend === 'up' ? 'text-red-500 bg-red-50' : pred.trend === 'down' ? 'text-green-500 bg-green-50' : 'text-gray-400 bg-gray-50';
  const catCfg = categoryConfig[pred.category];
  const riskColors = getRiskColor(pred.riskScore);

  return (
    <div className={clsx(
      'card border-l-4 hover:shadow-md transition-shadow',
      pred.riskScore >= 80 ? 'border-l-red-500' :
      pred.riskScore >= 60 ? 'border-l-orange-500' :
      pred.riskScore >= 40 ? 'border-l-yellow-500' : 'border-l-green-500'
    )}>
      {/* Top row */}
      <div className="flex items-start gap-4">
        <RiskGauge score={pred.riskScore} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 text-base flex-1">{pred.title}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', trendClass)}>
                <TrendIcon className="w-3.5 h-3.5" />
                {pred.trend === 'up' ? 'Rising' : pred.trend === 'down' ? 'Declining' : 'Stable'}
              </span>
              <span className={clsx('badge border text-xs', catCfg.bg, catCfg.color)}>
                {catCfg.label}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{pred.description}</p>

          {/* Metrics row */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-500">Confidence:</span>
              <span className="text-xs font-semibold text-blue-700">{pred.confidence}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Updated:</span>
              <span className="text-xs text-gray-700">
                {new Date(pred.lastUpdated).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">AI Confidence Level</span>
          <span className="text-xs font-semibold text-gray-700">{pred.confidence}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <div
            className="h-2 rounded-full bg-blue-500 transition-all"
            style={{ width: `${pred.confidence}%` }}
          />
        </div>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-4 text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 py-1"
      >
        {expanded ? '▲ Hide Details' : '▼ Show Recommended Action & Affected Areas'}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3">
          {/* Recommended Action */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Recommended Action</span>
            </div>
            <p className="text-sm text-blue-800">{pred.recommendedAction}</p>
          </div>

          {/* Affected Areas */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Affected Areas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {pred.affectedAreas.map((area) => (
                <span key={area} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
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
  const avgRisk = Math.round(PREDICTION_DATA.reduce((a, p) => a + p.riskScore, 0) / PREDICTION_DATA.length);
  const avgConfidence = Math.round(PREDICTION_DATA.reduce((a, p) => a + p.confidence, 0) / PREDICTION_DATA.length);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Health Predictions</h1>
            <p className="text-sm text-gray-500 mt-0.5">Predictive analytics for Kanpur District</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card border-l-4 border-l-purple-500">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">Total Predictions</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{PREDICTION_DATA.length}</p>
        </div>
        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-600">High-Risk Alerts</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{highRiskCount}</p>
        </div>
        <div className="card border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Avg Confidence</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgConfidence}%</p>
          <p className="text-xs text-gray-400 mt-0.5">Avg risk: {avgRisk}/100</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card flex items-center gap-4 flex-wrap py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Category:</span>
          {['All', 'disease', 'resource', 'vaccination', 'emergency'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
                categoryFilter === cat
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'
              )}
            >
              {cat === 'All' ? 'All' : categoryConfig[cat]?.label ?? cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-medium text-gray-600">Sort by:</span>
          <button
            onClick={() => setSortBy('risk')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              sortBy === 'risk' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
            )}
          >
            Risk Score
          </button>
          <button
            onClick={() => setSortBy('confidence')}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              sortBy === 'confidence' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200'
            )}
          >
            Confidence
          </button>
        </div>
      </div>

      {/* Prediction cards */}
      <div className="space-y-4">
        {filtered.map((pred) => (
          <PredictionCardComponent key={pred.id} pred={pred} />
        ))}
        {filtered.length === 0 && (
          <div className="card flex flex-col items-center justify-center py-16 text-gray-400">
            <Brain className="w-12 h-12 mb-3 opacity-30" />
            <p>No predictions match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
