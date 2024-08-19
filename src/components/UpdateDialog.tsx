import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddTaskForm } from './AddTaskForm';
import { AddCallingForm } from './AddCallingForm';
import { useScheduler } from '../contexts/SchedulerContext';
import AddMeetingForm from './AddMeetingForm';

interface UpdateDialogProps {
  open: boolean;
  onClose: () => void;
  category: string;
  initialData: any; // Adjust the type as needed
}

const UpdateDialog: React.FC<UpdateDialogProps> = ({ open, onClose, category, initialData }) => {
  const renderForm = () => {
    switch (category) {
      case 'task':
        return <AddTaskForm initialDate={initialData.reminder} closeDialog={onClose} />;
      case 'meeting':
        return <AddMeetingForm initialDate={initialData.reminder} closeDialog={onClose} />;
      case 'calling':
        return <AddCallingForm initialDate={initialData.reminder} closeDialog={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Update {category.charAt(0).toUpperCase() + category.slice(1)}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}

export default UpdateDialog;
