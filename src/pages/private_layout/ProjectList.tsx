import React from "react";
import { useEffect, useState } from "react";
import { InputAdornment, Paper, Tooltip, tooltipClasses } from "@mui/material";
import { DataGrid, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { FilterDataProp, RowData } from "../../interfaces";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import { getToken } from "../../services/storage.service";
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
// import AlertDialogSlide from "../../components/AlertDialogSlide";

const ProjectList = () => {
  const [rows, setRows] = useState<RowData[]>([]); 
  // const [open, setOpen] = React.useState(false);
  // const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate= useNavigate();
  const [columns] = useState([
    {
      field: "id",
      headerName: "Serial No.",
      width: 90,
      sortable: true,
      value: "1"
    },
    { field: "project_name", headerName: "Project Name", width: 150 },
    { field: "project_tech", headerName: "Technology", width: 150, 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // renderCell: (params: any) => {
      //   const techArray = params.value;
      //   return JSON.parse(techArray).join(', ')
      // },
    },
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
        
        // const handleDelete = (projectId:string) => {
        //   setOpen(true);
        //   setSelectedProjectId(projectId);
        //   console.log("Delete project", params.row.id);
        // };

        const confirmDelete = () => {
          const userConfirmed = window.confirm("Are you sure you want to delete this project?");
          if (userConfirmed) {
            console.log("Delete confirmed for project", params.row.id);
            fetch(`http://localhost/truck_management/api/project/delete/${params.row.id}`, { method: "DELETE" })
              .then((response) => {
                if (response.ok) {
                  console.log("Project deleted successfully");
                  fetchData();
                } else {
                  console.error("Failed to delete project");
                }
              })
              .catch((error) => {
                console.error("Error deleting project:", error);
              });
          } else {
            console.log("Delete action canceled");
          }
        };

        // const handleClose= ()=>{
        //   setOpen(false);
        // }

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
              <IconButton color="error" onClick={()=>confirmDelete()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
              {/* <AlertDialogSlide
                open={open}
                onClose={handleClose}
                title="Delete Project"
                content="Are you sure you want to delete this project?"
                actions={[
                  { label: 'Cancel', onClick: handleClose },
                  { label: 'Yes', onClick: confirmDelete },
                ]}
              /> */}
          </div>
        );
      },
    }
  ]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("limit") || "5"),
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
    const sort = sortModel[0]?.field || "project_name";
    const order = sortModel[0]?.sort || "asc";

    try {
      const url = new URL("http://localhost/truck_management/api/project/list");
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
      const token= getToken();
      const response = await fetch(url,{
        method:'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
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
      sort: sortModel[0]?.field || "project_name",
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
    <div className="vh-100 d-flex" style={{overflow:'hidden'}}>
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column justify-content-center align-items-center w-full">
          <div className="d-flex justify-content-start" style={{width:'91%', marginTop: '29px'}}>
            <Breadcrumb/>
          </div>
        <div className="w-full align-items-center w-full" style={{width: '93vw', zIndex: '0',
          marginLeft: '55px', marginTop: '25px', backgroundColor:'#f0f0f0', padding:'15px 24px', borderRadius:'15px'}}>
          <div className="d-flex justify-content-between w-full align-items-center">
            <div className="d-flex">
              <h2 className="my-4">Project Listing</h2>
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
                  <Input
                    type="text"
                    name="search"
                    placeholder="Search Projects"
                    label=""
                    value={search}
                    onChange={handleSearchChange}
                    register={null}
                    error={null}
                    sx={{

                      '& .MuiOutlinedInput-root': {
                        ...(searchError && {
                          '& fieldset': {
                            borderColor: 'error.main',
                          },
                        }),
                      },
                    }}
                    style={{width:'100%'}}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
                  {/* <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28" style={{
                    position:'absolute', right:'354px', top:'43px', zIndex:'1'
                  }}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#7E7E7E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> */}
              </div>
              <div className="btn bg-light d-flex ms-3 align-items-center" onClick={() => setSidebarOpen(true)} style={{borderRadius:'8px', padding:'7px 27px', marginRight:'10px', boxShadow:'0px 20px 60px 0px rgba(0, 0, 0, 0.2)'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" fill="none"><path d="M1.667.311C1.2.41.813.774.662 1.255.603 1.443.6 1.493.6 2.187c0 .682.004.746.059.921.089.281.232.48.545.757l2.329 2.022 2.054 1.78.013 2.546c.013 2.54.014 2.547.071 2.689.211.512.731.772 1.267.632.189-.049 2.798-1.09 2.943-1.174.154-.089.351-.311.434-.488l.072-.152.013-2.026.013-2.026 2.04-1.768c1.122-.973 2.17-1.883 2.329-2.023.327-.289.469-.485.559-.769.055-.175.059-.239.059-.921 0-.694-.003-.744-.062-.932a1.36 1.36 0 0 0-1.024-.946c-.183-.038-.855-.042-6.333-.04-5.317.002-6.152.007-6.314.042M13.92 2.199v.466L11.631 4.65C10.372 5.741 9.3 6.686 9.249 6.75a1.514 1.514 0 0 0-.251.437c-.048.126-.051.238-.059 2.055l-.008 1.922-.912.365c-.502.2-.921.364-.932.364-.01 0-.022-1.029-.026-2.286-.008-2.18-.011-2.293-.059-2.42a1.514 1.514 0 0 0-.251-.437c-.051-.064-1.123-1.009-2.382-2.1L2.08 2.665v-.932h11.84v.466" fill="#000"/></svg>
                <button className="text-black" type="button" style={{borderColor:'transparent', backgroundColor:'transparent'}}>Filter</button>
              </div>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28" style={{
                position:'absolute', right:'152px', top:'43px', zIndex:'1'
              }}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 14H12M12 14H14M12 14V16M12 14V12" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"></path> <path d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z" stroke="#ffffff" stroke-width="1.5"></path> </g></svg>
              <Button text={"Add Projects"} type={'button'} onClick={handleNavigateToAddProjects}
                sx={{
                  padding: '11px 15px', 
                  fontSize: '12px', 
                  display: 'flex', 
                  width: '170px !important', 
                  alignItems: 'center',
                  position: 'relative',
                  paddingLeft: '34px'
                }}
              />
            </div>
          </div>
          <Paper sx={{ width: "100%", overflow:'auto', maxHeight:'68vh' }}>
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
                pageSize: newModel.pageSize || 5,
              })}
              onSortModelChange={(newModel) => setSortModel(newModel)}
              paginationModel={{
                page: paginationModel.page - 1,
                pageSize: paginationModel.pageSize
              }}
              pageSizeOptions={[5, 10, 15]}
              sx={{ border: 0 }}
            />
          </Paper>
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
      </div>
    </div>
  );
}

export default ProjectList
