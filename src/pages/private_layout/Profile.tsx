import { Avatar, Box, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useUserProfile } from "../../hooks/userProfile";
import { CloudUpload, Delete } from "@mui/icons-material";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
import coverImage from '../../assets/img/cover_img.webp';
import { ChangeEvent, useState } from "react";
import { UploadResponse } from "../../interfaces";
import { constVariables } from "../../constants";

const Profile = () => {
  const {userProfile}= useUserProfile();
  const [hover, setHover] = useState(false);

  const [, setProfileImage] = useState<string | null>(null);
  const [coverImageSet, setCoverImage] =  useState<string | null>(null);

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "profile" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", userProfile?.id as string);
      try {
        const response = await fetch(`${constVariables.base_url}me/profile`, {
          method: "POST",
          body: formData,
        });

        const data: UploadResponse = await response.json();
        if (type === "profile") setProfileImage(data.url);
        if (type === "cover") setCoverImage(data.url);
        window.location.reload(); 
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleImageDelete = async (type: "profile" | "cover") => {
    try {
      const data = { id: userProfile?.id }; 
      await fetch(`${constVariables.base_url}me/profile/delete`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (type === "profile") setProfileImage(null);
      if (type === "cover") setCoverImage(null);
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const coverImageUrl = coverImageSet !==null ? `${constVariables.base_url}assets/images/uploads/`+coverImageSet : coverImage;
  return (
    <div className="vh-100 d-flex">
      <Sidebar />
      <div className="d-flex flex-column flex-grow-1">
        <Navbar />
        <div className="d-flex flex-column" style={{overflow:'auto', height:'100%'}}>
          <div className="d-flex justify-content-start" style={{width:'92%', marginLeft:'70px', marginTop: '12px'}}>
            <Breadcrumb/>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center w-full mt-3" style={{backgroundColor:'#f0f0f0'}}>
            <div className="d-flex flex-column w-full" style={{width:'100%'}}>
              <Box sx={{width: "100%", height: "220px" }}>
                <Paper
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${coverImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                </Paper>
              </Box>
              <Box sx={{ display:'flex', justifyContent:'space-around', zIndex:'0px', width:'100%', alignItems:'center', backgroundColor:'#ffffff', height:'95px' }}>
                <div className="d-flex align-items-center">
                  <div className="d-flex flex-column align-items-center" style={{marginRight:'14px'}}>
                    <Box
                      sx={{
                        position: "relative",
                        width: 150,
                        height: 150,
                        margin: "0 auto",
                        marginTop: "-107px",
                      }}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      <Avatar
                        src={
                          userProfile?.image_name !== null
                            ? `${constVariables.base_url}assets/images/uploads/` + userProfile?.image_name
                            : "/default-avatar.png"
                        }
                        sx={{
                          width: 150,
                          height: 150,
                          border: "5px solid white",
                          position: "relative",
                          zIndex: 1,
                        }}
                      />
                      {hover && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                            zIndex: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <IconButton color="primary">
                              <label htmlFor="upload-profile-image" style={{ cursor: "pointer" }}>
                                <CloudUpload />
                              </label>
                              <input
                                id="upload-profile-image"
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handleImageUpload(e as React.ChangeEvent<HTMLInputElement>, "profile")
                                }
                              />
                            </IconButton>
                            <IconButton
                              sx={{ color: "red" }}
                              onClick={() => handleImageDelete("profile")}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </div>
                  <span  style={{fontSize:'18px', margin:'0 10px', fontWeight:'800', fontFamily:'sans-serif'}}>{`${userProfile?.fname} ${userProfile?.lname}`}</span>
                  <span style={{marginLeft:'10px', border:'1px solid rgba(214, 214, 214, 0.7)', height:'32px'}}></span>
                </div>
                <Typography variant="h5">Profile Information</Typography>
              </Box>
            </div>
            <Grid container spacing={3} sx={{ marginTop:'1px' }}>
              <Grid item xs={12} md={4} sx={{width: '50%', display: 'flex', justifyContent:'flex-end', height: 'max-content'}}>
                <Box className="p-3 bg-light rounded" sx={{width:'53%', padding:'16px 29px !important', backgroundColor:'#ffffff !important', borderRadius: '20px !important'}}>
                  <Typography variant="h6" className="mb-3">
                    Social Media Links
                  </Typography>
                  <ul className="list-unstyled d-flex flex-wrap">
                    <li style={{marginRight:'10px'}}>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <Facebook sx={{ color: "#4267B2", fontSize: 40 }} />
                      </a>
                    </li>
                    <li style={{marginRight:'10px'}}>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <Twitter sx={{ color: "#1DA1F2", fontSize: 40 }} />
                      </a>
                    </li>
                    <li style={{marginRight:'10px'}}>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <LinkedIn sx={{ color: "#0077B5", fontSize: 40 }} />
                      </a>
                    </li>
                    <li style={{marginRight:'10px'}}>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <Instagram sx={{ color: "#E1306C", fontSize: 40 }} />
                      </a>
                    </li>
                  </ul>
                </Box>
              </Grid>
              <Grid item xs={17} md={8} sx={{padding:'26px 21px', width:'50%', display:'flex', justifyContent:'flex-end', height:'max-content'}}>
                <Box className="p-3 bg-light rounded" sx={{width:'94%', backgroundColor:'#ffffff !important', borderRadius: '20px !important'}}>
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
      </div>
    </div>
  )
}

export default Profile
