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
}

// Create the context
const SchedulerContext = createContext<SchedulerContextType | undefined>(undefined);

// Create a provider component
export const SchedulerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<string>("One");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date(2024,7));
  const [viewType, setViewType] = useState<string>("month-view"); // Default view type


  return (
    <SchedulerContext.Provider value={{ selectedSection, setSelectedSection, selectedDate, setSelectedDate,selectedMonth,setSelectedMonth, viewType,setViewType }}>
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
