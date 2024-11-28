import { Routes, Navigate, Route, Outlet } from "react-router-dom";
import {PrivateRoutes} from "./PrivateRoute";
import Signin from "../pages/public_layout/Signin";
import ForgetPass from "../pages/public_layout/ForgetPass";
import ChangePass from "../pages/public_layout/ChangePass";
import Dashboard from "../pages/private_layout/Dashboard";
import ProjectList from "../pages/private_layout/ProjectList";
import AddProjects from "../pages/private_layout/AddProjects";
import UpdateProject from "../pages/private_layout/UpdateProject";
import Interceptor from "../hooks/interceptor";
import { UserProfileProvider } from "../hooks/userProfile";
import { getToken } from "../services/storage.service";

const PublicRoutes= ()=>{
  const token= getToken();
  return token ? <Navigate to="/dashboard"/> : <Outlet/>;
}

const AppRoutes = () => {
  return (
    <div>
      <Interceptor>
        <UserProfileProvider>
          <Routes>
            <Route element={<PublicRoutes/>}>
              <Route path="/" element={<Navigate to={"/login"} />}></Route>
              <Route path="/login" element={<Signin />}></Route>
              <Route path="/forget" element={<ForgetPass />}></Route>
              <Route path="/reset-password/:reset_token" element={<ChangePass />}></Route>
            </Route>
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />}>
                {" "}
              </Route>
              <Route path="/dashboard/projects" element={<ProjectList />}></Route>
              <Route path="/dashboard/projects/add-projects" element={<AddProjects />}></Route>
              <Route path="/dashboard/projects/:id" element={<UpdateProject />}></Route>
            </Route>
          </Routes>
        </UserProfileProvider>
      </Interceptor>
    </div>
  )
}

export default AppRoutes
