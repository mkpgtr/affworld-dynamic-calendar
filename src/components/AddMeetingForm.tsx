import React, { useEffect, useState } from 'react';
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

interface AddMeetingFormProps {
  closeDialog?: () => void;
  initialDate?: string;
}

const AddMeetingForm: React.FC<AddMeetingFormProps> = ({ closeDialog, initialDate }) => {
  const { updateID, setUpdateID, setDialogOpen } = useScheduler();
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialData, setInitialData] = useState<{ description?: string; reminder?: Date }>({});

  // Initialize the reminder field with the initialDate
  const initialReminder = initialDate ? new Date(initialDate) : undefined;

  const form = useForm<z.infer<typeof MeetingSchema>>({
    resolver: zodResolver(MeetingSchema),
    defaultValues: {
      description: "",
      reminder: initialReminder,
    },
  });

  // Fetch data for updating if updateID is set
  useEffect(() => {
    if (updateID) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/schedules-by-id/${updateID}`);
          setInitialData(response.data);
          form.reset({
            description: response.data.description,
            reminder: new Date(response.data.reminder),
          });
          setIsUpdating(true);
        } catch (error) {
          console.error(`Failed to fetch item with id: ${updateID}`, error);
          toast({
            title: "Error!",
            description: "There was an error fetching the meeting details. Please try again.",
          });
        }
      };

      fetchData();
    }
  }, [updateID, form]);

  async function onSubmit(data: z.infer<typeof MeetingSchema>) {
    try {
      if (isUpdating) {
        // Send PUT request to update the existing item
        await axios.put(`http://localhost:8000/schedules/${updateID}`, {
          description: data.description,
          reminder: data.reminder?.toISOString(), // Convert date to ISO string
          category: 'meeting',
        });
        toast({
          title: "Meeting updated successfully!",
          description: `Meeting with description "${data.description}" has been updated.`,
        });
      } else {
        // Send POST request to create a new item
        await axios.post('http://localhost:8000/schedules', {
          description: data.description,
          reminder: data.reminder?.toISOString(), // Convert date to ISO string
          category: 'meeting',
        });
        toast({
          title: "Meeting added successfully!",
          description: `Meeting with description "${data.description}" has been added.`,
        });
      }

      form.reset();
      setUpdateID(null); // Clear the updateID after submission
      closeDialog?.();
      setDialogOpen(false);

    } catch (error) {
      toast({
        title: "Error!",
        description: "There was an error processing your request. Please try again.",
      });
      console.error("Error processing meeting:", error);
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
            <Button type="submit" className="w-full">{isUpdating ? "Update Meeting" : "Add Meeting"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AddMeetingForm;
