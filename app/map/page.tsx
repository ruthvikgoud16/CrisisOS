'use client';

import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/dashboard-layout';

const IncidentMap = dynamic(() => import('@/components/incident-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#111827] rounded-lg">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 h-[calc(100vh-3rem)]">
        <div>
          <h1 className="text-2xl font-bold text-white">Incident Map</h1>
          <p className="text-gray-400">Real-time incident locations across the country</p>
        </div>
        <div className="h-[calc(100%-4rem)] rounded-lg overflow-hidden border border-gray-800">
          <IncidentMap />
        </div>
      </div>
    </DashboardLayout>
  );
}
