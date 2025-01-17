import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Award, Target, TrendingUp, ArrowDownToLine, Gem, Shield, Users } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { DateSelector } from './components/DateSelector';
import { ActivationsTable } from './components/ActivationsTable';
import { fetchSheetData, parseSheetData } from './utils/sheets';
import type { ActivationData } from './types';

function App() {
  const [data, setData] = useState<ActivationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('Master Sheet');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawData = await fetchSheetData(selectedDate);
      const parsedData = parseSheetData(rawData);
      setData(parsedData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totals = useMemo(() => {
    const lastRow = data[data.length - 1];
    return {
      silver: lastRow?.silver ?? 0,
      gold: lastRow?.gold ?? 0,
      platinum: lastRow?.platinum ?? 0,
      standard: lastRow?.standard ?? 0,
      total: lastRow?.total ?? 0,
      target: lastRow?.target ?? 0,
      achieved: lastRow?.achieved ?? 0,
      remaining: lastRow?.remaining ?? 0
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activations Dashboard</h1>
              <p className="mt-2 text-gray-600">January 2025 Performance Overview</p>
            </div>
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Target"
            value={totals.target}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            icon={<Target size={24} />}
          />
          <DashboardCard
            title="Achieved"
            value={totals.achieved}
            color="bg-gradient-to-br from-green-500 to-green-600"
            icon={<TrendingUp size={24} />}
          />
          <DashboardCard
            title="Remaining"
            value={totals.remaining}
            color={`bg-gradient-to-br ${totals.remaining > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600'}`}
            color={`bg-gradient-to-br ${
              totals.remaining > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600'
            }`}
            icon={<ArrowDownToLine size={24} />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Silver Activations"
            value={totals.silver}
            color="bg-gradient-to-br from-gray-500 to-gray-600"
            icon={<Award size={24} />}
          />
          <DashboardCard
            title="Gold Activations"
            value={totals.gold}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            icon={<Gem size={24} />}
          />
          <DashboardCard
            title="Platinum Activations"
            value={totals.platinum}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            icon={<Shield size={24} />}
          />
          <DashboardCard
            title="Standard Activations"
            value={totals.standard}
            color="bg-gradient-to-br from-teal-500 to-teal-600"
            icon={<Users size={24} />}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Performance</h2>
          <ActivationsTable data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;