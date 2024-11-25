import { useAuth } from "../routes/PrivateRoute";
import Button from "./Button";
import icon from '../assets/img/search_icon.svg';
import { removeToken } from "../services/storageService";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout= ()=>{
    removeToken();
    navigate("/login");
  }
  return (
    <nav className="bg-transparent d-flex justify-content-between align-items-center text-#2B303B" style={{padding:'14px' ,borderBottom: '1px solid rgb(84 84 84 / 10%)'}}>
      <div className="d-flex w-full">
        <div className="logo ms-4" style={{paddingRight:'10px', borderRight: '1px solid #32323840'}}>
          <img src={icon} alt="Logo" width="30" height="30" className="d-inline-block align-top" />
        </div>
        <h5 className='d-flex align-items-center ms-3' style={{color:'#32323820',fontWeight:'600', fontSize:'28px', lineHeight:'16px', marginTop:'8px'}}>Search everything here.</h5>
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
            {`${user?.fname?.charAt(0)}${user?.lname?.charAt(0)}`}
          </div>
        </div>
        <Button text="Logout" type="button" onClick={() => logout()} />
      </div>
    </nav>
  );
};

export default Navbar;