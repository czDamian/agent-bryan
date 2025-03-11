import React from "react";
import { FaUser, FaDatabase, FaChartLine } from "react-icons/fa";

const StatItem = ({ icon, value, label }) => (
  <div id="about" className="flex-1 bg-gradient-to-b from-[#484245] to-[#774F65] bg-opacity-80 px-4 py-4 flex flex-col items-start justify-center text-white border-r border-[#774F65] last:border-r-0">
    <div className="mb-2 p-1 bg-white bg-opacity-10 rounded">
      {icon}
    </div>
    <div className="text-3xl md:text-5xl font-bold mt-1">{value}</div>
    <div className="mt-1">
      <div className="text-sm">{label}</div>
    </div>
  </div>
);

const StatsCard = () => {
  const statsData = [
    {
      id: 1,
      icon: <FaUser size={24} />,
      value: "100k",
      label: "Trusted Users",
    },
    {
      id: 2,
      icon: <FaDatabase size={24} />,
      value: "750+",
      label: "Health Queries Processed",
    },
    {
      id: 3,
      icon: <FaChartLine size={24} />,
      value: "95%",
      label: "Health Insights Provided",
    },
  ];

  return (
    <div className="flex mx-auto max-w-xl w-max flex-col sm:flex-row gap-4 sm:gap-2 md:gap-4 py-8">
      {statsData.map((stat) => (
        <StatItem
          key={stat.id}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </div>
  );
};

export default StatsCard;