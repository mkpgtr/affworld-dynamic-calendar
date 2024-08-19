import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useScheduler } from '../contexts/SchedulerContext';
import UpdateDialog from './UpdateDialog';
import { toast, useToast } from './ui/use-toast';

const ITEMS_PER_PAGE = 5;

const categoryColors = {
  task: 'bg-red-200',
  meeting: 'bg-green-200',
  calling: 'bg-blue-200'
};

export function ScheduleView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [initialData, setInitialData] = useState({});
  const { setCurrentScheduleId, setViewType, updateID, setUpdateID } = useScheduler();
  const { toast } = useToast();

  const fetchData = async (page = 1) => {
    try {
      const response = await axios.get('http://localhost:8000/schedules', {
        params: {
          skip: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE
        }
      });
      
      const { total_count, items } = response.data;
      console.log('Total Items:', total_count);
      console.log('Response Data:', items);
      
      setData(items);
      setTotalItems(total_count);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleNext = () => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleView = (id: string) => {
    setViewType('single-view');
    setCurrentScheduleId(id);
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/schedules-by-id/${id}`);
      setInitialData(response.data);
      setSelectedCategory(response.data.category);
      setUpdateID(id);
      setDialogOpen(true);
    } catch (err) {
      console.error(`Failed to fetch item with id: ${id}`, err);
      setError(err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/schedules/${id}`);
        setData(prevData => prevData.filter(item => item.id !== id));
      } catch (err) {
        console.error(`Failed to delete item with id: ${id}`, err);
        setError(err);
      }
    }
  };

  const handleRefetch = async () => {
    fetchData(currentPage);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div className="flex flex-col items-center justify-start h-screen">
      <h1 className="text-4xl font-bold text-red-600">Error Fetching Data</h1>
      <p className="text-lg text-gray-700 mt-4">{error.message}</p>
      <h4 className="text-2xl text-red-500 mt-2 font-bold">
        Please make sure you have turned the FastAPI REST API on.
      </h4>
      <span>and there are no errors in the fast api console</span>
    </div>
  );

  return (
    <div>

<div className="flex justify-between mt-4 mb-9">
            <button onClick={handlePrevious} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={handleNext} disabled={currentPage >= Math.ceil(totalItems / ITEMS_PER_PAGE)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Next
            </button>
          </div>
      

      {data.length === 0 ? (
        <p className="text-center text-xl">You don't have any events.</p>
      ) : (
        <>
          <Table className="border border-gray-300 rounded-md shadow-md">
            <TableCaption className="text-lg font-semibold">Your work schedule for the upcoming days.</TableCaption>
            <TableHeader className="bg-gray-100 border-b border-gray-300">
              <TableRow>
                <TableHead className="p-3 text-left text-sm font-medium text-gray-700">Title</TableHead>
                <TableHead className="p-3 text-left text-sm font-medium text-gray-700">Description</TableHead>
                <TableHead className="p-3 text-left text-sm font-medium text-gray-700">Reminder</TableHead>
                <TableHead className="p-3 text-left text-sm font-medium text-gray-700">Category</TableHead>
                <TableHead className="p-3 text-left text-sm font-medium text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((work: any) => (
                <TableRow key={work.id} className={`hover:bg-gray-50 ${categoryColors[work.category]}`}>
                  <TableCell className="p-3 text-sm text-gray-800">{work.title}</TableCell>
                  <TableCell className="p-3 text-sm text-gray-600">{work.description}</TableCell>
                  <TableCell className="p-3 text-sm text-gray-600">
                    {new Date(work.reminder).toLocaleDateString()} {new Date(work.reminder).toLocaleTimeString()}
                  </TableCell>
                  <TableCell className="p-3 text-sm text-gray-600">{work.category}</TableCell>
                  <TableCell className="p-3 text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="px-4 py-2 rounded-md hover:bg-black-300">Actions</button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleView(work.id)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdate(work.id)}>Update</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(work.id)} className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        
        </>
      )}

      <div className='hidden'>
        <UpdateDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          category={selectedCategory}
          initialData={initialData}
          refetch={handleRefetch} 
        />
      </div>
    </div>
  );
}

export default ScheduleView;
