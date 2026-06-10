'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/lib/supabase';

interface Incident {
  id: string;
  severity: string;
  status: string;
  people_affected: number;
}

const COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

const STATUS_COLORS = {
  Active: '#ef4444',
  Monitoring: '#eab308',
  Resolved: '#22c55e',
};

export default function ReportsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [severityData, setSeverityData] = useState<{ name: string; value: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [totalAffected, setTotalAffected] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('incidents').select('*');

      if (data) {
        setIncidents(data as Incident[]);

        const severityCounts: Record<string, number> = {
          Critical: 0,
          High: 0,
          Medium: 0,
          Low: 0,
        };
        const statusCounts: Record<string, number> = {
          Active: 0,
          Monitoring: 0,
          Resolved: 0,
        };

        let affected = 0;

        data.forEach((i) => {
          severityCounts[i.severity] = (severityCounts[i.severity] || 0) + 1;
          statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
          affected += i.people_affected || 0;
        });

        setSeverityData(
          Object.entries(severityCounts)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value }))
        );
        setStatusData(
          Object.entries(statusCounts)
            .filter(([, v]) => v > 0)
            .map(([name, value]) => ({ name, value }))
        );
        setTotalAffected(affected);
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400">Analytics and statistics overview</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#111827] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {severityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.name as keyof typeof COLORS]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: 'white' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                      itemStyle={{ color: 'white' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-[#1f2937] rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Incidents</p>
                  <p className="text-3xl font-bold text-white">{incidents.length}</p>
                </div>
                <div className="bg-[#1f2937] rounded-lg p-4">
                  <p className="text-gray-400 text-sm">People Affected</p>
                  <p className="text-3xl font-bold text-white">
                    {totalAffected.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#1f2937] rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Active Incidents</p>
                  <p className="text-3xl font-bold text-red-500">
                    {incidents.filter((i) => i.status === 'Active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
