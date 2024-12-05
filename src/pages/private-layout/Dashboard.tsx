import './dashboard.css'
import Breadcrumb from "../../components/Breadcrumb"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"

const Dashboard = () => {
  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="main-container d-flex flex-column">
          <div className="sub-container d-flex justify-content-start">
            <Breadcrumb/>
          </div>
          <div className="primary-container d-flex justify-content-center align-items-center">
            <h1 className="display-4 font-weight-bold">Coming Soon</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
