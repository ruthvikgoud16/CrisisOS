'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface TriageData {
  severity_score: number;
  urgency: string;
  recommended_action: string;
  resources_needed: string[];
  estimated_response_time: string;
}

const urgencyColors: Record<string, string> = {
  Critical: 'bg-red-600',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

export function TriageAnalysis({ data }: { data: TriageData }) {
  const progressColor =
    data.severity_score >= 75
      ? 'bg-red-500'
      : data.severity_score >= 50
      ? 'bg-orange-500'
      : data.severity_score >= 25
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <Card className="bg-[#111827] border-blue-500/50 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Triage Analysis
          <Badge className="bg-blue-600 text-white animate-pulse ml-2">
            AI Analyzed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Severity Score</span>
            <span className="text-white font-bold">{data.severity_score}/100</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${progressColor} transition-all duration-500`}
              style={{ width: `${data.severity_score}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-400">Urgency Level</span>
            <div className="mt-1">
              <Badge className={`${urgencyColors[data.urgency]} text-white`}>
                {data.urgency}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-400">Est. Response Time</span>
            <p className="text-white font-medium mt-1">{data.estimated_response_time}</p>
          </div>
        </div>

        <div>
          <span className="text-sm text-gray-400">Recommended Action</span>
          <p className="text-white mt-1">{data.recommended_action}</p>
        </div>

        <div>
          <span className="text-sm text-gray-400">Resources Needed</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.resources_needed.map((resource, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-blue-500 text-blue-400"
              >
                {resource}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
