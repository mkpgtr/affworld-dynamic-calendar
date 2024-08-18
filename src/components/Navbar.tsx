import React from "react";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { useScheduler } from "../contexts/SchedulerContext";

const Navbar: React.FC = () => {

    const { viewType, setViewType } = useScheduler();
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Section */}
        <div className="text-white text-lg font-bold">
          MyBrand
        </div>
        
        {/* Select Component Section */}
        <div>
          <Select value={viewType} onValueChange={(value:string) => setViewType(value)}>
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
