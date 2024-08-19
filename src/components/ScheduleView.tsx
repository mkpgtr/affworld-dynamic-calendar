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
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { useScheduler } from '../contexts/SchedulerContext';
import UpdateDialog from './UpdateDialog'; // Import the new UpdateDialog component

const ITEMS_PER_PAGE = 90;

const categoryColors = {
  task: 'bg-red-100',
  meeting: 'bg-green-100',
  calling: 'bg-blue-100'
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

  const fetchData = async (page = 1) => {
    try {
      const response = await axios.get('http://localhost:8000/schedules', {
        params: {
          skip: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE
        }
      });
      setData(response.data);
      setTotalItems(Number(response.headers['x-total-count']) || 0);
    } catch (err) {
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
    setCurrentScheduleId(id);  // Update context with selected schedule ID
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/schedules-by-id/${id}`);
      setInitialData(response.data);
      setSelectedCategory(response.data.category);
      setUpdateID(id); // Set the updateID in the context
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div>
      <Table>
        <TableCaption>Your work schedule for the upcoming days.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Reminder</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((work: any) => (
            <TableRow key={work.id} className={categoryColors[work.category]}>
              <TableCell className="font-medium">{work.title}</TableCell>
              <TableCell>{work.description}</TableCell>
              <TableCell>
                {new Date(work.reminder).toLocaleDateString()} {new Date(work.reminder).toLocaleTimeString()}
              </TableCell>
              <TableCell>{work.category}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 bg-gray-200 rounded-md">Actions</button>
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
      <div className="flex justify-between mt-4">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNext} disabled={currentPage >= Math.ceil(totalItems / ITEMS_PER_PAGE)}>
          Next
        </button>
      </div>

      <UpdateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        category={selectedCategory}
        initialData={initialData}
      />
    </div>
  );
}

export default ScheduleView;
