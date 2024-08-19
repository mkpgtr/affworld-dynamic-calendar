import React, { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(2);

  return (
    <div className="border-b">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`p-2 flex-1 text-center ${index === activeTab ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
