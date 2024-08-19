import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useScheduler } from "../contexts/SchedulerContext";
import DayDialogTabs from "./DayDialogTabs";

interface MonthDetailProps {
  closeDialog?: () => void;
}

interface Schedule {
  id: string;
  title: string;
  description: string;
  category: string;
  reminder: string;
}

const MonthDetail: React.FC<MonthDetailProps> = ({ closeDialog }) => {
  const { selectedMonth, dialogOpen, setDialogOpen,schedules,setSchedules } = useScheduler();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMonth) {
      fetchSchedules(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchSchedules = async (date: Date) => {
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    try {
      const response = await axios.get<Schedule[]>("http://localhost:8000/schedules-by-date", {
        params: { month, year },
      });
      console.log("Response data:", response.data);

      const groupedByDay = response.data.reduce((acc: Record<number, Schedule[]>, schedule) => {
        const day = new Date(schedule.reminder).getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(schedule);
        return acc;
      }, {});

      setSchedules(groupedByDay);
      setError(null);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to fetch schedules. Please try again later.");
    }
  };

  if (!selectedMonth) {
    return <p>Select a date to view the month details.</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const month = selectedMonth.getMonth();
  const year = selectedMonth.getFullYear();
  const numberOfDays = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const paddedDays = Array(firstDayOfMonth).fill(null).concat(daysArray);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setDialogOpen(true);
  };

  const getCategoryContent = (category: string, schedules: Schedule[]) => {
    console.log(`Getting content for category: ${category}`);
    const filteredSchedules = schedules.filter(schedule => schedule.category === category);
    console.log(`Filtered schedules for category ${category}:`, filteredSchedules);
    
    return (
      <div>
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <div key={schedule.id}>
              {category === 'task' ? schedule.title : schedule.description}
            </div>
          ))
        ) : (
          <div>No events for this category</div>
        )}
      </div>
    );
  };
  
  

  console.log(schedules)

  const getDefaultTab = (day: number) => {
    const daySchedules = schedules[day] || [];
    const taskCount = daySchedules.filter((s) => s.category === 'task').length;
    const meetingCount = daySchedules.filter((s) => s.category === 'meeting').length;
    const callCount = daySchedules.filter((s) => s.category === 'calling').length;

    if (taskCount >= meetingCount && taskCount >= callCount) {
      return "tasks";
    } else if (meetingCount >= callCount) {
      return "meetings";
    } else {
      return "calls";
    }
  };

  const isDiscrepancyDay = (day: number) => {
    // Show discrepancy message only for the 1st day of the month
    return day === 1 && (!schedules[day] || schedules[day].length === 0);
  };

  return (
    <div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">
          {selectedMonth.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day) => (
            <div key={day} className="font-bold">{day}</div>
          ))}
          {paddedDays.map((day, index) => (
            <HoverCard key={index} openDelay={0}>
              <HoverCardTrigger asChild>
                <div
                  className={`w-50 h-[6rem] flex flex-col items-center justify-center border rounded ${day ? 'bg-blue-200 cursor-pointer' : 'bg-transparent'}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  <div>{day || ''}</div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-2">
                {day && isDiscrepancyDay(day) ? (
                  <div className='bg-red-700 text-white font-bold p-8'>due to timezone problem Manish has blocked this box. however, you can click on the blue box and add an event. but it will only be visible in the schedule view</div>
                ) : day && schedules[day] && schedules[day].length ? (
                  <Tabs defaultValue={getDefaultTab(day)}>
                  <TabsList>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                    <TabsTrigger value="calls">Calls</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tasks">
                    {getCategoryContent('task', schedules[day] || [])}
                  </TabsContent>
                  <TabsContent value="meetings">
                    {getCategoryContent('meeting', schedules[day] || [])}
                  </TabsContent>
                  <TabsContent value="calls">
                    {getCategoryContent('calling', schedules[day] || [])}
                  </TabsContent>
                </Tabs>
                
                ) : (
                  <div>No events for this day</div>
                )}
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogTitle>
              Details for {selectedDay} {selectedMonth.toLocaleString("default", { month: "long" })} {year}
            </DialogTitle>
            <DayDialogTabs clickedDate={selectedDay} closeDialog={closeDialog} />
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MonthDetail;
