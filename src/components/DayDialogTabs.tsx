import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useScheduler } from '../contexts/SchedulerContext';
import { AddTaskForm } from './AddTaskForm';
import AddCallingForm from './AddCallingForm';
import AddMeetingForm from './AddMeetingForm';

type DayDialogTabsProps = {
  clickedDate: number;
  closeDialog?: () => void;
};

const DayDialogTabs: React.FC<DayDialogTabsProps> = ({ clickedDate,closeDialog }) => {
  const { selectedMonth,setDialogOpen,setDialogOpenViaDropdown,dialogOpenViaDropdown } = useScheduler();

  // Get the current year or another year from your context or state
  const year = new Date().getFullYear();

  // Construct the date string
  const dateForThisDialog = `${clickedDate} ${selectedMonth.toLocaleString('default', { month: 'long' })} ${year}`;

  return (
    <div className="w-full h-full max-h-screen flex flex-col">
      <Tabs defaultValue="meeting" className="flex-grow">
        <TabsList className="flex justify-around gap-2 p-2">
          <TabsTrigger value="calling">Calling</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="task">Task</TabsTrigger>
        </TabsList>
        <div className="overflow-y-auto flex-grow">
          
          <TabsContent value="calling" className="p-4">
            <div className="max-w-xs mx-auto">
              <AddCallingForm  closeDialog={closeDialog} initialDate={dateForThisDialog} />
            </div>
          </TabsContent>
          <TabsContent value="meeting" className="p-4">
            <div className="max-w-xs mx-auto">
              <AddMeetingForm closeDialog={closeDialog} initialDate={dateForThisDialog} />
            </div>
          </TabsContent>
          <TabsContent value="task" className="p-4">
            <div className="max-w-xs mx-auto">
              <AddTaskForm closeDialog={closeDialog} initialDate={dateForThisDialog} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DayDialogTabs;
