import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useScheduler } from '../contexts/SchedulerContext';
import { AddTaskForm } from './AddTaskForm';
import AddCallingForm from './AddCallingForm';
import AddMeetingForm from './AddMeetingForm';

type DayDialogTabsProps = {
  clickedDate: number;
};

const DayDialogTabs: React.FC<DayDialogTabsProps> = ({ clickedDate }) => {
  const { selectedMonth } = useScheduler();

  // Get the current year or another year from your context or state
  const year = new Date().getFullYear();

  // Construct the date string
  const dateForThisDialog = `${clickedDate} ${selectedMonth.toLocaleString('default', { month: 'long' })} ${year}`;

  return (
    <div className="w-full h-full max-h-screen flex flex-col">
      <Tabs defaultValue="today" className="flex-grow">
        <TabsList className="flex justify-around gap-2 p-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="calling">Calling</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="task">Task</TabsTrigger>
        </TabsList>
        <div className="overflow-y-auto flex-grow">
          <TabsContent value="today" className="p-4">
            <h2 className="text-lg font-semibold">Today's Details</h2>
            <p>Details for Today go here.</p>
          </TabsContent>
          <TabsContent value="calling" className="p-4">
            <div className="max-w-xs mx-auto">
              <AddCallingForm initialDate={dateForThisDialog} />
            </div>
          </TabsContent>
          <TabsContent value="meeting" className="p-4">
            <div className="max-w-xs mx-auto">
              <AddMeetingForm initialDate={dateForThisDialog} />
            </div>
          </TabsContent>
          <TabsContent value="task" className="p-4">
            <div className="max-w-xs mx-auto">
              <AddTaskForm initialDate={dateForThisDialog} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DayDialogTabs;
