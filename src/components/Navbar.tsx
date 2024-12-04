import searchIcon from '../assets/img/search_icon.svg';
import { useLogout, useUserProfile } from "../hooks/userProfile";
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Logout } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { constVariables } from '../constants';

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
    <nav className="bg-transparent d-flex justify-content-between align-items-center text-#2B303B" style={{padding:'14px', marginLeft:'48px', borderBottom: '1px solid rgb(84 84 84 / 10%)'}}>
      <div className="d-flex w-full">
        <div className="logo ms-4" style={{paddingRight:'10px', borderRight: '1px solid #32323840'}}>
          <img src={searchIcon} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        </div>
        <h5 className='d-flex align-items-center ms-3' style={{color:'#32323820',fontWeight:'600', fontSize:'28px', lineHeight:'16px', marginTop:'8px'}}>Search everything here..</h5>
      </div>
      <div className="d-flex align-items-center">
        <span className="mx-2">Environment: Dev</span>
        <div className="mx-2 d-flex align-items-center">
          <div
            className="d-flex justify-content-center align-items-center rounded-circle bg-dark text-white me-2"
            style={{
              width: '30px',
              height: '30px',
              fontSize: '16px',
              textAlign: 'center',
              padding: '19px'
            }}
          >
           {userProfile?.image_name !== null ? <img src={`${constVariables.base_url}assets/images/uploads/` + userProfile?.image_name} alt="userProfile" width="40" height="40" style={{borderRadius:'100%', borderColor:'transparent'}}/> : `${userProfile?.fname?.charAt(0)}${userProfile?.lname?.charAt(0)}`} 
          </div>
        </div>
        <span>{`${userProfile?.fname}`}</span>
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
          className='menu-list'
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
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