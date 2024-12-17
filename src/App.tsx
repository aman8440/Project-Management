import './App.css'
import { BrowserRouter} from "react-router-dom";
import { RecoilRoot } from "recoil";
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import Loader from './components/Loader';
import { LoaderProvider, useLoader } from './hooks/loaderContext';

const LoaderWrapper = () => {
  const { loading } = useLoader();
  return loading ? <Loader/> : null;
}

function App() {
  return (
    <>
      <RecoilRoot>
        <LoaderProvider>
          <BrowserRouter>
            <ToastContainer position='top-right' />
            <LoaderWrapper />
            <AppRoutes />
          </BrowserRouter>
        </LoaderProvider>
      </RecoilRoot>
    </>
  )
}

export default App;
