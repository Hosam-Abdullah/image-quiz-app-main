import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

export default function AdminPanel() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCorrect, setIsCorrect] = useState("true");
  const [images, setImages] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/images`
      );
      // Defensive: ensure images is always an array
      setImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching images:", error);
      showSnackbar("Error fetching images", "error");
      setImages([]); // Ensure images is always an array on error
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Please select an image first", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("isCorrect", isCorrect);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showSnackbar("Image uploaded successfully", "success");
      setSelectedFile(null);
      fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      showSnackbar("Error uploading image", "error");
    }
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/admin/images/${selectedImage._id}`,
        {
          isCorrect: selectedImage.isCorrect,
        }
      );
      showSnackbar("Image updated successfully", "success");
      setEditDialogOpen(false);
      fetchImages();
    } catch (error) {
      console.error("Error updating image:", error);
      showSnackbar("Error updating image", "error");
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/api/admin/images/${imageId}`
        );
        showSnackbar("Image deleted successfully", "success");
        fetchImages();
      } catch (error) {
        console.error("Error deleting image:", error);
        showSnackbar("Error deleting image", "error");
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderUploadSection = () => (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload New Image
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Image Type</FormLabel>
        <RadioGroup
          value={isCorrect}
          onChange={(e) => setIsCorrect(e.target.value)}
        >
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="Correct Image"
          />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="Incorrect Image"
          />
        </RadioGroup>
      </FormControl>

      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          type="file"
          onChange={handleFileSelect}
          style={{ marginBottom: "1rem" }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload Image
      </Button>
    </Paper>
  );

  const renderDashboard = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Image Dashboard
      </Typography>

      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "75%", // 4:3 aspect ratio
                  width: "100%",
                  bgcolor: "grey.100",
                }}
              >
                <CardMedia
                  component="img"
                  image={image.imagePath}
                  alt="Uploaded image"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // This ensures the entire image is visible
                    p: 1, // Add padding to prevent image from touching the edges
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Status: {image.isCorrect ? "Correct" : "Incorrect"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {new Date(image.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(image)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(image._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

        {renderUploadSection()}
        {renderDashboard()}

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Image Type</FormLabel>
              <RadioGroup
                value={selectedImage?.isCorrect.toString()}
                onChange={(e) =>
                  setSelectedImage({
                    ...selectedImage,
                    isCorrect: e.target.value === "true",
                  })
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Correct Image"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Incorrect Image"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
