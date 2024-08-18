import React from 'react';
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
import './custom-datetime.css'; // Ensure this path is correct for your project
import { useScheduler } from '../contexts/SchedulerContext';

const MeetingSchema = z.object({
  description: z.string().optional(),
  reminder: z.date().optional(),
});

type AddMeetingFormProps = {
  initialDate?: string;
};

export function AddMeetingForm({ initialDate }: AddMeetingFormProps) {
  const { selectedDate, selectedMonth } = useScheduler();

  // Initialize the reminder field with the initialDate
  const initialReminder = initialDate ? new Date(initialDate) : undefined;

  const form = useForm<z.infer<typeof MeetingSchema>>({
    resolver: zodResolver(MeetingSchema),
    defaultValues: {
      description: "",
      reminder: initialReminder,
    },
  });

  async function onSubmit(data: z.infer<typeof MeetingSchema>) {
    try {
      // Log the form data to the console
    

      // Send POST request to the FastAPI endpoint
      const response = await axios.post('http://localhost:8000/schedules', {
        description: data.description,
        reminder: data.reminder?.toISOString(), // Convert date to ISO string
        category: 'meeting',
      });

      console.log(response)

      // Handle successful response
      toast({
        title: "Meeting added successfully!",
        description: `Meeting with description "${data.description}" has been added.`,
      });
      form.reset();
    } catch (error) {
      // Handle error response
      toast({
        title: "Error!",
        description: "There was an error adding the meeting. Please try again.",
      });
      console.error("Error adding meeting:", error);
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Meeting description" {...field} />
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
            <Button type="submit" className="w-full">Add Meeting</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddMeetingForm;
