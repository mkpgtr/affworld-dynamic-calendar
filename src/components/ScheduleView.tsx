import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'; // Adjust the import path if needed

const arrayOfWork = [
  { title: "Go For Hiking", description: "Along the tracks of BIG SUR", reminder: new Date("2024-08-06T00:00:00+05:30"), category: "task" },
  { title: "Meeting with Team", description: "Discuss project milestones", reminder: new Date("2024-08-10T14:00:00+05:30"), category: "meeting" },
  { title: "Call with Client", description: "Discuss feedback and next steps", reminder: new Date("2024-08-12T09:00:00+05:30"), category: "calling" }
];

const categoryColors = {
  task: 'bg-red-100',    // Light red
  meeting: 'bg-green-100', // Light green
  calling: 'bg-blue-100'  // Light blue
};

export function ScheduleView() {
  return (
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
        {arrayOfWork.map((work, index) => (
          <TableRow key={index} className={categoryColors[work.category]}>
            <TableCell className="font-medium">{work.title}</TableCell>
            <TableCell>{work.description}</TableCell>
            <TableCell>
              {work.reminder.toLocaleDateString()} {work.reminder.toLocaleTimeString()}
            </TableCell>
            <TableCell>{work.category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ScheduleView;
