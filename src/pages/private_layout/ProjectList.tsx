import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import { Container } from "react-bootstrap";
import { DataGrid, GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { RowData } from "../../interfaces";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Input from "../../components/Input";
import { getToken } from "../../services/storageService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Button from "../../components/Button";

const ProjectList = () => {
  const [rows, setRows] = useState<RowData[]>([]); 
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate= useNavigate();
  const [columns] = useState([
    {
      field: "id",
      headerName: "Serial No.",
      width: 90,
      sortable: false,
      value: "1"
    },
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
      renderCell: (params:any) => {
        const handleView = () => {
          console.log("View project", params.row);
        };

        const handleEdit = () => {
          console.log("Edit project", params.row);
        };

        const handleDelete = () => {
          console.log("Delete project", params.row);
        };

        return (
          <div>
            <IconButton color="primary" onClick={handleView}>
              <VisibilityIcon />
            </IconButton>
            <IconButton color="secondary" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    }
  ]);
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: parseInt(searchParams.get("page") || "0"),
    pageSize: parseInt(searchParams.get("limit") || "5"),
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: searchParams.get("sort") || "project_name",
      sort: (searchParams.get("order") as GridSortDirection) || "asc",
    },
  ]);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const fetchData = async () => {
    const { page, pageSize } = paginationModel;
    const sort = sortModel[0]?.field || "project_name";
    const order = sortModel[0]?.sort || "asc";

    try {
      const url = new URL("http://localhost/truck_management/me/project/list");
      url.searchParams.append("page", (page + 1).toString());
      url.searchParams.append("limit", (pageSize).toString());
      url.searchParams.append("search", search);
      url.searchParams.append("sort", sort);
      url.searchParams.append("order", order);
      const token= getToken();
      const response = await fetch(url,{
        method:'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const rowsWithIndex = result.data.data.map((row: any, index: number) => ({
        ...row,
        id: page * pageSize + index + 1
      }));
      setRows(rowsWithIndex);
      setTotalRows(result.data.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateQueryParams = () => {
    setSearchParams({
      page: paginationModel.page.toString(),
      limit: paginationModel.pageSize.toString(),
      search: search,
      sort: sortModel[0]?.field || "project_name",
      order: sortModel[0]?.sort || "asc",
    });
  };

  const handleNavigateToAddProjects = () => {
    navigate('/dashboard/projects/add-projects');
  };

  useEffect(() => {
    updateQueryParams();
    fetchData();
  }, [paginationModel, sortModel, search]);

  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column justify-content-center align-items-center w-full">
          <div className="d-flex justify-content-start" style={{width:'92%', marginTop: '29px'}}>
            <Breadcrumb/>
          </div>
        <Container className="w-full m-2">
          <div className="d-flex justify-content-between w-">
            <h2 className="my-4">Project Listing</h2>
            <Button text={"Add Projects"} type={'button'} onClick={handleNavigateToAddProjects}/>
          </div>
          <Input
            type="text"
            name="search"
            placeholder="Search Projects"
            label=""
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            register={null}
            error={null}
          />
          <Paper sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              rowCount={totalRows}
              paginationMode="server"
              sortingMode="server"
              onPaginationModelChange={(newModel) => setPaginationModel({
                page: newModel.page || 0,
                pageSize: newModel.pageSize || 5,
              })}
              onSortModelChange={(newModel) => setSortModel(newModel)}
              paginationModel={paginationModel}
              pageSizeOptions={[5, 10]}
              sx={{ border: 0 }}
            />
          </Paper>
        </Container>
        </div>
      </div>
    </div>
  );
}

export default ProjectList
