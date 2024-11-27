import './App.css'
import { BrowserRouter} from "react-router-dom";
import { RecoilRoot } from "recoil";
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Toaster richColors position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App
