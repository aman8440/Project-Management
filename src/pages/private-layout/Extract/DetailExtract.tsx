import '../viewmore.css';
import Breadcrumb from '../../../components/Breadcrumb'
import { TabPanelProps } from '../../../interfaces';
import { Box } from '@mui/material';
import React from 'react';

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DetailExtract = () => {
  const [value, setValue] = React.useState(0);

  return (
    <div className="main-container d-flex flex-column">
      <div className="sub-contain d-flex justify-content-start">
        <Breadcrumb documentName={"Eurofin--QQ"}/>
      </div>
      <div className="container mt-5 mb-2">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            Hii this is add extract page for data
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailExtract;
