import { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb"
import Navbar from "../../components/Navbar"
import Sidebar from "../../components/Sidebar"
import { getToken } from "../../services/storage.service";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "../../schema";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../hooks/userProfile";
import { constVariables } from "../../constants";
import { toast } from "react-toastify";

const TECH_OPTIONS = [
  'React', 'Angular', 'Vue', 'Node.js', 'Python', 
  'Java', 'C#', 'Ruby', 'Go', 'Rust', 
  'TypeScript', 'GraphQL', 'Docker', 'Kubernetes',
  'Spring Boot', 'Django', 'Flask', 'Express.js', 
  'Next.js', 'Laravel', 'ASP.NET', 'Svelte',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Azure', 'Google Cloud', 'Firebase',
  'TensorFlow', 'WebSocket', 'Qiskit', 'InfluxDB',
  'Kafka', 'OpenCV', 'ROS', 'Terraform', 'Unity',
  'React Native', 'WebRTC'
];

const PROJECT_MANAGEMENT_TOOLS = [
  'Jira', 'Trello', 'Asana', 'Monday.com', 'Basecamp', 
  'ClickUp', 'Notion', 'Microsoft Project', 'Linear', 
  'Smartsheet', 'Wrike', 'Teamwork', 'Todoist', 
  'ProofHub', 'Zoho Projects', 'Confluence'
];

const AddProjects = () => {
  const { userProfile }= useUserProfile();
  const navigate= useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    projectStatus: 'Under Planning',
  });

  const [techSearch, setTechSearch] = useState('');
  const [toolSearch, setToolSearch] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
  });
  const getTodayDate= (): dayjs.Dayjs =>{
    return dayjs();
  }
  const handleChange = (field: string, value: string | string[] | number | null | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const onSubmit : SubmitHandler<ProjectData> = async (data) => {
    setIsLoading(true);
    const payload = {
      project_name: data.projectName,
      project_tech: formData.projectTech,
      project_startat: formData.projectStartAt ? formData.projectStartAt.toISOString() : null,
      project_deadline: formData.projectDeadline ? formData.projectDeadline.toISOString() : null,
      project_lead: data.projectLead,
      team_size: data.teamSize,
      project_client: data.projectClient,
      project_management_tool: data.projectManagementTool,
      project_management_url: data.projectManagementUrl,
      project_description: data.projectDescription,
      project_repo_tool: data.projectRepoTool,
      project_repo_url: data.projectRepoUrl,
      project_status: data.projectStatus,
      created_by: userProfile?.fname || "Unknown",
      updated_by: userProfile?.fname || "Unknown",
    };
    try {
      const token= getToken();
      const response = await fetch(`${constVariables.base_url}api/project/create` ,{
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
       body:JSON.stringify(payload)});
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else{
        navigate('/dashboard/projects');
        toast.success("Data Inserted Successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTechOptions = TECH_OPTIONS.filter(tech => 
    tech.toLowerCase().includes(techSearch.toLowerCase())
  );

  const filteredToolOptions = PROJECT_MANAGEMENT_TOOLS.filter(tool =>
    (tool || "").toLowerCase().includes((toolSearch || "").toLowerCase())
  );
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column" style={{overflow:'hidden', height:'100%'}}>
          <div className="d-flex justify-content-start" style={{width:'92%', marginLeft:'70px', marginTop: '12px'}}>
            <Breadcrumb/>
          </div>
          <div className="container mt-5 mb-2">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 rounded shadow">
                  <h2 className="text-center mb-4">Create New Project</h2>
                  <Input
                    label="Project Name" 
                    type="text"
                    variant="outlined" 
                    name="projectName"
                    value={formData.projectName}
                    register={register}
                    error={errors.projectName}
                    onChange={(e) => handleChange('projectName', e.target.value)}
                    className="mb-2"
                  />
                  <Autocomplete
                    multiple
                    fullWidth={true}
                    value={formData.projectTech}
                    options={filteredTechOptions}
                    onChange={(e, newValue) => {
                      handleChange('projectTech', newValue);
                      setValue('projectTech', newValue);
                    }}
                    inputValue={techSearch}
                    onInputChange={(e, newInputValue) => setTechSearch(newInputValue)}
                    className="mb-3"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...register("projectTech")}
                        label="Project Technologies"
                        name="projectTech"
                        error={!!errors.projectTech}
                        helperText={errors.projectTech?.message}
                      />
                    )}
                    getOptionLabel={(option) => option}
                  />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DateRangePicker']}>
                        <DateRangePicker
                          value={[
                            formData.projectStartAt ? dayjs(formData.projectStartAt) : null,
                            formData.projectDeadline ? dayjs(formData.projectDeadline) : null,
                          ]}
                          minDate={getTodayDate()}
                          onChange={(newValue: DateRange<dayjs.Dayjs> | null) => {
                            if (newValue !== null) {
                              const [start, end] = newValue;
                              const startDate = start ? start.toDate() : null;
                              const endDate = end ? end.toDate() : null;
                              handleChange('projectStartAt', startDate);
                              handleChange('projectDeadline', endDate);
                              setValue('projectStartAt', startDate);
                              setValue('projectDeadline', endDate);
                            }
                          }}
                          localeText={{
                            start: 'Project Start Date',
                            end: 'Project Deadline',
                          }}
                        />
                      </DemoContainer>
                      <div className="d-flex justify-content-between">
                        {errors.projectStartAt && <p className="text-danger ms-3" style={{fontSize:'13px'}}>{errors.projectStartAt.message}</p>}
                        {errors.projectDeadline && <p className="text-danger" style={{marginRight:'15px',fontSize:'13px'}}>{errors.projectDeadline.message}</p>}
                      </div>
                    </LocalizationProvider>
                  <Input
                    label="Project Lead"
                    type="text" 
                    variant="outlined" 
                    name="projectLead"
                    register={register}
                    error={errors.projectLead}
                    value={formData.projectLead}
                    onChange={(e) => handleChange('projectLead', e.target.value)}
                    className="mb-3 mt-4"
                  />
                  <FormControl fullWidth={true}  className="mb-3" error={!!errors.teamSize}>
                    <InputLabel>Team Size</InputLabel>
                    <Select
                      className="mb-3"
                      {...register('teamSize',{ valueAsNumber: true })}
                      value={formData.teamSize}
                      label="Team Size"
                      onChange={(e) =>  handleChange('teamSize', e.target.value)}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
                      ))}
                    </Select>
                    {errors.teamSize && <p className="text-danger">{errors.teamSize?.message}</p>}
                  </FormControl>
                  <Input
                    label="Project Client"
                    type="text"
                    variant="outlined" 
                    name="projectClient"
                    register={register}
                    error={errors.projectClient}
                    value={formData.projectClient}
                    onChange={(e) => handleChange('projectClient', e.target.value)}
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
                    renderInput={(params) => <TextField {...params} {...register("projectManagementTool")} label="Project Management Tool" name="projectManagementTool"
                      error={!!errors.projectManagementTool} helperText={errors.projectManagementTool?.message}/>}
                    getOptionLabel={(option) => option}
                  />
                  <Input
                    label="Project Management URL" 
                    type="text"
                    variant="outlined" 
                    name="projectManagementUrl"
                    register={register}
                    error={errors.projectManagementUrl}
                    value={formData.projectManagementUrl}
                    onChange={(e) => handleChange('projectManagementUrl', e.target.value)}
                    className="mb-3 mt-3"
                  />

                  <Input
                    label="Project Description"
                    type="textarea" 
                    variant="outlined" 
                    name="projectDescription"
                    register={register}
                    error={errors.projectDescription}
                    multiline={true}
                    rows={3}
                    value={formData.projectDescription}
                    onChange={(e) => handleChange('projectDescription', e.target.value)}
                    className="mb-3"
                  />
                  <Input
                    label="Project Repo Tool" 
                    type="text"
                    variant="outlined" 
                    name="projectRepoTool"
                    register={register}
                    error={errors.projectRepoTool}
                    value={formData.projectRepoTool}
                    onChange={(e) => handleChange('projectRepoTool', e.target.value)}
                    className="mb-3"
                  />
                  <Input
                    label="Project Repo Url"
                    type="text"
                    variant="outlined" 
                    name="projectRepoUrl"
                    register={register}
                    error={errors.projectRepoUrl}
                    value={formData.projectRepoUrl}
                    onChange={(e) => handleChange('projectRepoUrl', e.target.value)}
                    className="mb-3"
                  />
                  <FormControl fullWidth={true}  className="mb-3" error={!!errors.projectStatus}>
                    <InputLabel>Project Status</InputLabel>
                    <Select
                      className="mb-3"
                      value={formData.projectStatus}
                      label="Project Status"
                      {...register('projectStatus')}
                      onChange={(e) => handleChange('projectStatus', e.target.value)}
                    >
                      {[
                        'Under Planning', 'Development Started', 'Under Testing', 'Deployed on Dev', 'Live'
                      ].map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                    {errors.projectStatus && <p className="text-danger">{errors.projectStatus.message}</p>}
                  </FormControl>
                  <div className="add-btn d-flex justify-content-between" style={{width:'100%'}}>    
                    <Button text="Back" type="button" onClick={()=>{navigate("/dashboard/projects")}} sx={{backgroundColor:'transparent !important', color:'#0145FE !important'
                    }}/>
                    <Button text={isLoading ? "Submitting..." : "Submit"} type="submit" disabled={isLoading}/>
                  </div>
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
