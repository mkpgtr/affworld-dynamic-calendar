import React, { useState } from "react";
import SidebarCalendar from "./SidebarCalendar";
import MonthDetail from "./MonthDetail";
import ScheduleView from "./ScheduleView";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTaskForm from "./AddTaskForm";
import AddCallingForm from "./AddCallingForm";
import AddMeetingForm from "./AddMeetingForm";
import { useScheduler } from "../contexts/SchedulerContext";
import SingleView from "./SingleView";

const SchedulerContainer: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("One");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const {viewType,dialogOpenViaDropdown,setDialogOpenViaDropdown,setViewType} = useScheduler()
 
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Compute the reminder value
  const computeReminder = () => {
    if (selectedDate) {
      return new Date(selectedDate); // Or modify as needed
    } else if (selectedMonth) {
      return new Date(selectedMonth); // Or modify as needed
    }
    return undefined;
  };

  const handleDropdownSelect = (category: string) => {
    setSelectedCategory(category);
    setDialogOpen(true);
    setDialogOpenViaDropdown(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
 
    setSelectedCategory(null);
  };

  const DialogComponent: React.FC = () => {
    if (!dialogOpen || !selectedCategory) return null;

    const reminderValue = computeReminder(); // Compute reminder value

    const renderForm = () => {
      switch (selectedCategory) {
        case "Meeting":
          return <AddMeetingForm closeDialog={closeDialog} initialDate={reminderValue?.toISOString()}   />;
        case "Task":
          return <AddTaskForm closeDialog={closeDialog} initialDate={reminderValue?.toISOString()} />;
        case "Calling":
          return <AddCallingForm closeDialog={closeDialog} initialDate={reminderValue?.toISOString()}  />;
        default:
          return null;
      }
    };

    return (
      <div className="dialog fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-96 relative">
          <button onClick={closeDialog} className="absolute top-2 right-2">Close</button>
          {renderForm()}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto mt-8 p-4 h-screen">
      <div className="flex h-4/5">
        {/* Left Section - Sidebar (30%) */}
        <div className="w-3/10 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Sidebar</h2>
          <div className="flex justify-between mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Create</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Event Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className='text-right' 
                  onClick={() => {
                    setViewType('month-view')
                    handleDropdownSelect("Meeting")
                  }}
                >
                  Meeting
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className='text-right' 
                  onClick={() =>{
                    setViewType('month-view')
                    handleDropdownSelect("Task")
                  }}
                  >
                  Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className='text-right' 
                  onClick={() => {
                    setViewType('month-view')
                    handleDropdownSelect("Calling")
                  }}
                >
                  Calling
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        <div className="w-7/10 bg-white p-4 ml-4  flex-1">
          {/* <h2 className="text-lg font-bold">Main Content</h2> */}
          {viewType === 'schedule-view' && <ScheduleView />}
          {viewType === 'single-view' && <SingleView />}
          {viewType === 'month-view' && (
            <>
        <h3 className="text-xl font-bold text-blue-600 bg-yellow-100 border border-yellow-300 p-4 rounded-lg shadow-lg">
  Click on any box of this month to create 
  <span className="text-red-600 font-semibold"> OR hover over a box </span>
  to view created events.
</h3>


            <MonthDetail closeDialog={closeDialog} selectedDate={selectedDate || selectedMonth} />
            </>
          )}
        </div>
      </div>

      {/* Render Dialog based on selected category */}
      <DialogComponent  />
    </div>
  );
};

export default SchedulerContainer;
