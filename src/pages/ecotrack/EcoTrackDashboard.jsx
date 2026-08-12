import React, { useState } from "react";
import {
  Leaf,
  CheckSquare,
  Activity,
  Home,
  Globe2,
  Users2,
  Target,
  Users,
  Plus,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Filter,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  Zap,
  Droplets,
  Trash2,
  TreePine,
  ShoppingCart,
} from "lucide-react";

// HEATMAP GRID DENSITY SCALE
const DENSITY_COLORS = {
  0: "bg-[#F4F0FF]",
  25: "bg-[#D8C7FF]",
  50: "bg-[#AD8BFF]",
  75: "bg-[#8B5CF6]",
  100: "bg-[#7C5CFC]",
};

const HEATMAP_DATA = [
  { level: "Senior Executive", values: [100, 75, 50, 75, 100, 50, 25, 75, 100, 50, 75, 100] },
  { level: "Director", values: [75, 50, 75, 100, 75, 100, 50, 25, 75, 100, 50, 75] },
  { level: "Manager", values: [50, 25, 75, 50, 100, 75, 100, 50, 25, 75, 100, 50] },
  { level: "Associate", values: [25, 50, 25, 75, 50, 75, 50, 100, 75, 50, 25, 75] },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const EMPLOYEES = [
  {
    id: 1,
    name: "Eleanor Vance",
    gender: "Female",
    age: 32,
    ethnicity: "Caucasian",
    designation: "Senior Sustainability Lead",
    dateJoined: "12 Jan 2021",
    satisfaction: 92,
    status: "Current",
  },
  {
    id: 2,
    name: "Marcus Chen",
    gender: "Male",
    age: 38,
    ethnicity: "Asian",
    designation: "GHG Emission Specialist",
    dateJoined: "05 May 2020",
    satisfaction: 88,
    status: "Current",
  },
  {
    id: 3,
    name: "Amara Okonjo",
    gender: "Female",
    age: 29,
    ethnicity: "African",
    designation: "ESG Data Analyst",
    dateJoined: "18 Sep 2022",
    satisfaction: 95,
    status: "Current",
  },
  {
    id: 4,
    name: "Diego Ramirez",
    gender: "Male",
    age: 41,
    ethnicity: "Hispanic",
    designation: "Energy & Waste Director",
    dateJoined: "01 Nov 2019",
    satisfaction: 84,
    status: "Current",
  },
  {
    id: 5,
    name: "Sophia Al-Mansoor",
    gender: "Female",
    age: 35,
    ethnicity: "Middle Eastern",
    designation: "Procurement Manager",
    dateJoined: "14 Feb 2023",
    satisfaction: 78,
    status: "Current",
  },
  {
    id: 6,
    name: "Julian Thorne",
    gender: "Male",
    age: 45,
    ethnicity: "Caucasian",
    designation: "VP of People & Culture",
    dateJoined: "10 Mar 2018",
    satisfaction: 65,
    status: "Past",
  },
  {
    id: 7,
    name: "Kavita Patel",
    gender: "Female",
    age: 27,
    ethnicity: "South Asian",
    designation: "Biodiversity Researcher",
    dateJoined: "22 Aug 2023",
    satisfaction: 91,
    status: "Current",
  },
];

export default function EcoTrackDashboard() {
  const [activeMenu, setActiveMenu] = useState("Employee");
  const [isEnvOpen, setIsEnvOpen] = useState(true);
  const [activeEnvSub, setActiveEnvSub] = useState("GHG Emissions");
  const [dateFilter, setDateFilter] = useState("1 Jun 2023 - 11 Feb 2024");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredEmployees = EMPLOYEES.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.ethnicity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-[#F7F8FA] font-sans text-[#161224] antialiased select-none">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 min-w-[256px] bg-white border-r border-[#EFEFF4] flex flex-col justify-between p-5 h-screen sticky top-0 z-30 shrink-0">
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-[#7C5CFC] text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Leaf size={20} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-[#161224] leading-tight tracking-tight">
                EcoTrack
              </h1>
              <p className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-wider">
                ESG Analytics Suite
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-wider px-3 mb-2">
              Quick Links
            </div>

            <button
              type="button"
              onClick={() => setActiveMenu("Task")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-semibold transition cursor-pointer ${
                activeMenu === "Task"
                  ? "bg-[#EBE5FF] text-[#7C5CFC] font-bold"
                  : "text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA]"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare size={18} className={activeMenu === "Task" ? "text-[#7C5CFC]" : "text-[#6E6D7A]"} />
                <span>Task</span>
              </div>
              <span className="bg-[#EBE5FF] text-[#7C5CFC] text-[10px] font-bold px-2 py-0.5 rounded-full">
                12
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("Activities")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition cursor-pointer ${
                activeMenu === "Activities"
                  ? "bg-[#EBE5FF] text-[#7C5CFC] font-bold"
                  : "text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA]"
              }`}
            >
              <Activity size={18} className={activeMenu === "Activities" ? "text-[#7C5CFC]" : "text-[#6E6D7A]"} />
              <span>Activities</span>
            </button>
          </div>

          {/* Main Menu Section */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-wider px-3 mb-2">
              Main Navigation
            </div>

            <button
              type="button"
              onClick={() => setActiveMenu("Home")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition cursor-pointer ${
                activeMenu === "Home"
                  ? "bg-[#EBE5FF] text-[#7C5CFC] font-bold"
                  : "text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA]"
              }`}
            >
              <Home size={18} className={activeMenu === "Home" ? "text-[#7C5CFC]" : "text-[#6E6D7A]"} />
              <span>Home</span>
            </button>

            {/* Environment Collapsible Item */}
            <div>
              <button
                type="button"
                onClick={() => setIsEnvOpen(!isEnvOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-semibold text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Globe2 size={18} className="text-[#6E6D7A]" />
                  <span>Environment</span>
                </div>
                {isEnvOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isEnvOpen && (
                <div className="pl-6 space-y-1 mt-1 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#EFEFF4]">
                  {[
                    { label: "GHG Emissions", icon: Zap },
                    { label: "Energy", icon: Sparkles },
                    { label: "Waste", icon: Trash2 },
                    { label: "Water", icon: Droplets },
                    { label: "Biodiversity", icon: TreePine },
                    { label: "Procurement", icon: ShoppingCart },
                  ].map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.label}
                        type="button"
                        onClick={() => {
                          setActiveEnvSub(sub.label);
                          setActiveMenu("Environment");
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-medium transition cursor-pointer ${
                          activeMenu === "Environment" && activeEnvSub === sub.label
                            ? "bg-[#EBE5FF] text-[#7C5CFC] font-bold"
                            : "text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA]"
                        }`}
                      >
                        <SubIcon size={14} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Employee Item (ACTIVE STATE) */}
            <button
              type="button"
              onClick={() => setActiveMenu("Employee")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition cursor-pointer ${
                activeMenu === "Employee"
                  ? "bg-[#EBE5FF] text-[#7C5CFC] font-bold"
                  : "text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA]"
              }`}
            >
              <Users2 size={18} className={activeMenu === "Employee" ? "text-[#7C5CFC]" : "text-[#6E6D7A]"} />
              <span>Employee</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMenu("Goal Manager")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-xs font-semibold transition cursor-pointer ${
                activeMenu === "Goal Manager"
                  ? "bg-[#EBE5FF] text-[#7C5CFC] font-bold"
                  : "text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA]"
              }`}
            >
              <Target size={18} className={activeMenu === "Goal Manager" ? "text-[#7C5CFC]" : "text-[#6E6D7A]"} />
              <span>Goal Manager</span>
            </button>
          </div>

          {/* Community Section */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-bold text-[#6E6D7A] uppercase tracking-wider px-3 mb-2">
              Community & Network
            </div>

            <button
              type="button"
              onClick={() => setActiveMenu("Community")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-xs font-semibold text-[#6E6D7A] hover:text-[#161224] hover:bg-[#F7F8FA] transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users size={18} className="text-[#6E6D7A]" />
                <span>Community</span>
              </div>
              <div className="flex -space-x-1.5 overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#CBB5FF] text-[8px] font-bold text-white flex items-center justify-center">
                  JD
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#7C5CFC] text-[8px] font-bold text-white flex items-center justify-center">
                  AK
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="pt-4 border-t border-[#EFEFF4]">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full h-11 bg-[#7C5CFC] hover:bg-[#6846EC] text-white text-xs font-bold rounded-[10px] shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Create New</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN APP CONTENT CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* APP HEADER */}
        <header className="h-16 bg-white border-b border-[#EFEFF4] px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <h2 className="text-[20px] font-extrabold text-[#161224]">
            {activeMenu}
          </h2>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-64 sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6D7A] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search here..."
                className="w-full pl-9 pr-9 py-2 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold text-[#161224] focus:outline-none focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[#6E6D7A] bg-white px-1.5 py-0.5 rounded border border-[#EFEFF4]">
                ⌘K
              </span>
            </div>

            {/* Language Selector */}
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold text-[#161224] hover:bg-slate-100 transition cursor-pointer"
            >
              <span>🇺🇸 English</span>
              <ChevronDown size={14} className="text-[#6E6D7A]" />
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-[10px] bg-[#F7F8FA] border border-[#EFEFF4] text-[#161224] hover:bg-slate-100 transition cursor-pointer"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#7C5CFC] ring-2 ring-white" />
            </button>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#EFEFF4]">
              <div className="w-9 h-9 rounded-full bg-[#EBE5FF] border border-[#CBB5FF] text-[#7C5CFC] font-extrabold flex items-center justify-center text-xs shadow-xs">
                AM
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY WORKSPACE */}
        <main className="p-6 sm:p-8 space-y-6 flex-1">
          {/* 3. UPPER ANALYTICS GRID (2 COLUMNS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT COLUMN: HEATMAP CARD (SPAN 7) */}
            <div className="lg:col-span-7 bg-white rounded-[18px] border border-[#EFEFF4] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-base font-extrabold text-[#161224]">
                    Management Level
                  </h3>
                  <p className="text-xs text-[#6E6D7A] font-medium mt-0.5">
                    12-Month organizational density heatmap
                  </p>
                </div>

                {/* Date Filter Dropdown */}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold text-[#161224] hover:bg-slate-100 transition cursor-pointer"
                >
                  <Calendar size={14} className="text-[#7C5CFC]" />
                  <span>{dateFilter}</span>
                  <ChevronDown size={13} className="text-[#6E6D7A]" />
                </button>
              </div>

              {/* 12-MONTH HEATMAP GRID */}
              <div className="space-y-3 overflow-x-auto pt-2">
                <div className="grid grid-cols-13 gap-2 min-w-[500px]">
                  {/* Empty Corner */}
                  <div className="text-[11px] font-bold text-[#6E6D7A]"></div>
                  {/* Month Headers */}
                  {MONTHS.map((m) => (
                    <div key={m} className="text-[11px] font-bold text-[#6E6D7A] text-center">
                      {m}
                    </div>
                  ))}

                  {/* Level Rows */}
                  {HEATMAP_DATA.map((row) => (
                    <React.Fragment key={row.level}>
                      <div className="text-[11px] font-bold text-[#161224] flex items-center pr-2 truncate">
                        {row.level}
                      </div>
                      {row.values.map((val, idx) => (
                        <div
                          key={idx}
                          title={`${row.level} (${MONTHS[idx]}): ${val}% Density`}
                          className={`h-7 rounded-[6px] ${DENSITY_COLORS[val]} transition-transform hover:scale-110 cursor-pointer shadow-2xs`}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* HEATMAP DENSITY LEGEND */}
              <div className="pt-3 border-t border-[#EFEFF4] flex items-center justify-between text-xs font-semibold text-[#6E6D7A]">
                <span>Density Scale</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px]">0%</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-[4px] bg-[#F4F0FF]" title="0%" />
                    <div className="w-4 h-4 rounded-[4px] bg-[#D8C7FF]" title="25%" />
                    <div className="w-4 h-4 rounded-[4px] bg-[#AD8BFF]" title="50%" />
                    <div className="w-4 h-4 rounded-[4px] bg-[#8B5CF6]" title="75%" />
                    <div className="w-4 h-4 rounded-[4px] bg-[#7C5CFC]" title="100%" />
                  </div>
                  <span className="text-[10px]">100%</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: EMPLOYMENT METRICS DONUT CARD (SPAN 5) */}
            <div className="lg:col-span-5 bg-white rounded-[18px] border border-[#EFEFF4] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#161224]">
                  Employment Metrics
                </h3>
                <button type="button" className="text-[#6E6D7A] hover:text-[#161224]">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* DONUT CHART WITH CENTER SUMMARY STAT */}
              <div className="relative flex items-center justify-center py-2">
                <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 36 36">
                  {/* Background Track (#EBE5FF) */}
                  <path
                    className="text-[#EBE5FF]"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Primary Purple Segment (#7C5CFC - 56% Man) */}
                  <path
                    className="text-[#7C5CFC]"
                    strokeDasharray="56, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Center Content Overlay */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-[#161224] tracking-tight">
                    22,317
                  </span>
                  <span className="text-xs font-bold text-[#6E6D7A] uppercase tracking-wider">
                    Summary
                  </span>
                </div>
              </div>

              {/* BOTTOM GENDER RATIO STATS */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#EFEFF4]">
                <div className="bg-[#F7F8FA] p-3 rounded-[12px] border border-[#EFEFF4]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6E6D7A]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7C5CFC]" />
                      Man
                    </span>
                    <span className="text-emerald-600 flex items-center">
                      <ArrowUpRight size={14} /> 19.6%
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-[#161224] mt-1">
                    56%
                  </p>
                </div>

                <div className="bg-[#F7F8FA] p-3 rounded-[12px] border border-[#EFEFF4]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6E6D7A]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EBE5FF] border border-[#CBB5FF]" />
                      Woman
                    </span>
                    <span className="text-emerald-600 flex items-center">
                      <ArrowUpRight size={14} /> 19.6%
                    </span>
                  </div>
                  <p className="text-base font-extrabold text-[#161224] mt-1">
                    44%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. LOWER DATA SECTION: EMPLOYEES DATA TABLE CARD */}
          <div className="bg-white rounded-[18px] border border-[#EFEFF4] p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] space-y-5">
            {/* Table Header Controls */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-lg font-extrabold text-[#161224]">
                  Employees Directory
                </h3>
                <p className="text-xs text-[#6E6D7A] font-medium mt-0.5">
                  ESG headcount, ethnic diversity, and employee satisfaction tracking
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold text-[#161224] hover:bg-slate-100 transition cursor-pointer"
                >
                  <Filter size={14} className="text-[#7C5CFC]" />
                  <span>Filter</span>
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold text-[#161224] hover:bg-slate-100 transition cursor-pointer"
                >
                  <Calendar size={14} className="text-[#7C5CFC]" />
                  <span>{dateFilter}</span>
                  <ChevronDown size={13} className="text-[#6E6D7A]" />
                </button>
              </div>
            </div>

            {/* EMPLOYEES TABLE */}
            <div className="overflow-x-auto rounded-[12px] border border-[#EFEFF4]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F8FA] text-[#6E6D7A] font-bold uppercase text-[10px] tracking-wider border-b border-[#EFEFF4]">
                  <tr>
                    <th className="py-3.5 px-4">Employee Name</th>
                    <th className="py-3.5 px-4">Gender</th>
                    <th className="py-3.5 px-4">Age</th>
                    <th className="py-3.5 px-4">Ethnicity</th>
                    <th className="py-3.5 px-4">Designation</th>
                    <th className="py-3.5 px-4">Date Joined</th>
                    <th className="py-3.5 px-4 min-w-[180px]">Satisfaction Score</th>
                    <th className="py-3.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEFF4] bg-white font-semibold text-[#161224]">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-[#F7F8FA]/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#161224]">
                        {emp.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#6E6D7A]">{emp.gender}</td>
                      <td className="py-3.5 px-4 text-[#6E6D7A]">{emp.age}</td>
                      <td className="py-3.5 px-4 text-[#6E6D7A]">{emp.ethnicity}</td>
                      <td className="py-3.5 px-4">{emp.designation}</td>
                      <td className="py-3.5 px-4 text-[#6E6D7A]">{emp.dateJoined}</td>

                      {/* SATISFACTION PROGRESS BAR */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-[#EBE5FF] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#7C5CFC] rounded-full transition-all duration-500"
                              style={{ width: `${emp.satisfaction}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#7C5CFC] w-8">
                            {emp.satisfaction}%
                          </span>
                        </div>
                      </td>

                      {/* STATUS PILL BADGE */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold ${
                            emp.status === "Current"
                              ? "bg-[#EBE5FF] text-[#7C5CFC]"
                              : "bg-[#F7F8FA] text-[#6E6D7A] border border-[#EFEFF4]"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: CREATE NEW ITEM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#161224]/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[20px] border border-[#EFEFF4] p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EFEFF4] pb-3">
              <h3 className="text-base font-extrabold text-[#161224] flex items-center gap-2">
                <Plus size={18} className="text-[#7C5CFC]" />
                <span>Create New ESG Record</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#6E6D7A] hover:text-[#161224] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-[#161224]">
              <div>
                <label className="block text-[#6E6D7A] mb-1.5 uppercase text-[10px] font-bold">
                  Record Type
                </label>
                <select className="w-full h-10 px-3 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold focus:outline-none focus:border-[#7C5CFC]">
                  <option>GHG Emissions Audit</option>
                  <option>Energy Consumption Metrics</option>
                  <option>Employee Diversity Entry</option>
                  <option>Waste & Water Management</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6E6D7A] mb-1.5 uppercase text-[10px] font-bold">
                  Title / Description
                </label>
                <input
                  type="text"
                  placeholder="Enter record title..."
                  className="w-full h-10 px-3 bg-[#F7F8FA] border border-[#EFEFF4] rounded-[10px] text-xs font-semibold focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#F7F8FA] border border-[#EFEFF4] text-[#161224] rounded-[10px] text-xs font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-[#7C5CFC] text-white rounded-[10px] text-xs font-bold hover:bg-[#6846EC]"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
