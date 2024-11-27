import { Routes, Navigate, Route } from "react-router-dom";
import {PrivateRoutes} from "./PrivateRoute";
import Signin from "../pages/public_layout/Signin";
import ForgetPass from "../pages/public_layout/ForgetPass";
import ChangePass from "../pages/public_layout/ChangePass";
import Dashboard from "../pages/private_layout/Dashboard";
import ProjectList from "../pages/private_layout/ProjectList";
import AddProjects from "../pages/private_layout/AddProjects";
import UpdateProject from "../pages/private_layout/UpdateProject";
const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />}></Route>
        <Route path="/login" element={<Signin />}></Route>
        <Route path="/forget" element={<ForgetPass />}></Route>
        <Route path="/reset-password/:reset_token" element={<ChangePass />}></Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {" "}
          </Route>
          <Route path="/dashboard/projects" element={<ProjectList />}></Route>
          <Route path="/dashboard/projects/add-projects" element={<AddProjects />}></Route>
          <Route path="/dashboard/projects/:id" element={<UpdateProject />}></Route>
        </Route>
      </Routes>
    </div>
  )
}

export default AppRoutes
