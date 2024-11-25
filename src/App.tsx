import './App.css'
import { BrowserRouter} from "react-router-dom";
import { RecoilRoot } from "recoil";
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';
import { AuthProvider } from './routes/PrivateRoute';

function App() {
  return (
    <>
      <RecoilRoot>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </RecoilRoot>
    </>
  )
}

export default App
