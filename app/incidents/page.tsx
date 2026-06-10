'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Search, Filter } from 'lucide-react';

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

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchIncidents() {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .order('reported_at', { ascending: false });

      if (data) {
        setIncidents(data as Incident[]);
        setFilteredIncidents(data as Incident[]);
      }
    }
    fetchIncidents();
  }, []);

  useEffect(() => {
    let filtered = incidents;

    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter((i) => i.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    setFilteredIncidents(filtered);
  }, [searchQuery, severityFilter, statusFilter, incidents]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from('incidents').update({ status: newStatus }).eq('id', id);

    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Incidents</h1>
          <p className="text-gray-400">Manage and track all reported incidents</p>
        </div>

        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1f2937] border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <div className="flex gap-2">
                <Filter className="h-4 w-4 text-gray-500 self-center mr-2" />
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[140px] bg-[#1f2937] border-gray-700 text-white">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f2937] border-gray-700">
                    <SelectItem value="all" className="text-white">
                      All Severities
                    </SelectItem>
                    <SelectItem value="Critical" className="text-white">
                      Critical
                    </SelectItem>
                    <SelectItem value="High" className="text-white">
                      High
                    </SelectItem>
                    <SelectItem value="Medium" className="text-white">
                      Medium
                    </SelectItem>
                    <SelectItem value="Low" className="text-white">
                      Low
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-[#1f2937] border-gray-700 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f2937] border-gray-700">
                    <SelectItem value="all" className="text-white">
                      All Statuses
                    </SelectItem>
                    <SelectItem value="Active" className="text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="Monitoring" className="text-white">
                      Monitoring
                    </SelectItem>
                    <SelectItem value="Resolved" className="text-white">
                      Resolved
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Title</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Severity</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Reported At</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow
                    key={incident.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-gray-400 font-mono text-xs">
                      {incident.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {incident.title}
                    </TableCell>
                    <TableCell className="text-gray-300">{incident.location}</TableCell>
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
                    <TableCell>
                      <Select
                        value={incident.status}
                        onValueChange={(val) => handleStatusChange(incident.id, val)}
                      >
                        <SelectTrigger className="w-[120px] h-8 bg-[#1f2937] border-gray-700 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1f2937] border-gray-700">
                          <SelectItem value="Active" className="text-white text-xs">
                            Active
                          </SelectItem>
                          <SelectItem value="Monitoring" className="text-white text-xs">
                            Monitoring
                          </SelectItem>
                          <SelectItem value="Resolved" className="text-white text-xs">
                            Resolved
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
