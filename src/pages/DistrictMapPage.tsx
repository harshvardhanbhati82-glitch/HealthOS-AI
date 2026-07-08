import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Map, AlertTriangle, Users, Package, UserCheck } from 'lucide-react';
import type { PHC } from '../types';
import { PHC_DATA } from '../data/phcData';
import PHCModal from '../components/PHCModal';
import clsx from 'clsx';
import 'leaflet/dist/leaflet.css';

const riskMarkerColor: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

const riskBadge: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const stockBadge: Record<string, string> = {
  Good: 'bg-green-100 text-green-700',
  Low: 'bg-yellow-100 text-yellow-700',
  Critical: 'bg-red-100 text-red-700',
};

function FitBounds({ phcs }: { phcs: PHC[] }) {
  const map = useMap();
  useEffect(() => {
    if (phcs.length > 0) {
      map.fitBounds(phcs.map((p) => [p.lat, p.lng] as [number, number]), { padding: [40, 40] });
    }
  }, [map, phcs]);
  return null;
}

export default function DistrictMapPage() {
  const [selectedPHC, setSelectedPHC] = useState<PHC | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('All');

  const filtered = filterRisk === 'All' ? PHC_DATA : PHC_DATA.filter((p) => p.riskLevel === filterRisk);

  const riskCounts = {
    Low: PHC_DATA.filter((p) => p.riskLevel === 'Low').length,
    Medium: PHC_DATA.filter((p) => p.riskLevel === 'Medium').length,
    High: PHC_DATA.filter((p) => p.riskLevel === 'High').length,
    Critical: PHC_DATA.filter((p) => p.riskLevel === 'Critical').length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white">District Health Map</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kanpur District — {PHC_DATA.length} PHCs · Click any marker for details</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Low', 'Medium', 'High', 'Critical'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={clsx(
                  'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                  filterRisk === r
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                )}
              >
                {r}{r !== 'All' && <span className="ml-1 opacity-70">({riskCounts[r as keyof typeof riskCounts]})</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 min-h-0">
          <MapContainer center={[26.45, 80.25]} zoom={10} className="w-full h-full" style={{ minHeight: '500px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds phcs={filtered} />
            {filtered.map((phc) => (
              <CircleMarker
                key={phc.id}
                center={[phc.lat, phc.lng]}
                radius={phc.riskLevel === 'Critical' ? 18 : phc.riskLevel === 'High' ? 15 : 12}
                pathOptions={{
                  color: riskMarkerColor[phc.riskLevel],
                  fillColor: riskMarkerColor[phc.riskLevel],
                  fillOpacity: 0.85,
                  weight: 2.5,
                }}
              >
                <Popup maxWidth={280}>
                  <div className="font-sans py-1 min-w-[220px]">
                    <h3 className="font-bold text-gray-900 text-sm mb-0.5">{phc.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{phc.block}</p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="text-gray-600">Doctors:</span>
                        <span className="font-semibold text-gray-800">{phc.doctors}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="text-gray-600">Patients Today:</span>
                        <span className="font-semibold text-gray-800">{phc.patientsToday}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Package className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-gray-600">Medicine Stock:</span>
                        <span className={clsx('px-1.5 py-0.5 rounded text-xs font-semibold',
                          phc.medicineStock === 'Good' ? 'bg-green-100 text-green-700' :
                          phc.medicineStock === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {phc.medicineStock} ({phc.medicineStockPercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={clsx('px-1.5 py-0.5 rounded text-xs font-semibold',
                          phc.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                          phc.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                          phc.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        )}>
                          {phc.riskLevel}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPHC(phc)}
                      className="w-full bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors font-semibold"
                    >
                      View Details →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 shrink-0 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">PHC List</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click to view details</p>
          </div>
          <div className="flex-1 divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map((phc) => (
              <div
                key={phc.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                onClick={() => setSelectedPHC(phc)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: riskMarkerColor[phc.riskLevel] }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{phc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{phc.doctors} Dr · {phc.patientsToday} pts</p>
                    </div>
                  </div>
                  <span className={clsx('badge text-xs shrink-0', riskBadge[phc.riskLevel])}>{phc.riskLevel}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${phc.medicineStockPercent}%`, backgroundColor: riskMarkerColor[phc.medicineStock === 'Good' ? 'Low' : phc.medicineStock === 'Low' ? 'Medium' : 'Critical'] }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{phc.medicineStockPercent}%</span>
                </div>
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shrink-0">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Risk Legend</p>
            {Object.entries(riskMarkerColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{level} Risk</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPHC && <PHCModal phc={selectedPHC} onClose={() => setSelectedPHC(null)} />}
    </div>
  );
}
