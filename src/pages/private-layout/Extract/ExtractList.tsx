import '../projectList.css';
import { DataGrid, GridSortDirection, GridSortModel } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { ExtractFilterDataProp, ExtractFilterState, RowData } from '../../../interfaces';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useLoader } from '../../../hooks/loaderContext';
import { Avatar, IconButton, InputAdornment, Paper, TextField, Tooltip, tooltipClasses, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel'
import TuneIcon from '@mui/icons-material/Tune';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DocumentDeleteRequest, DocumentEndpointsService, DocumentStatusEnum } from '../../../swagger/api';
import Button from '../../../components/Button';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AlertDialogSlide from '../../../components/AlertDialogSlide';
import { toast } from 'react-toastify';
import EditIcon from "@mui/icons-material/Edit";
import ExtractFilter from '../../../components/ExtractFilter';
import React from 'react';

const convertDate = (dateString: string | null) => {
  const date = new Date(dateString as string);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getRandomColor = () => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ExtractList = () => {
  const [rows, setRows] = useState<RowData[]>([]); 
  const [open, setOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<string[]>([]); 
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageNumber: parseInt(searchParams.get("pageNumber") || "0"),
    size: parseInt(searchParams.get("size") || "20"),
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: searchParams.get("sortColumn") || "document_name",
      sort: (searchParams.get("sortDirection") as GridSortDirection) || "asc",
    },
  ]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  let [searchText] = useDebounce(search, 300);
  const [searchError, setSearchError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterState, setFilterState] = useState<ExtractFilterState>({
    visibleFilter: false,
    selectedStatus: '',
    selectedExtension: '',
    selectedStartDate: null,
    selectedEndDate: null
  })
  const [filters, setFilters] = useState<ExtractFilterDataProp>({
    processing_status: '',
    extension: '',
    startDateAt: null,
    endDateAt: null,
  });

  const { setLoading } = useLoader();
  const navigate= useNavigate();
  const [columns] = useState([
    { field: "document_name", headerName: "Document File Name", width: 160, sortable: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderCell: (params:any) => (
        <div className='avatar-document-name d-flex align-items-center'>
          <Avatar sx={{ bgcolor: getRandomColor() }}>
            {params.value[0].toUpperCase()}
          </Avatar>
          <Typography ml={2}>{params.value}</Typography>
        </div>
      ),
     },
    { field: "id", headerName: "Document ID", width: 140 },
    { field: "processing_status", headerName: "Status", width: 140,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderCell: (params:any) => (
        <div className='d-flex align-items-center'>
          <FiberManualRecordIcon sx={{ color: 'green', fontSize: 12, marginRight: 1 }} />
          {params.value}
        </div>
      ),
     },
    { field: "extension", headerName: "Extension", width: 140 },
    { field: "is_data_published", headerName: "Is Data Published", width: 140,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ),
     },
    { field: "is_template", headerName: "Is template", width: 130,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ),
     },
    { field: "is_template_apply", headerName: "Is Template Apply", width: 130,
      renderCell: (params) => (
        params.value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />
      ),
     },
    { field: "template", headerName: "Template Name", width: 140,
      renderCell: (params) => params.row.template?.name || ""
     },
    { field: "document_path", headerName: "Document Path", width: 140 },
    { field: "created_at", headerName: "Created At", width: 140,
      renderCell: (params) => (
        <span>{new Date(params.value).toUTCString()}</span>
      ),
     },
    { field: "updated_at", headerName: "Updated At", width: 140,
      renderCell: (params) => (
        <span>{new Date(params.value).toUTCString()}</span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 80,
      renderCell: (params) => {
        const handleEdit = () => {
          navigate(`/extract/edit/${params.row.id}`);
        };
        return (
          <div>
            <Tooltip title="Edit" arrow>
              <IconButton color="secondary" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    }
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedRows([]);
  };

  const handleDeleteClick = () => {
    setOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("No rows selected for deletion!");
      return;
    }
    const deleteRequest: DocumentDeleteRequest = {
      document_ids: selectedRows,
    };
    DocumentEndpointsService.deleteDocumentsApiV1DocumentDelete(deleteRequest)
      .then((response) => {
        if (response.status === "SUCCESS") {
          toast.success("Selected rows deleted successfully!");
          fetchData();
          setSelectedRows([]);
        } else {
          toast.error("Failed to delete the selected rows.");
        }
      })
      .catch((error) => {
        console.error("Error deleting rows:", error);
        toast.error("An error occurred while deleting the rows.");
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleApplyFilters = () => {
    setSidebarOpen(false);
    fetchData();
    const hasValidFilter = Object.values(filters).some(
      value => value && (!(Array.isArray(value)) || value.length > 0)
    );
    const isField = !!( filters.processing_status || filters.extension || filters.startDateAt || filters.endDateAt
    )
    if(isField){
      setFilterState({
        ...filterState,
        visibleFilter:hasValidFilter,
        selectedStatus:filters.processing_status ?? '',
        selectedExtension:filters.extension ?? '',
        selectedStartDate: filters.startDateAt ?? null,
        selectedEndDate: filters.endDateAt ?? null
      })
    }
    else{
      setFilterState({
        ...filterState,
        visibleFilter:hasValidFilter,
        selectedStatus:'',
        selectedExtension: '',
        selectedStartDate:null,
        selectedEndDate: null
      })
    }
  };

  const handleResetFilters = () => {
    setFilters({
      processing_status: '',
      extension: '',
      startDateAt: null,
      endDateAt: null,
    });
    setSidebarOpen(false);
    setSearchParams({
      pageNumber: paginationModel.pageNumber.toString(),
      size: paginationModel.size.toString(),
      searchText: searchText.trim(),
      sortColumn: sortModel[0]?.field || "document_name",
      sortDirection: sortModel[0]?.sort || "asc",
    })
    filters.startDateAt = null;
    filters.endDateAt = null;
    filters.processing_status = "";
    filters.extension = "";
    fetchData();
    setFilterState({
      ...filterState,
      visibleFilter:false,
      selectedStatus:'',
      selectedExtension: '',
      selectedStartDate:null,
      selectedEndDate: null
    })
  };

  const removeFilter = (filterKey: keyof ExtractFilterState) => {
    switch(filterKey) {
      case 'selectedStatus':
        filterState.selectedStatus = '';
        filters.processing_status = '';
        break;
      case 'selectedExtension':
        filterState.selectedExtension = '';
        filters.extension = '';
        break;
      case 'selectedStartDate':
        filterState.selectedStartDate = null;
        filters.startDateAt = null;
        break;
      case 'selectedEndDate':
        filterState.selectedEndDate = null;
        filters.endDateAt = null;
        break;
    }
    type FilterKeys = 'selectedStatus' | 'selectedExtension' | 'selectedStartDate' | 'selectedEndDate';
    const relevantKeys: FilterKeys[] = ['selectedStatus', 'selectedExtension', 'selectedStartDate', 'selectedEndDate'];
    const hasActiveFilters = relevantKeys.some(
      key => filterState[key] && filterState[key] !== '' && filterState[key] !== null
    );
    filterState.visibleFilter = hasActiveFilters;
    setFilterState(filterState);
    setFilters(filters);
    const params = new URLSearchParams(searchParams);
    switch(filterKey) {
      case 'selectedStatus':
        params.delete('processingStatus');
        break;
      case 'selectedExtension':
        params.delete('extension');
        break;
      case 'selectedStartDate':
        params.delete('startDate');
        break;
      case 'selectedEndDate':
        params.delete('endDate');
        break;
    }
    setSearchParams(params);
    fetchData();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    if (searchValue.length > 0 && searchValue.length < 3) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }
  };

  const refershFunction = ()=>{
    setFilters({
      processing_status: '',
      extension: '',
      startDateAt: null,
      endDateAt: null,
    });
    setSearchParams({
      pageNumber: "0",
      size: "20",
      sortColumn: "document_name",
      sortDirection: "asc",
    })
    filters.startDateAt = null;
    filters.endDateAt = null;
    filters.processing_status = "";
    filters.extension = "";
    paginationModel.pageNumber = 0;
    paginationModel.size = 20;
    sortModel[0].field = "document_name";
    sortModel[0].sort = "asc";
    searchText = "";
    setSearch(searchText);
    setFilterState({
      ...filterState,
      visibleFilter:false,
      selectedStatus:'',
      selectedExtension: '',
      selectedStartDate:null,
      selectedEndDate: null
    })
    fetchData();
  }

  const fetchData = async (isSearch?:boolean) => {
    const { pageNumber, size } = paginationModel;
    const isSearching = searchText.length >= 3;

    if (!isSearch ) {
      setLoading(true);
    }
    const sortColumn = sortModel[0]?.field || 'document_name';
    const sortDirection = sortModel[0]?.sort || 'asc';
    try {
      let startDate: string | undefined;
      let endDate: string | undefined;
      if (filters.startDateAt instanceof Date && !isNaN(filters.startDateAt.getTime())) {
        startDate = convertDate(filters.startDateAt.toISOString());
      }
      if (filters.endDateAt instanceof Date && !isNaN(filters.endDateAt.getTime())) {
        endDate = convertDate(filters.endDateAt.toISOString());
      }
      const validProcessingStatuses = ['PROCESSING', 'FAILED', 'PROCESSED'];
      const processingStatus = validProcessingStatuses.includes(filters.processing_status as string) 
        ? filters.processing_status as DocumentStatusEnum 
        : undefined;
      const validExtensions = ['pdf', 'png', 'jpg'];
      const extension = validExtensions.includes(filters.extension as string)
        ? filters.extension
        : undefined;
      const orFields: Array<'isTemplate' | 'isTemplateApply'> | undefined = undefined;
      const response = await DocumentEndpointsService.getDocumentsApiV1DocumentDocumentsGet(
        pageNumber,
        size,
        isSearching ? searchText.trim() : undefined,
        sortColumn as string || undefined,
        sortDirection as "asc" | "desc" || undefined,
        orFields,
        startDate,
        endDate as string || undefined,
        processingStatus as DocumentStatusEnum || undefined,
        extension as string || undefined
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      const rowsWithIndex : RowData[] = response.data?.docs?.map((row: any, _index: number) => ({
        ...row,
        // id: (page - 1) * pageSize + index + 1
      })) || [];
      setRows(rowsWithIndex);
      setTotalRows(response.data?.page.totalCount as number);
      updateQueryParams();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };

  const updateQueryParams = () => {
    const filterParams: Record<string, string> = {};
    if (filters.startDateAt) {
      filterParams.startDate = convertDate(filters.startDateAt.toISOString()) as string;
    }
    if (filters.endDateAt) {
      filterParams.endDate = convertDate(filters.endDateAt.toISOString()) as string;
    }
    if (filters.processing_status) {
      filterParams.processingStatus = filters.processing_status;
    }
    if (filters.extension) {
      filterParams.extension = filters.extension;
    }
    setSearchParams({
      pageNumber: paginationModel.pageNumber.toString(),
      size: paginationModel.size.toString(),
      search: searchText.trim(),
      sortColumn: sortModel[0]?.field || "document_name",
      sortDirection: sortModel[0]?.sort || "asc",
      ...filterParams,
    });
  };

  const handleNavigateToAddProjects = () => {
    navigate('/extract/add-extract');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowDoubleClick = (param:any) => {
    navigate(`/extract/${param.row.id}`);
  };
  
  useEffect(() => {
    fetchData(false);
  }, [paginationModel, sortModel]);

  useEffect(() => {
    fetchData(true);
  }, [searchText]); 

  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-full">
      <div className="w-full align-items-center w-full list-container">
        <div className="d-flex justify-content-between w-full align-items-start mb-4">
          <div className="d-flex">
            <h2 className="heading mt-2">Extract</h2>
          </div>
          <div className="d-flex w-full justify-content-between">
            <div className="search-input w-full">
              <Tooltip
                open={searchError}
                title="Please enter at least 3 characters"
                placement="bottom-start"
                slotProps={{
                  popper: {
                    sx: {
                      [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                        {
                          marginTop: '0px',
                        },
                    },
                  },
                }}
              >
                <TextField
                  type="text"
                  name="search"
                  placeholder="Search document..."
                  className='search-project'
                  value={search}
                  onChange={handleSearchChange}
                  sx={{

                    '& .MuiOutlinedInput-root': {
                      ...(searchError && {
                        '& fieldset': {
                          borderColor: 'error.main',
                        },
                      }),
                    },
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Tooltip>
            </div>
            <Button text={"Filter"} type={'button'} onClick={() => setSidebarOpen(true)} className='filter-btn' startIconPass={<TuneIcon />} />
            <Button text={"Refresh"} type={'button'} onClick={() => refershFunction()} className='filter-btn' startIconPass={<RestartAltIcon />} />
            <Button text={"Upload"} type={'button'} className='add-project-btn' onClick={handleNavigateToAddProjects} startIconPass={<UploadFileOutlinedIcon />} />
          </div>
        </div>
        {filterState.visibleFilter && (
          <div className="filters-content d-flex justify-content-between w-full align-items-start">
            <div className="filters-sub-content d-flex">
              <div className="filters-field d-flex">
                {filterState.selectedStatus && (
                  <div className="field-name d-flex justify-content-between w-full">
                    <h4 className='header'>Processing Status: {filters.processing_status}</h4>
                    <span className='icon' onClick={()=>removeFilter('selectedStatus')}><CloseIcon/></span>
                  </div>
                )}
                {filterState.selectedExtension && (
                  <div className="field-name d-flex justify-content-between w-full">
                    <h4 className='header'>Extension: {filters.extension}</h4>
                    <span className='icon' onClick={()=>removeFilter('selectedExtension')}><CloseIcon/></span>
                  </div>
                )}
                {filterState.selectedStartDate && (
                  <div className="field-name d-flex justify-content-between w-full">
                    <h4 className='header'>Start Date: {convertDate((filters.startDateAt)?.toISOString() ?? '')}</h4>
                    <span className='icon' onClick={()=>removeFilter('selectedStartDate')}><CloseIcon/></span>
                  </div>
                )}
                {filterState.selectedEndDate && (
                  <div className="field-name d-flex justify-content-between w-full">
                    <h4 className='header'>End Date: {convertDate((filters.endDateAt)?.toISOString() ?? '')}</h4>
                    <span className='icon' onClick={()=>removeFilter('selectedEndDate')}><CloseIcon/></span>
                  </div>
                )}
              </div>
            </div>
            <div className="filters-btn d-flex">
              <Button text={"Clear All"} type={'button'} className='filter-btn align-self-start' onClick={handleResetFilters} startIconPass={<ClearAllIcon />} />
            </div>
            </div>
          )}
          <Paper>
            <DataGrid
              rows={rows}
              rowHeight={42}
              columns={columns}
              rowCount={totalRows}
              paginationMode="server"
              sortingMode="server"
              checkboxSelection
              onRowDoubleClick={handleRowDoubleClick}
              onPaginationModelChange={(newModel) => setPaginationModel({
                pageNumber: newModel.page,
                size: newModel.pageSize || 20,
              })}
              onSortModelChange={(newModel) => setSortModel(newModel)}
              paginationModel={{
                page: paginationModel.pageNumber,
                pageSize: paginationModel.size
              }}
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={(selectedIds) => setSelectedRows(selectedIds as string[])}
              pageSizeOptions={[10, 20, 30]}
              sx={{ border: 0 }}
            />
          </Paper>
          <AlertDialogSlide
            open={open}
            onClose={handleClose}
            title="Delete Project"
            content="Are you sure you want to delete this project?"
            actions={[
              { label: 'Cancel', onClick: handleClose, color: "secondary" },
              { label: 'Yes', onClick: confirmDelete,  color: "primary"},
            ]}
          />
      </div>
      <ExtractFilter
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        filter={filters}
        onRemoveFilter={removeFilter}
        setFilters={setFilters}
        filterState={filterState}
        setFilterState={setFilterState}
      />
      {selectedRows.length > 0 && (
        <div className='select-info-bar d-flex align-items-center justify-content-between w-full bg-white'>
          <Typography>
            You have selected <b>{selectedRows.length}</b> {selectedRows.length > 1 ? 'files.' : 'file.'}
          </Typography>
          <div className='action-buttons d-flex'>
            <Button
              text={'Cancel'}
              type={'button'}
              className='cancel-button-select'
              startIconPass={<CancelIcon />}
              sx={{ marginRight: 2 }}
              onClick={handleCancel}
              />
            <Button
              text={'Delete'}
              type={'button'}
              className='delete-button-select'
              onClick={handleDeleteClick}
              startIconPass={<DeleteIcon />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ExtractList;
