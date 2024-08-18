import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useScheduler } from "../contexts/SchedulerContext";

const DayDetailDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { selectedDate } = useScheduler();

  if (!selectedDate) return null;

  const day = selectedDate.getDate();
  const month = selectedDate.toLocaleString('default', { month: 'long' });
  const year = selectedDate.getFullYear();
  const dayOfWeek = selectedDate.toLocaleDateString('default', { weekday: 'long' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <button className="hidden" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Day Details</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p><strong>Date:</strong> {day}</p>
          <p><strong>Month:</strong> {month}</p>
          <p><strong>Year:</strong> {year}</p>
          <p><strong>Day:</strong> {dayOfWeek}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayDetailDialog;
