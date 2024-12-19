import './navbar.css';
import searchIcon from '../assets/img/search_icon.svg';
import { useLogout, useUserProfile } from "../hooks/userProfile";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Logout } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { userProfile }= useUserProfile();
  const navigate= useNavigate();
  const logout = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [icon, setIcon] = useState(true);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIcon(!icon);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIcon(true);
  };

  return (
    <nav className="navbar-container bg-transparent d-flex justify-content-between align-items-center text-#2B303B">
      <div className="d-flex w-full">
        <div className="logo logo-nav ms-4">
          <img src={searchIcon} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        </div>
        <h5 className='nav-heading d-flex align-items-center ms-3'>Search everything here..</h5>
      </div>
      <div className="d-flex align-items-center">
        <span className="mx-2">Environment: Dev</span>
        <div className="mx-2 d-flex align-items-center">
          <div
            className="nav-sub-container d-flex justify-content-center align-items-center rounded-circle bg-dark text-white me-2">
            {`${userProfile?.first_name?.charAt(0)}${userProfile?.last_name?.charAt(0)}`} 
          </div>
        </div>
        <span>{`${userProfile?.first_name}`}</span>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {icon ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          className="menu-list"
          slotProps={{
            paper: {
              className: 'menu-list-paper',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={()=> {handleClose(); navigate("/dashboard/profile");}}>
            <Avatar/>Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => {handleClose(); logout();}}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;