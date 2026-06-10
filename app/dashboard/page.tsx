'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, Users, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Incident {
  id: string;
  title: string;
  location: string;
  severity: string;
  status: string;
  reported_at: string;
}

const severityColors: Record<string, string> = {
  Critical: 'bg-red-600 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-yellow-500 text-black',
  Low: 'bg-green-500 text-white',
};

const statusColors: Record<string, string> = {
  Active: 'bg-red-500/20 text-red-400 border-red-500',
  Monitoring: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
  Resolved: 'bg-green-500/20 text-green-400 border-green-500',
};

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    teamsActive: 18,
    peopleAffected: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .order('reported_at', { ascending: false });

      if (data) {
        setIncidents(data as Incident[]);
        const criticalCount = data.filter((i) => i.severity === 'Critical').length;
        const totalAffected = data.reduce((sum, i) => sum + (i.people_affected || 0), 0);
        setStats({
          total: data.length,
          critical: criticalCount,
          teamsActive: 18,
          peopleAffected: totalAffected,
        });
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Emergency operations overview</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#111827] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Incidents
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Critical
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{stats.critical}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Teams Active
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.teamsActive}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#111827] border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                People Affected
              </CardTitle>
              <MapPin className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {stats.peopleAffected.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Severity</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.slice(0, 5).map((incident) => (
                  <TableRow
                    key={incident.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-white font-medium">
                      {incident.location}
                    </TableCell>
                    <TableCell>
                      <Badge className={severityColors[incident.severity]}>
                        {incident.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[incident.status]}
                      >
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(incident.reported_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
