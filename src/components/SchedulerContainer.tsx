import React from "react";
import { useScheduler } from "../contexts/SchedulerContext";
import SidebarCalendar from "./SidebarCalendar";
import MonthDetail from "./MonthDetail";
import ScheduleView from "./ScheduleView";

const SchedulerContainer: React.FC = () => {
  const { selectedSection, setSelectedSection, selectedDate, selectedMonth, viewType } = useScheduler();
  console.log(viewType, 'viewType'); // Debugging line to check viewType

  return (
    <div className="container mx-auto mt-8 p-4 h-screen">
      <div className="flex h-4/5">
        {/* Left Section - Sidebar (30%) */}
        <div className="w-3/10 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Sidebar</h2>
          <div className="space-y-4">
            {/* Sidebar Items */}
            {["One", "Two", "Three", "Four"].map((section) => (
              <div
                key={section}
                className={`p-2 bg-white border rounded cursor-pointer ${
                  selectedSection === section ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedSection(section)}
              >
                {section === "One" ? <SidebarCalendar /> : section}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section (70%) */}
        <div className="w-7/10 bg-white p-4 ml-4 border border-red-700 flex-1">
          <h2 className="text-lg font-bold">Main Content</h2>
          {viewType === 'schedule-view' && <ScheduleView />}
          {viewType === 'month-view' && (
            <MonthDetail selectedDate={selectedDate || selectedMonth} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulerContainer;
