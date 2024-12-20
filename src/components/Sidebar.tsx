import logo from '../assets/img/logo.svg';
import addProjectIcon from '../assets/img/add-project-icon.svg';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import addProjectIconACtive from '../assets/img/add-project-icon-active.svg';
import activeExtractIcon from '../assets/img/active_extract.svg';
import extractIcon from '../assets/img/extract_icon.svg';

const Sidebar = () => {
  const location = useLocation();
  const [isExtractOpen, setIsExtractOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const toggleExtractSubmenu = () => setIsExtractOpen(!isExtractOpen);
  const handleMouseEnterSidebar = () => setIsSidebarHovered(true);
  const handleMouseLeaveSidebar = () => setIsSidebarHovered(false);
  const isActive = (path: string) => location.pathname === path;

  const ExtractRoute = `/extract${location.search}`;

  useEffect(() => {
    if (
      location.pathname.startsWith('/Extract/add-Extract') &&
      location.pathname !== `${ExtractRoute}`
    ) {
      setIsExtractOpen(true);
    }
  }, [ExtractRoute, location.pathname]);

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
        <Link className='text-decoration-none' to={ExtractRoute}>   
          <div
            className={`mask d-flex btn ${isActive("/extract") ? "active" : ""}`}
            style={{ position:'relative'}}
            >
            <img src={isActive("/extract") ? activeExtractIcon : extractIcon} alt="projectIcon" height="20" width="20" />
            {isSidebarHovered && (
              <span onClick={toggleExtractSubmenu} className='sidebar-span'>
                {isExtractOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
              </span>
            )}
          </div>
        </Link>
        {isExtractOpen && (
          <Link
            className="text-decoration-none ms-1"
            to="/extract/add-extract"
          >
            <div className={`add d-flex btn ${isActive("/extract/add-extract") ? "active" : ""}`}>
              <img src={isActive("/extract/add-extract") ? addProjectIcon : addProjectIconACtive} alt="addProjectIcon" height='20' width='20'/>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Sidebar