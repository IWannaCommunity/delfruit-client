import React from "react";

type Tab = {
  label: string;
  value: string;
};

type TabBarProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
};

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex space-x-1 px-2 pt-2 border border-solid border-b-0 rounded-md border-gray-400 bg-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-[1em] py-[0.5em] border border-gray-100 rounded-t-md font-verdana text-[1em] text-[#212121]
            ${
              activeTab === tab.value
                ? "bg-white border-b-0"
                : "bg-gray-100 hover:bg-gray-200 hover:border-gray-300"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}