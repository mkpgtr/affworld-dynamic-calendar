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
} from '@/components/ui/table'; // Adjust the import path if needed

const ITEMS_PER_PAGE = 8;

const categoryColors = {
  task: 'bg-red-100',    // Light red
  meeting: 'bg-green-100', // Light green
  calling: 'bg-blue-100'  // Light blue
};

export function ScheduleView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async (page = 1) => {
    try {
      console.log(`Fetching page ${page} with skip=${(page - 1) * ITEMS_PER_PAGE} and limit=${ITEMS_PER_PAGE}`);
      const response = await axios.get('http://localhost:8000/schedules', {
        params: {
          skip: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE
        }
      });
      setData(response.data);
      // Assuming total items count is included in the response headers
      console.log(response)
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
    console.log('Handle Next Clicked');
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    console.log('Handle Previous Clicked');
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((work, index) => (
            <TableRow key={index} className={categoryColors[work.category]}>
              <TableCell className="font-medium">{work.title}</TableCell>
              <TableCell>{work.description}</TableCell>
              <TableCell>
                {new Date(work.reminder).toLocaleDateString()} {new Date(work.reminder).toLocaleTimeString()}
              </TableCell>
              <TableCell>{work.category}</TableCell>
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
    </div>
  );
}

export default ScheduleView;
