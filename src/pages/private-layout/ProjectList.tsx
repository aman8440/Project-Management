import './projectList.css'
import React from "react";
import { useEffect, useState } from "react";
import { InputAdornment, Paper, TextField, Tooltip, tooltipClasses } from "@mui/material";
import { DataGrid, GridSortDirection, GridSortModel, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import { FilterDataProp, RowData } from "../../interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Button from "../../components/Button";
import FilterSidebar from "../../components/FilterSidebar";
import { format } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import AlertDialogSlide from "../../components/AlertDialogSlide";
import { constVariables } from "../../constants";
import { toast } from 'react-toastify';

function CustomToolbar() {
  return (
    <div className="custom-toolbar d-flex w-full">
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    </div>
  );
}

const ProjectList = () => {
  const [rows, setRows] = useState<RowData[]>([]); 
  const [rowToDelete, setRowToDelete] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("limit") || "10"),
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: searchParams.get("sort") || "id",
      sort: (searchParams.get("order") as GridSortDirection) || "asc",
    },
  ]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchError, setSearchError] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState<FilterDataProp>({
    projectStartAt: null,
    projectDeadline: null,
    projectStatus: '',
    projectTech: []
  });

  const navigate= useNavigate();
  const [columns] = useState([
    { field: "id", headerName: "Serial No.", width: 90, sortable: true, value: "1" },
    { field: "project_name", headerName: "Project Name", width: 150 },
    { field: "project_tech", headerName: "Technology", width: 150 },
    { field: "project_startat", headerName: "Start Date", width: 120 },
    { field: "project_deadline", headerName: "Deadline", width: 120 },
    { field: "project_lead", headerName: "Lead", width: 120 },
    { field: "team_size", headerName: "Team Size", width: 120 },
    { field: "project_client", headerName: "Client", width: 120 },
    { field: "project_management_tool", headerName: "ProjecT Tool", width: 120 },
    { field: "project_management_url", headerName: "Project Url", width: 120 },
    { field: "project_description", headerName: "Project Description", width: 120 },
    { field: "project_repo_tool", headerName: "Repo Tool", width: 120 },
    { field: "project_repo_url", headerName: "Repo Url", width: 120 },
    { field: "project_status", headerName: "Status", width: 120 },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderCell: (params:any) => {
        const handleView = () => {
          navigate(`/dashboard/projects/${params.row.id}`);
        };
        const handleEdit = () => {
          navigate(`/dashboard/projects/edit/${params.row.id}`);
        };
        return (
          <div>
            <Tooltip title="View More" arrow>
              <IconButton color="primary" onClick={handleView}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit" arrow>
              <IconButton color="secondary" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <IconButton color="error" onClick={()=>handleDeleteClick(params.row.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    }
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = (row:any) => {
    setRowToDelete(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRowToDelete(null);
  };

  const confirmDelete = () => {
    fetch(`${constVariables.base_url}api/project/delete/${rowToDelete}`, { 
      method: "DELETE" 
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Project deleted successfully!");
          fetchData();
        } else {
          console.error("Failed to delete project");
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      }).finally(() => {
        handleClose();
      });
  };

  const handleApplyFilters = () => {
    setSidebarOpen(false);
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      projectStartAt: null,
      projectDeadline: null,
      projectStatus: "",
      projectTech: [],
    });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return format(d, 'yyyy-MM-dd');
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

  const fetchData = async () => {
    const { page, pageSize } = paginationModel;
    const sort = sortModel[0]?.field || "id";
    const order = sortModel[0]?.sort || "asc";
    try {
      const url = new URL(`${constVariables.base_url}api/project/list`);
      url.searchParams.append("page", (page).toString());
      url.searchParams.append("limit", (pageSize).toString());
      if (search.length >= 3) {
        url.searchParams.append("search", search);
      }
      url.searchParams.append("sort", sort);
      url.searchParams.append("order", order);
      if (filters.projectStartAt) {
        url.searchParams.append("project_startat", formatDate(filters.projectStartAt.toISOString()));
      }
      if (filters.projectDeadline) {
        url.searchParams.append("project_deadline", formatDate(filters.projectDeadline.toISOString()));
      }
      if (filters.projectStatus) {
        url.searchParams.append("project_status", filters.projectStatus);
      }
      if (filters.projectTech.length > 0) {
        url.searchParams.append("project_tech", filters.projectTech.join(","));
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      updateQueryParams();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rowsWithIndex = result.data.data.map((row: any) => ({
        ...row,
        // id: (page - 1) * pageSize + index + 1
      }));
      setRows(rowsWithIndex);
      setTotalRows(result.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateQueryParams = () => {
    const filterParams: Record<string, string> = {};
    if (filters.projectStartAt) {
      filterParams.project_start_at = formatDate(filters.projectStartAt.toISOString());
    }
    if (filters.projectDeadline) {
      filterParams.project_deadline = formatDate(filters.projectDeadline.toISOString());
    }
    if (filters.projectStatus) {
      filterParams.project_status = filters.projectStatus;
    }
    if (filters.projectTech.length > 0) {
      filterParams.project_tech = filters.projectTech.join(","); 
    }
    setSearchParams({
      page: paginationModel.page.toString(),
      limit: paginationModel.pageSize.toString(),
      search: search,
      sort: sortModel[0]?.field || "id",
      order: sortModel[0]?.sort || "asc",
      ...filterParams,
    });
  };

  const handleNavigateToAddProjects = () => {
    navigate('/dashboard/projects/add-projects');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowDoubleClick = (param:any) => {
    navigate(`/dashboard/projects/${param.row.id}`);
  };

  useEffect(() => {
    updateQueryParams();
    fetchData();
  }, [paginationModel, sortModel, search]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-full">
      <div className="d-flex justify-content-start breadcrum-position">
        <Breadcrumb/>
      </div>
      <div className="w-full align-items-center w-full list-container">
        <div className="d-flex justify-content-between w-full align-items-start mb-4">
          <div className="d-flex">
            <h2 className="heading mt-2">Projects</h2>
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
                  placeholder="Search Projects"
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
            <Button text={"Filter"} type={'button'} className='filter-btn' onClick={() => setSidebarOpen(true)}
              startIconPass={<FilterAltOutlinedIcon />}
            />
            <Button text={"Add Projects"} type={'button'} className='add-project-btn' onClick={handleNavigateToAddProjects}
              startIconPass={<CreateNewFolderOutlinedIcon />}
            />
          </div>
        </div>
        <Paper>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            paginationMode="server"
            sortingMode="server"
            checkboxSelection
            onRowDoubleClick={handleRowDoubleClick}
            onPaginationModelChange={(newModel) => setPaginationModel({
              page: newModel.page + 1,
              pageSize: newModel.pageSize || 10,
            })}
            onSortModelChange={(newModel) => setSortModel(newModel)}
            paginationModel={{
              page: paginationModel.page - 1,
              pageSize: paginationModel.pageSize
            }}
            pageSizeOptions={[10, 15, 20]}
            sx={{ border: 0 }}
            slots={{
              toolbar: CustomToolbar,
            }}
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
      <FilterSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}

export default ProjectList;
