import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import { ProjectData, TabPanelProps } from "../../interfaces";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../../services/storage.service";
import dayjs from "dayjs";
import Input from "../../components/Input";
import { BarChart, DefaultizedPieValueType, LineChart, pieArcLabelClasses, PieChart, ScatterChart } from "@mui/x-charts";

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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const ViewMore = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();
  const [techSearch, setTechSearch] = useState('');
  const [toolSearch, setToolSearch] = useState('');
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    projectTech: [],
    projectStartAt: null,
    projectDeadline: null,
    projectLead: '',
    teamSize: 1,
    projectClient: '',
    projectManagementTool: '',
    projectManagementUrl: '',
    projectDescription: '',
    projectRepoTool: '',
    projectRepoUrl: '',
    projectStatus: 'Planning'
  });
  
  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        const response = await fetch(`http://localhost/truck_management/api/project/details/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const project = await response.json();
        console.log("project", project)
        setFormData(project);
        setFormData({
          projectName: project.project_name,
          projectTech: project.project_tech.split(', '),
          projectStartAt: dayjs(project.project_startat).toDate(),
          projectDeadline: dayjs(project.project_deadline).toDate(),
          projectLead: project.project_lead,
          teamSize: parseInt(project.team_size),
          projectClient: project.project_client,
          projectManagementTool: project.project_management_tool,
          projectManagementUrl: project.project_management_url,
          projectDescription: project.project_description,
          projectRepoTool: project.project_repo_tool,
          projectRepoUrl: project.project_repo_url,
          projectStatus: project.project_status
        });
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [id, setValue]);

  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
  ];
  const data1 = [
    { label: 'Group A', value: 400, color: '#0088FE' },
    { label: 'Group B', value: 300, color: '#00C49F' },
    { label: 'Group C', value: 300, color: '#FFBB28' },
    { label: 'Group D', value: 200, color: '#FF8042' },
  ];
  
  const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    legend: { hidden: true },
  };
  const TOTAL = data1.map((item) => item.value).reduce((a, b) => a + b, 0);
  
  const getArcLabel = (params: DefaultizedPieValueType) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };
  
  const data = [
    { x: 100, y: 200, id: 1 },
    { x: 120, y: 100, id: 2 },
    { x: 170, y: 300, id: 3 },
    { x: 140, y: 250, id: 4 },
    { x: 150, y: 400, id: 5 },
    { x: 110, y: 280, id: 6 },
  ];

  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column" style={{overflow:'hidden', height:'100%', backgroundColor:'rgb(232, 232, 232)'}}>
          <div className="d-flex justify-content-start" style={{width:'92%', marginLeft:'70px', marginTop: '29px'}}>
            <Breadcrumb/>
          </div>
          <div className="d-flex flex-column" style={{width:'100%', marginLeft:'107px', marginTop:'42px'}}>
            <div className="d-flex">
              <div className="d-flex flex-column">
                <h3>{formData.projectName}</h3>
                <h6 className="ms-1">Project Details</h6>
              </div>
            </div>
          </div>
          <div className="profile-tab d-flex mb-3" style={{width:'80%', marginLeft:'107px', marginTop:'42px', backgroundColor:'#fff', padding:'20px 25px', borderRadius:'15px',
            boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, .2), 0px 1px 1px 0px rgba(0, 0, 0, .14), 0px 1px 3px 0px rgba(0, 0, 0, .12)', overflow:'auto'}}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Project Details" {...a11yProps(0)} />
                  <Tab label="Charts" {...a11yProps(1)} />
                  <Tab label="Timeline" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                {formData ? (
                  <form>
                    <Input
                      label="Project Name"
                      type="text"
                      variant="outlined"
                      name="projectName"
                      value={formData.projectName}
                      className="mb-2"
                    />
                    <Autocomplete
                      multiple
                      fullWidth
                      value={formData?.projectTech || []}
                      inputValue={techSearch}
                      onInputChange={(e, newInputValue) => setTechSearch(newInputValue)}
                      className="mb-3"
                      options={[]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Project Technologies"
                          name="projectTech"
                          InputProps={{
                            ...params.InputProps,
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                    <Input
                      label="Project Lead"
                      type="text"
                      variant="outlined"
                      name="projectLead"
                      value={formData.projectLead}
                      className="mb-3 mt-4"
                    />
                    <FormControl fullWidth={true}  className="mb-3">
                      <InputLabel>Team Size</InputLabel>
                      <Select
                        className="mb-3"
                        value={formData.teamSize}
                        label="Team Size"
                        inputProps={{ readOnly: true }}
                      >
                        <MenuItem value={formData.teamSize}>{formData.teamSize}</MenuItem>
                      </Select>
                    </FormControl>
                    <Input
                      label="Project Client"
                      type="text"
                      variant="outlined"
                      name="projectClient"
                      value={formData.projectClient}
                      className="mb-3"
                    />
                    <Autocomplete
                      fullWidth={true}
                      value={formData?.projectManagementTool || null}
                      inputValue={toolSearch}
                      onInputChange={(e, newInputValue) => setToolSearch(newInputValue)}
                      className="mb-3"
                      options={[]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Project Management Tool"
                          name="projectManagementTool"
                        />
                      )}
                    />
                    <Input
                      label="Project Management URL"
                      type="text"
                      variant="outlined"
                      name="projectManagementUrl"
                      value={formData.projectManagementUrl}
                      className="mb-3 mt-3"
                    />
                    <Input
                      label="Project Description"
                      type="text"
                      variant="outlined"
                      name="projectDescription"
                      value={formData.projectDescription}
                      className="mb-3"
                    />
                    <Input
                      label="Project Repo Tool"
                      type="text"
                      variant="outlined"
                      name="projectRepoTool"
                      value={formData.projectRepoTool}
                      className="mb-3"
                    />
                    <Input
                      label="Project Repo Url"
                      type="text"
                      variant="outlined"
                      name="projectRepoUrl"
                      value={formData.projectRepoUrl}
                      className="mb-3"
                    />
                    <FormControl fullWidth={true}  className="mb-3">
                      <InputLabel>Project Status</InputLabel>
                      <Select
                        className="mb-3"
                        value={formData.projectStatus}
                        label="Project Status"
                        inputProps={{ readOnly: true }}
                      >
                        <MenuItem value={formData.projectStatus}>{formData.projectStatus}</MenuItem>
                      </Select>
                    </FormControl>
                  </form>
                  ) : (
                    <p>Loading project data...</p>
                  )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className="charts d-flex w-full flex-wrap justify-content-start">
                  <BarChart
                    width={500}
                    height={300}
                    series={[
                      { data: pData, label: 'pv', id: 'pvId' },
                      { data: uData, label: 'uv', id: 'uvId' },
                    ]}
                    xAxis={[{ data: xLabels, scaleType: 'band' }]}
                  />
                  <LineChart
                    width={500}
                    height={300}
                    series={[
                      { data: pData, label: 'pv', yAxisId: 'leftAxisId' },
                      { data: uData, label: 'uv', yAxisId: 'rightAxisId' },
                    ]}
                    xAxis={[{ scaleType: 'point', data: xLabels }]}
                    yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
                    rightAxis="rightAxisId"
                  />
                  <PieChart
                    series={[
                      {
                        outerRadius: 100,
                        data: data1,
                        arcLabel: getArcLabel,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        fontSize: 14,
                      },
                    }}
                    {...sizing}
                  />
                  <ScatterChart
                    width={500}
                    height={300}
                    series={[{ data, label: 'pv', id: 'pvId' }]}
                    xAxis={[{ min: 0 }]}
                  />
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Input
                  label="Project Start Date"
                  type="text"
                  variant="outlined"
                  name="projectStartAt"
                  value={(formData.projectStartAt)?.toDateString()}
                  className="mb-2"
                />
                <Input
                  label="Project Deadline Date"
                  type="text"
                  variant="outlined"
                  name="projectDeadline"
                  value={(formData.projectDeadline)?.toDateString()}
                  className="mb-2"
                />
              </CustomTabPanel>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewMore
