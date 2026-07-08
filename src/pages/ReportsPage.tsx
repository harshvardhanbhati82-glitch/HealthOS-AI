import { useState } from 'react';
import { FileBarChart2, FileSpreadsheet, FileText, CheckCircle2, AlertTriangle, Filter, Download } from 'lucide-react';
import { REPORT_DATA } from '../data/phcData';
import type { ReportData } from '../types';
import { useToast } from '../components/Toast';
import clsx from 'clsx';

const riskBadge: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const stockBadge: Record<string, string> = {
  Good: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Low: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

async function exportPDF(data: ReportData[]) {
  const jsPDFModule = await import('jspdf');
  const jsPDF = jsPDFModule.jsPDF;
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({ orientation: 'landscape' });

  // Header bar
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 297, 28, 'F');
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('HealthOS AI — District Health Report', 14, 12);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Kanpur District · UP State Health Mission · Generated: ${new Date().toLocaleString('en-IN')}`, 14, 21);

  // Summary boxes
  const summaryItems = [
    { label: 'Total PHCs', value: String(data.length) },
    { label: 'Total Patients', value: String(data.reduce((a, d) => a + d.patients, 0)) },
    { label: 'Vaccinations', value: String(data.reduce((a, d) => a + d.vaccinations, 0)) },
    { label: 'Critical PHCs', value: String(data.filter((d) => d.riskLevel === 'Critical').length) },
    { label: 'High Risk PHCs', value: String(data.filter((d) => d.riskLevel === 'High').length) },
  ];

  doc.setTextColor(30, 30, 30);
  summaryItems.forEach((item, i) => {
    const x = 14 + i * 56;
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(x, 32, 52, 16, 2, 2, 'F');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(item.value, x + 26, 41, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(item.label, x + 26, 46, { align: 'center' });
  });

  autoTable(doc, {
    startY: 52,
    head: [['PHC Name', 'Block', 'Doctors', 'Patients', 'Medicine Stock', 'Risk Level', 'Vaccinations', 'Active Cases']],
    body: data.map((d) => [d.phcName, d.block, d.doctors, d.patients, d.medicineStock, d.riskLevel, d.vaccinations, d.activeCases]),
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9, cellPadding: 4 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3.5 },
    bodyStyles: { textColor: [30, 30, 30] },
    columnStyles: { 0: { fontStyle: 'bold' } },
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageCount: number = (doc.internal as any).getNumberOfPages?.() ?? 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`HealthOS AI · Page ${i} of ${pageCount}`, 14, pageHeight - 8);
    doc.text(new Date().toLocaleDateString('en-IN'), 297 - 14, pageHeight - 8, { align: 'right' });
  }

  doc.save(`HealthOS_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

async function exportExcel(data: ReportData[]) {
  const XLSX = await import('xlsx');

  const summaryRows = [
    ['HealthOS AI — District Health Report'],
    ['Kanpur District · UP State Health Mission'],
    ['Generated:', new Date().toLocaleString('en-IN')],
    [],
    ['Summary Statistics', ''],
    ['Total PHCs', data.length],
    ['Total Doctors', data.reduce((a, d) => a + d.doctors, 0)],
    ['Total Patients Today', data.reduce((a, d) => a + d.patients, 0)],
    ['Critical Risk PHCs', data.filter((d) => d.riskLevel === 'Critical').length],
    ['High Risk PHCs', data.filter((d) => d.riskLevel === 'High').length],
    ['Medium Risk PHCs', data.filter((d) => d.riskLevel === 'Medium').length],
    ['Low Risk PHCs', data.filter((d) => d.riskLevel === 'Low').length],
    [],
    ['Medicine Stock Status', ''],
    ['Critical Stock', data.filter((d) => d.medicineStock === 'Critical').length],
    ['Low Stock', data.filter((d) => d.medicineStock === 'Low').length],
    ['Good Stock', data.filter((d) => d.medicineStock === 'Good').length],
    [],
    ['Total Vaccinations', data.reduce((a, d) => a + d.vaccinations, 0)],
    ['Total Active Cases', data.reduce((a, d) => a + d.activeCases, 0)],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  summarySheet['!cols'] = [{ wch: 28 }, { wch: 18 }];

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
      'Report Date': d.date,
    }))
  );
  detailSheet['!cols'] = [{ wch: 22 }, { wch: 22 }, { wch: 10 }, { wch: 15 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 14 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
  XLSX.utils.book_append_sheet(wb, detailSheet, 'PHC Details');
  XLSX.writeFile(wb, `HealthOS_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function ReportsPage() {
  const { showToast } = useToast();
  const [filterRisk, setFilterRisk] = useState('All');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const filtered = filterRisk === 'All' ? REPORT_DATA : REPORT_DATA.filter((d) => d.riskLevel === filterRisk);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      await exportPDF(filtered);
      showToast('success', 'PDF Exported Successfully', `HealthOS_Report_${new Date().toISOString().slice(0, 10)}.pdf downloaded.`);
    } catch (e) {
      console.error(e);
      showToast('error', 'PDF Export Failed', 'Please try again.');
    }
    setIsExportingPDF(false);
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      await exportExcel(filtered);
      showToast('success', 'Excel Exported Successfully', `HealthOS_Report_${new Date().toISOString().slice(0, 10)}.xlsx downloaded.`);
    } catch (e) {
      console.error(e);
      showToast('error', 'Excel Export Failed', 'Please try again.');
    }
    setIsExportingExcel(false);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <FileBarChart2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">District Health Reports</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Kanpur District · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isExportingPDF
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FileText className="w-4 h-4" />
            }
            Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isExportingExcel
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FileSpreadsheet className="w-4 h-4" />
            }
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'PHCs in Report', value: filtered.length, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Total Patients', value: filtered.reduce((a, d) => a + d.patients, 0), color: 'text-purple-600 dark:text-purple-400' },
          { label: 'Total Vaccinations', value: filtered.reduce((a, d) => a + d.vaccinations, 0), color: 'text-teal-600 dark:text-teal-400' },
          { label: 'Active Cases', value: filtered.reduce((a, d) => a + d.activeCases, 0), color: 'text-orange-600 dark:text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center py-5">
            <p className={clsx('text-3xl font-bold tabular-nums', color)}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="card py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter by Risk:</span>
          </div>
          {['All', 'Low', 'Medium', 'High', 'Critical'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={clsx(
                'px-3 py-1.5 rounded-xl text-sm font-medium border transition-all',
                filterRisk === r
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'
              )}
            >
              {r}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 font-medium">{filtered.length} PHCs</span>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['PHC Name', 'Block', 'Doctors', 'Patients Today', 'Medicine Stock', 'Risk Level', 'Vaccinations', 'Active Cases'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{row.phcName}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.block}</td>
                  <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 tabular-nums">{row.doctors}</td>
                  <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 tabular-nums">{row.patients}</td>
                  <td className="py-3 px-4"><span className={clsx('badge', stockBadge[row.medicineStock])}>{row.medicineStock}</span></td>
                  <td className="py-3 px-4"><span className={clsx('badge', riskBadge[row.riskLevel])}>{row.riskLevel}</span></td>
                  <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300 tabular-nums">{row.vaccinations}</td>
                  <td className="py-3 px-4 text-center tabular-nums">
                    <span className={clsx('font-semibold', row.activeCases > 30 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300')}>
                      {row.activeCases}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
            <AlertTriangle className="w-10 h-10 mb-3 opacity-40" />
            <p>No data matches the selected filter</p>
          </div>
        )}

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>Showing {filtered.length} of {REPORT_DATA.length} PHCs</span>
          <span>Data as of {new Date().toLocaleDateString('en-IN')}</span>
        </div>
      </div>

      {/* Export note */}
      <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <Download className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold">Export includes filtered data only</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
            PDF and Excel will include only the {filtered.length} PHC{filtered.length !== 1 ? 's' : ''} visible above based on your filter.
          </p>
        </div>
      </div>
    </div>
  );
}
