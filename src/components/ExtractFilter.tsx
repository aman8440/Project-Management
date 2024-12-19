import './filterSidebar.css';
import React, { useCallback } from 'react';
import { ExtractFilterDataProp, ExtractFilterProps } from '../interfaces';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Drawer, FormControl, InputLabel, MenuItem, Select, Box } from '@mui/material';
import Button from './Button';
import RestoreIcon from '@mui/icons-material/Restore';
import { toast } from 'react-toastify';
import { DateTimePicker } from '@mui/x-date-pickers';
import { DocumentStatusEnum } from '../swagger/api';

const ExtractFilter: React.FC<ExtractFilterProps> = ({
  isOpen, onClose, onApply, onReset, filter, setFilters}) => {

  const handleFilterChange = useCallback((key: keyof ExtractFilterDataProp, value: ExtractFilterDataProp[keyof ExtractFilterDataProp]) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  }, [setFilters]);

  const validateDateRange = (startDate: Date | null, endDate: Date | null): boolean => {
    if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      toast.error("End date must be after start date");
      return false;
    }
    return true;
  };

  const applyFilters = () => {
    if (!validateDateRange(filter.startDateAt as Date, filter.endDateAt as Date)) {
      return;
    }
    if (filter.processing_status && !Object.values(DocumentStatusEnum).includes(filter.processing_status as DocumentStatusEnum)) {
      toast.error("Invalid processing status");
      return;
    }
    setFilters(filter);
    onApply(filter);
    onClose();
  };

  const resetFilters = () => {
    const resetState: ExtractFilterDataProp = {
      processing_status: '',
      extension: '',
      startDateAt: null,
      endDateAt: null,
    };
    setFilters(resetState);
    onReset();
  };

  return (
    <Drawer anchor="right" className='filter-drawer' open={isOpen} onClose={onClose}>
      <Box className="filter-box">
        <div className="d-flex w-full justify-content-between my-3 mb-5">
          <h4 className='mt-1'>Advanced Filters</h4>
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
            <div className="heading w-100">
              <h4 className='fs-6'>Status</h4>
            </div>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter.processing_status || ''}
                label="Select Status"
                onChange={(e) => handleFilterChange('processing_status', e.target.value as DocumentStatusEnum)}
              >
                {Object.values(DocumentStatusEnum).map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="heading w-100 mt-4">
              <h4 className='fs-6'>Extension</h4>
            </div>
            <FormControl fullWidth>
              <InputLabel>Extension</InputLabel>
              <Select
                value={filter.extension || ''}
                label="Select Extension"
                onChange={(e) => handleFilterChange('extension', e.target.value)}
              >
                {['png', 'jpg', 'pdf'].map((ext) => (
                  <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="heading mt-4">
              <h4 className='fs-6'>Start Date & Time</h4>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
                className="w-100"
                value={filter.startDateAt ? dayjs(filter.startDateAt) : null}
                onChange={(newValue: Dayjs | null) => {
                  if (newValue) {
                    const start = newValue;
                    const startDate = start ? start.toDate() : null;
                    if (validateDateRange(startDate, filter.endDateAt as Date)) {
                      handleFilterChange('startDateAt', startDate);
                    }
                  }
                }}
                slotProps={{
                  textField: {
                    placeholder: 'MM/DD/YYYY HH:MM',
                  },
                }}
              />
            </LocalizationProvider>
            <div className="heading mt-4">
              <h4 className='fs-6'>End Date & Time</h4>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
                className="w-100"
                value={filter.endDateAt ? dayjs(filter.endDateAt) : null}
                onChange={(newValue: Dayjs | null) => {
                  if (newValue) {
                    const end = newValue;
                    const endDate = end ? end.toDate() : null;
                    if (validateDateRange(filter.startDateAt as Date, endDate)) {
                      handleFilterChange('endDateAt', endDate);
                    }
                    handleFilterChange('endDateAt', endDate);
                  }
                }}
                slotProps={{
                  textField: {
                    placeholder: 'MM/DD/YYYY HH:MM',
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <Box className="action-btn">
            <Button
              type="button"
              text="Cancel"
              onClick={onClose}
              className="cancel-btn w-full"
            />
            <Button type="button" text="Apply" className='w-full' onClick={applyFilters} />
          </Box>
        </div>
      </Box>
    </Drawer>
  );
};

export default ExtractFilter;
