import React from "react";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { useScheduler } from "../contexts/SchedulerContext";

const Navbar: React.FC = () => {
  const { viewType, setViewType } = useScheduler();

  // Get today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", // e.g., "Monday"
    month: "long",   // e.g., "August"
    day: "numeric",  // e.g., "19"
    year: "numeric"  // e.g., "2024"
  });

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Section */}
        <div className="text-white text-lg font-bold">
          {formattedDate}
        </div>
        
        {/* Select Component Section */}
        <div>
          <Select value={viewType} onValueChange={(value: string) => setViewType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month-view">Month</SelectItem>
              <SelectItem value="schedule-view">Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
