import './dashboard.css'
import Breadcrumb from "../../components/Breadcrumb"

const Dashboard = () => {
  return (
    <div className="main-container d-flex flex-column">
      <div className="sub-container d-flex justify-content-start">
        <Breadcrumb/>
      </div>
      <div className="primary-container d-flex justify-content-center align-items-center">
        <h1 className="display-4 font-weight-bold">Coming Soon</h1>
      </div>
    </div>
  )
}

export default Dashboard
