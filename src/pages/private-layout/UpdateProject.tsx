import './form.css';
import { useState, useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumb";
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
import { useNavigate, useParams } from "react-router-dom";
import { useUserProfile } from "../../hooks/userProfile";
import { toast } from "react-toastify";
import { GetProjectDataByIdResponse, ProjectManagementService, UpdateProjectRequest } from '../../swagger/api';
import { format } from 'date-fns';

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
  'React Native', 'WebRTC', 'Solidity', 'Ethereum', 'IPFS', 'R'
];

const PROJECT_MANAGEMENT_TOOLS = [
  'Jira', 'Trello', 'Asana', 'Monday.com', 'Basecamp', 
  'ClickUp', 'Notion', 'Microsoft Project', 'Linear', 
  'Smartsheet', 'Wrike', 'Teamwork', 'Todoist', 
  'ProofHub', 'Zoho Projects', 'Confluence'
];

const UpdateProject = () => {
  const { userProfile }= useUserProfile();
  const navigate = useNavigate();
  const { id } = useParams();
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
    projectStatus: 'Under Planning'
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
    mode:'onChange'
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response: GetProjectDataByIdResponse = await ProjectManagementService.getApiProjectDetails(parseInt(id as string));
        setFormData({
          projectName: response.project_name,
          projectTech: response.project_tech.split(', '),
          projectStartAt: dayjs(response.project_startat).toDate(),
          projectDeadline: dayjs(response.project_deadline).toDate(),
          projectLead: response.project_lead,
          teamSize: response.team_size,
          projectClient: response.project_client,
          projectManagementTool: response.project_management_tool,
          projectManagementUrl: response.project_management_url,
          projectDescription: response.project_description,
          projectRepoTool: response.project_repo_tool,
          projectRepoUrl: response.project_repo_url,
          projectStatus: response.project_status
        });
        setValue("projectName", response.project_name);
        setValue("projectTech", response.project_tech.split(', '));
        setValue("projectStartAt", dayjs(response.project_startat).toDate());
        setValue("projectDeadline", dayjs(response.project_deadline).toDate());
        setValue("projectLead", response.project_lead);
        setValue("teamSize", response.team_size);
        setValue("projectClient", response.project_client);
        setValue("projectManagementTool", response.project_management_tool);
        setValue("projectManagementUrl", response.project_management_url);
        setValue("projectDescription", response.project_description);
        setValue("projectRepoTool", response.project_repo_tool);
        setValue("projectRepoUrl", response.project_repo_url);
        setValue("projectStatus", response.project_status);
      } catch (error) {
        console.error('Error fetching project data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [id, setValue]);

  const handleChange = (field: string, value: string | string[] | number | null | Date) => {
    if (field === 'projectStartAt' || field === 'projectDeadline') {
      value = value ? dayjs(value as Date).toDate() : null;
    }
    if (field === 'teamSize') {
      value = Number(value);
    }
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      return updatedData;
    });
    setValue(field as keyof ProjectData, value, { 
      shouldValidate: true 
    });
  };

  const onSubmit: SubmitHandler<ProjectData> = async (data) => {
    setIsLoading(true);
    const payload : UpdateProjectRequest = {
      project_name: data.projectName,
      project_tech: formData.projectTech,
      project_startat: formData.projectStartAt ? format(new Date(formData.projectStartAt), 'yyyy-MM-dd') : '',
      project_deadline: formData.projectDeadline ? format(new Date(formData.projectDeadline), 'yyyy-MM-dd') : '',
      project_lead: data.projectLead,
      team_size: data.teamSize,
      project_client: data.projectClient,
      project_management_tool: data.projectManagementTool,
      project_management_url: data.projectManagementUrl,
      project_description: data.projectDescription,
      project_repo_tool: data.projectRepoTool,
      project_repo_url: data.projectRepoUrl,
      project_status: data.projectStatus,
      updated_by: userProfile?.fname || "",
    };
    try {
      await ProjectManagementService.putApiProjectUpdate(parseInt(id as string),payload)
      toast.success("Data updated successful!");
      navigate('/dashboard/projects');
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
    <div className="main-container d-flex flex-column">
      <div className="common-class d-flex justify-content-start">
        <Breadcrumb projectName={formData.projectName} />
      </div>
      <div className="container mt-5 mb-2">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {formData ? (
              <form onSubmit={handleSubmit(onSubmit)} className="form-div p-4 rounded shadow">
                <h2 className="text-center mb-4">Update Project</h2>
                <div className="input-div-main d-flex mb-2 justify-content-between w-full">
                  <Input
                    label="Project Name" 
                    type="text"
                    variant="outlined" 
                    name="projectName"
                    value={formData.projectName}
                    register={register}
                    error={errors.projectName}
                    onChange={(e) => handleChange('projectName', e.target.value)}
                  />
                  <Input
                    label="Project Lead"
                    type="text" 
                    variant="outlined"    
                    name="projectLead"
                    register={register}
                    error={errors.projectLead}
                    value={formData.projectLead}
                    onChange={(e) => handleChange('projectLead', e.target.value)}
                  />
                </div>
                <Autocomplete
                  multiple
                  fullWidth
                  value={formData?.projectTech || []}
                  options={filteredTechOptions}
                  onChange={(_e, newValue) => {
                    handleChange('projectTech', newValue);
                    setValue('projectTech', newValue);
                  }}
                  inputValue={techSearch}
                  onInputChange={(_e, newInputValue) => setTechSearch(newInputValue)}
                  className="mb-4"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...register("projectTech")}
                      label="Project Technologies"
                      name="projectTech"
                    />
                  )}
                  getOptionLabel={(option) => option}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DateRangePicker']}>
                    <DateRangePicker
                      value={[dayjs(formData.projectStartAt),dayjs(formData.projectDeadline)]}
                      slotProps={{
                        textField: ({position}) => ({
                          error: position === 'start' 
                            ? !!errors.projectStartAt 
                            : !!errors.projectDeadline,
                          helperText: position === 'start' 
                            ? errors.projectStartAt?.message 
                            : errors.projectDeadline?.message,
                        })
                      }}
                      onChange={(newValue: DateRange<dayjs.Dayjs> ) => {
                        if (newValue !== null) {
                          const [start, end] = newValue;
                          const startDate = start ? start.toDate() : null;
                          const endDate = end ? end.toDate() : null;
                          handleChange('projectStartAt', startDate);
                          handleChange('projectDeadline', endDate);
                        }
                      }}
                      localeText={{
                        start: 'Project Start Date',
                        end: 'Project Deadline',
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <div className="input-div-main d-flex d-flex justify-content-between w-full">
                  <Input
                    label="Project Client"
                    type="text"
                    variant="outlined" 
                    name="projectClient"
                    register={register}
                    error={errors.projectClient}
                    value={formData.projectClient}
                    onChange={(e) => handleChange('projectClient', e.target.value)}
                  />
                  <Autocomplete
                    fullWidth={true}
                    value={formData.projectManagementTool}
                    onChange={(_e, newValue) => {
                      handleChange('projectManagementTool', newValue as string);
                      setToolSearch(newValue as string);
                    }}
                    onInputChange={(_e, newInputValue) => {
                      setToolSearch(newInputValue);
                    }}
                    className='autocomplete-feild'
                    options={filteredToolOptions}
                    renderInput={(params) => <TextField {...params} {...register("projectManagementTool")} label="Project Management Tool" name="projectManagementTool"
                      error={!!errors.projectManagementTool} helperText={errors.projectManagementTool?.message}/>}
                    getOptionLabel={(option) => option}
                  />
                </div>
                <Input
                  label="Project Management URL"
                  type="text"
                  variant="outlined"
                  name="projectManagementUrl"
                  value={formData.projectManagementUrl}
                  register={register}
                  error={errors.projectManagementUrl}
                  onChange={(e) => handleChange('projectManagementUrl', e.target.value)}
                  className="mb-2 mt-2"
                />
                <Input
                  label="Project Description"
                  type="text"
                  variant="outlined"
                  name="projectDescription"
                  value={formData.projectDescription}
                  register={register}
                  error={errors.projectDescription}
                  multiline={true}
                  rows={3}
                  onChange={(e) => handleChange('projectDescription', e.target.value)}
                  className="mb-2"
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
                  className="mb-2"
                />
                <div className="add-input-div d-flex d-flex mb-2 justify-content-between w-full">
                  <Input
                    label="Project Repo Tool" 
                    type="text"
                    variant="outlined" 
                    name="projectRepoTool"
                    register={register}
                    error={errors.projectRepoTool}
                    value={formData.projectRepoTool}
                    onChange={(e) => handleChange('projectRepoTool', e.target.value)}
                    className="mb-2"
                  />
                  <FormControl  className="select-box mb-2" error={!!errors.teamSize}>
                    <InputLabel>Team Size</InputLabel>
                    <Select
                      className="mb-2"
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
                  <FormControl  className="select-box mb-2" error={!!errors.projectStatus}>
                    <InputLabel>Project Status</InputLabel>
                    <Select
                      className="mb-2"
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
                </div>
                <div className="add-btn d-flex justify-content-between">    
                  <Button text="Back" type="button" className="back-btn" onClick={()=>{navigate("/dashboard/projects")}}/>
                  <Button type="submit" text={isLoading ? 'Updating...' : 'Update Project'} disabled={isLoading}/>
                </div>
              </form>
            ) : (
              <p>Loading project data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
