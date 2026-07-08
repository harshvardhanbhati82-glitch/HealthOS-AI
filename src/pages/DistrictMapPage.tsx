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
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
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
      const bounds = phcs.map((p) => [p.lat, p.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, phcs]);
  return null;
}

export default function DistrictMapPage() {
  const [selectedPHC, setSelectedPHC] = useState<PHC | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('All');

  const filtered = filterRisk === 'All'
    ? PHC_DATA
    : PHC_DATA.filter((p) => p.riskLevel === filterRisk);

  const riskCounts = {
    Low: PHC_DATA.filter((p) => p.riskLevel === 'Low').length,
    Medium: PHC_DATA.filter((p) => p.riskLevel === 'Medium').length,
    High: PHC_DATA.filter((p) => p.riskLevel === 'High').length,
    Critical: PHC_DATA.filter((p) => p.riskLevel === 'Critical').length,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">District Health Map</h1>
              <p className="text-xs text-gray-500">Kanpur District — {PHC_DATA.length} PHCs</p>
            </div>
          </div>

          {/* Risk filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Low', 'Medium', 'High', 'Critical'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilterRisk(r)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                  filterRisk === r
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                )}
              >
                {r}
                {r !== 'All' && (
                  <span className="ml-1 opacity-70">({riskCounts[r as keyof typeof riskCounts]})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 min-h-0">
          <MapContainer
            center={[26.45, 80.25]}
            zoom={10}
            className="w-full h-full"
            style={{ minHeight: '500px' }}
          >
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
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => {/* popup opens */},
                }}
              >
                <Popup maxWidth={280} className="phc-popup">
                  <div className="font-sans py-1">
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{phc.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{phc.block}</p>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="text-gray-600">Doctors:</span>
                        <span className="font-medium text-gray-900">{phc.doctors}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span className="text-gray-600">Patients Today:</span>
                        <span className="font-medium text-gray-900">{phc.patientsToday}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Package className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-gray-600">Medicine Stock:</span>
                        <span className={clsx('px-1.5 py-0.5 rounded text-xs font-medium', stockBadge[phc.medicineStock])}>
                          {phc.medicineStock} ({phc.medicineStockPercent}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={clsx('px-1.5 py-0.5 rounded text-xs font-medium', riskBadge[phc.riskLevel])}>
                          {phc.riskLevel}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPHC(phc)}
                      className="w-full bg-blue-600 text-white text-xs py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Right sidebar — PHC list */}
        <div className="w-72 shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">PHC List</h3>
            <p className="text-xs text-gray-500 mt-0.5">Click a PHC to view details</p>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((phc) => (
              <div
                key={phc.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedPHC(phc)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: riskMarkerColor[phc.riskLevel] }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{phc.name}</p>
                      <p className="text-xs text-gray-500">{phc.doctors} Dr · {phc.patientsToday} pts</p>
                    </div>
                  </div>
                  <span className={clsx('badge text-xs shrink-0', riskBadge[phc.riskLevel])}>
                    {phc.riskLevel}
                  </span>
                </div>

                {/* Stock bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${phc.medicineStockPercent}%`,
                        backgroundColor: riskMarkerColor[
                          phc.medicineStock === 'Good' ? 'Low' :
                          phc.medicineStock === 'Low' ? 'Medium' : 'Critical'
                        ],
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{phc.medicineStockPercent}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 mb-2">RISK LEGEND</p>
            {Object.entries(riskMarkerColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-600">{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHC Detail Modal */}
      {selectedPHC && (
        <PHCModal phc={selectedPHC} onClose={() => setSelectedPHC(null)} />
      )}
    </div>
  );
}
