/* global globalThis */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  fetchUserCheck,
  fetchVirtualId,
} from "../../services/userservice/userService";
import "./LoginPage.css";
import { setLocalData } from "../../utils/constants";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { initialize } from "../../services/telemetryService";
import { reportError } from "../../utils/errorReporter";
import { startEvent } from "../../services/callTelemetryIntract";
import LanguageModalNew from "../../utils/LanguageModal";
import { AudioDiagnosticModal } from "../../components/AudioDiagnostic";
import ServerErrorScreen from "../../components/ServerErrorScreen/ServerErrorScreen";
import panda from "../../assets/images/panda.svg";
import textureImage from "../../assets/images/textureImage.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const loginMode = process.env.REACT_APP_LOGIN_MODE || "product";
  const isStateLogin = loginMode === "state";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [formAlert, setFormAlert] = useState({
    message: "",
    severity: "error",
  });
  const ranonce = useRef(false);

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: "Quicksand",
      backgroundColor: "#fff",
    },
    "& .MuiInputLabel-root": { fontFamily: "Quicksand" },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #fff inset",
      WebkitTextFillColor: "#333",
    },
  };

  const showFormAlert = (message, severity = "error") => {
    setFormAlert({ message, severity });
  };

  const clearFormAlert = () => {
    setFormAlert({ message: "", severity: "error" });
  };
  const [showModal, setShowModal] = useState(false);
  const [showAudioDiagnostic, setShowAudioDiagnostic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_event, newValue) => {
    clearFormAlert();
    setActiveTab(newValue);
    setUsername("");
    setPassword("");
  };

  const handleStudentUsernameChange = (e) => {
    clearFormAlert();
    const value = e.target.value.replace(/\D/g, "");
    setUsername(value);
  };

  const handleGuestSuffixChange = (e) => {
    clearFormAlert();
    let value = e.target.value;
    if (value.startsWith("GT_")) {
      value = value.slice(3);
    }
    setUsername(value);
  };

  const handleProductUsernameChange = (e) => {
    clearFormAlert();
    setUsername(e.target.value);
  };

  const getEffectiveUsername = () => {
    if (!isStateLogin) return username.trim();
    if (activeTab === 0) return username;
    const suffix = username.trim();
    return suffix ? `GT_${suffix}` : "";
  };

  const handleWordClick = () => {
    setShowModal(true);
  };

  const isLoginSuccessful = (details) =>
    details?.message === "Login successful" ||
    details?.message === "Registered successfully";

  const setupUserSession = async (token, uname) => {
    localStorage.setItem("apiToken", token);
    setLocalData("profileName", uname);

    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();

    await initialize({
      context: {
        mode: process.env.REACT_APP_MODE,
        authToken: token,
        did: localStorage.getItem("deviceId") || visitorId,
        uid: uname || "anonymous",
        channel: process.env.REACT_APP_CHANNEL,
        env: process.env.REACT_APP_ENV,
        pdata: {
          id: process.env.REACT_APP_ID,
          ver: [
            process.env.REACT_APP_VER,
            process.env.REACT_APP_BUILD_NUMBER,
            process.env.REACT_APP_COMMIT_ID?.substring(0, 7),
          ]
            .filter(Boolean)
            .join("-"),
          pid: process.env.REACT_APP_PID,
        },
        tags: [""],
        timeDiff: 0,
        host: process.env.REACT_APP_HOST,
        endpoint: process.env.REACT_APP_ENDPOINT,
        apislug: process.env.REACT_APP_APISLUG,
      },
      config: {},
      metadata: {},
    });

    if (!ranonce.current) {
      if (!localStorage.getItem("contentSessionId")) {
        startEvent();
      }
      ranonce.current = true;
    }
  };

  const handleLoginError = (error) => {
    console.error("Login Error:", error);

    reportError({
      type: "login_error",
      status: error?.response?.status,
      message: error?.response?.data?.message || error?.message,
      stack: error?.stack,
    });

    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message;

      if (message === "Required fields are missing") {
        showFormAlert(
          isStateLogin
            ? activeTab === 0
              ? "Enter your PEN ID in Username (numbers only), then your password."
              : "Enter your guest username (starting with GT_) and password."
            : "Enter your username and password.",
          "warning"
        );
      } else if (status === 401 && message === "Unauthorized access") {
        showFormAlert(
          isStateLogin
            ? activeTab === 0
              ? "We could not find this PEN ID. Check the number or register first."
              : "Guest login failed. Check your username or contact support."
            : "We could not sign you in. Check your username and password.",
          "error"
        );
      } else if (status === 400) {
        showFormAlert(
          message || "Please check Username and Password, then try again.",
          "error"
        );
      } else {
        showFormAlert(message || "Login failed. Please try again.", "error");
      }
    } else if (error.request) {
      setNetworkError(true);
    } else {
      showFormAlert(
        "Something went wrong. Please try again in a moment.",
        "error"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearFormAlert();
    if (!password) {
      showFormAlert("Please enter your password.", "warning");
      return;
    }
    if (!isStateLogin) {
      if (!username.trim()) {
        showFormAlert("Please enter your username.", "warning");
        return;
      }
    } else if (activeTab === 0 && !username) {
      showFormAlert("Please enter your PEN ID.", "warning");
      return;
    } else if (activeTab === 1 && !username.trim()) {
      showFormAlert(
        "Enter your guest ID in the field after GT_, then your password.",
        "warning"
      );
      return;
    }

    const effectiveUsername = getEffectiveUsername();
    localStorage.clear();
    setLoading(true);

    setIsSubmitting(true);
    try {
      if (isStateLogin) {
        const userCheckDetails = await fetchUserCheck(effectiveUsername);

        if (!isLoginSuccessful(userCheckDetails)) {
          showFormAlert(
            userCheckDetails?.message ||
              "We could not verify your account. Check your details and try again.",
            "error"
          );
          return;
        }
      }

      const usernameDetails = await fetchVirtualId(effectiveUsername);
      const token = usernameDetails?.result?.token;

      if (!token) {
        showFormAlert(
          "Incorrect username or password. Please try again.",
          "error"
        );
        return;
      }

      await setupUserSession(token, effectiveUsername);
      setShowAudioDiagnostic(true);
    } catch (error) {
      handleLoginError(error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("apiToken") === null) return;

    // If the user came from somewhere inside the app (e.g., back-button from
    // /practice), return them there. Otherwise default to /discover-start.
    if (globalThis.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/discover-start", { replace: true });
    }
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(240,240,240,0.6)",
        }}
      >
        <CircularProgress size="3rem" sx={{ color: "#E15404" }} />
      </Box>
    );
  }

  if (networkError) {
    return <ServerErrorScreen onRetry={() => setNetworkError(false)} />;
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${textureImage})`,
        backgroundRepeat: "round",
        backgroundSize: "contain",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "500px",
          px: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            mb: 3,
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Box
            sx={{
              background: "#ffffff",
              border: "3px solid #6DAF19",
              borderRadius: "20px",
              p: { xs: 2, sm: 2.5 },
              position: "relative",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderTop: "12px solid #ffffff",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                bottom: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "13px solid transparent",
                borderRight: "13px solid transparent",
                borderTop: "13px solid #6DAF19",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Quicksand",
                fontSize: { xs: "20px", sm: "24px", md: "28px" },
                fontWeight: 600,
                color: "#333333",
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              Welcome! Let's get started!
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <img
            src={panda}
            alt="panda"
            style={{
              width: isMobile ? "150px" : "200px",
              height: "auto",
              filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
            }}
          />
        </Box>

        <Box
          sx={{
            width: "100%",
            background: "white",
            borderRadius: "20px",
            p: { xs: 3, sm: 4 },
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          }}
        >
          {isStateLogin ? (
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mb: 2,
                "& .MuiTab-root": { fontFamily: "Quicksand", fontWeight: 600 },
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  "& .Mui-selected": { color: "#5a9a15 !important" },
                  "& .MuiTabs-indicator": { backgroundColor: "#6DAF19" },
                }}
              >
                <Tab label="Student" />
                <Tab label="Guest" />
              </Tabs>
            </Box>
          ) : null}

          {formAlert.message ? (
            <Alert
              severity={formAlert.severity}
              onClose={clearFormAlert}
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: "12px",
                fontFamily: "Quicksand",
                fontSize: "0.95rem",
                alignItems: "center",
                borderWidth: 2,
                ...(formAlert.severity === "warning" && {
                  borderColor: "#c9a227",
                  color: "#5c4d12",
                  bgcolor: "rgba(201, 162, 39, 0.08)",
                  "& .MuiAlert-icon": { color: "#a67c00" },
                }),
                ...(formAlert.severity === "error" && {
                  borderColor: "#e57373",
                  color: "#5d1f1f",
                  bgcolor: "rgba(229, 115, 115, 0.08)",
                  "& .MuiAlert-icon": { color: "#d32f2f" },
                }),
              }}
            >
              {formAlert.message}
            </Alert>
          ) : null}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {!isStateLogin ? (
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleProductUsernameChange}
                    required
                    autoComplete="username"
                    sx={textFieldSx}
                  />
                ) : activeTab === 0 ? (
                  <TextField
                    label="Username (PEN ID)"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleStudentUsernameChange}
                    required
                    type="number"
                    sx={textFieldSx}
                  />
                ) : (
                  <TextField
                    label="Guest ID"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={handleGuestSuffixChange}
                    required
                    placeholder="your_guest_id"
                    helperText="Type only the part after GT_; GT_ is added for you."
                    FormHelperTextProps={{
                      sx: { fontFamily: "Quicksand", fontSize: "0.8rem" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            mr: 0,
                            "& .MuiTypography-root": {
                              fontFamily: "Quicksand",
                              fontWeight: 700,
                              color: "#5a9a15",
                            },
                          }}
                        >
                          <Typography component="span" variant="body1">
                            GT_
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldSx}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => {
                    clearFormAlert();
                    setPassword(e.target.value);
                  }}
                  sx={textFieldSx}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    background:
                      "linear-gradient(135deg, #6DAF19 0%, #5a9a15 100%)",
                    color: "white",
                    fontFamily: "Quicksand",
                    fontWeight: 700,
                    borderRadius: "25px",
                    padding: { xs: "16px 32px", sm: "18px 40px" },
                    textTransform: "none",
                    fontSize: { xs: "18px", sm: "20px", md: "22px" },
                    boxShadow: "0 8px 20px rgba(109, 175, 25, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a9a15 0%, #4a8a10 100%)",
                      transform: "scale(1.02)",
                      boxShadow: "0 12px 24px rgba(109, 175, 25, 0.5)",
                    },
                    "&.Mui-disabled": {
                      background:
                        "linear-gradient(135deg, #a8d46b 0%, #8ec050 100%)",
                      color: "rgba(255,255,255,0.85)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : isStateLogin ? (
                    activeTab === 0 ? (
                      "Login as Student"
                    ) : (
                      "Login as Guest"
                    )
                  ) : (
                    "Login"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

      <LanguageModalNew show={showModal} onClose={() => setShowModal(false)} />
      <AudioDiagnosticModal
        show={showAudioDiagnostic}
        onClose={() => {
          setShowAudioDiagnostic(false);
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            setLocalData("audioDiagnosticShown", "true");
          }
          handleWordClick();
          navigate("/discover-start");
        }}
      />
    </Box>
  );
};

export default LoginPage;
