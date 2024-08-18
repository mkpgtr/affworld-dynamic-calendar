import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useScheduler } from "../contexts/SchedulerContext";
import DayDialogTabs from "./DayDialogTabs";

const MonthDetail: React.FC = () => {
  const { selectedMonth } = useScheduler();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!selectedMonth) {
    return <p>Select a date to view the month details.</p>;
  }

  const month = selectedMonth.getMonth();
  const year = selectedMonth.getFullYear();

  // Calculate the number of days in the selected month
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);

  // Determine the starting day of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Create an array for days of the week headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fill in the days before the first day of the month
  const paddedDays = Array(firstDayOfMonth).fill(null).concat(daysArray);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">
        {selectedMonth.toLocaleString('default', { month: 'long' })} {year}
      </h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Render the days of the week headers */}
        {weekDays.map(day => (
          <div key={day} className="font-bold">{day}</div>
        ))}
        {/* Render the days of the month */}
        {paddedDays.map((day, index) => (
          <div
            key={index}
            className={`p-4 border rounded ${day ? 'bg-blue-200 cursor-pointer' : 'bg-transparent'}`}
            onClick={() => day && handleDayClick(day)}
          >
            {day || ''}
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger />
        <DialogContent>
          <DialogTitle>
            Details for {selectedDay} {selectedMonth.toLocaleString('default', { month: 'long' })} {year}
          </DialogTitle>
          <DayDialogTabs />
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthDetail;
