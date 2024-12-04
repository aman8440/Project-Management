import logo from '../assets/img/logo.svg';
import projectIcon from '../assets/img/project_icon.svg';
import profileIcon from '../assets/img/profile_icon.svg';
import dashboardIcon from '../assets/img/dashboard-icon.svg';
import addProjectIcon from '../assets/img/add-project-icon.svg';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import projectIconActive from '../assets/img/project-icon-active.svg';
import profileIconActive from '../assets/img/profile-icon-active.svg';
import dashboardIconActive from '../assets/img/home-icon-active.svg';
import addProjectIconACtive from '../assets/img/add-project-icon-active.svg';

const Sidebar = () => {
  const location = useLocation();
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const toggleProjectsSubmenu = () => setIsProjectsOpen(!isProjectsOpen);
  const handleMouseEnterSidebar = () => setIsSidebarHovered(true);
  const handleMouseLeaveSidebar = () => setIsSidebarHovered(false);
  const isActive = (path: string) => location.pathname === path;

  const projectsRoute = `/dashboard/projects${location.search}`;

  useEffect(() => {
    if (
      location.pathname.startsWith('/dashboard/projects/add-projects') &&
      location.pathname !== `${projectsRoute}`
    ) {
      setIsProjectsOpen(true);
    }
  }, [location.pathname]);

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
          <div className={`aws d-flex btn ${isActive("/dashboard") ? "active" : ""}`}>
            <img src={isActive("/dashboard") ? dashboardIcon : dashboardIconActive} alt="dashboardIcon" height='16' width='16'/>
          </div>
        </Link>
        <Link className='text-decoration-none' to="/dashboard/profile">
          <div className={`home d-flex btn ${isActive("/dashboard/profile") ? "active" : ""}`}>
            <img src={isActive("/dashboard/profile") ? profileIcon : profileIconActive} alt="profileIcon" height='16' width='16' />
          </div>
        </Link>
        <Link className='text-decoration-none' to={projectsRoute}>   
          <div
            className={`mask d-flex btn ${isActive("/dashboard/projects") ? "active" : ""}`}
            style={{ position:'relative'}}
            >
            <img src={isActive("/dashboard/projects") ? projectIcon : projectIconActive} alt="projectIcon" height="16" width="16" />
            {isSidebarHovered && (
              <span onClick={toggleProjectsSubmenu} style={{position:'absolute', right:'9px'}}>
                {isProjectsOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
              </span>
            )}
          </div>
        </Link>
        {isProjectsOpen && (
          <Link
            className="text-decoration-none ms-1"
            to="/dashboard/projects/add-projects"
          >
            <div className={`add d-flex btn ${isActive("/dashboard/projects/add-projects") ? "active" : ""}`}>
              <img src={isActive("/dashboard/projects/add-projects") ? addProjectIcon : addProjectIconACtive} alt="addProjectIcon" height='16' width='16'/>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Sidebar