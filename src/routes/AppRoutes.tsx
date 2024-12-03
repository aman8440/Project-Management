import { Routes, Navigate, Route, Outlet } from "react-router-dom";
import {PrivateRoutes} from "./PrivateRoute";
import Interceptor from "../hooks/interceptor";
import { UserProfileProvider } from "../hooks/userProfile";
import { getToken } from "../services/storage.service";
import Loader from "../components/Loader";
import { lazy, Suspense } from "react";

const PublicRoutes= ()=>{
  const token= getToken();
  return token ? <Navigate to="/dashboard"/> : <Outlet/>;
}

const Signin = lazy(() => import("../pages/public_layout/Signin"));
const ForgetPass = lazy(() => import("../pages/public_layout/ForgetPass"));
const ChangePass = lazy(() => import("../pages/public_layout/ChangePass"));

const Dashboard = lazy(() => import("../pages/private_layout/Dashboard"));
const Profile = lazy(() => import("../pages/private_layout/Profile"));
const ProjectList = lazy(() => import("../pages/private_layout/ProjectList"));
const AddProjects = lazy(() => import("../pages/private_layout/AddProjects"));
const UpdateProject = lazy(() => import("../pages/private_layout/UpdateProject"));
const ViewMore = lazy(() => import("../pages/private_layout/ViewMore"));

const AppRoutes = () => {
  return (
    <div>
      <Interceptor>
        <UserProfileProvider>
          <Suspense fallback={<Loader />}>
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
              <Route path="/dashboard/profile" element={<Profile />}></Route>
              <Route path="/dashboard/projects" element={<ProjectList />}></Route>
              <Route path="/dashboard/projects/add-projects" element={<AddProjects />}></Route>
              <Route path="/dashboard/projects/edit/:id" element={<UpdateProject />}></Route>
              <Route path="/dashboard/projects/:id" element={<ViewMore />}></Route>
            </Route>
          </Routes>
          </Suspense>
        </UserProfileProvider>
      </Interceptor>
    </div>
  )
}

export default AppRoutes
