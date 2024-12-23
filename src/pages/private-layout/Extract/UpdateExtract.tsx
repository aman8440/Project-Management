import '../form.css';
import Breadcrumb from '../../../components/Breadcrumb'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ExtractDetailData, TemplateProp } from '../../../interfaces';
import { ExtractDetailDataSchema } from '../../../schema';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DocumentEndpointsService } from '../../../swagger/api';
import { toast } from 'react-toastify';
import Input from '../../../components/Input';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from '../../../components/Button';
import AlertDialogSlide from '../../../components/AlertDialogSlide';

const UpdateExtract = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState<ExtractDetailData>({
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
  });
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExtractDetailData>({
    resolver: zodResolver(ExtractDetailDataSchema),
    mode:'onChange'
  });
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
          published_by: response.data?.published_by
        });
        setValue("id", response.data?.id);
        setValue("document_name", response.data?.document_name);
        setValue("processing_status", response.data?.processing_status);
        setValue("extension", response.data?.extension);
        setValue("document_path", response.data?.document_path);
        setValue("textract_data_path", response.data?.textract_data_path);
        setValue("is_template", response.data?.is_template);
        setValue("is_template_apply", response.data?.is_template_apply);
        setValue("is_data_published", response.data?.is_data_published);
        setValue("published_by", response.data?.published_by);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectData();
  }, [id, setValue]);
  
  const handleChange = (field: string, value: string | TemplateProp | boolean | null) => {
    if (value === 'true' || value === 'false') {
      value = value === 'true';
    }
    setFormData((prevData) => {
      const updatedData = { ...prevData, [field]: value };
      return updatedData;
    });
    setValue(field as keyof ExtractDetailData, value, { 
      shouldValidate: true 
    });
  };

  const onSubmit: SubmitHandler<ExtractDetailData> = async (data) => {
    setIsLoading(true);
    try {
      setOpen(true);
      setUpdatedData({
        id: data.id,
        document_name: data.document_name,
        processing_status: data.processing_status,
        extension: data.extension,
        document_path: data.document_path,
        textract_data_path: data.textract_data_path,
        is_template: data.is_template,
        is_template_apply: data.is_template_apply,
        is_data_published: data.is_data_published,
        published_by: data.published_by
      });
      toast.success("Data updated successful!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="main-container d-flex flex-column">
      <div className="common-class d-flex justify-content-start">
        <Breadcrumb documentName={formData.document_name}/>
      </div>
      <div className="container mt-5 mb-2">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {formData ? (
              <form onSubmit={handleSubmit(onSubmit)} className="form-div p-4 rounded shadow">
                <h2 className="text-center mb-4">Update Project</h2>
                <Input
                  label="Document ID" 
                  type="text"
                  name="id"
                  value={formData.id}
                  register={register}
                  error={errors.id}
                  onChange={(e: { target: { value: string | boolean | TemplateProp | null; }; }) => handleChange('id', e.target.value)}
                />
                <Input
                  label="Document Name"
                  type="text"    
                  name="document_name"
                  register={register}
                  error={errors.document_name}
                  value={formData.document_name}
                  onChange={(e) => handleChange('document_name', e.target.value)}
                />
                <div className="input-div-main d-flex mb-2 justify-content-between w-full">
                <FormControl className="select-box mb-2" error={!!errors.processing_status}>
                  <InputLabel>Processing Status</InputLabel>
                  <Select
                    className="mb-2"
                    {...register('processing_status')}
                    value={formData.processing_status || ''}
                    label="Processing Status"
                    onChange={(e) => handleChange('processing_status', e.target.value)}
                  >
                    {['PROCESSING', 'FAILED', 'PROCESSED'].map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.processing_status && (
                    <p className="text-danger">{errors.processing_status?.message}</p>
                  )}
                </FormControl>
                  <FormControl  className="select-box mb-2" error={!!errors.extension}>
                    <InputLabel>Extension</InputLabel>
                    <Select
                      className="mb-2"
                      value={formData.extension}
                      label="Extension"
                      {...register('extension')}
                      onChange={(e) => handleChange('extension', e.target.value)}
                    >
                      {['png', 'jpg', 'pdf'].map((ext) => (
                        <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                      ))}
                    </Select>
                    {errors.extension && <p className="text-danger">{errors.extension.message}</p>}
                  </FormControl>
                </div>
                <Input
                  label="Document path"
                  type="text"    
                  name="document_path"
                  register={register}
                  error={errors.document_path}
                  value={formData.document_path}
                  onChange={(e) => handleChange('document_path', e.target.value)}
                />
                <div className="input-div-main d-flex d-flex justify-content-between w-full">
                  <Input
                    label="Textract Data Path"
                    type="text"
                    name="textract_data_path"
                    register={register}
                    error={errors.textract_data_path}
                    value={formData.textract_data_path as string}
                    onChange={(e) => handleChange('textract_data_path', e.target.value)}
                  />
                  <Input
                    label="Published By:"
                    type="text"
                    name="published_by"
                    register={register}
                    error={errors.published_by}
                    value={formData.published_by ? formData.published_by : "N/A"}
                    onChange={(e) => handleChange('published_by', e.target.value)}
                  />
                </div>
                <div className="add-input-div d-flex d-flex mb-2 justify-content-between w-full">
                  <FormControl  className="select-box mb-2" error={!!errors.is_template}>
                    <InputLabel>Is Template</InputLabel>
                    <Select
                      className="mb-2"
                      {...register('is_template')}
                      value={formData.is_template ? 'true' : 'false'}
                      label="Is Template"
                      onChange={(e) =>  handleChange('is_template', e.target.value)}
                    >
                       {['true', 'false'].map((ext) => (
                        <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                      ))}
                    </Select>
                    {errors.is_template && <p className="text-danger">{errors.is_template?.message}</p>}
                  </FormControl>
                  <FormControl  className="select-box mb-2" error={!!errors.is_template_apply}>
                    <InputLabel>Is Template Applied</InputLabel>
                    <Select
                      className="mb-2"
                      value={formData.is_template_apply ? 'true' : 'false'}
                      label="Is Template Applied"
                      {...register('is_template_apply')}
                      onChange={(e) => handleChange('is_template_apply', e.target.value)}
                    >
                      {['true', 'false'].map((ext) => (
                        <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                      ))}
                    </Select>
                    {errors.is_template_apply && <p className="text-danger">{errors.is_template_apply.message}</p>}
                  </FormControl>
                  <FormControl  className="select-box mb-2" error={!!errors.is_data_published}>
                    <InputLabel>Is Data Published</InputLabel>
                    <Select
                      className="mb-2"
                      value={formData.is_data_published ? 'true' : 'false'}
                      label="Is Data Published"
                      {...register('is_data_published')}
                      onChange={(e) => handleChange('is_data_published', e.target.value)}
                    >
                      {['true', 'false'].map((ext) => (
                        <MenuItem key={ext} value={ext}>{ext}</MenuItem>
                      ))}
                    </Select>
                    {errors.is_data_published && <p className="text-danger">{errors.is_data_published.message}</p>}
                  </FormControl>
                </div>
                <div className="add-btn d-flex justify-content-between">    
                  <Button text="Back" type="button" className="back-btn" onClick={()=>{navigate("/extract")}}/>
                  <Button type="submit" text={isLoading ? 'Updating...' : 'Update Extract Data'} disabled={isLoading}/>
                </div>
              </form>
            ) : (
              <p>Loading extract data...</p>
            )}
          </div>
          <AlertDialogSlide
            open={open}
            onClose={()=> (setOpen(false))}
            title="Updated Data"
            content={updatedData}
            actions={[
              { label: 'Ok', onClick: (()=>navigate('/extract')),  color: "primary"},
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default UpdateExtract;
