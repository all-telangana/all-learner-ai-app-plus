/* global globalThis */
import MainLayout from "../Layout/MainLayout";
import ServerErrorScreen from "../ServerErrorScreen/ServerErrorScreen";
import assessmentBackground from "../../assets/images/assessmentBackground.png";
import {
  Box,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  isMuiElement,
  createTheme,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  Button,
  ListItemText,
  Divider,
} from "../../../node_modules/@mui/material/index";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import TranslateIcon from "@mui/icons-material/Translate";
import MicIcon from "@mui/icons-material/Mic";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useMediaQuery, useTheme } from "@mui/material";
import LogoutImg from "../../assets/images/logout.svg";
import { styled } from "@mui/material/styles";
import {
  getLocalData,
  getParameter,
  languages,
  levelConfig,
  setLocalData,
  getLanguageOrDefault,
} from "../../utils/constants";
import { useAlphabetDemo } from "../../context/AlphabetDemoContext";
import {
  RoundTick,
  StartAssessmentButton,
  SelectLanguageButton,
} from "../Icons/SvgIcons";
import { getFontFamily } from "../../utils/fontUtils";
import practicebg from "../../assets/images/practice-bg.svg";
import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";
import { useEffect, useState, useMemo } from "react";
import HelpLogo from "../../assets/help.png";
import CloseIcon from "@mui/icons-material/Close";

import axios from "../../../node_modules/axios/index";
// import { useDispatch } from 'react-redux';
import { setVirtualId } from "../../store/slices/user.slice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import desktopLevelB from "../../assets/images/beginnerLevel.png";
import desktopLevel1 from "../../assets/images/desktopLevel1.png";
import desktopLevel2 from "../../assets/images/desktopLevel2.png";
import desktopLevel3 from "../../assets/images/desktopLevel3.jpg";
import desktopLevel4 from "../../assets/images/desktopLevel4.png";
import desktopLevel5 from "../../assets/images/desktopLevel5.png";
import desktopLevel6 from "../../assets/images/desktopLevel6.png";
import desktopLevel7 from "../../assets/images/desktopLevel7.png";
import desktopLevel8 from "../../assets/images/desktopLevel8.png";
import desktopLevel9 from "../../assets/images/desktopLevel9.png";
import desktopLevel10 from "../../assets/images/desktopLevel10.png";
import desktopLevel11 from "../../assets/images/desktopLevel11.png";
import desktopLevel12 from "../../assets/images/desktopLevel12.png";
import desktopLevel13 from "../../assets/images/desktopLevel13.png";
import desktopLevel14 from "../../assets/images/desktopLevel14.png";
import desktopLevel15 from "../../assets/images/desktopLevel15.png";
import desktopLevel1Mobile from "../../assets/images/mobilebglevel1.png";
import desktopLevel2Mobile from "../../assets/images/mobilebglevel2.png";
import desktopLevel3Mobile from "../../assets/images/mobilebglevel3.png";
import desktopLevel4Mobile from "../../assets/images/mobilebglevel4.png";
import desktopLevel5Mobile from "../../assets/images/mobilebglevel5.png";
import desktopLevel6Mobile from "../../assets/images/mobilebglevel6.png";
import desktopLevel7Mobile from "../../assets/images/mobilebglevel7.png";
import desktopLevel8Mobile from "../../assets/images/mobilebglevel8.png";
import desktopLevel9Mobile from "../../assets/images/mobilebglevel9.png";
import desktopLevel10Mobile from "../../assets/images/mobilebglevel10.png";
import rOneImage from "../../assets/R1Back.png";
import rTwoImage from "../../assets/R2Back.png";
import rThreeImage from "../../assets/R3Back.png";
import rFourImage from "../../assets/R4Back.png";
import profilePic from "../../assets/images/profile_url.png";
import textureImage from "../../assets/images/textureImage.png";
import back from "../../assets/images/back-arrow.png";
import { jwtDecode } from "jwt-decode";
import config from "../../utils/urlConstants.json";
import panda from "../../assets/images/panda.svg";
import cryPanda from "../../assets/images/cryPanda.svg";
import { uniqueId } from "../../services/utilService";
import { end, interact } from "../../services/telemetryService";
import { levelMapping } from "../../utils/levelData";
import scoreView from "../../assets/images/scoreView.svg";
import {
  fetchUserPoints,
  logoutUser,
} from "../../services/orchestration/orchestrationService";
import { fetchVirtualId } from "../../services/userservice/userService";
import { getFetchMilestoneDetails } from "../../services/learnerAi/learnerAiService";
import * as Assets from "../../utils/imageAudioLinks";
import NumberFlow from "@number-flow/react";
import LanguageModalNew from "../../utils/LanguageModal";
import { AudioDiagnosticModal } from "../AudioDiagnostic";
import { getF1FlowStep } from "../../RFlow/F1";
import { getF2FlowStep } from "../../RFlow/F2";
import { getF3FlowStep } from "../../RFlow/F3";
import AlphabetChart from "./AlphabetChart";
import AlphabetChartPreview from "./AlphabetChartPreview";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getUiStrings } from "../../constants/strings";

const theme = createTheme();

export const LanguageModal = ({ lang, setLang, setOpenLangModal }) => {
  const [selectedLang, setSelectedLang] = useState(lang);
  const ui = useMemo(() => getUiStrings(lang || "en"), [lang]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        overflow: "hidden",
        py: { xs: 1, sm: 2 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "min(600px, calc(100vw - 24px))",
          maxHeight: "min(90vh, 100%)",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          overflow: "hidden",
          flexShrink: 0,
          px: { xs: 1, sm: 2 },
          pb: { xs: 1.5, sm: 2 },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            mt: {
              xs: "clamp(12px, 2.5vh, 28px)",
              sm: "clamp(16px, 3vh, 32px)",
            },
            mb: { xs: 0.5, sm: 1 },
            px: 1,
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <Box
            component="span"
            sx={{
              color: "#000000",
              fontWeight: 600,
              fontSize: {
                xs: "clamp(22px, 5.5vw, 30px)",
                sm: "clamp(28px, 3.5vw, 36px)",
              },
              fontFamily: getFontFamily(lang),
              lineHeight: 1.2,
            }}
          >
            {ui.ASSESSMENT_SELECT_LANGUAGE}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            flex: "1 1 auto",
            minHeight: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "stretch",
              alignContent: "center",
              gap: "clamp(12px, 3vw, 20px)",
              width: "100%",
              maxWidth: "540px",
              py: { xs: 0.5, sm: 1 },
              boxSizing: "border-box",
              "& > *": {
                flex: "1 1 140px",
                maxWidth: { xs: "min(200px, calc(50% - 8px))", sm: "200px" },
                display: "flex",
                justifyContent: "center",
                boxSizing: "border-box",
              },
              "&:has(> *:nth-child(2):last-child) > *": {
                flex: {
                  xs: "1 1 calc(50% - 10px)",
                  sm: "1 1 calc(50% - 12px)",
                },
                maxWidth: {
                  xs: "calc(50% - 10px)",
                  sm: "calc(50% - 12px)",
                },
              },
            }}
          >
            {languages.map((elem) => {
              const isSelectedLang = elem.lang === selectedLang;
              return (
                <Box key={elem.lang}>
                  <Box
                    onClick={() => setSelectedLang(elem.lang)}
                    sx={{
                      cursor: "pointer",
                      width: "100%",
                      maxWidth: "100%",
                      height: {
                        xs: "clamp(88px, 22vw, 118px)",
                        sm: "clamp(100px, 12vh, 140px)",
                      },
                      background: isSelectedLang ? "#EE6931" : "#EFEFEF",
                      borderRadius: "10px",
                      border: `3px solid ${
                        isSelectedLang ? "#A03D13" : "#DADADA"
                      }`,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "center",
                      boxSizing: "border-box",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      {isSelectedLang ? (
                        <Box
                          mt={"-2px"}
                          mr={"8px"}
                          sx={{ transform: "scale(0.9)" }}
                        >
                          <RoundTick />
                        </Box>
                      ) : (
                        <Box
                          mt={"-2px"}
                          mr={"8px"}
                          sx={{
                            height: "16px",
                            width: "16px",
                            borderRadius: "15px",
                            border: "1.5px solid #999999",
                          }}
                        ></Box>
                      )}
                    </Box>
                    <Box
                      mt="-4px"
                      component="span"
                      sx={{
                        color: isSelectedLang ? "#FFFFFF" : "#000000",
                        fontWeight: 600,
                        fontSize: {
                          xs: "clamp(22px, 8vw, 40px)",
                          sm: "clamp(28px, 4vw, 46px)",
                        },
                        fontFamily: "Quicksand",
                        lineHeight: 1.1,
                      }}
                    >
                      {elem.symbol}
                    </Box>
                    <Box
                      mt={0.25}
                      component="span"
                      sx={{
                        color: isSelectedLang ? "#FFFFFF" : "#000000",
                        fontWeight: 600,
                        fontSize: {
                          xs: "clamp(11px, 3vw, 16px)",
                          sm: "clamp(14px, 1.8vw, 18px)",
                        },
                        fontFamily: "Quicksand",
                        lineHeight: 1.2,
                        textAlign: "center",
                        px: 0.25,
                        wordBreak: "break-word",
                      }}
                    >
                      {elem.name}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
            mt: { xs: 1.5, sm: 2 },
            mb: 0.5,
          }}
        >
          <Box
            onClick={() => {
              setLang(selectedLang);
              setOpenLangModal(false);
            }}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "20px",
                fontFamily: getFontFamily(lang),
                display: "flex",
                alignItems: "center",
              }}
            >
              {ui.ASSESSMENT_LANG_CONFIRM}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const MessageDialog = ({
  message,
  closeDialog,
  isError,
  dontShowHeader,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ui = getUiStrings(getLocalData("lang") || "en");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 999999,
      }}
    >
      <Box
        sx={{
          width: "600px",
          minHeight: "424px",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundImage: `url(${textureImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "round",
          boxShadow: "0px 4px 20px -1px rgba(0, 0, 0, 0.00)",
          backdropFilter: "blur(25px)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 10,
            bottom: 0,
            pointerEvents: "none",
          }}
        >
          {isError ? (
            <img src={cryPanda} alt="cryPanda" />
          ) : (
            <img src={panda} alt="panda" />
          )}
        </Box>

        <Box mt="32px">
          {!dontShowHeader && (
            <Typography
              className={isError ? "failureHeader" : "successHeader"}
              sx={{
                mt: 3,
                textAlign: "center",
              }}
            >
              {isError ? ui.ASSESSMENT_DIALOG_OOPS : ui.HURRAY}
            </Typography>
          )}
        </Box>

        <Box
          mt="28px"
          display={"flex"}
          flexWrap={"wrap"}
          padding={"0px 10px 0px 10px"}
          width={"80%"}
        >
          <span
            style={{
              color: "#000000",
              fontWeight: 700,
              fontSize: isMobile ? " 20px" : "40px",
              fontFamily: "Quicksand",
              lineHeight: isMobile ? "35px" : "62px",
              textAlign: "center",
            }}
          >
            {message || ``}
          </span>
        </Box>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          mt={isMobile ? "15px" : "60px"}
          // mr="110px"
          mb={2}
        >
          <Box
            onClick={() => {
              closeDialog();
            }}
            sx={{
              cursor: "pointer",
              background: "#6DAF19",
              minWidth: "173px",
              height: "55px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0px 24px 0px 20px",
              zIndex: "9999",
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: isMobile ? "16px" : "20px",
                fontFamily: "Quicksand",
              }}
            >
              {ui.ASSESSMENT_DIALOG_CONTINUE}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const CustomIconButton = styled(IconButton)({
  padding: "6px 20px",
  color: "white",
  fontSize: "20px",
  fontWeight: 500,
  borderRadius: "8px",
  marginRight: "10px",
  fontFamily: '"Lato", "sans-serif"',
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .logout-img": {
    display: "block",
    filter: "invert(1)",
  },
});

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: "1.2rem", // Adjust the font size as needed
  },
});

export const ProfileHeader = ({
  level,
  setOpenLangModal,
  lang,
  profileName,
  points = 0,
  handleBack,
  vocabCount = 0,
  wordCount = 0,
}) => {
  const { setIsAlphabetDemoActive } = useAlphabetDemo();
  const language = lang || getLocalData("lang");
  const ui = useMemo(() => getUiStrings(language || "en"), [language]);
  let username = profileName || getLocalData("profileName");

  // Check if F2 flow is active and update username display
  const getMilestoneData = () => {
    try {
      const milestoneStr = getLocalData("getMilestone");
      if (milestoneStr) {
        return JSON.parse(milestoneStr);
      }
    } catch (e) {
      console.error("Error parsing getMilestone:", e);
    }
    return null;
  };
  const milestoneData = getMilestoneData();
  const milestoneLevel = milestoneData?.data?.milestone_level || null;
  const subMilestoneLevel = milestoneData?.data?.sub_milestone_level || null;
  const shouldShowF1 = milestoneLevel === "B" && subMilestoneLevel === "F1";
  const shouldShowF2 = milestoneLevel === "B" && subMilestoneLevel === "F2";
  const shouldShowF3 = milestoneLevel === "B" && subMilestoneLevel === "F3";
  const f2FlowStep = getF2FlowStep();
  const f3FlowStep = getF3FlowStep();
  const isF2FlowActive = shouldShowF2 && f2FlowStep.step !== null;
  const isF3FlowActive = shouldShowF3 && f3FlowStep.step !== null;

  // If F3 flow is active and username contains "F1" or "F2", replace with "F3"
  if (
    isF3FlowActive &&
    username &&
    typeof username === "string" &&
    (username.includes("F1") || username.includes("F2"))
  ) {
    username = username.replace(/F[12]/g, "F3");
  }
  // If F2 flow is active and username contains "F1", replace with "F2"
  else if (
    isF2FlowActive &&
    username &&
    typeof username === "string" &&
    username.includes("F1")
  ) {
    username = username.replace(/F1/g, "F2");
  }

  const navigate = useNavigate();
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const [animatedVocabCount, setAnimatedVocabCount] = useState(0);
  const [animatedWordCount, setAnimatedWordCount] = useState(0);
  const [milestone, setMilestone] = useState(0);
  const [showAudioDiagnostic, setShowAudioDiagnostic] = useState(false);
  const [openAlphabetModal, setOpenAlphabetModal] = useState(false);
  const [openAlphabetPreview, setOpenAlphabetPreview] = useState(false);
  const [showChartPointer, setShowChartPointer] = useState(false);
  const chartAudioRef = React.useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const rawMilestone = getLocalData("getMilestone");

    try {
      const parsed = rawMilestone ? JSON.parse(rawMilestone) : null;
      const levelStr = parsed?.data?.milestone_level || "m0";
      const levelNum = parseInt(levelStr.replace("m", ""), 10);
      setMilestone(levelNum);
    } catch (e) {
      console.error("Failed to parse milestone data:", e);
      setMilestone(0);
    }
  }, [lang]); // Update when language changes to refresh milestone data

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedVocabCount(vocabCount);
    }, 200);

    return () => clearTimeout(timeout);
  }, [vocabCount]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedWordCount(wordCount);
    }, 200);

    return () => clearTimeout(timeout);
  }, [wordCount]);

  // Listen for demo completion to trigger chart pointer

  useEffect(() => {
    const playChartAudio = () => {
      // 🔒 Prevent double audio
      if (chartAudioRef.current) {
        chartAudioRef.current.pause();
        chartAudioRef.current.currentTime = 0; // rewind (good practice)
        chartAudioRef.current = null;
      }

      const audioPath = `${process.env.PUBLIC_URL}/audio/audio-preview/Alphabet Chart/Chart Icon/${language}/ChartNarration.wav`;
      const audio = new Audio(audioPath);
      chartAudioRef.current = audio;

      audio.onplay = () => {
        setShowChartPointer(true);
        setIsAudioPlaying(true);
      };

      audio.onended = () => {
        setShowChartPointer(false); // 👈 demo finished
        setIsAudioPlaying(false);
        chartAudioRef.current = null;
        setIsAlphabetDemoActive(false);
        globalThis.dispatchEvent(new Event("alphabetDemoStop"));
      };

      audio.onerror = () => {
        console.warn("Chart audio missing, showing pointer only");
        setShowChartPointer(false);
        setIsAudioPlaying(false);
        chartAudioRef.current = null;
        setIsAlphabetDemoActive(false);
        globalThis.dispatchEvent(new Event("alphabetDemoStop"));
      };

      setTimeout(() => {
        // 🛡️ Guard: if alphabetDemoStop cleared the ref, don't play
        if (chartAudioRef.current !== audio) return;
        audio.play().catch(() => {
          setShowChartPointer(false);
          setIsAudioPlaying(false);
          chartAudioRef.current = null;
          setIsAlphabetDemoActive(false);
          globalThis.dispatchEvent(new Event("alphabetDemoStop"));
        });
      }, 500);
    };
    // 🛡️ Initial mount check: validate F1 flow + milestone before playing
    // This blocks stale showAlphabetDemo from a previous session
    const checkDemoOnMount = () => {
      const demoState = getLocalData("showAlphabetDemo");
      if (demoState !== "true") return;

      // Check if F1 flow is actually active
      let isF1Active = false;
      try {
        const msStr = getLocalData("getMilestone");
        if (msStr) {
          const msData = JSON.parse(msStr);
          isF1Active =
            msData?.data?.milestone_level === "B" &&
            msData?.data?.sub_milestone_level === "F1";
        }
      } catch (e) {
        // ignore parse errors
      }

      if (isF1Active) {
        // 🎯 Only auto-play for IMMEDIATE milestones (L1=index 0)
        // Deferred milestones (A1=6, A2=13, A3=20) should ONLY play
        // when user clicks "Start Game" → alphabetDemoTriggerRequest event
        const immediateOnlyMilestones = [0];
        const rawIndex = getLocalData("f1FlowIndex");
        const currentF1Index = rawIndex !== null ? Number(rawIndex) : -1;

        // 🔒 Also check if this milestone was already played (prevents replay on re-login)
        let playedIndices = [];
        try {
          const playedRaw = getLocalData("playedAlphabetDemoIndices");
          playedIndices = playedRaw ? JSON.parse(playedRaw) : [];
        } catch (e) {
          playedIndices = [];
        }

        if (
          immediateOnlyMilestones.includes(currentF1Index) &&
          !playedIndices.includes(currentF1Index)
        ) {
          playChartAudio();
          return;
        }
      }

      // Not F1 flow or not at an allowed milestone → clear stale flag
      setLocalData("showAlphabetDemo", "false");
      setIsAlphabetDemoActive(false);
    };

    // 🎬 Event-based trigger: Practice.jsx already validated the milestone
    // before dispatching alphabetDemoComplete, so just play
    const handleDemoEvent = () => {
      const demoState = getLocalData("showAlphabetDemo");
      if (demoState === "true") {
        playChartAudio();
      }
    };

    // Initial check (validated)
    checkDemoOnMount();

    const handleStorageChange = (e) => {
      if (e.key === "showAlphabetDemo" && e.newValue === "true") {
        handleDemoEvent();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("alphabetDemoComplete", handleDemoEvent);

    // 🔇 Listen for stop signal from Practice.jsx (non-milestone cleanup)
    const handleDemoStop = () => {
      if (chartAudioRef.current) {
        chartAudioRef.current.pause();
        chartAudioRef.current.currentTime = 0;
        chartAudioRef.current = null;
      }
      setShowChartPointer(false);
      setIsAudioPlaying(false);
      setLocalData("showAlphabetDemo", "false");
      setIsAlphabetDemoActive(false);
    };
    window.addEventListener("alphabetDemoStop", handleDemoStop);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("alphabetDemoComplete", handleDemoEvent);
      window.removeEventListener("alphabetDemoStop", handleDemoStop);

      if (chartAudioRef.current) {
        chartAudioRef.current.pause();
        chartAudioRef.current = null;
      }
    };
  }, [language]);

  const handleAlphabetChartOpen = () => {
    // Check if demo was already completed (returns null first time → falsy)
    const isDemoComplete = getLocalData("AlphabetDemoCompleted") === "true";
    interact("ET", "Open Alphabet Chart", "alphabet-chart");
    if (isDemoComplete) {
      // 📘 User has seen demo before → show normal chart/modal
      setOpenAlphabetModal(true);
    } else {
      // 🎬 First time → show demo/preview
      setOpenAlphabetPreview(true);

      // Mark as completed so next time we skip demo
      setLocalData("AlphabetDemoCompleted", "true");
    }

    // Common cleanup regardless of demo or normal mode
    setShowChartPointer(false);
    setIsAudioPlaying(false);

    if (chartAudioRef.current) {
      chartAudioRef.current.pause();
      chartAudioRef.current = null;
    }
  };

  useEffect(() => {
    // Cleanup function – runs when component unmounts
    // or when dependencies change (if you add any)
    return () => {
      if (chartAudioRef.current) {
        chartAudioRef.current.pause();
        chartAudioRef.current.currentTime = 0;
        chartAudioRef.current = null;
        setShowChartPointer(false); // important if pointer is visual
        setIsAudioPlaying(false);
      }
    };
  }, []);

  const getAlphabetTooltipText = () => {
    const texts = {
      en: {
        title: "📚 Alphabet Chart",
        desc: "If you need help with an alphabet or syllable, check the chart here.",
      },
      te: {
        title: "📚 అక్షరమాల చార్ట్",
        desc: "మీకు ఏదైనా అక్షరం లేదా అక్షర సమూహంతో సహాయం కావాలా? అయితే, ఇక్కడ ఉన్న పట్టికను చూడండి.",
      },
      kn: {
        title: "📚 ವರ್ಣಮಾಲೆ ಚಾರ್ಟ್‌",
        desc: "ನಿಮಗೆ ಅಕ್ಷರಗಳು ಅಥವಾ ಗುಣಿತಾಕ್ಷರಗಳನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಲು ಸಹಾಯ ಬೇಕಾದರೆ, ಇಲ್ಲಿರುವ ಚಾರ್ಟ್‌ ನೋಡಿ.",
      },
      hi: {
        title: "📚 वर्णमाला चार्ट",
        desc: "यदि आपको किसी वर्णमाला या सिलेबल के लिए सहायता चाहिए, तो यहाँ चार्ट देखें।",
      },
    };

    return texts[lang] || texts.en;
  };
  const tooltipText = getAlphabetTooltipText();

  const handleProfileBack = () => {
    try {
      if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
        window.parent.postMessage(
          { type: "restore-iframe-content" },
          window?.location?.ancestorOrigins?.[0] ||
            window.parent.location.origin
        );
        navigate("/");
      } else {
        navigate("/discover-start");
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed, but proceeding with local logout");
    } finally {
      localStorage.clear();
      end({});
      navigate("/login");
    }
  };

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      <AudioDiagnosticModal
        show={showAudioDiagnostic}
        onClose={() => setShowAudioDiagnostic(false)}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: isMobile ? "75px" : "65px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(3px)",
          display: "flex",
          alignItems: "center",
          zIndex: 5555,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "50%" },
          }}
        >
          {handleBack && (
            <Box sx={{ ml: { xs: "10px", sm: "24px" } }}>
              <IconButton onClick={handleBack}>
                <img
                  src={back}
                  alt="back"
                  style={{ height: isMobile ? "18px" : "30px" }}
                />
              </IconButton>
            </Box>
          )}
          {username && (
            <>
              <Box
                ml={
                  handleBack
                    ? { xs: "10px", sm: "8px" }
                    : { xs: "10px", sm: "94px" }
                }
                sx={{ cursor: "pointer" }}
                onClick={handleProfileBack}
              >
                <img
                  src={profilePic}
                  alt="profile-pic"
                  style={{ height: isMobile ? "25px" : "30px" }}
                />
              </Box>
              <Box ml={isMobile ? "5px" : "12px"}>
                <span
                  style={{
                    color: "#000000",
                    fontWeight: 700,
                    fontSize: { xs: "10px", sm: "16px" },
                    fontFamily: "Quicksand",
                    lineHeight: "25px",
                  }}
                >
                  {username || ""}
                </span>
              </Box>
            </>
          )}
          {milestone > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: isMobile ? 1 : 4,
                mt: isMobile ? 1 : 0,
                ml: isMobile ? 5 : 2,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: {
                  xs: "center",
                  sm: "initial",
                },
                width: isMobile ? "35%" : "auto",
              }}
            >
              {/* Words Learnt */}
              <Box
                sx={{
                  position: "relative",
                  background:
                    "linear-gradient(90deg, #7B2CBF 0%, #9D4EDD 100%)",
                  border: "1px solid white",
                  color: "#fff",
                  borderRadius: "12px",
                  px: 3,
                  py: "4px",
                  display: "flex",
                  alignItems: "center",
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  boxShadow: 2,
                }}
              >
                <Box
                  sx={{
                    fontSize: isMobile ? "10px" : "20px",
                    fontWeight: "bold",
                    mr: 1,
                    fontFamily: "Quicksand",
                  }}
                >
                  {vocabCount > 0 ? (
                    <NumberFlow
                      value={animatedVocabCount}
                      decimals={0}
                      duration={4000}
                      style={{
                        fontSize: isMobile ? "10px" : "18px",
                        fontWeight: "bold",
                        fontFamily: "Quicksand",
                        color: "white",
                      }}
                    />
                  ) : (
                    "-"
                  )}
                </Box>
                <Box
                  sx={{
                    fontSize: isMobile ? "8px" : "16px",
                    fontWeight: 600,
                    mr: 2,
                    fontFamily: getFontFamily(lang),
                    whiteSpace: "nowrap",
                  }}
                >
                  {ui.ASSESSMENT_WORDS_LEARNT}
                </Box>
                <Box
                  component="img"
                  src={Assets.books}
                  alt="Books"
                  sx={{
                    position: "absolute",
                    right: {
                      xs: "8px",
                      sm: "-20px",
                    },
                    top: {
                      xs: "50%",
                      sm: "auto",
                    },
                    transform: {
                      xs: "translateY(-50%)",
                      sm: "none",
                    },
                    width: isMobile ? "17px" : "40px",
                    height: isMobile ? "17px" : "40px",
                    border: "4px solid white",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                  }}
                />
              </Box>

              {/* Words Per Minute */}
              {lang === "en" && (
                <Box
                  sx={{
                    position: "relative",
                    background:
                      "linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)",
                    border: "1px solid white",
                    color: "#fff",
                    borderRadius: "12px",
                    px: 3,
                    py: "4px",
                    display: "flex",
                    alignItems: "center",
                    width: {
                      xs: "100%",
                      sm: "auto",
                    },
                    boxShadow: 2,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: isMobile ? "10px" : "20px",
                      fontWeight: "bold",
                      mr: 1,
                      fontFamily: "Quicksand",
                    }}
                  >
                    {wordCount > 0 ? (
                      <NumberFlow
                        value={animatedWordCount}
                        decimals={0}
                        duration={1000}
                        style={{
                          fontSize: isMobile ? "10px" : "18px",
                          fontWeight: "bold",
                          fontFamily: "Quicksand",
                          color: "white",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </Box>
                  <Box
                    sx={{
                      fontSize: isMobile ? "8px" : "16px",
                      fontWeight: 600,
                      mr: 2,
                      fontFamily: "Quicksand",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ui.ASSESSMENT_WORDS_PER_MINUTE}
                  </Box>
                  <Box
                    component="img"
                    src={Assets.clock}
                    alt="Clock"
                    sx={{
                      position: "absolute",
                      right: {
                        xs: "8px",
                        sm: "-20px",
                      },
                      top: {
                        xs: "50%",
                        sm: "auto",
                      },
                      transform: {
                        xs: "translateY(-50%)",
                        sm: "none",
                      },
                      width: isMobile ? "17px" : "40px",
                      height: isMobile ? "17px" : "40px",
                      border: "4px solid white",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Box>

        {isMobile && (
          <Box sx={{ position: "relative", zIndex: 10, mr: 3 }}>
            <IconButton
              onClick={toggleMenu}
              sx={{
                backgroundColor: "#fff",
                border: "2px solid #ccc",
                borderRadius: "8px",
                ml: 1,
              }}
            >
              <MenuIcon />
            </IconButton>

            <Collapse in={menuOpen}>
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  mt: 1,
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  boxShadow: 3,
                  width: "200px",
                  overflow: "hidden",
                }}
              >
                <List disablePadding>
                  <ListItemButton
                    onClick={() =>
                      setOpenLangModal
                        ? setOpenLangModal(true)
                        : setOpenMessageDialog({
                            message: ui.ASSESSMENT_GO_HOME_CHANGE_LANGUAGE,
                            dontShowHeader: true,
                          })
                    }
                  >
                    <TranslateIcon sx={{ mr: 1 }} />
                    <ListItemText
                      primary={ui.ASSESSMENT_SELECT_LANGUAGE}
                      primaryTypographyProps={{
                        fontFamily: "Quicksand",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#333F61",
                      }}
                    />
                  </ListItemButton>
                  <Divider />
                  <ListItemButton
                    onClick={() => {
                      // Telemetry event for mobile menu click
                      interact(
                        "ET",
                        "Open Audio Diagnostic",
                        "header-mobile-menu"
                      );
                      setShowAudioDiagnostic(true);
                      setMenuOpen(false);
                    }}
                  >
                    <MicIcon sx={{ mr: 1, color: "#6DAF19" }} />
                    <ListItemText
                      primary={ui.ASSESSMENT_AUDIO_TEST}
                      primaryTypographyProps={{
                        fontFamily: "Quicksand",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#333F61",
                      }}
                    />
                  </ListItemButton>
                  {["B", "m1", "m2", "m3"].includes(milestoneLevel) && (
                    <>
                      <Divider />
                      <ListItemButton onClick={handleAlphabetChartOpen}>
                        <MenuBookIcon sx={{ mr: 1, color: "#EE6931" }} />
                        <ListItemText
                          primary={ui.ASSESSMENT_ALPHABET_CHART}
                          primaryTypographyProps={{
                            fontFamily: "Quicksand",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#333F61",
                          }}
                        />
                      </ListItemButton>
                    </>
                  )}
                  {process.env.REACT_APP_IS_APP_IFRAME !== "true" && (
                    <>
                      <Divider />
                      <ListItemButton onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} />
                        <ListItemText
                          primary={ui.ASSESSMENT_LOGOUT}
                          primaryTypographyProps={{
                            fontFamily: "Quicksand",
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#333F61",
                          }}
                        />
                      </ListItemButton>
                    </>
                  )}
                </List>
              </Box>
            </Collapse>
          </Box>
        )}

        {!isMobile && (
          <Box
            sx={{
              justifySelf: "flex-end",
              width: { xs: "100%", sm: "50%" },
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              alignItems: "center",
            }}
          >
            {["B", "m1", "m2", "m3"].includes(milestoneLevel) && (
              <>
                <Backdrop
                  sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 2, // higher than most things
                  }}
                  open={isAudioPlaying}
                  invisible={true}
                />
                <CustomTooltip
                  title={ui.ASSESSMENT_ALPHABET_CHART}
                  arrow
                  placement="bottom"
                >
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <IconButton
                      onClick={handleAlphabetChartOpen}
                      sx={{
                        mr: { xs: "5px", sm: "10px" },
                        padding: isMobile ? "6px" : "8px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        animation: "pulseGlow 2s ease-in-out infinite",
                        "@keyframes pulseGlow": {
                          "0%, 100%": {
                            boxShadow: "0 0 0 0 rgba(238, 105, 49, 0.4)",
                          },
                          "50%": {
                            boxShadow: "0 0 0 8px rgba(238, 105, 49, 0)",
                          },
                        },
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                      }}
                    >
                      <MenuBookIcon
                        sx={{
                          color: "#EE6931",
                          fontSize: isMobile ? "24px" : "24px",
                        }}
                      />
                    </IconButton>
                    {/* Animated finger pointer - only show when audio is playing */}
                    {showChartPointer && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: isMobile ? -20 : -35,
                          left: "50%",
                          transform: "translateX(-50%)",
                          animation: "pointToChart 1.5s ease-in-out infinite",
                          "@keyframes pointToChart": {
                            "0%, 100%": {
                              transform: "translateX(-50%) translateY(0)",
                              opacity: 1,
                            },
                            "50%": {
                              transform: "translateX(-50%) translateY(-8px)",
                              opacity: 0.7,
                            },
                          },
                          pointerEvents: "none",
                        }}
                      >
                        <span
                          style={{
                            fontSize: isMobile ? "25px" : "40px",
                            display: "inline-block",
                          }}
                        >
                          👆
                        </span>
                      </Box>
                    )}
                  </Box>
                </CustomTooltip>
                {showChartPointer && (
                  <Dialog
                    open
                    PaperProps={{
                      sx: {
                        borderRadius: 3,
                        p: 4,
                        maxWidth: 600, // ⬆️ wider dialog
                        // zIndex: 6000,
                      },
                    }}
                  >
                    <Box>
                      {/* Header */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography
                          fontWeight={700}
                          fontSize="22px" // ⬆️ bigger header
                          lineHeight={1.3}
                        >
                          {tooltipText.title}
                        </Typography>

                        <IconButton
                          size="medium"
                          onClick={() => {
                            setShowChartPointer(false);
                            if (chartAudioRef.current) {
                              chartAudioRef.current.pause();
                              chartAudioRef.current.currentTime = 0;
                              chartAudioRef.current = null;
                            }
                            setIsAudioPlaying(false);
                            setIsAlphabetDemoActive(false);
                            globalThis.dispatchEvent(
                              new Event("alphabetDemoStop")
                            );
                          }}
                        >
                          <CloseIcon fontSize="medium" />
                        </IconButton>
                      </Box>

                      {/* Description */}
                      <Typography
                        fontSize="18px" // ⬆️ bigger description
                        lineHeight={1.7}
                        color="text.secondary"
                      >
                        {tooltipText.desc}
                      </Typography>
                    </Box>
                  </Dialog>
                )}
              </>
            )}

            {process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true" && (
              <Box sx={{ position: "relative" }} mr="10px">
                <img
                  src={scoreView}
                  alt="scoreView"
                  width={isMobile ? "47px" : "86px"}
                  height={isMobile ? "25px" : "35px"}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: isMobile ? "40%" : "50%",
                    left: isMobile ? "68%" : "70%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span
                    style={{
                      color: "#FFDD39",
                      fontWeight: 700,
                      fontSize: isMobile ? "11px" : "18px",
                      fontFamily: "Quicksand",
                    }}
                  >
                    {points}
                  </span>
                </Box>
              </Box>
            )}

            <Box
              mr={{ xs: "10px", sm: "20px" }}
              onClick={() =>
                setOpenLangModal
                  ? setOpenLangModal(true)
                  : setOpenMessageDialog({
                      message: ui.ASSESSMENT_GO_HOME_CHANGE_LANGUAGE,
                      dontShowHeader: true,
                    })
              }
            >
              <Box sx={{ position: "relative", cursor: "pointer" }}>
                <SelectLanguageButton width={isMobile ? 80 : 180} />
                <Box
                  sx={{
                    position: "absolute",
                    top: 9,
                    left: isMobile ? 10 : 20,
                  }}
                >
                  <span
                    style={{
                      color: "#000000",
                      fontWeight: 700,
                      fontSize: isMobile ? "10px" : "16px",
                      fontFamily: "Quicksand",
                      lineHeight: "25px",
                    }}
                  >
                    {isMobile
                      ? ui.ASSESSMENT_LANGUAGE_SHORT
                      : languages?.find((elem) => elem.lang === language)
                          ?.name || ui.ASSESSMENT_SELECT_LANGUAGE}
                  </span>
                </Box>
              </Box>
            </Box>
            {/* Audio Diagnostic Button - Subtle */}
            <CustomTooltip title={ui.ASSESSMENT_AUDIO_TEST}>
              <IconButton
                onClick={() => {
                  // Telemetry event for header button click
                  interact("ET", "Open Audio Diagnostic", "header");
                  setShowAudioDiagnostic(true);
                }}
                sx={{
                  mr: { xs: "5px", sm: "10px" },
                  padding: isMobile ? "6px" : "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                <MicIcon
                  sx={{
                    color: "#6DAF19",
                    fontSize: isMobile ? "18px" : "20px",
                  }}
                />
              </IconButton>
            </CustomTooltip>
            {process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true" &&
              process.env.REACT_APP_IS_APP_IFRAME !== "true" && (
                <CustomTooltip title={ui.ASSESSMENT_LOGOUT}>
                  <IconButton
                    onClick={handleLogout}
                    sx={{
                      mr: { xs: "5px", sm: "10px" },
                      padding: isMobile ? "6px" : "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <img
                      className="logout-img"
                      style={{ height: 25, width: 25 }}
                      src={LogoutImg}
                      alt="Logout"
                    />
                  </IconButton>
                </CustomTooltip>
              )}
          </Box>
        )}
      </Box>
      <AlphabetChartPreview
        open={openAlphabetPreview}
        onClose={() => setOpenAlphabetPreview(false)}
        lang={language}
        onStartExploring={() => {
          setOpenAlphabetPreview(false);
          setOpenAlphabetModal(true);
        }}
      />
      <AlphabetChart
        open={openAlphabetModal}
        onClose={() => setOpenAlphabetModal(false)}
        lang={language}
      />
    </>
  );
};

const Assesment = ({ discoverStart }) => {
  let username;
  if (localStorage.getItem("token") !== null) {
    let jwtToken = localStorage.getItem("token");
    var userDetails = jwtDecode(jwtToken);
    username = userDetails.student_name;
    setLocalData("profileName", username);
  }

  // const [searchParams, setSearchParams] = useSearchParams();
  // const [profileName, setProfileName] = useState(username);
  const [openMessageDialog, setOpenMessageDialog] = useState("");
  // let lang = searchParams.get("lang") || "ta";
  const [level, setLevel] = useState("");
  const dispatch = useDispatch();
  const [openLangModal, setOpenLangModal] = useState(false);
  const [lang, setLang] = useState(getLanguageOrDefault());
  const ui = useMemo(() => getUiStrings(lang), [lang]);
  const [points, setPoints] = useState(0);
  const [vocabCount, setVocabCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [milestoneDataKey, setMilestoneDataKey] = useState(0); // Force re-render when milestone data changes
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showModal, setShowModal] = useState(false);
  const [initError, setInitError] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadDataRef = React.useRef(null);
  const nativeLangEnable = getLocalData("nativeLangEnable");
  const nativeLang = getLocalData("nativeLang");
  const rStepNo = getLocalData("rStepZero");
  const rFlows = String(getLocalData("rFlow"));

  const getAssessmentText = () => {
    const texts = {
      en: {
        testSkills: "Let's test your language skills",
        goodSkills: "You have good language skills",
        discoverLevel: "Take the assessment to discover your level",
        completeLevel: (level) =>
          `Take the assessment to complete Level ${level}.`,
        startAssessment: "Start Assessment",
      },
      te: {
        testSkills: "మీ భాషా నైపుణ్యాలను పరీక్షించుకుందాం",
        goodSkills: "మీకు మంచి భాషా నైపుణ్యాలు ఉన్నాయి",
        discoverLevel: "మీ స్థాయిని తెలుసుకోవడానికి మూల్యాంకనాన్ని చేయండి.",
        completeLevel: (level) =>
          `Level ${level} పూర్తి చేయడానికి మూల్యాంకనాన్ని చేయండి.`,
        startAssessment: "మూల్యాంకనాన్ని ప్రారంభించండి",
      },
      kn: {
        testSkills: "Let's test your language skills",
        goodSkills: "You have good language skills",
        discoverLevel: "Take the assessment to discover your level",
        completeLevel: (level) =>
          `Take the assessment to complete Level ${level}.`,
        startAssessment: "Start Assessment",
      },
    };

    return texts[lang] || texts.en;
  };
  const assessmentText = getAssessmentText();

  const handleWordClick = () => {
    setShowModal(true);
  };

  useEffect(() => {
    if (nativeLangEnable !== true) {
      handleWordClick();
    }
  }, []);

  if (
    (level === "B" && (rStepNo !== 1 || rStepNo === "1")) ||
    (level === "B" && rFlows !== "true")
  ) {
    setLocalData("mFail", "true");
    // setLocalData("rFlow", "true");
    setLocalData("rStepZero", 0);
  }

  // console.log("nLang", nativeLang, nativeLangEnable, level);

  useEffect(() => {
    setLocalData("lang", lang);
    let contentSessionId = localStorage.getItem("contentSessionId");
    let session_id = getLocalData("sessionId");

    if (!session_id) {
      setLocalData("sessionId", contentSessionId);
    }

    const runLoad = async () => {
      setLoading(true);
      if (discoverStart && username && !TOKEN) {
        try {
          setLocalData("profileName", username);
          const usernameDetails = await fetchVirtualId(username);
          const getMilestoneDetails = await getFetchMilestoneDetails(lang);

          setLocalData(
            "getMilestone",
            JSON.stringify({ ...getMilestoneDetails })
          );
          // Force re-render to update milestone data display
          setMilestoneDataKey((prev) => prev + 1);

          if (
            levelMapping[usernameDetails?.data?.result?.virtualID] !== undefined
          ) {
            setLevel(levelMapping[usernameDetails?.data?.result?.virtualID]);
          } else {
            const token = getLocalData("token");
            if (token) {
              try {
                const decoded = jwtDecode(token);
                const emisUsername = String(decoded.emis_username);

                if (levelMapping[emisUsername] !== undefined) {
                  setLevel(levelMapping[emisUsername]);
                }
              } catch (error) {
                console.error("Error decoding JWT token:", error);
              }
            }
          }

          // console.log("Assigned LEVEL:", level);

          localStorage.setItem(
            "virtualId",
            usernameDetails?.data?.result?.virtualID
          );
          //let session_id = localStorage.getItem("sessionId");
          const milestoneLevel = getMilestoneDetails?.data?.milestone_level;
          const parsedLevel = milestoneLevel?.startsWith("m")
            ? Number(milestoneLevel.replace("m", ""))
            : milestoneLevel;

          // Auto-redirect returning users on discover-start BEFORE setLevel
          // so we never re-render with their old milestone image
          if (discoverStart) {
            const subMilestone =
              getMilestoneDetails?.data?.sub_milestone_level ?? "";
            if ((parsedLevel === "B" || parsedLevel === "b") && !subMilestone) {
              navigate("/letter-hunt");
              return;
            }
            if (parsedLevel && parsedLevel !== 0) {
              navigate("/practice");
              return;
            }
          }

          // Only set level if we're staying on this page (new user, level === 0)
          setLevel(parsedLevel);

          setVocabCount(
            getMilestoneDetails?.data?.extra?.vocabulary_count +
              getMilestoneDetails?.data?.extra?.learned_voc_count || 0
          );
          setWordCount(
            getMilestoneDetails?.data?.extra?.latest_towre_data
              ?.wordsPerMinute || 0
          );
          let session_id = getLocalData("sessionId");

          if (!session_id) {
            session_id = uniqueId();
            setLocalData("sessionId", session_id);
          }

          setLocalData("lang", lang || "ta");
          if (
            process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
            (localStorage.getItem("contentSessionId") !== null ||
              process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true")
          ) {
            fetchUserPoints()
              .then((points) => {
                setPoints(points);
              })
              .catch((error) => {
                console.error("Error fetching user points:", error);
                setPoints(0);
              });
          }

          // dispatch(setVirtualId(virtualId));
        } catch (error) {
          console.error("Error loading discover-start data:", error);
          setInitError(true);
        }
      } else {
        try {
          const language = lang;
          const getMilestoneDetails = await getFetchMilestoneDetails(language);
          setLocalData(
            "getMilestone",
            JSON.stringify({ ...getMilestoneDetails })
          );
          // Force re-render to update milestone data display
          setMilestoneDataKey((prev) => prev + 1);
          const level = getMilestoneDetails?.data?.milestone_level;
          setLevel(
            level?.startsWith("m") ? Number(level.replace("m", "")) : level
          );
          setVocabCount(
            getMilestoneDetails?.data?.extra?.vocabulary_count || 0
          );
          setWordCount(
            getMilestoneDetails?.data?.extra?.latest_towre_data
              ?.wordsPerMinute || 0
          );

          if (levelMapping[virtualId] !== undefined) {
            setLevel(levelMapping[virtualId]);
          } else {
            const token = getLocalData("token");
            if (token) {
              try {
                const decoded = jwtDecode(token);
                const emisUsername = String(decoded.emis_username);

                if (levelMapping[emisUsername] !== undefined) {
                  setLevel(levelMapping[emisUsername]);
                }
              } catch (error) {
                console.error("Error decoding JWT token:", error);
              }
            }
          }

          // console.log("Assigned LEVEL:", level);

          let sessionId = getLocalData("sessionId");

          if (!sessionId || sessionId === "null") {
            sessionId = localStorage.getItem("contentSessionId") || uniqueId();
            setLocalData("sessionId", sessionId);
          }

          if (
            process.env.REACT_APP_IS_APP_IFRAME !== "true" &&
            TOKEN &&
            (localStorage.getItem("contentSessionId") !== null ||
              process.env.REACT_APP_IS_IN_APP_AUTHORISATION === "true")
          ) {
            fetchUserPoints()
              .then((points) => {
                setPoints(points);
              })
              .catch((error) => {
                console.error("Error fetching user points:", error);
                setPoints(0);
              });
          }
        } catch (error) {
          console.error("Error loading assessment data:", error);
          setInitError(true);
        }
      }
    };
    loadDataRef.current = runLoad;
    runLoad().finally(() => setLoading(false));
  }, [lang]);

  const TOKEN = localStorage.getItem("apiToken");
  let virtualId;
  // if (TOKEN) {
  //   const tokenDetails = jwtDecode(TOKEN);
  //   virtualId = JSON.stringify(tokenDetails?.virtual_id);
  // }

  const handleOpenVideo = () => {
    if (process.env.REACT_APP_SHOW_HELP_VIDEO === "true") {
      let allowedOrigins = [];
      try {
        allowedOrigins = JSON.parse(
          process.env.REACT_APP_PARENT_ORIGIN_URL || "[]"
        );
      } catch (error) {
        console.error(
          "Invalid JSON format in REACT_APP_PARENT_ORIGIN_URL:",
          error
        );
      }

      const parentOrigin =
        window?.location?.ancestorOrigins?.[0] || window.parent.location.origin;

      if (allowedOrigins.includes(parentOrigin)) {
        try {
          window.parent.postMessage(
            {
              message: "help-video-link",
            },
            parentOrigin
          );
        } catch (error) {
          console.error("Error sending postMessage:", error);
        }
      } else {
        console.warn(`Parent origin "${parentOrigin}" is not allowed.`);
      }
    }
  };

  const navigate = useNavigate();
  const handleRedirect = () => {
    const profileName = getLocalData("profileName");
    if (!username && !profileName && !TOKEN && level === 0) {
      // alert("please add username in query param");
      setOpenMessageDialog({
        message: "please add username in query param",
        isError: true,
      });
      return;
    }
    // When milestone_level is "B" and sub_milestone_level is empty (e.g. after discovery fail), route to letter-hunt
    const milestoneDataForRedirect = getMilestoneData();
    const milestoneLevelForRedirect =
      milestoneDataForRedirect?.data?.milestone_level || null;
    const subMilestoneLevelForRedirect =
      milestoneDataForRedirect?.data?.sub_milestone_level ?? "";
    if (
      (level === "B" || level === "b") &&
      milestoneLevelForRedirect === "B" &&
      (!subMilestoneLevelForRedirect || subMilestoneLevelForRedirect === "")
    ) {
      navigate("/letter-hunt");
      return;
    }
    if (level === 0) {
      navigate("/discover");
    } else {
      navigate("/practice");
    }
  };

  const images = {
    desktopLevelB,
    desktopLevel1,
    desktopLevel2,
    desktopLevel3,
    desktopLevel4,
    desktopLevel5,
    desktopLevel6,
    desktopLevel7,
    desktopLevel8,
    desktopLevel9,
    desktopLevel10,
    desktopLevel11,
    desktopLevel12,
    desktopLevel13,
    desktopLevel14,
    desktopLevel15,
    desktopLevel1Mobile,
    desktopLevel2Mobile,
    desktopLevel3Mobile,
    desktopLevel4Mobile,
    desktopLevel5Mobile,
    desktopLevel6Mobile,
    desktopLevel7Mobile,
    desktopLevel8Mobile,
    desktopLevel9Mobile,
    desktopLevel10Mobile,
  };

  const imageKey =
    isMobile && level <= 10
      ? `desktopLevel${level || 1}Mobile`
      : `desktopLevel${level || 1}`;

  const tFlow = String(getLocalData("tFlow"));
  const rStep = Number(getLocalData("rStep")) || 0;

  // Get milestone_level from API to determine if F1 flow should be active
  const getMilestoneData = () => {
    try {
      const milestoneStr = getLocalData("getMilestone");
      if (milestoneStr) {
        return JSON.parse(milestoneStr);
      }
    } catch (e) {
      console.error("Error parsing getMilestone:", e);
    }
    return null;
  };
  const milestoneData = getMilestoneData();
  const milestoneLevel = milestoneData?.data?.milestone_level || null;
  const subMilestoneLevel = milestoneData?.data?.sub_milestone_level || null;

  // Only set rFlow to "true" if milestone level is "B" (F1/F2/F3 flows)
  // For milestone levels "m1", "m2", etc., rFlow should be "false"
  const rFlowRaw = getLocalData("rFlow");
  const rFlow =
    milestoneLevel === "B" && rFlowRaw === "true" ? "true" : "false";

  // F1 flow is triggered when milestone_level is "B" and sub_milestone_level is "F1"
  const shouldShowF1 = milestoneLevel === "B" && subMilestoneLevel === "F1";
  // F2 flow is triggered when milestone_level is "B" and sub_milestone_level is "F2"
  const shouldShowF2 = milestoneLevel === "B" && subMilestoneLevel === "F2";
  // F3 flow is triggered when milestone_level is "B" and sub_milestone_level is "F3"
  const shouldShowF3 = milestoneLevel === "B" && subMilestoneLevel === "F3";

  // Check if F1 flow is active
  const f1FlowStep = getF1FlowStep();
  const isF1FlowActive = shouldShowF1 && f1FlowStep.step !== null;

  // Check if F2 flow is active
  const f2FlowStep = getF2FlowStep();
  const isF2FlowActive = shouldShowF2 && f2FlowStep.step !== null;

  // Check if F3 flow is active
  const f3FlowStep = getF3FlowStep();
  const isF3FlowActive = shouldShowF3 && f3FlowStep.step !== null;

  // console.log("Discovery Start - F1/F2/F3 detection:", {
  //   milestoneLevel,
  //   subMilestoneLevel,
  //   shouldShowF1,
  //   shouldShowF2,
  //   shouldShowF3,
  //   isF1FlowActive,
  //   isF2FlowActive,
  //   isF3FlowActive,
  //   f1FlowStepIndex: f1FlowStep.index,
  //   f2FlowStepIndex: f2FlowStep.index,
  //   f3FlowStepIndex: f3FlowStep.index,
  // });

  const sectionStyle = {
    width: "100vw",
    height: "100vh",
    // backgroundImage: `url(${
    //   rFlow === "true" ? rOneImage : images?.[`desktopLevel${level || 1}`]
    // })`,
    backgroundImage: `url(${
      rFlow === "true"
        ? level == 1
          ? rOneImage
          : level == 2 && rStep === 2
          ? rTwoImage
          : level == 2 && rStep === 3
          ? rThreeImage
          : level == 2 && rStep === 4
          ? rFourImage
          : images?.[imageKey]
        : images?.[imageKey]
    })`,
    backgroundRepeat: "round",
    backgroundSize: "auto",
    position: "relative",
  };

  // Show a friendly error card when API calls on mount fail (server down / timeout).
  if (initError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
          px: 3,
          textAlign: "center",
        }}
      >
        <ServerErrorScreen
          onRetry={() => {
            setInitError(false);
            loadDataRef.current?.();
          }}
        />
      </Box>
    );
  }

  return (
    <>
      {!!openMessageDialog && (
        <MessageDialog
          message={openMessageDialog.message}
          closeDialog={() => {
            setOpenMessageDialog("");
          }}
          isError={openMessageDialog.isError}
          dontShowHeader={openMessageDialog.dontShowHeader}
        />
      )}
      {openLangModal && (
        <LanguageModal {...{ lang, setLang, setOpenLangModal }} />
      )}
      {level > 0 || level === "B" ? (
        <Box style={sectionStyle}>
          <ProfileHeader
            {...{
              level,
              lang,
              setOpenLangModal,
              points,
              setOpenMessageDialog,
              vocabCount,
              wordCount,
            }}
          />
          <Box>
            {process.env.REACT_APP_SHOW_HELP_VIDEO === "true" && (
              <Box
                onClick={handleOpenVideo}
                sx={{
                  position: "absolute",
                  bottom: 40,
                  right: 80,
                  width: "237px",
                  height: "112px",
                  cursor: "pointer",
                }}
              >
                <img src={HelpLogo} alt="help_video_link" />
              </Box>
            )}
            <Box
              sx={{
                position: "absolute",
                bottom: 60,
                right: 0,
                width: "237px",
                height: "112px",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "20px 0px 0px 20px",
                backdropFilter: "blur(3px)",
              }}
            >
              <Box
                sx={{
                  width: rFlow === "true" ? "190px" : "165px",
                  height: "64px",
                  background: levelConfig[level].color,
                  borderRadius: "10px",
                  margin: "24px 48px 24px 24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: `3px 3px 10px ${levelConfig[level].color}80`,
                }}
                onClick={handleRedirect}
              >
                <span
                  style={{
                    color: "#F0EEEE",
                    fontWeight: 600,
                    fontSize: "20px",
                    fontFamily: getFontFamily(lang),
                    lineHeight: "25px",
                    textShadow: "#000 1px 0 10px",
                  }}
                >
                  {shouldShowF3
                    ? ui.ASSESSMENT_START_F3
                    : shouldShowF2
                    ? ui.ASSESSMENT_START_F2
                    : isF1FlowActive
                    ? ui.ASSESSMENT_START_F1
                    : milestoneLevel === "B" && rFlow === "true"
                    ? ui.ASSESSMENT_LEARN_LETTERS
                    : // Only show "Learn Letters" for milestone level "B" (F1/F2/F3 flows)
                      // For milestone levels "m1", "m2", etc., show "Start Level X"
                      ui.ASSESSMENT_START_LEVEL.replace(
                        "{level}",
                        String(level)
                      )}
                </span>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <MainLayout
          showNext={false}
          showTimer={false}
          cardBackground={assessmentBackground}
          backgroundImage={practicebg}
          loading={loading}
          {...{
            setOpenLangModal,
            lang,
            points,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: 2, md: 5 },
              textAlign: "center",
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={44} sx={{ color: "#1CB0F6", mb: 2 }} />
                <Typography
                  sx={{
                    color: "#322020",
                    fontWeight: 600,
                    fontSize: { xs: "15px", md: "18px" },
                    fontFamily: getFontFamily(lang),
                  }}
                >
                  Please wait, we are fetching details for you…
                </Typography>
              </>
            ) : (
              <>
                <Typography
                  sx={{
                    color: "#322020",
                    fontWeight: 700,
                    fontSize: { xs: "24px", md: "40px" },
                    fontFamily: getFontFamily(lang),
                    lineHeight: { xs: "36px", md: "62px" },
                    textAlign: "center",
                  }}
                  fontSize={{ md: "40px", xs: "30px" }}
                >
                  {discoverStart
                    ? ui.ASSESSMENT_TEST_LANGUAGE_SKILLS
                    : ui.ASSESSMENT_GOOD_LANGUAGE_SKILLS}
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      color: "#1CB0F6",
                      fontWeight: 600,
                      fontSize: { xs: "20px", md: "30px" },
                      fontFamily: getFontFamily(lang),
                      lineHeight: { xs: "30px", md: "50px" },
                      textAlign: "center",
                    }}
                    fontSize={{ md: "30px", xs: "20px" }}
                  >
                    {level > 0
                      ? ui.ASSESSMENT_TAKE_COMPLETE_LEVEL.replace(
                          "{level}",
                          String(level)
                        )
                      : ui.ASSESSMENT_TAKE_DISCOVER_LEVEL}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {process.env.REACT_APP_SHOW_HELP_VIDEO === "true" && (
                    <Box
                      onClick={handleOpenVideo}
                      sx={{
                        mt: { xs: 1, md: 1 },
                        mr: { xs: 2, md: 2 },
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <img src={HelpLogo} alt="help_video_link" />
                    </Box>
                  )}
                  <Box
                    sx={{
                      cursor: "pointer",
                      mt: { xs: 1, md: 2 },
                      zIndex: 9999,
                    }}
                    onClick={handleRedirect}
                  >
                    {lang === "te" ? (
                      <Box
                        sx={{
                          background: "#EDB530",
                          border: "2px solid #322020",
                          borderRadius: "9px",
                          padding: "12px 24px",
                          minWidth: "218px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        <span
                          style={{
                            color: "#322020",
                            fontWeight: 600,
                            fontSize: "20px",
                            fontFamily: getFontFamily(lang),
                          }}
                        >
                          {assessmentText.startAssessment}
                        </span>
                      </Box>
                    ) : (
                      <StartAssessmentButton />
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </MainLayout>
      )}
      <LanguageModalNew show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Assesment;
