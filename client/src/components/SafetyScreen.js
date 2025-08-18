import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export default function SafetyScreen() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#e3f6fd",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header: Logos and Banner */}
      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 4, md: 8 },
          pt: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: { xs: 2, md: 6 },
        }}
      >
        <Box sx={{ flex: 1, textAlign: "left" }}>
          <img
            src="/ministry-logo.png"
            alt="Ministry Logo"
            style={{
              maxHeight: "120px",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box sx={{ flex: 2, textAlign: "center" }}>
          <img
            src="/program-title.png"
            alt="Team Development And Skills Improvement Program"
            style={{
              maxHeight: "100px",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box sx={{ flex: 1, textAlign: "right" }}>
          <img
            src="/saudi-logo.png"
            alt="Saudi Binladin Group Logo"
            style={{
              maxHeight: "160px",
              width: "auto",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      {/* Main Title Section */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          sx={{
            color: "#f00",
            fontWeight: "bold",
            fontSize: { xs: 36, md: 60 },
            textShadow: "2px 2px 0 #fff, 4px 4px 0 #ff0, 6px 6px 0 #000",
            mb: 2,
            fontFamily: "Arial, Tahoma, sans-serif",
            letterSpacing: 2,
          }}
        >
          شاشة السلامة
        </Typography>
        <Typography
          sx={{
            color: "#f00",
            fontWeight: "bold",
            fontSize: { xs: 32, md: 56 },
            mb: 2,
            fontFamily: "Arial, Tahoma, sans-serif",
            letterSpacing: 2,
          }}
        >
          SAFETY SCREEN
        </Typography>
        <Typography
          sx={{
            color: "#f00",
            fontWeight: "bold",
            fontSize: { xs: 28, md: 44 },
            mb: 2,
            fontFamily: "Arial, Tahoma, sans-serif",
            letterSpacing: 2,
          }}
        >
          حفاظتی اسکرین
        </Typography>
      </Box>

      {/* Red Arrow Button */}
      <Button
        onClick={() => navigate("/quiz")}
        sx={{
          position: "absolute",
          right: { xs: 16, md: 40 },
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "transparent",
          minWidth: 0,
          p: 0,
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        <ArrowForwardIosIcon
          sx={{ fontSize: { xs: 60, md: 100 }, color: "#f00" }}
        />
      </Button>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#f00",
          color: "#fff",
          textAlign: "center",
          py: { xs: 1, md: 1.5 },
          fontSize: { xs: "1rem", md: "1.3rem" },
          fontWeight: "bold",
          letterSpacing: 1,
          lineHeight: 1.5,
        }}
      >
        إدارة الأمن والسلامة والصحة المهنية والبيئة &nbsp;|&nbsp;
        <span style={{ fontSize: "1.2em", verticalAlign: "middle" }}>
          &copy;
        </span>
        &nbsp;Designer: مصباح نصّار &nbsp;|&nbsp; &nbsp; Developer: Hosam
        Abdullah & Saeed Misbah &nbsp;
      </Box>
    </Box>
  );
}
