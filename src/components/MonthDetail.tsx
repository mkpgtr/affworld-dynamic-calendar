import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useScheduler } from "../contexts/SchedulerContext";
import DayDialogTabs from "./DayDialogTabs";

interface MonthDetailProps {
  closeDialog?: () => void;
}

const MonthDetail: React.FC<MonthDetailProps> = ({ closeDialog }) => {
  const { selectedMonth, dialogOpen, setDialogOpen } = useScheduler();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<Record<number, any[]>>({});

  useEffect(() => {
    if (selectedMonth) {
      const month = selectedMonth.toLocaleString("default", { month: "long" }).toLowerCase();
      const year = selectedMonth.getFullYear();

      axios
        .get("http://localhost:8000/schedules-by-date", {
          params: {
            month,
            year,
          },
        })
        .then((response) => {
          const data = response.data;
          const groupedByDay = data.reduce((acc: Record<number, any[]>, schedule: any) => {
            const date = new Date(schedule.reminder).getDate();
            if (!acc[date]) acc[date] = [];
            acc[date].push(schedule);
            return acc;
          }, {});
          setSchedules(groupedByDay);
        })
        .catch((error) => {
          console.error("Failed to fetch schedules", error);
        });
    }
  }, [selectedMonth]);

  if (!selectedMonth) {
    return <p>Select a date to view the month details.</p>;
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

  const getCategoryContent = (category: string, schedules: any[]) => {
    return (
      <div>
        {schedules.map((schedule) => (
          <div key={schedule.id} className={`text-${category}`}>
            {category}: {category === 'task' ? schedule.title : schedule.description}
          </div>
        ))}
      </div>
    );
  };

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
            <HoverCard key={index} openDelay={0}> {/* Set openDelay to 0 */}
              <HoverCardTrigger asChild>
                <div
                  className={`w-50 h-[6rem] flex flex-col items-center justify-center border rounded ${day ? 'bg-blue-200 cursor-pointer' : 'bg-transparent'}`}
                  onClick={() => day && handleDayClick(day)}
                >
                  <div>{day || ''}</div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 p-2">
                {day && schedules[day]?.length ? (
                  <Tabs defaultValue={getDefaultTab(day)}>
                    <TabsList>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                      <TabsTrigger value="meetings">Meetings</TabsTrigger>
                      <TabsTrigger value="calls">Calls</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tasks">
                      {getCategoryContent('task', schedules[day].filter(s => s.category === 'task'))}
                    </TabsContent>
                    <TabsContent value="meetings">
                      {getCategoryContent('meeting', schedules[day].filter(s => s.category === 'meeting'))}
                    </TabsContent>
                    <TabsContent value="calls">
                      {getCategoryContent('calling', schedules[day].filter(s => s.category === 'calling'))}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div>No events on this day</div>
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
