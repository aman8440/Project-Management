import Breadcrumb from "../../components/Breadcrumb";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useUserProfile } from "../../hooks/userProfile";

const Profile = () => {
  const {userProfile}= useUserProfile();
  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column" style={{overflow:'hidden', height:'100%'}}>
          <div className="d-flex justify-content-start" style={{width:'92%', marginLeft:'70px', marginTop: '29px'}}>
            <Breadcrumb/>
          </div>
          <div className="d-flex justify-content-center align-items-center" style={{height:'100%'}}>
            <h3>{`Hello ${userProfile?.fname} ${userProfile?.lname}`}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
