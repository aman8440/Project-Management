import logo from '../assets/img/logo.svg';
import projectIcon from '../assets/img/project_icon.svg';
import profileIcon from '../assets/img/profile_icon.svg';
import dashboardIcon from '../assets/img/dashboard-icon.svg';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="sidebar-container text-white d-flex flex-column">
      {/* <div className="d-flex w-100 p-4 pb-2" style={{borderBottom: '1px solid #FFFFFF1A'}}>
        <div className="logo" style={{paddingRight:'5px'}}>
          <img src={logo} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        </div>
        <span className='d-flex align-items-center' style={{fontSize: '15.45px', fontWeight:'600', lineHeight:'18.1px', whiteSpace:'nowrap'}}>Search Portal</span>
      </div> */}
      {/* <ul className="list-unstyled p-4">
        <li className="btn mb-3 d-flex mt-4 p-2" style={{ backgroundColor: '#ffffff', borderRadius: '4.32px'}}>
          <div className="d-flex" style={{borderRight: '0.86px solid #2E255933', paddingRight:'8px'}}>
            <img src={homeIcon} alt="homeIcon" width="20" height="20" className="d-inline-block align-top" />
          </div>
          <span className='ms-3' style={{ color: '#2B303B' }}>Search</span>
        </li>
        <li className="btn mb-3 d-flex mt-4 p-2" style={{ backgroundColor: '#FFFFFF1A', borderRadius: '4.32px' }}>
          <div className="d-flex" style={{borderRight: '0.86px solid #FFFFFF33', paddingRight:'8px'}}>
            <img src={frameIcon} alt="frameIcon" width="20" height="20" className="d-inline-block align-top" />
          </div>
          <span className='ms-3 text-white'>ASOR</span>
        </li>
        <li className="btn mb-3 d-flex mt-4 p-2" style={{ backgroundColor: '#FFFFFF1A', borderRadius: '4.32px' }}>
          <div className="d-flex" style={{borderRight: '0.86px solid #FFFFFF33', paddingRight:'8px'}}>
            <img src={awsIcon} alt="awsIcon" width="20" height="20" className="d-inline-block align-top" />
          </div>
          <span className='ms-3 text-white' style={{whiteSpace:'nowrap'}}>AWS Config</span>
        </li>
      </ul> */}
        <div className="imgContainer d-flex flex-column justify-content-center">
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
            <div className={`mask d-flex btn ${isActive("/dashboard/projects") ? "active" : ""}`} style={{
              backgroundColor: isActive("/dashboard/projects") ? "#ffffff" : "#ffffff1a",
              color: isActive("/dashboard/projects") ? "black" : "#ffffff",
            }}>
              <img src={projectIcon} alt="projectIcon" height='20' width='20'/>
            </div>
          </Link>
        </div>
    </div>
  )
}

export default Sidebar