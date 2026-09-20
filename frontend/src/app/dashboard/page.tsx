"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  url: string;
  status: string;
  uptimePercentage: number;
  lastPingAt: string | null;
}

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({ name: '', url: '' });
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data.services);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/services', newService);
      setShowModal(false);
      setNewService({ name: '', url: '' });
      fetchServices();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Services</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <Plus size={18} /> <span>Add Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length === 0 && (
          <p className="text-gray-500">No services added yet.</p>
        )}
        {services.map(service => (
          <div key={service.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]" title={service.url}>
                  {service.url}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded ${service.status === 'ONLINE' ? 'bg-green-100 text-green-800' : service.status === 'OFFLINE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                {service.status}
              </span>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Uptime</p>
                <p className="font-semibold">{service.uptimePercentage.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-gray-500">Last Ping</p>
                <p className="font-semibold">
                  {service.lastPingAt ? new Date(service.lastPingAt).toLocaleTimeString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center pt-4 border-t dark:border-gray-700">
              <Link href={`/dashboard/services/${service.id}`} className="text-blue-500 text-sm hover:underline">
                View Analytics
              </Link>
              <button onClick={() => handleDelete(service.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Service</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block mb-1">Service Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-1">URL (must include http/https)</label>
                <input 
                  type="url" 
                  required
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={newService.url}
                  onChange={e => setNewService({...newService, url: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
