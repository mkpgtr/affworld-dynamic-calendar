import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { useScheduler } from "../contexts/SchedulerContext";

const SidebarCalendar: React.FC = () => {
  const { setSelectedDate,setSelectedMonth } = useScheduler();
  const [localSelectedDate, setLocalSelectedDate] = React.useState<Date | undefined>(undefined);

  const handleSelect = (date: Date | undefined) => {
    setLocalSelectedDate(date);
    setSelectedDate(date); // Update the context with the selected date
  };

  // Extract month and year from the date
  const getMonthYear = (date: Date | undefined) => {
    return date ? { month: date.getMonth(), year: date.getFullYear() } : { month: new Date().getMonth(), year: new Date().getFullYear() };
  };

  const { month, year } = getMonthYear(localSelectedDate);

  // Function to handle month change
  const handleMonthChange = (month: Date) => {
    // Pass the month to the context
    setSelectedMonth(month);
  };

  return (
    <div className="p-2 bg-white border rounded">
      <h3 className="text-lg font-bold mb-4">Calendar</h3>
      <Calendar
        mode="single"
        
        
        onMonthChange = {handleMonthChange}
        selected={localSelectedDate}
        onSelect={handleSelect}
        className="rounded-md border"
      />
    </div>
  );
};

export default SidebarCalendar;
