import './alertDialogSlide.css';
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { DialogProps } from "../interfaces";
import Cropper, { Point, Area } from "react-easy-crop";
import { useRef, useState } from "react";
import { Box, Slider, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  open,
  onClose,
  title,
  content,
  actions,
  initialImage,
  onUpload,
  aspectRatio = 1,
  enableCrop = false,
  dialogType = "default",
  onDelete,
}: DialogProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setIsDisabled(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setIsDisabled(true);
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => {
        console.error("Error loading image:", error);
        reject(error)});
      image.src = url;
  });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<{ file: File; thumbnail: File }> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    const thumbnailCanvas = document.createElement("canvas");
    const thumbnailCtx = thumbnailCanvas.getContext("2d");
    const thumbnailSize = 140;

    thumbnailCanvas.width = thumbnailSize;
    thumbnailCanvas.height = thumbnailSize;

    if (!thumbnailCtx) {
      throw new Error("No 2d context for thumbnail");
    }

    thumbnailCtx.drawImage(
      canvas,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      thumbnailSize,
      thumbnailSize
    );
    const mainBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.95);
    });
    const thumbnailBlob = await new Promise<Blob>((resolve) => {
      thumbnailCanvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8);
    });
    const timestamp = Date.now();
    return {
      file: new File([mainBlob], `cropped-${timestamp}.jpg`, { type: "image/jpeg" }),
      thumbnail: new File([thumbnailBlob], `thumbnail-${timestamp}.jpg`, {
        type: "image/jpeg",
      }),
    };
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleUpload = async () => {
    if (!image || !croppedAreaPixels || !onUpload) return;
    try {
      const { file, thumbnail } = await getCroppedImg(image, croppedAreaPixels);
      onUpload(file, thumbnail);
      onClose();
      setIsDisabled(true);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
      maxWidth={dialogType === "imageCropper" ? "md" : "sm"}
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {dialogType === "default" ? (
          <DialogContentText id="alert-dialog-slide-description">
            {content}
          </DialogContentText>
        ) : (
          <Box className="crop-image-box w-100"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {image && (  
              <>
                {enableCrop ? (
                  <>
                    <Cropper
                      image={image ?? ""}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspectRatio}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={handleCropComplete}
                    />
                    <Box className="sub-crop-image-box">
                      <Typography>Zoom</Typography>
                      <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(_e, zoom) => setZoom(zoom as number)}
                      />
                    </Box>
                  </>
                ) : (
                  <img
                    className='profile-image-main'
                    src={image ?? ''}
                    alt="Preview"
                  />
                )}
              </>
            )}
            <Box className="d-flex flex-column align-items-center justify-content-center h-100">
              <Typography className='typo-drag-drop'>
                {dragOver ? "Drop the image here" : "Drag and drop an image or click to upload"}
              </Typography>
              <Button
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Image
              </Button>
            </Box>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {dialogType === "imageCropper" ? (
          <>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpload} color="primary" disabled={!isDisabled}>
              Upload
            </Button>
            <Button onClick={onDelete} color="error" disabled={!image}>
              Delete
            </Button>
          </>
        ) : (
          actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              color={action.color || "primary"}
            >
              {action.label}
            </Button>
          ))
        )}
      </DialogActions>
    </Dialog>
  );
}
