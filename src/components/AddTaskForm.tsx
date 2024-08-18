import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import './custom-datetime.css'; // Ensure this path is correct for your project
import { useScheduler } from '../contexts/SchedulerContext';

const TaskSchema = z.object({
  title: z.string().min(3, { message: "Task title must be at least 3 characters." }),
  description: z.string().optional(),
  reminder: z.date().optional(),
  
});

type AddTaskFormProps = {
  initialDate?: string;
};

export function AddTaskForm({ initialDate }: AddTaskFormProps) {
  const { selectedDate, selectedMonth } = useScheduler();

  // Initialize the reminder field with the initialDate
  const initialReminder = initialDate ? new Date(initialDate) : undefined;

  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      reminder: initialReminder
      
    },
  });

  async function onSubmit(data: z.infer<typeof TaskSchema>) {
    try {
      // Log the form data to the console
      console.log({
        title: data.title,
        description: data.description,
        reminder: data.reminder,
        category : 'task'
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Task added successfully!",
        description: `Task "${data.title}" has been added.`,
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error!",
        description: "There was an error adding the task. Please try again.",
      });
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
            <Button type="submit" className="w-full">Add Task</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddTaskForm;
