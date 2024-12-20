import "../viewmore.css";
import Breadcrumb from "../../../components/Breadcrumb";
import { ExtractDetailData, TabPanelProps } from "../../../interfaces";
import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { Document, Page, pdfjs } from 'react-pdf';

import {
  DocumentEndpointsService
} from "../../../swagger/api";
import { getToken } from "../../../services/storage.service";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/9.8.1/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const convertDate = (dateString: string | null) => {
  const date = new Date(dateString as string);

  // Format date parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const DetailExtract = () => {
  const [value, setValue] = React.useState(0);

  const [, setIsLoading] = useState<boolean>(false);
  const { id } = useParams() ?? "";
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExtractDetailData>({
    id: "",
    document_name: "",
    processing_status: "",
    extension: "",
    document_path: "",
    textract_data_path: "",
    is_template: false,
    is_template_apply: false,
    is_data_published: false,
    processed_at: null,
    published_by: "N/A",
    is_deleted: false,
    created_by: "",
    updated_by: "",
    created_at: null,
    updated_at: null,
  });

  const handleChange = async (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setValue(newValue);
    if (newValue === 1 && !pdfUrl) {
      await getFilePath();
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response =
          await DocumentEndpointsService.getDocumentApiV1DocumentDocIdGet(
            id as string
          );
        setFormData({
          id: response.data?.id,
          document_name: response.data?.document_name,
          processing_status: response.data?.processing_status,
          extension: response.data?.extension,
          document_path: response.data?.document_path,
          textract_data_path: response.data?.textract_data_path,
          is_template: response.data?.is_template,
          is_template_apply: response.data?.is_template_apply,
          is_data_published: response.data?.is_data_published,
          processed_at: response.data?.processed_at,
          published_by: response.data?.published_by,
          is_deleted: response.data?.is_deleted,
          created_by: response.data?.created_by,
          updated_by: response.data?.updated_by,
          created_at: response.data?.created_at,
          updated_at: response.data?.updated_at,
        });
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [id, setValue]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const getFilePath = async () => {
    try {
      setPdfError(null);
      const token= getToken();
      const response = await fetch(`http://localhost:9000/api/v1/files/download?filePath=${formData.document_path}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/pdf'
        },
      });
      console.log(response);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching file data:", error);
    }
  };

  const extractDetails = [
    { title: "Document ID:", content: formData.id },
    { title: "Document Name:", content: formData.document_name },
    { title: "Processing Status:", content: formData.processing_status },
    { title: "File Extension:", content: formData.extension },
    { title: "Document Path:", content: formData.document_path },
    { title: "Textract Data Path:", content: formData.textract_data_path },
    { title: "Is Template:", content: formData.is_template?.toString() },
    {
      title: "Is Template Applied:",
      content: formData.is_template_apply?.toString(),
    },
    {
      title: "Is Data Published:",
      content: formData.is_data_published?.toString(),
    },
    {
      title: "Processed At:",
      content:
        formData.processed_at === null
          ? ""
          : convertDate(formData.processed_at ?? ""),
    },
    {
      title: "Published By:",
      content: formData.published_by === null ? "N/A" : formData.published_by,
    },
    { title: "Is Deleted:", content: formData.is_deleted?.toString() },
    { title: "Created By:", content: formData.created_by },
    { title: "Updated By:", content: formData.updated_by },
    { title: "Created At:", content: convertDate(formData.created_at ?? "") },
    { title: "Updated At:", content: convertDate(formData.updated_at ?? "") },
  ];

  return (
    <div className="main-container d-flex flex-column">
      <div className="sub-contain d-flex justify-content-start">
        <Breadcrumb documentName={formData.document_name} />
      </div>
      <div className="container mt-5 p-4 bg-white shadow rounded">
        <div className="text-left mb-4">
          <p className="text-black fs-9">Document Details</p>
        </div>
        <div className="profile-tab nav nav-tabs mb-4">
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Document Details" {...a11yProps(0)} />
                <Tab label="Document" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <div className="tab-content">
              <CustomTabPanel value={value} index={0}>
                {formData ? (
                  <>
                    <div className="tab-pane fade show active">
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {extractDetails.map((detail, index) => (
                          <div className={"col d-flex flex-column"} key={index}>
                            <div className="card h-100">
                              <div className="card-body">
                                <h5 className="card-title text-primary">
                                  {detail.title}
                                </h5>
                                <p className="card-text">{detail.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Loading project data...</p>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <div className="tab-pane fade show active">
                <div className="pdf-container">
                  {pdfError ? (
                    <div className="alert alert-danger">{pdfError}</div>
                  ) : pdfUrl ? (
                    <div className="pdf-viewer">
                      <iframe
                        title="PDF Viewer"
                        src={pdfUrl}
                        width="100%"
                        height="800px"
                      />
                    </div>
                  ) : (
                    <div>Loading PDF...</div>
                  )}
                </div>
                </div>
              </CustomTabPanel>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default DetailExtract;
