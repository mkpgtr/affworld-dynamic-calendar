import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context value
interface SchedulerContextType {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  selectedMonth: Date | undefined;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedMonth: (month: Date) => void;
  viewType: string;
  setViewType: (viewType: string) => void;

  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  dialogOpenViaDropdown:boolean;
  setDialogOpenViaDropdown: (open: boolean) => void;
  currentScheduleId: string | null;
  setCurrentScheduleId: (id: string | null) => void;
  updateID: string | null;
  setUpdateID: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context
const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

// Create a provider component
export const SchedulerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const today = new Date();
  const [selectedSection, setSelectedSection] = useState<string>("One");

  // Initialize selectedDate and selectedMonth with today's date and current month if they are undefined
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth()) // Start of the current month
  );

  const [viewType, setViewType] = useState<string>("month-view"); // Default view type
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenViaDropdown, setDialogOpenViaDropdown] = useState<boolean>(false);
  const [currentScheduleId, setCurrentScheduleId] = useState<string | null>(null);
  const [updateID, setUpdateID] = useState<string | null>(null);

  return (
    <SchedulerContext.Provider 
      value={{ 
        dialogOpen,
        setDialogOpen,
        selectedSection, 
        setSelectedSection, 
        selectedDate, 
        setSelectedDate,
        selectedMonth,
        setSelectedMonth, 
        viewType,
        setViewType,
        dialogOpenViaDropdown,
        setDialogOpenViaDropdown,
        currentScheduleId, setCurrentScheduleId,
        updateID, setUpdateID
      }}
    >
      {children}
    </SchedulerContext.Provider>
  );
};

// Custom hook to use the Scheduler context
export const useScheduler = (): SchedulerContextType => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useScheduler must be used within a SchedulerProvider");
  }
  return context;
};
