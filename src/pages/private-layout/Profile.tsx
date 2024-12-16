import './profile.css';
import { Avatar, Box, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import { useUserProfile } from "../../hooks/userProfile";
import { CloudUpload, Delete } from "@mui/icons-material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import coverImage from '../../assets/img/cover_img.webp';
import { ChangeEvent, useState } from "react";
import { constVariables } from "../../constants";
import { toast } from 'react-toastify';
import { FileManagementService, ProfileImageUploadRequest } from '../../swagger/api';

const Profile = () => {
  const {userProfile}= useUserProfile();
  const [hover, setHover] = useState(false);

  const [, setProfileImage] = useState<string | null>(null);
  const [coverImageSet, setCoverImage] =  useState<string | null>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg','image/webp', 'image/svg'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    const formData: ProfileImageUploadRequest = {
      id: userProfile?.id ?? 0,
      file: file,
    };
    try {
      const response = await FileManagementService.postMeProfile(formData);
      if(response.status === "success"){
        if (type === "profile") setProfileImage(response.image_name);
        if (type === "cover") setCoverImage(response.image_name);
        window.location.reload(); 
        toast.success("Image Uploaded Sucessfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageDelete = async (type: "profile" | "cover") => {
    try {
      const data = { id: userProfile?.id ?? 0 };
      await FileManagementService.postMeProfileDelete(data);

      if (type === "profile") setProfileImage(null);
      if (type === "cover") setCoverImage(null);
      window.location.reload(); 
      toast.success("Image Deleted Sucessfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const coverImageUrl = coverImageSet !==null ? `${constVariables.base_url}assets/images/uploads/`+coverImageSet : coverImage;
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
                backgroundImage: `url(${coverImageUrl})`,
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
                      userProfile?.image_name !== null
                        ? `${constVariables.base_url}assets/images/uploads/` + userProfile?.image_name
                        : "/default-avatar.png"
                    }
                  />
                  {hover && (
                    <Box className="user-box">
                      <Box className="user-sub-box">
                        <IconButton color="primary">
                          <label htmlFor="upload-profile-image">
                            <CloudUpload />
                          </label>
                          <input
                            id="upload-profile-image"
                            type="file"
                            hidden
                            onChange={(e) =>
                              handleImageUpload(e as React.ChangeEvent<HTMLInputElement>, "profile")
                            }
                          />
                        </IconButton>
                        <IconButton
                          className='delete-image'
                          onClick={() => handleImageDelete("profile")}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </Box>
              </div>
              <span  className='user-name'>{`${userProfile?.fname} ${userProfile?.lname}`}</span>
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
                value={userProfile?.fname}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userProfile?.lname}
              />
              <TextField
                label="Gender"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userProfile?.gender}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userProfile?.email}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={userProfile?.phone}
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Profile
