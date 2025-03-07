import { Routes, Navigate, Route, Outlet } from "react-router-dom";
import {PrivateRoutes} from "./PrivateRoute";
import Interceptor from "../hooks/interceptor";
import { getToken } from "../services/storage.service";
import { lazy, Suspense } from "react";

const PublicRoutes= ()=>{
  const token= getToken();
  return token ? <Navigate to="/dashboard/projects"/> : <Outlet/>;
}

const Loader = lazy(() => import("../components/Loader"));
const Signin = lazy(() => import("../pages/public-layout/Signin"));
const ForgetPass = lazy(() => import("../pages/public-layout/ForgetPass"));
const ChangePass = lazy(() => import("../pages/public-layout/ChangePass"));
const CommonLayout = lazy(() => import("../pages/private-layout/CommonLayout"));
const Dashboard = lazy(() => import("../pages/private-layout/Dashboard"));
const Profile = lazy(() => import("../pages/private-layout/Profile"));
const ProjectList = lazy(() => import("../pages/private-layout/ProjectList"));
const AddProjects = lazy(() => import("../pages/private-layout/AddProjects"));
const UpdateProject = lazy(() => import("../pages/private-layout/UpdateProject"));
const ViewMore = lazy(() => import("../pages/private-layout/ViewMore"));

const AppRoutes = () => {
  return (
    <div>
      <Interceptor>
        <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<PublicRoutes/>}>
            <Route path="/" element={<Navigate to={"/login"} />}></Route>
            <Route path="/login" element={<Signin />}></Route>
            <Route path="/forget" element={<ForgetPass />}></Route>
            <Route path="/reset-password/:reset_token" element={<ChangePass />}></Route>
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route element={<CommonLayout />}>
              <Route path="/dashboard" element={<Dashboard />}>
                {" "}
              </Route>
              <Route path="/dashboard/profile" element={<Profile />}></Route>
              <Route path="/dashboard/projects" element={<ProjectList />}></Route>
              <Route path="/dashboard/projects/add-projects" element={<AddProjects />}></Route>
              <Route path="/dashboard/projects/edit/:id" element={<UpdateProject />}></Route>
              <Route path="/dashboard/projects/:id" element={<ViewMore />}></Route>
            </Route>
          </Route>
        </Routes>
        </Suspense>
      </Interceptor>
    </div>
  )
}

export default AppRoutes
