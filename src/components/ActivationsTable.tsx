import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ActivationData } from '../types';

interface ActivationsTableProps {
  data: ActivationData[];
}

export function ActivationsTable({ data }: ActivationsTableProps) {
  return (
    <div className="overflow-hidden bg-white rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600">
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Emp ID</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Agent Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span>Silver</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span>Gold</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                  <span>Platinum</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                  <span>Standard</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Target</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Achieved</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Remaining</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => {
              const isTotal = row.empId === 'Total' || row.agentName === 'Total';
              const achievementPercentage = (row.achieved / row.target) * 100;
              const rowClass = isTotal 
                ? 'bg-gradient-to-r from-gray-50 to-gray-100 font-semibold' 
                : index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

              return (
                <tr 
                  key={`${row.empId}-${row.agentName}-${index}`} 
                  className={`${rowClass} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.empId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.agentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {row.silver}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {row.gold}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {row.platinum}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {row.standard}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {row.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.target}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        achievementPercentage >= 100 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {row.achieved}
                      </span>
                      {!isTotal && (
                        <span className={`ml-2 text-xs ${
                          achievementPercentage >= 100 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          ({achievementPercentage.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {row.remaining > 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.remaining > 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {Math.abs(row.remaining)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}