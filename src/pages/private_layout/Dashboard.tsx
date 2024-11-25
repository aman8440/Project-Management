import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"

const Dashboard = () => {
  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <h1 className="display-4 font-weight-bold">Coming Soon</h1>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
