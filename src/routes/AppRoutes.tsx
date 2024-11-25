import { Routes, Navigate, Route, Outlet } from "react-router-dom";
import AuthRoutes from "./AuthRoutes";
import {PrivateRoutes, PrivateRoute} from "./PrivateRoute";
import { getToken } from "../services/storageService";
import { AuthProviderProps } from "../interfaces";

const PublicRoutes: React.FC<AuthProviderProps> = () => {
  const token = getToken();
  return token ? <Navigate to="/dashboard" /> : <Outlet/> ;
};
const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={ getToken() ? (<Navigate to="/dashboard" replace />) : (<Navigate to="/login" replace />)}/>
        <Route element={<PublicRoutes children={undefined} />}>
          {AuthRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
        <Route element={<PrivateRoutes />}>
          {PrivateRoute.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </div>
  )
}

export default AppRoutes
