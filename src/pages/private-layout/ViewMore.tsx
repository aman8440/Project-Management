import './viewmore.css';
import { Box, Tab, Tabs } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { ProjectData, TabPanelProps } from "../../interfaces";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  BarChart,
  LineChart,
  pieArcLabelClasses,
  PieChart,
} from "@mui/x-charts";
import { constVariables } from "../../constants";

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

const ViewMore = () => {
  const [value, setValue] = React.useState(0);
  const [graphData, setGraphData] = useState<number[]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [pieChartData, setPieChartData] = useState([]);

  const handleChange = async (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue == 1) {
      await fetchGraphData();
      await fetchPieData();
    }
  };

  const [, setIsLoading] = useState<boolean>(false);
  const { id } = useParams();

  const [formData, setFormData] = useState<ProjectData>({
    projectName: "",
    projectTech: [],
    projectStartAt: null,
    projectDeadline: null,
    projectLead: "",
    teamSize: 1,
    projectClient: "",
    projectManagementTool: "",
    projectManagementUrl: "",
    projectDescription: "",
    projectRepoTool: "",
    projectRepoUrl: "",
    projectStatus: "Under Planning",
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${constVariables.base_url}api/project/details/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const project = await response.json();
        setFormData(project);
        setFormData({
          projectName: project.project_name,
          projectTech: project.project_tech.split(", "),
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
          projectStatus: project.project_status,
        });
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [id, setValue]);

  const fetchGraphData = async () => {
    try {
      const response = await fetch(`${constVariables.base_url}api/project/getProjectCount`);
      const responseData = await response.json();
      const month_data: string[] = [];
      const count_data: number[] = [];
      responseData.data.forEach((item: { month_name: string; project_count: string }) => {
        month_data.push(item.month_name);
        count_data.push(parseInt(item.project_count));
      });
      setGraphData(count_data);
      setXLabels(month_data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };
  const fetchPieData = async () => {
    try {
      const response = await fetch(`${constVariables.base_url}api/project/getStatusCount`);
      const responseData = await response.json();
      const pieChartData = responseData.data.map((item :{ project_status: string; project_count: string }) => ({
        label: item.project_status,
        value: parseInt(item.project_count),
      }));
      setPieChartData(pieChartData);
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

  const projectDetails = [
    { title: "Project Name", content: formData.projectName },
    { title: "Team Size", content: formData.teamSize },
    { title: "Project Lead", content: formData.projectLead },
    { title: "Project Client", content: formData.projectClient },
    { title: "Project Management Tool", content: formData.projectManagementTool },
    { title: "Project Repo Tool", content: formData.projectRepoTool },
    { title: "Project Status", content: formData.projectStatus },
    { 
      title: "Project Repo URL", 
      content: <Link className="text-decoration-none" to={formData.projectRepoUrl}>
                <p className="card-text text-black">View</p>
               </Link> 
    },
    { 
      title: "Project Management URL", 
      content: <Link className="text-decoration-none" to={formData.projectManagementUrl}>
                <p className="card-text text-black">View</p>
               </Link> 
    },
    { 
      title: "Project Technologies", 
      content: formData.projectTech.join(", ") 
    },
    { 
      title: "Project Description", 
      content: formData.projectDescription, 
      ClassName: "description" 
    },
  ];
  const projectTimeline = [
    { title: "Project Start Date", content: formData.projectStartAt?.toDateString()},
    { title: "Project Deadline Date", content: formData.projectDeadline?.toDateString() }
  ];

  const sizing = {
    margin: { right: 5 },
    width: 200,
    height: 200,
    legend: { hidden: true },
  };
  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div
          className="main-container d-flex flex-column"
        >
          <div
            className="sub-contain d-flex justify-content-start"
          >
            <Breadcrumb projectName={formData.projectName} />
          </div>
          <div className="container mt-5 p-4 bg-white shadow rounded">
            <div className="text-center mb-4">
              <h1 className="text-primary">{formData.projectName}</h1>
              <p className="text-secondary">Project Details</p>
            </div>
            <div className="profile-tab nav nav-tabs mb-4">
              <Box>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Project Details" {...a11yProps(0)} />
                    <Tab label="Charts" {...a11yProps(1)} />
                    <Tab label="Timeline" {...a11yProps(2)} />
                  </Tabs>
                </Box>
                <div className="tab-content">
                  <CustomTabPanel value={value} index={0}>
                    {formData ? (
                      <>
                        <div className="tab-pane fade show active">
                          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {projectDetails.map((detail, index) => (
                              <div className={detail.ClassName || "col"} key={index}>
                                <div className="card h-100">
                                  <div className="card-body">
                                    <h5 className="card-title text-primary">{detail.title}</h5>
                                    <p className="card-text">{detail.content}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>Loading project data...</p>
                    )}
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <div className="tab-pane d-flex w-full flex-wrap justify-content-start charts">
                      <BarChart
                        width={500}
                        height={250}
                        series={[{ data: graphData, label: "Project Count", id: "graphId" }]}
                        xAxis={[{ data: xLabels, scaleType: "band" }]}
                      />
                      <LineChart
                        width={500}
                        height={250}
                        series={[
                          { data: graphData, label: "Project Count", yAxisId: "leftAxisId" },
                        ]}
                        xAxis={[{ scaleType: "point", data: xLabels }]}
                        yAxis={[{ id: "leftAxisId" }, { id: "rightAxisId" }]}
                        rightAxis="rightAxisId"
                      />
                      <PieChart
                        series={[
                          {
                            outerRadius: 100,
                            data: pieChartData,
                            arcLabel: (d) => `${d.value}`
                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fill: "white",
                            fontSize: 14,
                          },
                        }}
                        {...sizing}
                      />
                    </div>
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <div className="tab-pane fade show active">
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {projectTimeline.map((detail, index) => (
                          <div className="col" key={index}>
                            <div className="card h-100">
                              <div className="card-body">
                                <h5 className="card-title text-primary">{detail.title}</h5>
                                <p className="card-text">{detail.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CustomTabPanel>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMore;
