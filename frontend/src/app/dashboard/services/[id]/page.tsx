"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ServiceAnalytics() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${params.id}`);
        setService(res.data.service);
      } catch (error) {
        console.error(error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id, router]);

  if (loading) return <div>Loading analytics...</div>;
  if (!service) return <div>Service not found</div>;

  const chartData = service.pingLogs.map((log: any) => ({
    time: new Date(log.createdAt).toLocaleTimeString(),
    responseTime: log.responseTime,
    status: log.statusCode
  })).reverse();

  return (
    <div>
      <Link href="/dashboard" className="flex items-center text-blue-500 mb-6 hover:underline">
        <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
        <h1 className="text-2xl font-bold">{service.name} Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{service.url}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">Status</p>
            <p className={`font-bold text-xl ${service.status === 'ONLINE' ? 'text-green-500' : 'text-red-500'}`}>
              {service.status}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">Uptime</p>
            <p className="font-bold text-xl">{service.uptimePercentage.toFixed(2)}%</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">Total Pings</p>
            <p className="font-bold text-xl">{service.pingLogs.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Response Time History (ms)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#3B82F6" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
