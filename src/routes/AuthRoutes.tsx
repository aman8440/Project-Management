import Signin from '../pages/public_layout/Signin';
import ForgetPass from '../pages/public_layout/ForgetPass'
import ChangePass from '../pages/public_layout/ChangePass';

const AuthRoutes = [
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/forget",
    element: <ForgetPass />,
  },
  {
    path: "/reset-password/:reset_token",
    element: <ChangePass />,
  },
];

export default AuthRoutes;