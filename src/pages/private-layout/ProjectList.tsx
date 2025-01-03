import "./projectList.css";
import React from "react";
import { useEffect, useState } from "react";
import {
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import {
  DataGrid,
  GridSortDirection,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { FilterDataProp, FilterState, RowData } from "../../interfaces";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Button from "../../components/Button";
import FilterSidebar from "../../components/FilterSidebar";
import { format } from "date-fns";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CreateNewFolderOutlinedIcon from "@mui/icons-material/CreateNewFolderOutlined";
import AlertDialogSlide from "../../components/AlertDialogSlide";
import { toast } from "react-toastify";
import { ProjectManagementService } from "../../swagger/api";
import { useLoader } from "../../hooks/loaderContext";
import useDebounce from "../../hooks/useDebounce";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const ProjectList = () => {
  const [rows, setRows] = useState<RowData[]>([]);
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: parseInt(searchParams.get("page") || "0"),
    pageSize: parseInt(searchParams.get("limit") || "15"),
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: searchParams.get("sort") || "id",
      sort: (searchParams.get("order") as GridSortDirection) || "asc",
    },
  ]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  let debouncedSearch = useDebounce(search, 300);
  const [searchError, setSearchError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>({
    visibleFilter: false,
    dependentField: true,
    inDependentField: true,
    statuses: [],
    techOptions: [],
    techSearch: "",
    showStatusField: false,
    showTechField: false,
    toolSearch: "",
  });
  const [filters, setFilters] = useState<FilterDataProp>({
    projectStartAt: null,
    projectDeadline: null,
    projectStatus: "",
    projectTech: [],
    projectManagementTool: "",
  });
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [columns] = useState([
    {
      field: "serial",
      headerName: "Serial No.",
      width: 90,
      sortable: true,
      value: "1",
    },
    { field: "project_name", headerName: "Project Name", width: 150 },
    { field: "project_tech", headerName: "Technology", width: 150 },
    { field: "project_startat", headerName: "Start Date", width: 120 },
    { field: "project_deadline", headerName: "Project Deadline", width: 140 },
    { field: "project_lead", headerName: "Lead", width: 120 },
    { field: "team_size", headerName: "Team Size", width: 120 },
    { field: "project_client", headerName: "Client", width: 120 },
    {
      field: "project_management_tool",
      headerName: "ProjecT Tool",
      width: 120,
    },
    { field: "project_management_url", headerName: "Project Url", width: 120 },
    {
      field: "project_description",
      headerName: "Project Description",
      width: 120,
    },
    { field: "project_repo_tool", headerName: "Repo Tool", width: 120 },
    { field: "project_repo_url", headerName: "Repo Url", width: 120 },
    { field: "project_status", headerName: "Status", width: 120 },
    {
      field: "action",
      headerName: "Action",
      exportable: false,
      width: 180,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderCell: (params: any) => {
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
              <IconButton
                color="error"
                onClick={() => handleDeleteClick(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDeleteClick = (row: any) => {
    setRowToDelete(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRowToDelete(null);
  };

  const CustomToolbar = () => {
    const getFilteredColumns = () => {
      return columns.filter((col) => col.field !== "action");
    };
    const getFilteredColumnsPrint = () => {
      return columns.filter(
        (col) => col.field !== "project_description" && col.field !== "action"
      );
    };
    return (
      <div className="custom-toolbar d-flex w-full">
        <GridToolbarContainer>
          <GridToolbarExport
            csvOptions={{
              fields: getFilteredColumns().map((col) => col.field)
            }}
            printOptions={{
              fields: getFilteredColumnsPrint().map((col) => col.field),
              hideFooter: true,
              hideToolbar: true,
              disableToolbarButton: false,
              allColumns: true,
              pageStyle: `
                @page { size: landscape A3; margin: 0mm; }
                table, th, td {
                  font-size: 10px;
                }
              `,
            }}
          />
        </GridToolbarContainer>
      </div>
    );
  };

  const confirmDelete = () => {
    ProjectManagementService.deleteApiProjectDelete(rowToDelete || 0)
      .then((response) => {
        if (response.status === "success") {
          toast.success("Project deleted successfully!");
          fetchData();
        } else {
          console.error("Failed to delete project");
        }
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleApplyFilters = () => {
    setSidebarOpen(false);
    fetchData();
    const hasValidFilter = Object.values(filters).some(
      (value) => value && (!Array.isArray(value) || value.length > 0)
    );
    const isIndependentField = !!filters.projectManagementTool;
    const isDependentField = !!(
      filters.projectStartAt ||
      filters.projectDeadline ||
      filters.projectStatus ||
      (Array.isArray(filters.projectTech) && filters.projectTech.length > 0)
    );
    setFilterState({
      ...filterState,
      visibleFilter: hasValidFilter,
      dependentField: isDependentField,
      inDependentField: isIndependentField,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      projectStartAt: null,
      projectDeadline: null,
      projectStatus: "",
      projectTech: [],
      projectManagementTool: "",
    });
    setSidebarOpen(false);
    setSearchParams({
      page: paginationModel.page.toString(),
      limit: paginationModel.pageSize.toString(),
      search: debouncedSearch,
      sort: sortModel[0]?.field || "id",
      order: sortModel[0]?.sort || "asc",
    });
    filters.projectStartAt = null;
    filters.projectDeadline = null;
    filters.projectTech = [];
    filters.projectStatus = "";
    filters.projectManagementTool = "";
    fetchData();
    setFilterState({
      ...filterState,
      visibleFilter: false,
      dependentField: false,
      inDependentField: false,
      statuses: [],
      techOptions: [],
      techSearch: "",
      showStatusField: false,
      showTechField: false,
      toolSearch: "",
    });
  };

  const formatDate = (date: string | Date | null) => {
    if (date && typeof date === "string") {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, "yyyy-MM-dd");
      }
    }
    if (date instanceof Date && !isNaN(date.getTime())) {
      return format(date, "yyyy-MM-dd");
    }
    return "";
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    setIsSearch(true);
    if (searchValue.length > 0 && searchValue.length < 3) {
      setSearchError(true);
    } else {
      setSearchError(false);
    }
  };

  const fetchData = async () => {
    const { page, pageSize } = paginationModel;
    if (!isSearch) {
      setLoading(true);
    }
    const sort = sortModel[0]?.field || "id";
    const order = sortModel[0]?.sort || "asc";
    try {
      const formattedStartAt = filters.projectStartAt
        ? format(filters.projectStartAt, "yyyy-MM-dd")
        : undefined;

      const formattedDeadline = filters.projectDeadline
        ? format(filters.projectDeadline, "yyyy-MM-dd")
        : undefined;

      const projectTech = filters.projectTech?.length
        ? filters.projectTech.join(",")
        : undefined;

      const response = await ProjectManagementService.getApiProjectList(
        debouncedSearch.length >= 3 ? debouncedSearch.trim() : undefined,
        sort,
        order,
        page,
        pageSize,
        formattedStartAt,
        formattedDeadline,
        (filters.projectStatus as
          | "Under Planning"
          | "Development Started"
          | "Under Testing"
          | "Deployed on Dev"
          | "Live") || undefined,
        projectTech,
        filters.projectManagementTool || undefined
      );
      const rowsWithIndex: RowData[] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data?.projects?.map((row : any, index : number) => ({
          ...row,
          serial: (page) * pageSize + index + 1
        })) || [];
      setRows(rowsWithIndex);
      setTotalRows(response.data?.total as number);
      updateQueryParams();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateQueryParams = () => {
    const filterParams: Record<string, string> = {};
    if (filters.projectStartAt) {
      filterParams.project_start_at = formatDate(
        filters.projectStartAt.toISOString()
      ) as string;
    }
    if (filters.projectDeadline) {
      filterParams.project_deadline = formatDate(
        filters.projectDeadline.toISOString()
      ) as string;
    }
    if (filters.projectStatus) {
      filterParams.project_status = filters.projectStatus;
    }
    if (filters.projectTech !== undefined) {
      if (filters.projectTech.length > 0) {
        filterParams.project_tech = filters.projectTech?.join(",");
      }
    }
    if (filters.projectManagementTool) {
      filterParams.project_management_tool = filters.projectManagementTool;
    }
    if (debouncedSearch.trim() && debouncedSearch.length >= 3) {
      debouncedSearch = debouncedSearch.trim();
    }
    setSearchParams({
      page: paginationModel.page.toString(),
      limit: paginationModel.pageSize.toString(),
      search: debouncedSearch,
      sort: sortModel[0]?.field || "id",
      order: sortModel[0]?.sort || "asc",
      ...filterParams,
    });
  };

  const handleNavigateToAddProjects = () => {
    navigate("/dashboard/projects/add-projects");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRowDoubleClick = (param: any) => {
    navigate(`/dashboard/projects/${param.row.id}`);
  };

  const removeDependentFilters = () => {
    const updatedFilters = {
      ...filters,
      projectStartAt: null,
      projectDeadline: null,
      projectStatus: "",
      projectTech: [],
    };
    setFilters(updatedFilters);
    setSearchParams({
      page: paginationModel.page.toString(),
      limit: paginationModel.pageSize.toString(),
      search: debouncedSearch,
      sort: sortModel[0]?.field || "id",
      order: sortModel[0]?.sort || "asc",
      projectManagementTool: filters.projectManagementTool ?? "",
    });
    filters.projectStartAt = null;
    filters.projectDeadline = null;
    filters.projectTech = [];
    filters.projectStatus = "";
    fetchData();
    setFilterState({
      ...filterState,
      dependentField: false,
      visibleFilter: Object.values(updatedFilters).some(
        (value) =>
          value !== null &&
          ((typeof value === "string" && value.trim() !== "") ||
            (Array.isArray(value) && value.length > 0))
      ),
      statuses: [],
      techOptions: [],
      techSearch: "",
      showStatusField: false,
      showTechField: false,
    });
  };

  const removeIndependentFilter = () => {
    const updatedFilters = {
      ...filters,
      projectManagementTool: "",
    };
    setFilters(updatedFilters);
    setSearchParams({
      page: paginationModel.page.toString(),
      limit: paginationModel.pageSize.toString(),
      search: debouncedSearch,
      sort: sortModel[0]?.field || "id",
      order: sortModel[0]?.sort || "asc",
      projectStartAt:
        formatDate(filters.projectStartAt?.toISOString() ?? "") ?? "",
      projectDeadline:
        formatDate(filters.projectDeadline?.toISOString() ?? "") ?? "",
      projectStatus: filters.projectStatus || "",
      projectTech: filters.projectTech?.join(", ") || [],
    });
    filters.projectManagementTool = "";
    fetchData();
    setFilterState({
      ...filterState,
      inDependentField: false,
      visibleFilter: Object.values(updatedFilters).some(
        (value) =>
          value !== null &&
          ((typeof value === "string" && value.trim() !== "") ||
            (Array.isArray(value) && value.length > 0))
      ),
      toolSearch: "",
    });
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel, sortModel, debouncedSearch]);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center w-full">
      <div className="d-flex justify-content-start breadcrum-position">
        <Breadcrumb />
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
                          marginTop: "0px",
                        },
                    },
                  },
                }}
              >
                <TextField
                  type="text"
                  name="search"
                  placeholder="Search Projects"
                  className="search-project"
                  value={search}
                  onChange={handleSearchChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      ...(searchError && {
                        "& fieldset": {
                          borderColor: "error.main",
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
            <Button
              text={"Filter"}
              type={"button"}
              className="filter-btn"
              onClick={() => setSidebarOpen(true)}
              startIconPass={<FilterAltOutlinedIcon />}
            />
            <Button
              text={"Add Projects"}
              type={"button"}
              className="add-project-btn"
              onClick={handleNavigateToAddProjects}
              startIconPass={<CreateNewFolderOutlinedIcon />}
            />
          </div>
        </div>
        {filterState.visibleFilter && (
          <div className="filters-content d-flex justify-content-between w-full align-items-start">
            <div className="filters-sub-content d-flex">
              <div className="filters-field d-flex">
                {filterState.dependentField && (
                  <div className="field-name d-flex">
                    {filters.projectStartAt && (
                      <div className="dependent-field d-flex">
                        <h4 className="header">
                          Project Start Date:{" "}
                          {formatDate(filters.projectStartAt ?? "")}
                        </h4>
                      </div>
                    )}
                    {filters.projectDeadline && (
                      <div className="dependent-field d-flex">
                        <h4 className="header">
                          Project End Date:{" "}
                          {formatDate(filters.projectDeadline ?? "")}
                        </h4>
                      </div>
                    )}
                    {filters.projectStatus && (
                      <div className="dependent-field d-flex">
                        <h4 className="header">
                          Project Status: {filters.projectStatus}
                        </h4>
                      </div>
                    )}
                    {Array.isArray(filters.projectTech) &&
                      filters.projectTech.length > 0 && (
                        <div className="dependent-field d-flex">
                          <h4 className="header">
                            Project Tech: {filters.projectTech?.join(", ")}
                          </h4>
                        </div>
                      )}
                    <span className="icon" onClick={removeDependentFilters}>
                      <CloseIcon />
                    </span>
                  </div>
                )}
                {filterState.inDependentField && (
                  <div className="field-name d-flex justify-content-between w-full">
                    <h4 className="header">
                      Project Tool: {filters.projectManagementTool}
                    </h4>
                    <span className="icon" onClick={removeIndependentFilter}>
                      <CloseIcon />
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="filters-btn d-flex">
              <Button
                text={"Clear All"}
                type={"button"}
                className="filter-btn align-self-start"
                onClick={handleResetFilters}
                startIconPass={<ClearAllIcon />}
              />
            </div>
          </div>
        )}
        <Paper>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={totalRows}
            paginationMode="server"
            sortingMode="server"
            checkboxSelection
            onRowDoubleClick={handleRowDoubleClick}
            onPaginationModelChange={(newModel) => {
              setPaginationModel({
                page: newModel.page,
                pageSize: newModel.pageSize || 15,
              });
              setIsSearch(false);
            }}
            onSortModelChange={(newModel) => {
              setSortModel(newModel);
              setIsSearch(false);
            }}
            paginationModel={{
              page: paginationModel.page,
              pageSize: paginationModel.pageSize,
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
            { label: "Cancel", onClick: handleClose, color: "secondary" },
            { label: "Yes", onClick: confirmDelete, color: "primary" },
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
        filterState={filterState}
        setFilterState={setFilterState}
      />
    </div>
  );
};

export default ProjectList;
