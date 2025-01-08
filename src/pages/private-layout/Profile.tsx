import './profile.css';
import { Avatar, Box, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { CloudUpload, Delete } from "@mui/icons-material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import coverImage from '../../assets/img/cover_img.webp';
import {  useState } from "react";
import { constVariables } from "../../constants";
import { toast } from 'react-toastify';
import { FileManagementService } from '../../swagger/api';
import { useLoader } from '../../hooks/loaderContext';
import AlertDialogSlide from '../../components/AlertDialogSlide';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [hover, setHover] = useState(false);
  const { loading, setLoading } = useLoader();
  const [, setProfileImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [enableCrop, setEnableCrop] = useState(false);

  const handleImageUploadClick = () => {
    setEnableCrop(true);
    setOpen(true);
  };

  const handleImageUpload = async (mainFile: File, thumbnailFile: File) => {
    setLoading(true);
    const allowedTypes = ['image/jpeg','image/jpg'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(mainFile.type)) {
      toast.error("Invalid file type. Please upload an image.");
      setLoading(false);
      return;
    }

    const fileExtension = mainFile.name.toLowerCase().split('.').pop();
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      toast.error("Invalid file extension. Please upload a JPEG and PNG image.");
      setLoading(false);
      return;
    }

    if (mainFile.size > maxSize) {
      toast.error("File is too large. Maximum size is 5MB.");
      setLoading(false);
      return;
    }

    const formData = {
      id: user?.id ?? 0,
      file: mainFile,
      thumbnail: thumbnailFile
    };
    try {
      const response = await FileManagementService.postMeProfile(formData);
      if(response.status === "success"){
        setProfileImage(`${response.image_name}?t=${new Date().getTime()}`);
        setOpen(false);
        window.location.reload(); 
        toast.success("Image Uploaded Sucessfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally{
      setLoading(false);
    }
  };

  const handleImageDelete = async () => {
    setLoading(true);
    try {
      const data = { id: user?.id ?? 0 };
      await FileManagementService.postMeProfileDelete(data);

      setProfileImage(null);
      setOpen(false);
      window.location.reload(); 
      toast.success("Image Deleted Sucessfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally{
      setLoading(false);
    }
  };
  return (
    <div className="main-container d-flex flex-column">
      <div className="sub-container d-flex justify-content-start">
        <Breadcrumb/>
      </div>
      <div className="profile-container d-flex flex-column justify-content-center align-items-center w-full mt-3" >
        <div className="profile-sub-container d-flex flex-column w-full">
          <Box className="cover-image">
            <Paper
              sx={{
                backgroundImage: `url(${coverImage})`,
              }}
            >
            </Paper>
          </Box>
          <Box className="user-info">
            <div className="d-flex align-items-center">
              <div className="profile-data d-flex flex-column align-items-center">
                <Box className="user-image"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <Avatar
                    className='avatar-img'
                    src={
                      user?.image_name !== null
                        ? `${constVariables.base_url}assets/images/uploads/thumbnail/` + user?.image_name
                        : "/default-avatar.png"
                    }
                  />
                  {hover && !loading && (
                    <Box className="user-box">
                      <Box className="user-sub-box">
                      <IconButton color="primary" onClick={handleImageUploadClick}>
                        <CloudUpload />
                      </IconButton>
                        <IconButton
                          className='delete-image'
                          onClick={() => handleImageDelete()}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              </div>
              <span  className='user-name'>{`${user?.fname} ${user?.lname}`}</span>
              <span className='main-heading'></span>
            </div>
            <Typography variant="h5">Profile Information</Typography>
          </Box>
        </div>
        <Grid container spacing={3} className='grid-container'>
          <Grid item xs={12} md={4} className='sub-grid-container'>
            <Box className="social-lick-box p-3 bg-light rounded">
              <Typography variant="h6" className="mb-3">
                Social Media Links
              </Typography>
              <ul className="list-unstyled d-flex flex-wrap">
                <li className='list-social'>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className='facebook'/>
                  </a>
                </li>
                <li className='list-social'>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className='twitter'/>
                  </a>
                </li>
                <li className='list-social'>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <LinkedIn className='linkedin'/>
                  </a>
                </li>
                <li className='list-social'>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className='instagram'/>
                  </a>
                </li>
              </ul>
            </Box>
          </Grid>
          <Grid item xs={17} md={8} className='admin-detail-grid'>
            <Box className="admin-details p-3 bg-light rounded">
              <Typography variant="h6" className="mb-3">
                Admin Details
              </Typography>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.fname}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.lname}
              />
              <TextField
                label="Gender"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.gender}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.email}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={user?.phone}
              />
            </Box>
          </Grid>
        </Grid>
        <AlertDialogSlide
          open={open}
          onClose={() => setOpen(false)}
          title="Upload Profile Image"
          aspectRatio={1}
          enableCrop={enableCrop}
          dialogType="imageCropper"
          initialImage={
            user?.image_name
              ? `${constVariables.base_url}assets/images/uploads/${user.image_name}`
              : undefined
          }
          onUpload={handleImageUpload}
          actions={[
            { label: 'Cancel', onClick: () => setOpen(false), color: "secondary" }
          ]}
          onDelete={handleImageDelete}
        />
      </div>
    </div>
  )
}

export default Profile
