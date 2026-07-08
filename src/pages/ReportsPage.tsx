import { useState } from 'react';
import {
  FileBarChart2, Download, FileSpreadsheet, FileText,
  CheckCircle2, AlertTriangle, Filter
} from 'lucide-react';
import { REPORT_DATA } from '../data/phcData';
import type { ReportData } from '../types';
import clsx from 'clsx';

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

async function exportPDF(data: ReportData[]) {
  // Dynamic import to avoid SSR issues
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.jsPDF;
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'landscape' });

  // Title block
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('HealthOS AI — District Health Report', 14, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Kanpur District  ·  Generated: ${new Date().toLocaleString('en-IN')}`, 14, 26);

  // Summary row
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text(`PHCs: ${data.length}`, 14, 36);
  doc.text(`Patients: ${data.reduce((a, d) => a + d.patients, 0)}`, 60, 36);
  doc.text(`Vaccinations: ${data.reduce((a, d) => a + d.vaccinations, 0)}`, 120, 36);
  doc.text(`Critical PHCs: ${data.filter((d) => d.riskLevel === 'Critical').length}`, 200, 36);

  autoTable(doc, {
    startY: 44,
    head: [['PHC Name', 'Block', 'Doctors', 'Patients', 'Medicine Stock', 'Risk Level', 'Vaccinations', 'Active Cases']],
    body: data.map((d) => [
      d.phcName, d.block, d.doctors, d.patients,
      d.medicineStock, d.riskLevel, d.vaccinations, d.activeCases,
    ]),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Footer on every page
  const pageCount = (doc as any).internal.getNumberOfPages?.() ?? 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `HealthOS AI · UP State Health Mission · Page ${i} of ${pageCount}`,
      14,
      (doc.internal.pageSize as any).height - 8
    );
  }

  doc.save(`HealthOS_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

async function exportExcel(data: ReportData[]) {
  const XLSX = await import('xlsx');

  const summaryRows = [
    ['HealthOS AI — District Health Report'],
    ['Kanpur District'],
    ['Generated:', new Date().toLocaleString('en-IN')],
    [],
    ['Metric', 'Value'],
    ['Total PHCs', data.length],
    ['Total Doctors', data.reduce((a, d) => a + d.doctors, 0)],
    ['Total Patients Today', data.reduce((a, d) => a + d.patients, 0)],
    ['Critical Risk PHCs', data.filter((d) => d.riskLevel === 'Critical').length],
    ['High Risk PHCs', data.filter((d) => d.riskLevel === 'High').length],
    ['Total Vaccinations', data.reduce((a, d) => a + d.vaccinations, 0)],
    ['Total Active Cases', data.reduce((a, d) => a + d.activeCases, 0)],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  const detailSheet = XLSX.utils.json_to_sheet(
    data.map((d) => ({
      'PHC Name': d.phcName,
      'Block': d.block,
      'Doctors': d.doctors,
      'Patients Today': d.patients,
      'Medicine Stock': d.medicineStock,
      'Risk Level': d.riskLevel,
      'Vaccinations': d.vaccinations,
      'Active Cases': d.activeCases,
      'Date': d.date,
    }))
  );

  detailSheet['!cols'] = [
    { wch: 22 }, { wch: 20 }, { wch: 10 }, { wch: 15 },
    { wch: 15 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
  XLSX.utils.book_append_sheet(wb, detailSheet, 'PHC Details');
  XLSX.writeFile(wb, `HealthOS_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function ReportsPage() {
  const [filterRisk, setFilterRisk] = useState('All');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const filtered = filterRisk === 'All'
    ? REPORT_DATA
    : REPORT_DATA.filter((d) => d.riskLevel === filterRisk);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportPDF(filtered);
      setExportSuccess('PDF exported successfully!');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (e) {
      console.error(e);
      alert('PDF export failed. Check console for details.');
    }
    setIsExportingPDF(false);
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      await exportExcel(filtered);
      setExportSuccess('Excel exported successfully!');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (e) {
      console.error(e);
      alert('Excel export failed. Check console for details.');
    }
    setIsExportingExcel(false);
  };

  const totalPatients = filtered.reduce((a, d) => a + d.patients, 0);
  const totalVaccinations = filtered.reduce((a, d) => a + d.vaccinations, 0);
  const totalActiveCases = filtered.reduce((a, d) => a + d.activeCases, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <FileBarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">District Health Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Kanpur District · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {exportSuccess && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {exportSuccess}
            </div>
          )}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isExportingPDF ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isExportingExcel ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'PHCs in Report', value: filtered.length, color: 'text-blue-600' },
          { label: 'Total Patients', value: totalPatients, color: 'text-purple-600' },
          { label: 'Total Vaccinations', value: totalVaccinations, color: 'text-teal-600' },
          { label: 'Active Cases', value: totalActiveCases, color: 'text-orange-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-4">
            <p className={clsx('text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter by Risk:</span>
          </div>
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-all',
                filterRisk === r
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
              )}
            >
              {r}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500">{filtered.length} PHCs shown</span>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['PHC Name', 'Block', 'Doctors', 'Patients Today', 'Medicine Stock', 'Risk Level', 'Vaccinations', 'Active Cases'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900 whitespace-nowrap">{row.phcName}</td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{row.block}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{row.doctors}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{row.patients}</td>
                  <td className="py-3 px-4">
                    <span className={clsx('badge', stockBadge[row.medicineStock])}>
                      {row.medicineStock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={clsx('badge', riskBadge[row.riskLevel])}>
                      {row.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">{row.vaccinations}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={clsx(row.activeCases > 30 ? 'text-red-600 font-semibold' : 'text-gray-700')}>
                      {row.activeCases}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <AlertTriangle className="w-10 h-10 mb-3 opacity-40" />
            <p>No data matches the selected filter</p>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <span>Showing {filtered.length} of {REPORT_DATA.length} PHCs</span>
          <span>Data as of {new Date().toLocaleDateString('en-IN')}</span>
        </div>
      </div>

      {/* Export note */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Download className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">Export includes filtered data only</p>
          <p className="text-xs text-blue-600 mt-0.5">
            PDF and Excel exports will include only the PHCs visible in the table above based on your current filter selection.
          </p>
        </div>
      </div>
    </div>
  );
}
