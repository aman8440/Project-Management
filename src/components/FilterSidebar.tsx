import './filterSidebar.css';
import React, { useCallback } from 'react';
import { FilterDataProp, FilterSidebarProps } from '../interfaces';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { Drawer, FormControl, InputLabel, MenuItem, Select, Box, Autocomplete, TextField } from '@mui/material';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import Button from './Button';
import RestoreIcon from '@mui/icons-material/Restore';
import { toast } from 'react-toastify';
import { GetStatusRequest, ProjectManagementService } from '../swagger/api';
import { format } from 'date-fns';

const PROJECT_MANAGEMENT_TOOLS = [
  'Jira', 'Trello', 'Asana', 'Monday.com', 'Basecamp', 
  'ClickUp', 'Notion', 'Microsoft Project', 'Linear', 
  'Smartsheet', 'Wrike', 'Teamwork', 'Todoist', 
  'ProofHub', 'Zoho Projects', 'Confluence'
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen, onClose, onApply, onReset, filters, setFilters, filterState, setFilterState}) => {
    const {statuses, techOptions, techSearch, showStatusField, showTechField, toolSearch}= filterState;
  const handleFilterChange = useCallback((key: keyof FilterDataProp, value: FilterDataProp[keyof FilterDataProp]) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  }, [setFilters]);
  
  const applyFilters = () => {
    setFilters(filters);
    onApply(filters);
    onClose();
  };

  const resetFilters = () => {
    const resetState: FilterDataProp = {
      projectStartAt: null,
      projectDeadline: null,
      projectStatus: '',
      projectTech: [],
      projectManagementTool: ''
    };
    setFilters(resetState);
    onReset();
  };

  const closeSidebar = () => {
    onClose();
  };

  const fetchStatuses = async (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      try {
        const data : GetStatusRequest ={
          project_startat: format(new Date(startDate), 'yyyy-MM-dd'),
          project_deadline: format(new Date(endDate), 'yyyy-MM-dd')
        };
        const response = await ProjectManagementService.postApiProjectStatus(data);
        const statusArray = response.data ? Object.values(response.data) : [];
        setFilterState({
          ...filterState,
          statuses:statusArray,
          showStatusField:true
        })
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    }
  };

  const fetchTechnologies = async (project_status: string) => {
    if (project_status) {
      try {
        const response = await ProjectManagementService.postApiProjectTech({project_status});
        const technologies = Object.values(response.data);
        setFilterState({
          ...filterState,
          techOptions:technologies,
          showTechField:true
        })
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    }
  };

  const filteredTechOptions = techOptions.filter((tech) =>
    tech.toLowerCase().includes(techSearch.toLowerCase())
  );

  const filteredToolOptions = PROJECT_MANAGEMENT_TOOLS.filter(tool =>
    (tool || "").toLowerCase().includes((toolSearch || "").toLowerCase())
  );
  return (
    <Drawer anchor="right" className='filter-drawer' open={isOpen} onClose={onClose}>
      <Box className="filter-box">
        <div className="d-flex w-full justify-content-between my-3 mb-5">
          <h4 className='mt-1'>Filters</h4>
          <Button
            type="button"
            text="Reset"
            className='reset-btn align-self-start'
            onClick={resetFilters}
            startIconPass={<RestoreIcon />}
          />
        </div>
        <div className="filter-field d-flex flex-column justify-content-between filter-sidebar">
          <div className="d-flex flex-column align-items-start ">
            <div className="heading d-flex justify-content-between w-100">
              <h4 className='fs-6'>Project Start Date</h4>
              <h4 className='deadline-date fs-6 d-flex justify-content-start'>Project Deadline</h4>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                value={[
                  filters.projectStartAt ? dayjs(filters.projectStartAt) : null,
                  filters.projectDeadline ? dayjs(filters.projectDeadline) : null,
                ]}
                onChange={(newValue: DateRange<dayjs.Dayjs> | null) => {
                  if (newValue) {
                    const [start, end] = newValue;
                    const startDate = start ? start.toDate() : null;
                    const endDate = end ? end.toDate() : null;
                    if (start && end && start.isAfter(end)) {
                      toast.warning("Start date cannot be after the end date.");
                      return;
                    }
                    handleFilterChange('projectStartAt', startDate);
                    handleFilterChange('projectDeadline', endDate);
                    fetchStatuses(startDate, endDate);
                  }
                }}
                localeText={{
                  start: 'MM/DD/YYYY',
                  end: 'MM/DD/YYYY',
                }}
              />
            </LocalizationProvider>
            {showStatusField && (
              <FormControl fullWidth sx={{ marginTop: 3 }}>
                <InputLabel>Project Status</InputLabel>
                <Select
                  value={filters.projectStatus || ''}
                  label="Project Status"
                  onChange={(e) => {
                    const selectedStatus = e.target.value;
                    handleFilterChange('projectStatus', selectedStatus);
                    fetchTechnologies(selectedStatus);
                  }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {showTechField && (
              <Autocomplete
                multiple
                fullWidth
                value={filters.projectTech || []}
                options={filteredTechOptions}
                onChange={(_e, newValue) => handleFilterChange('projectTech', newValue)}
                inputValue={techSearch}
                onInputChange={(_e, newInputValue) => setFilterState((prev)=>({
                  ...prev,
                  techSearch:newInputValue
                }))}
                className="mt-4"
                renderInput={(params) => <TextField {...params} label="Project Technologies" />}
                getOptionLabel={(option) => option}
              />
            )}
            <Autocomplete
              fullWidth={true}
              value={filters.projectManagementTool}
              onChange={(_e, newValue) => {
                handleFilterChange('projectManagementTool', newValue);
                setFilterState({
                  ...filterState,
                  toolSearch:newValue ?? ''
                })
              }}
              onInputChange={(_e, newInputValue) => setFilterState((prev)=>({
                ...prev,
                toolSearch:newInputValue
              }))}
              className='mt-3'
              options={filteredToolOptions}
              renderInput={(params) => <TextField {...params} label="Project Management Tool" name="projectManagementTool" />}
              getOptionLabel={(option) => option}
            />
          </div>
          <Box className="action-btn">
            <Button
              type="button"
              text="Cancel"
              onClick={closeSidebar}
              className="cancel-btn w-full"
            />
            <Button type="button" text="Apply" className='w-full' onClick={applyFilters} />
          </Box>
        </div>
      </Box>
    </Drawer>
  );
};

export default FilterSidebar;
