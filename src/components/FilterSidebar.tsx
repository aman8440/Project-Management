import React, { useState, useCallback } from 'react';
import { FilterDataProp, FilterSidebarProps } from '../interfaces';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { Drawer, FormControl, InputLabel, MenuItem, Select, Box, Autocomplete, TextField } from '@mui/material';
import { DateRange } from '@mui/x-date-pickers-pro/models';
import Button from './Button';

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters
}) => {
  const [localFilters, setLocalFilters] = useState<FilterDataProp>(filters);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [techOptions, setTechOptions] = useState<string[]>([]);
  const [techSearch, setTechSearch] = useState('');
  const [showStatusField, setShowStatusField] = useState(false);
  const [showTechField, setShowTechField] = useState(false);

  const handleFilterChange = useCallback((key: keyof FilterDataProp, value: FilterDataProp[keyof FilterDataProp]) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
    setFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  }, [setFilters]);
  
  const applyFilters = () => {
    setFilters(localFilters);
    onApply(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const resetState: FilterDataProp = {
      projectStartAt: null,
      projectDeadline: null,
      projectStatus: '',
      projectTech: []
    };
    setLocalFilters(resetState);
    setFilters(resetState);
    setStatuses([]);
    setTechOptions([]);
    setTechSearch('');
    setShowStatusField(false);
    setShowTechField(false);
    onReset();
  };

  const closeSidebar = () => {
    setShowStatusField(false);
    setShowTechField(false);
    onClose();
  };

  const fetchStatuses = async (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      try {
        const data ={
          project_startat: startDate,
          project_deadline: endDate
        };
        const response = await fetch('http://localhost/truck_management/api/project/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const res = await response.json();
        setStatuses(res.data);
        setShowStatusField(true);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    }
  };

  const fetchTechnologies = async (project_status: string) => {
    if (project_status) {
      try {
        const response = await fetch('http://localhost/truck_management/api/project/tech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_status }),
        });
        const data = await response.json();
        const technologies = Object.values(data.data);
        setTechOptions(technologies as string[]);
        setShowTechField(true);
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    }
  };

  const filteredTechOptions = techOptions.filter((tech) =>
    tech.toLowerCase().includes(techSearch.toLowerCase())
  );
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 400, padding: 2 }}>
        <div className="d-flex w-full justify-content-between my-3 mb-5">
          <h4 className='mt-1'>Filters</h4>
          <Button
              type="button"
              text="Reset"
              className='align-self-start '
              onClick={resetFilters}
            />
        </div>
        <div className="d-flex flex-column justify-content-between" style={{height:'calc(100vh - 142px)'}}>
          <div className="d-flex flex-column align-items-start ">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker
                value={[
                  localFilters.projectStartAt ? dayjs(localFilters.projectStartAt) : null,
                  localFilters.projectDeadline ? dayjs(localFilters.projectDeadline) : null,
                ]}
                onChange={(newValue: DateRange<dayjs.Dayjs> | null) => {
                  if (newValue) {
                    const [start, end] = newValue;
                    const startDate = start ? start.toDate() : null;
                    const endDate = end ? end.toDate() : null;
                    if (start && end && start.isAfter(end)) {
                      alert('Start date cannot be after the end date.');
                      return;
                    }
                    handleFilterChange('projectStartAt', startDate);
                    handleFilterChange('projectDeadline', endDate);
                    fetchStatuses(startDate, endDate);
                  }
                }}
                localeText={{
                  start: 'Project Start Date',
                  end: 'Project Deadline',
                }}
              />
            </LocalizationProvider>
            {showStatusField && (
              <FormControl fullWidth sx={{ marginTop: 3 }}>
                <InputLabel>Project Status</InputLabel>
                <Select
                  value={localFilters.projectStatus || ''}
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
                value={localFilters.projectTech || []}
                options={filteredTechOptions}
                onChange={(e, newValue) => handleFilterChange('projectTech', newValue)}
                inputValue={techSearch}
                onInputChange={(e, newInputValue) => setTechSearch(newInputValue)}
                className="mt-4"
                renderInput={(params) => <TextField {...params} label="Project Technologies" />}
                getOptionLabel={(option) => option}
              />
            )}
          </div>
          <Box sx={{ marginTop: 2, display:'flex', justifyContent:'space-between', width:'100%' }}>
            <Button type="button" text="Apply" className='w-full' onClick={applyFilters} />
            <Button
              type="button"
              text="Cancel"
              onClick={closeSidebar}
              className="w-full"
            />
          </Box>
        </div>
      </Box>
    </Drawer>
  );
};

export default FilterSidebar;
