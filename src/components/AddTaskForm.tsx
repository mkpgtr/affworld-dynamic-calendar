import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import './custom-datetime.css';
import { useScheduler } from '../contexts/SchedulerContext';

const TaskSchema = z.object({
  title: z.string().min(3, { message: "Task title must be at least 3 characters." }),
  description: z.string().optional(),
  reminder: z.date().optional(),
});

type AddTaskFormProps = {
  initialDate?: string;
  closeDialog?: () => void;
  refetch?: () => void;
};

export function AddTaskForm({ initialDate, closeDialog,refetch }: AddTaskFormProps) {
  const { updateID, setUpdateID, setDialogOpen,fetchSchedules,selectedMonth } = useScheduler();
  const isUpdate = !!updateID; // Determine if we are updating

  const initialReminder = initialDate ? new Date(initialDate) : undefined;

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      reminder: initialReminder,
    },
  });

  useEffect(() => {
    if (isUpdate && updateID) {
      // Fetch existing data for update
      axios.get(`http://localhost:8000/schedules-by-id/${updateID}`)
        .then(response => {
          const { title = "", description = "", reminder } = response.data;
          // Ensure to handle undefined and null values correctly
          form.setValue("title", title);
          form.setValue("description", description || "");
          form.setValue("reminder", reminder ? new Date(reminder) : undefined);
        })
        .catch(error => {
          console.error("Error fetching data for update:", error);
        });
    }
  }, [isUpdate, updateID, form]);

  async function onSubmit(data: z.infer<typeof TaskSchema>) {
    try {
      const formattedReminder = data.reminder ? data.reminder.toISOString() : undefined;

      if (isUpdate) {
        // Update request
        await axios.put(`http://localhost:8000/schedules/${updateID}`, {
          title: data.title,
          description: data.description,
          reminder: formattedReminder,
          category: 'task',
        });
        refetch()
        toast({
          title: "Task updated successfully!",
          description: `Task "${data.title}" has been updated.`,
        });
      } else {
        // Add request
        await axios.post('http://localhost:8000/schedules', {
          title: data.title,
          description: data.description,
          reminder: formattedReminder,
          category: 'task',
        });
        toast({
          title: "Task added successfully!",
          description: `Task "${data.title}" has been added.`,
        });

        fetchSchedules(selectedMonth)
      }

      form.reset();
      setUpdateID(null); // Clear updateID
      if (closeDialog) closeDialog(); // Close the dialog
      setDialogOpen(false); // Ensure the dialog is closed

    } catch (error) {
      toast({
        title: "Error!",
        description: "There was an error processing your request. Please try again.",
      });
      console.error("Error processing task:", error);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <FormControl>
                    <Controller
                      name="reminder"
                      control={form.control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Datetime
                          value={value || ''}
                          onChange={(date) => onChange(date ? new Date(date) : undefined)}
                          dateFormat="YYYY-MM-DD"
                          timeFormat="HH:mm"
                          className="mb-2 p-2 border rounded"
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">{isUpdate ? 'Update Task' : 'Add Task'}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddTaskForm;
