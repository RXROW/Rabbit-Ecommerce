import React, { useState } from "react";
import Sidebar from "./AdminSideBar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { darkMode } = useTheme();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen"> 
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
 
      <main className={`flex-1  ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
