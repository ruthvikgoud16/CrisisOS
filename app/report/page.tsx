'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TriageAnalysis } from '@/components/triage-analysis';
import { supabase } from '@/lib/supabase';
import { Loader2, Send } from 'lucide-react';

interface TriageData {
  severity_score: number;
  urgency: string;
  recommended_action: string;
  resources_needed: string[];
  estimated_response_time: string;
}

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('');
  const [peopleAffected, setPeopleAffected] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [triageData, setTriageData] = useState<TriageData | null>(null);
  const [incidentId, setIncidentId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTriageData(null);

    try {
      const { data: incident, error: insertError } = await supabase
        .from('incidents')
        .insert({
          title,
          location,
          description,
          severity,
          people_affected: parseInt(peopleAffected) || 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setIncidentId(incident.id);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          description,
          severity,
          peopleAffected,
        }),
      });

      const triage = await response.json();
      setTriageData(triage);

      await supabase
        .from('incidents')
        .update({ triage_analysis: triage })
        .eq('id', incident.id);

      setTitle('');
      setLocation('');
      setSeverity('');
      setPeopleAffected('');
      setDescription('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Report Incident</h1>
          <p className="text-gray-400">Submit a new incident for triage and response</p>
        </div>

        <Card className="bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Incident Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Incident Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief description of the incident"
                  className="bg-[#1f2937] border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State or specific address"
                  className="bg-[#1f2937] border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity" className="text-gray-300">
                  Severity
                </Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger className="bg-[#1f2937] border-gray-700 text-white">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f2937] border-gray-700">
                    <SelectItem value="Critical" className="text-white hover:bg-gray-800">
                      Critical
                    </SelectItem>
                    <SelectItem value="High" className="text-white hover:bg-gray-800">
                      High
                    </SelectItem>
                    <SelectItem value="Medium" className="text-white hover:bg-gray-800">
                      Medium
                    </SelectItem>
                    <SelectItem value="Low" className="text-white hover:bg-gray-800">
                      Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="people" className="text-gray-300">
                  People Affected
                </Label>
                <Input
                  id="people"
                  type="number"
                  value={peopleAffected}
                  onChange={(e) => setPeopleAffected(e.target.value)}
                  placeholder="Estimated number of people affected"
                  className="bg-[#1f2937] border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the incident..."
                  className="bg-[#1f2937] border-gray-700 text-white placeholder-gray-500 min-h-[120px]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting & Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Incident
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && (
          <Card className="bg-[#111827] border-gray-800">
            <CardContent className="py-8 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-400">Analyzing incident with AI...</p>
            </CardContent>
          </Card>
        )}

        {triageData && !loading && (
          <div className="space-y-4">
            <TriageAnalysis data={triageData} />
            {incidentId && (
              <p className="text-sm text-gray-500">
                Incident ID: {incidentId}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
