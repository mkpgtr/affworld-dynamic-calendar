import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'; // Adjust the import path if needed
import { useScheduler } from '../contexts/SchedulerContext';

const categoryStyles = {
  task: 'bg-red-100 border-red-300',
  calling: 'bg-blue-100 border-blue-300',
  meeting: 'bg-green-100 border-green-300'
};

const SingleView = () => {
  const { currentScheduleId, setViewType } = useScheduler();
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (currentScheduleId) {
        try {
          const response = await axios.get(`http://localhost:8000/schedules-by-id/${currentScheduleId}`);
          setSchedule(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchedule();
  }, [currentScheduleId]);

  const handleSelect = (view: string) => {
    setViewType(view);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching schedule: {error.message}</p>;

  if (!schedule) return <p className="text-center">No schedule selected</p>;

  const containerStyle = categoryStyles[schedule.category] || 'bg-gray-100 border-gray-300';

  return (
    <div className={`p-6 rounded-lg border ${containerStyle} relative`}>
      <h2 className="text-3xl font-semibold mb-4">Schedule Details</h2>
      <p className="text-lg"><strong>Title:</strong> {schedule.title || 'N/A'}</p>
      <p className="text-lg"><strong>Description:</strong> {schedule.description}</p>
      <p className="text-lg"><strong>Reminder:</strong> {new Date(schedule.reminder).toLocaleString()}</p>
      <p className="text-lg"><strong>Category:</strong> {schedule.category}</p>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 transition duration-150 ease-in-out absolute right-0 top-0 mt-2">
          GO Back to
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-xl rounded-lg mt-2 right-0 border border-gray-300">
          <DropdownMenuItem onClick={() => handleSelect('month-view')} className="hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded">
            Month View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect('schedule-view')} className="hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded">
            Schedule View
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SingleView;
