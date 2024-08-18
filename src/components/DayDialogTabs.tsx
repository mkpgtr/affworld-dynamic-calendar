import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const DayDialogTabs: React.FC = () => {
  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="flex gap-2 p-2">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="calling">Calling</TabsTrigger>
        <TabsTrigger value="meeting">Meeting</TabsTrigger>
        <TabsTrigger value="task">Task</TabsTrigger>
      </TabsList>
      <TabsContent value="today" className="p-4">
        <h2 className="text-lg font-bold">Today's Details</h2>
        <p>Details for Today go here.</p>
      </TabsContent>
      <TabsContent value="calling" className="p-4">
        <h2 className="text-lg font-bold">Calling Details</h2>
        <p>Details for Calls go here.</p>
      </TabsContent>
      <TabsContent value="meeting" className="p-4">
        <h2 className="text-lg font-bold">Meeting Details</h2>
        <p>Details for Meetings go here.</p>
      </TabsContent>
      <TabsContent value="task" className="p-4">
        <h2 className="text-lg font-bold">Task Details</h2>
        <p>Details for Tasks go here.</p>
      </TabsContent>
    </Tabs>
  );
};

export default DayDialogTabs;
