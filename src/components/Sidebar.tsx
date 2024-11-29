import logo from '../assets/img/logo.svg';
import projectIcon from '../assets/img/project_icon.svg';
import profileIcon from '../assets/img/profile_icon.svg';
import dashboardIcon from '../assets/img/dashboard-icon.svg';
import addProjectIcon from '../assets/img/add-project-icon.svg';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const toggleProjectsSubmenu = () => setIsProjectsOpen(!isProjectsOpen);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const handleMouseEnterSidebar = () => setIsSidebarHovered(true);
  const handleMouseLeaveSidebar = () => setIsSidebarHovered(false);
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="sidebar-container text-white d-flex flex-column"
      onMouseEnter={handleMouseEnterSidebar}
      onMouseLeave={handleMouseLeaveSidebar}
    >
      <div className="imgContainer d-flex flex-column justify-content-center"
      >
        <div className="logo">
          <img src={logo} alt="logo"/>
        </div>
        <hr className="line"/>
        <Link className='text-decoration-none' to="/dashboard">   
          <div className={`aws d-flex btn ${isActive("/dashboard") ? "active" : ""}`} style={{
            backgroundColor: isActive("/dashboard") ? "#ffffff" : "#ffffff1a",
            color: isActive("/dashboard") ? "black" : "#ffffff",
          }}>
            <img src={dashboardIcon} alt="dashboardIcon" height='20' width='20'/>
          </div>
        </Link>
        <Link className='text-decoration-none' to="/dashboard/profile">
          <div className={`home d-flex btn ${isActive("/dashboard/profile") ? "active" : ""}`} style={{
            backgroundColor: isActive("/dashboard/profile") ? "#ffffff" : "#ffffff1a",
            color: isActive("/dashboard/profile") ? "black" : "#ffffff",
          }}>
            <img src={profileIcon} alt="profileIcon" height='20' width='20' />
          </div>
        </Link>
        <Link className='text-decoration-none' to="/dashboard/projects">   
        <div
          className={`mask d-flex btn ${isActive("/dashboard/projects") ? "active" : ""}`}
          style={{
            backgroundColor: isActive("/dashboard/projects") ? "#ffffff" : "#ffffff1a",
            color: isActive("/dashboard/projects") ? "black" : "#ffffff",
            position:'relative'
          }}
          onClick={toggleProjectsSubmenu}
        >
          <img src={projectIcon} alt="projectIcon" height="20" width="20" />
          {isSidebarHovered && (
            <span style={{position:'absolute', right:'9px'}}>
              {isProjectsOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
            </span>
          )}
        </div>
        </Link>
        {isProjectsOpen && (
          <Link
            className="text-decoration-none ms-3"
            to="/dashboard/projects/add-projects"
          >
            <div className={`add d-flex btn ${isActive("/dashboard/projects/add-projects") ? "active" : ""}`} style={{
              backgroundColor: isActive("/dashboard/projects/add-projects") ? "#ffffff" : "#ffffff1a",
              color: isActive("/dashboard/projects/add-projects") ? "black" : "#ffffff",
            }}>
              <img src={addProjectIcon} alt="addProjectIcon" height='20' width='20'/>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Sidebar