import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Button,
  Typography,
  Alert,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const UserQuiz = () => {
  const [quizPair, setQuizPair] = useState(null);
  const [message, setMessage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [quizResults, setQuizResults] = useState({ correct: 0, incorrect: 0 });
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [currentPair, setCurrentPair] = useState(0);
  const [remainingPairs, setRemainingPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const is1080p = useMediaQuery("(width: 1920px) and (height: 1080px)");

  const fetchQuizPair = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/pair`
      );

      if (response.data.reset) {
        startNewQuiz();
        return;
      }

      const {
        images,
        correctImageId,
        totalPairs: pairs,
        remainingPairs: remaining,
        currentPair: pair,
      } = response.data;

      setTotalPairs(pairs);
      setRemainingPairs(remaining);
      setCurrentPair(pair);

      // Shuffle the images
      const shuffledImages = [...images].sort(() => Math.random() - 0.5);

      setQuizPair({
        images: shuffledImages,
        correctImageId,
      });
      setMessage(null);
      setShowNext(false);
    } catch (error) {
      console.error("Error fetching quiz pair:", error);
      setMessage({ type: "error", text: "Error loading quiz" });
    }
  };

  useEffect(() => {
    fetchQuizPair();
  }, []);

  const startNewQuiz = () => {
    setQuizResults({ correct: 0, incorrect: 0 });
    setCurrentPair(0);
    setRemainingPairs(0);
    setIsQuizComplete(false);
    fetchQuizPair();
  };

  const handleImageClick = (imageId) => {
    if (isQuizComplete) return;

    if (imageId === quizPair.correctImageId) {
      setQuizResults((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setMessage({ type: "success", text: "Correct answer!" });

      // If last question, show results
      if (remainingPairs === 0) {
        setIsQuizComplete(true);
      } else {
        // Move to next question after a short delay
        setTimeout(() => {
          fetchQuizPair();
        }, 1000); // 1 second delay for feedback
      }
    } else {
      setQuizResults((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setMessage({ type: "error", text: "Wrong answer. Try again!" });
    }
  };

  const getChartData = () => {
    return [
      { name: "Correct", value: quizResults.correct, fill: "#4CAF50" },
      { name: "Incorrect", value: quizResults.incorrect, fill: "#f44336" },
    ];
  };

  // Responsive design helper functions
  const getLogoHeight = () => {
    if (is1080p) return 100;
    if (isTablet) return 70;
    if (isMobile) return 50;
    return 80;
  };

  const getTitleHeight = () => {
    if (is1080p) return 80;
    if (isTablet) return 60;
    if (isMobile) return 40;
    return 70;
  };

  const getHeaderPadding = () => {
    if (is1080p) return 3;
    if (isMobile) return 1;
    return 2;
  };

  const renderResults = () => (
    <Box
      sx={{
        textAlign: "center",
        mt: is1080p ? 6 : 4,
        px: is1080p ? 4 : 2,
      }}
    >
      <Typography
        variant={is1080p ? "h3" : "h4"}
        color="primary"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Quiz Results
      </Typography>

      <Box
        sx={{
          height: is1080p ? 400 : 300,
          maxWidth: "800px",
          margin: "0 auto",
          mb: 4,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getChartData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Typography
        variant={is1080p ? "h4" : "h5"}
        sx={{ mb: 3, color: "text.secondary" }}
      >
        You got {quizResults.correct} out of {totalPairs} questions correct on
        the first try!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={startNewQuiz}
        size={is1080p ? "large" : "medium"}
        sx={{
          px: is1080p ? 6 : 4,
          py: is1080p ? 2 : 1.5,
          fontSize: is1080p ? "1.5rem" : "1.2rem",
        }}
      >
        Take Quiz Again
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(255,255,255,0.7)", // adjust opacity as needed
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
        <AppBar position="static" sx={{ bgcolor: "white", boxShadow: 0 }}>
          <Container
            maxWidth={is1080p ? false : "lg"}
            sx={{ px: is1080p ? 4 : 3 }}
          >
            <Toolbar
              sx={{ justifyContent: "space-between", py: getHeaderPadding() }}
            >
              <img
                src="/ministry-logo.png"
                alt="Ministry Logo"
                height={getLogoHeight()}
              />
              <img
                src="/program-title.png"
                alt="Team Development And Skills Improvement Program"
                style={{
                  height: getTitleHeight(),
                  maxWidth: "50%",
                  objectFit: "contain",
                  margin: "0 20px",
                }}
              />
              <img
                src="/saudi-logo.png"
                alt="Saudi Logo"
                height={getLogoHeight()}
              />
            </Toolbar>
          </Container>
        </AppBar>

        {!quizPair ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant={isMobile ? "h6" : "h4"}>Loading...</Typography>
          </Box>
        ) : isQuizComplete ? (
          renderResults()
        ) : (
          <Container
            maxWidth={is1080p ? false : "lg"}
            sx={{ mt: 4, px: is1080p ? 4 : 3 }}
          >
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                Question {currentPair} of {totalPairs}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Remaining: {remainingPairs}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", mb: is1080p ? 6 : 4 }}>
              <Typography
                variant={isMobile ? "h5" : is1080p ? "h3" : "h4"}
                color="error"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Choose The Right Picture
              </Typography>
              <Typography
                variant={isMobile ? "h6" : is1080p ? "h4" : "h5"}
                sx={{ color: "#666", mb: 1 }}
              >
                اختار الصورة الصحيحة
              </Typography>
              <Typography
                variant={isMobile ? "subtitle1" : is1080p ? "h5" : "h6"}
                sx={{ color: "#666" }}
              >
                صحیح تصویر کا انتخاب کریں
              </Typography>
            </Box>

            {message && (
              <Alert
                severity={message.type}
                sx={{
                  mb: is1080p ? 6 : 3,
                  maxWidth: is1080p ? "80%" : "md",
                  mx: "auto",
                  "& .MuiAlert-icon": {
                    fontSize: is1080p ? "3rem" : "2rem",
                  },
                  py: is1080p ? 2 : 1,
                }}
              >
                <Typography variant={is1080p ? "h4" : "h6"}>
                  {message.text}
                </Typography>
              </Alert>
            )}

            <Grid
              container
              spacing={is1080p ? 6 : 4}
              justifyContent="center"
              sx={{ mb: 4 }}
            >
              {quizPair.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={5} key={index}>
                  <Card
                    sx={{
                      maxWidth: is1080p ? 800 : 500,
                      mx: "auto",
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea onClick={() => handleImageClick(image._id)}>
                      <CardMedia
                        component="img"
                        image={`/${image.imagePath}`}
                        alt={`Quiz Image ${index + 1}`}
                        sx={{
                          height: is1080p ? 500 : 300,
                          objectFit: "contain",
                          bgcolor: "white",
                        }}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          left: 0,
          bottom: 0,
          bgcolor: "#f00",
          color: "#fff",
          textAlign: "center",
          py: { xs: 1, md: 1.5, lg: 1.5 },
          fontSize: {
            xs: "0.95rem",
            sm: "1.05rem",
            md: "1.15rem",
            lg: "1.2rem",
          },
          fontWeight: "bold",
          letterSpacing: 1,
          zIndex: 1300,
          lineHeight: 1.5,
        }}
      >
        إدارة الأمن والسلامة والصحة المهنية والبيئة &nbsp;|&nbsp;
        <span style={{ fontSize: "1.2em", verticalAlign: "middle" }}>
          &copy;
        </span>
        &nbsp;Designer: مصباح نصّار &nbsp;|&nbsp; Programmer: Hosam Abdullah
      </Box>
    </Box>
  );
};

export default UserQuiz;
