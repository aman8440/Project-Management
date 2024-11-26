import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import { getToken } from "../../services/storageService";
import Input from "../../components/Input";
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { DateRange } from '@mui/x-date-pickers-pro/models';
import Button from "../../components/Button";
import { ProjectData } from "../../interfaces";
import { useAuth } from "../../routes/PrivateRoute";

const TECH_OPTIONS = [
  'React', 'Angular', 'Vue', 'Node.js', 'Python', 
  'Java', 'C#', 'Ruby', 'Go', 'Rust', 
  'TypeScript', 'GraphQL', 'Docker', 'Kubernetes',
  'Spring Boot', 'Django', 'Flask', 'Express.js', 
  'Next.js', 'Laravel', 'ASP.NET', 'Svelte',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Azure', 'Google Cloud', 'Firebase'
];

const PROJECT_MANAGEMENT_TOOLS = [
  'Jira', 'Trello', 'Asana', 'Monday.com', 'Basecamp', 
  'ClickUp', 'Notion', 'Microsoft Project', 'Linear', 
  'Smartsheet', 'Wrike', 'Teamwork', 'Todoist', 
  'ProofHub', 'Zoho Projects', 'Confluence'
];

const AddProjects = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProjectData>({
    projectName: '',
    projectTech: [] as string[],
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
    projectStatus: 'Planning',
  });

  const [techSearch, setTechSearch] = useState('');
  const [toolSearch, setToolSearch] = useState('');

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      project_name: formData.projectName,
      project_tech: formData.projectTech,
      project_startat: formData.projectStartAt?.toISOString(),
      project_deadline: formData.projectDeadline?.toISOString(),
      project_lead: formData.projectLead,
      team_size: formData.teamSize,
      project_client: formData.projectClient,
      project_management_tool: formData.projectManagementTool,
      project_management_url: formData.projectManagementUrl,
      project_description: formData.projectDescription,
      project_repo_tool: formData.projectRepoTool,
      project_repo_url: formData.projectRepoUrl,
      project_status: formData.projectStatus,
      created_by: user?.fname,
      updated_by: user?.fname
    };

    try {
      const token= getToken();
      const response = await fetch("http://localhost/truck_management/me/project/create" ,{
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
       body:JSON.stringify(payload)});
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Project created:', response.json());
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const filteredTechOptions = TECH_OPTIONS.filter(tech => 
    tech.toLowerCase().includes(techSearch.toLowerCase())
  );

  const filteredToolOptions = PROJECT_MANAGEMENT_TOOLS.filter(tool => 
    tool.toLowerCase().includes(toolSearch.toLowerCase())
  );
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column" style={{overflow:'hidden', height:'100%'}}>
          <div className="d-flex justify-content-start" style={{width:'92%', marginLeft:'70px', marginTop: '29px'}}>
            <Breadcrumb/>
          </div>
          <div className="container mt-5 mb-2">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
                  <h2 className="text-center mb-4">Create New Project</h2>
                  <Input
                    label="Project Name" 
                    variant="outlined" 
                    name="projectName"
                    value={formData.projectName}
                    onChange={()=>handleChange}
                    className="mb-3"
                  />
                  <Autocomplete
                    multiple
                    fullWidth={true} 
                    value={formData.projectTech}
                    onChange={(e, newValue) => handleChange('projectTech', newValue)}
                    options={filteredTechOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Project Technologies"
                        placeholder="Search technologies"
                      />
                    )}
                    getOptionLabel={(option) => option}
                    inputValue={techSearch}
                    onInputChange={(e, newInputValue) => {
                      setTechSearch(newInputValue); 
                    }}
                  />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateRangePicker']}>
                          <DateRangePicker
                            value={[
                              dayjs(formData.projectStartAt),
                              dayjs(formData.projectDeadline),
                            ]}
                            onChange={(newValue: DateRange<dayjs.Dayjs> | null) => {
                              if (newValue !== null) {
                                setFormData((prev) => ({
                                  ...prev,
                                  projectStartAt: newValue[0]?.toDate() || null,
                                  projectDeadline: newValue[1]?.toDate() || null,
                                }));
                              }
                            }}
                            localeText={{
                              start: 'Project Start Date',
                              end: 'Project Deadline',
                            }}
                          />
                      </DemoContainer>
                    </LocalizationProvider>
                  <Input
                    label="Project Lead" 
                    variant="outlined" 
                    name="projectLead"
                    value={formData.projectLead}
                    onChange={()=>handleChange}
                    className="mb-3 mt-4"
                  />
                  <FormControl fullWidth={true}  className="mb-3">
                    <InputLabel>Team Size</InputLabel>
                    <Select
                      name="teamSize"
                      className="mb-3"
                      value={formData.teamSize}
                      label="Team Size"
                      onChange={()=>handleChange}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Input
                    label="Project Client" 
                    variant="outlined" 
                    name="projectClient"
                    value={formData.projectClient}
                    onChange={()=>handleChange}
                    className="mb-3"
                  />
                  <Autocomplete
                    fullWidth={true} 
                    className="mb-3"
                    value={formData.projectManagementTool}
                    onChange={(e, newValue) => {
                      handleChange('projectManagementTool', newValue as string);
                      setToolSearch(newValue as string);
                    }}
                    onInputChange={(e, newInputValue) => {
                      setToolSearch(newInputValue);
                    }}
                    options={filteredToolOptions}
                    renderInput={(params) => <TextField {...params} label="Project Management Tool" />}
                    getOptionLabel={(option) => option}
                  />
                  <Input
                    label="Project Management URL" 
                    variant="outlined" 
                    name="projectManagementUrl"
                    value={formData.projectManagementUrl}
                    onChange={()=>handleChange}
                    className="mb-3"
                  />

                  <Input
                    label="Project Description" 
                    variant="outlined" 
                    multiline
                    rows={4}
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={()=>handleChange}
                    className="mb-3"
                  />
                  <Input
                    label="Project Repo Tool" 
                    variant="outlined" 
                    name="projectRepoTool"
                    value={formData.projectRepoTool}
                    onChange={()=>handleChange}
                    className="mb-3"
                  />
                  <Input
                    label="Project Repo Url" 
                    variant="outlined" 
                    name="projectRepoUrl"
                    value={formData.projectRepoUrl}
                    onChange={()=>handleChange}
                    className="mb-3"
                  />
                  <FormControl fullWidth={true}  className="mb-3">
                    <InputLabel>Project Status</InputLabel>
                    <Select
                      className="mb-3"
                      name="projectStatus"
                      value={formData.projectStatus}
                      label="Project Status"
                      onChange={()=>handleChange}
                    >
                      {[
                        'Planning', 
                        'Requirements Gathering', 
                        'In Progress', 
                        'Development', 
                        'Testing', 
                        'Production'
                      ].map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button 
                    type={"submit"}
                    text="Create Project"
                  >
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProjects
