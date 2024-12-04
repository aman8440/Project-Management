import './App.css'
import { BrowserRouter} from "react-router-dom";
import { RecoilRoot } from "recoil";
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <ToastContainer position='top-right' />
          <AppRoutes />
        </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App
