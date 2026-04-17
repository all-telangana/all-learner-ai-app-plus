import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Dialog,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ReplayIcon from "@mui/icons-material/Replay";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import {
  dataEn as letterDataEn,
  dataHi as letterDataHi,
  dataTe as letterDataTe,
  dataKn as letterDataKn,
} from "../../RFlow/LetterTrain";
import { wordData } from "../../RFlow/Barakhadi";
import { getAssetAudioUrl, getAssetUrl } from "../../utils/rFlowS3Links";
import {
  HINDI_ORDER_MAP,
  TELUGU_ORDER_MAP,
  KANNADA_ORDER_MAP,
} from "./AlphabetChart";
import { motion, AnimatePresence } from "framer-motion";
import {
  playTTS,
  stopAllAudio,
} from "../../lib/axl-explorations/src/utils/audioUtils";

// Demo instructions for each language
const demoInstructions = {
  en: {
    title: "Alphabet Chart",
    description: "Learn letters and words with sounds!",
    howToPlay: "How to Use",
    alphabetLabel: "Alphabet",
    syllableLabel: "Syllable",
    steps: ["Learn Alphabets", "Learn Syllables", "Complete!"],
    // Alphabet phase instructions
    alphabetInstruction1: "Click on any alphabet card to hear its sound",
    alphabetInstruction2: "Great! Keep clicking on more alphabet cards",
    alphabetInstruction3:
      "Excellent! Now let's learn syllables. Click the Syllable toggle above",
    // Syllable phase instructions
    syllableInstruction1: "Now click on any syllable card to hear its sound",
    syllableInstruction2: "Great! Keep clicking on more syllable cards",
    syllableInstruction3:
      "Excellent! You've learned how to use the Alphabet Chart!",
    // Narrations
    alphabetNarration1: "Click on any alphabet card to hear its sound",
    alphabetNarration2: "Great! Keep clicking on more alphabet cards",
    alphabetNarration3:
      "Excellent! Now let's learn syllables. Click the Syllable toggle above",
    syllableNarration1: "Now click on any syllable card to hear its sound",
    syllableNarration2: "Great! Keep clicking on more syllable cards",
    syllableNarration3:
      "Excellent! You've learned how to use the Alphabet Chart!",
    noCardsMessage: "No cards available for this section.",
    startButton: "Start Exploring",
    skipDemo: "Skip Demo",
    replayDemo: "Replay Demo",
    completion: {
      title: "Demo Complete!",
      description: "You're ready to explore the Alphabet Chart!",
    },
  },
  te: {
    title: "అక్షరమాల చార్ట్",
    description: "శబ్దాలతో అక్షరాలు మరియు పదాలు నేర్చుకోండి!",
    howToPlay: "ఎలా ఉపయోగించాలి",
    alphabetLabel: "అక్షరమాల",
    syllableLabel: "గుణింతాలు",
    steps: ["అక్షరాలు నేర్చుకోండి", "గుణింతాలు నేర్చుకోండి", "పూర్తయింది!"],
    alphabetInstruction1: "శబ్దం వినడానికి ఏదైనా అక్షర కార్డ్‌పై క్లిక్ చేయండి",
    alphabetInstruction2: "బాగుంది! మరిన్ని అక్షర కార్డ్స్‌పై క్లిక్ చేయండి",
    alphabetInstruction3:
      "అద్భుతం! ఇప్పుడు గుణింతాలు నేర్చుకుందాం. పైన గుణింతాలు టాగుల్ క్లిక్ చేయండి",
    syllableInstruction1:
      "ఇప్పుడు శబ్దం వినడానికి ఏదైనా గుణింత కార్డ్‌పై క్లిక్ చేయండి",
    syllableInstruction2: "బాగుంది! మరిన్ని గుణింత కార్డ్స్‌పై క్లిక్ చేయండి",
    syllableInstruction3:
      "అద్భుతం! అక్షరమాల చార్ట్‌ను ఎలా ఉపయోగించాలో నేర్చుకున్నారు!",
    alphabetNarration1: "శబ్దం వినడానికి ఏదైనా అక్షర కార్డ్‌పై క్లిక్ చేయండి",
    alphabetNarration2: "బాగుంది! మరిన్ని అక్షర కార్డ్స్‌పై క్లిక్ చేయండి",
    alphabetNarration3:
      "అద్భుతం! ఇప్పుడు గుణింతాలు నేర్చుకుందాం. పైన గుణింతాలు టాగుల్ క్లిక్ చేయండి",
    syllableNarration1:
      "ఇప్పుడు శబ్దం వినడానికి ఏదైనా గుణింత కార్డ్‌పై క్లిక్ చేయండి",
    syllableNarration2: "బాగుంది! మరిన్ని గుణింత కార్డ్స్‌పై క్లిక్ చేయండి",
    syllableNarration3:
      "అద్భుతం! అక్షరమాల చార్ట్‌ను ఎలా ఉపయోగించాలో నేర్చుకున్నారు!",
    noCardsMessage: "ఈ విభాగంలో కార్డ్‌లు అందుబాటులో లేవు.",
    startButton: "అన్వేషించడం ప్రారంభించండి",
    skipDemo: "డెమో స్కిప్ చేయండి",
    replayDemo: "డెమోను మళ్లీ ఆడండి",
    completion: {
      title: "డెమో పూర్తయింది!",
      description: "అక్షరమాల చార్ట్‌ను అన్వేషించడానికి మీరు సిద్ధంగా ఉన్నారు!",
    },
  },
  kn: {
    title: "ವರ್ಣಮಾಲೆ ಚಾರ್ಟ್‌",
    description: "ಧ್ವನಿಗಳೊಂದಿಗೆ ಅಕ್ಷರಗಳು ಮತ್ತು ಪದಗಳನ್ನು ಕಲಿಯಿರಿ!",
    howToPlay: "ಹೇಗೆ ಬಳಸುವುದು",
    alphabetLabel: "ಅಕ್ಷರಮಾಲೆ",
    syllableLabel: "ಗುಣಿತಾಕ್ಷರ",
    steps: ["ಅಕ್ಷರಗಳನ್ನು ಕಲಿಯಿರಿ", "ಗುಣಿತಾಕ್ಷರಗಳನ್ನು ಕಲಿಯಿರಿ", "ಪೂರ್ಣಗೊಂಡಿದೆ!"],
    alphabetInstruction1:
      "ಧ್ವನಿಯನ್ನು ಕೇಳಲು ಯಾವುದೇ ಅಕ್ಷರ ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    alphabetInstruction2: "ಅದ್ಭುತ! ಇನ್ನಷ್ಟು ಅಕ್ಷರ ಕಾರ್ಡ್‌ಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    alphabetInstruction3:
      "ಅತ್ಯುತ್ತಮ! ಈಗ ಗುಣಿತಾಕ್ಷರಗಳನ್ನು ಕಲಿಯೋಣ. ಮೇಲೆ ಗುಣಿತಾಕ್ಷರ ಟಾಗಲ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    syllableInstruction1:
      "ಈಗ ಧ್ವನಿಯನ್ನು ಕೇಳಲು ಯಾವುದೇ ಗುಣಿತಾಕ್ಷರ ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    syllableInstruction2:
      "ಅದ್ಭುತ! ಇನ್ನಷ್ಟು ಗುಣಿತಾಕ್ಷರ ಕಾರ್ಡ್‌ಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    syllableInstruction3:
      "ಅತ್ಯುತ್ತಮ! ಅಕ್ಷರಮಾಲೆ ಚಾರ್ಟ್ ಅನ್ನು ಹೇಗೆ ಬಳಸುವುದು ಎಂದು ಕಲಿತಿದ್ದೀರಿ!",
    alphabetNarration1: "ಧ್ವನಿಯನ್ನು ಕೇಳಲು ಯಾವುದೇ ಅಕ್ಷರ ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    alphabetNarration2: "ಅದ್ಭುತ! ಇನ್ನಷ್ಟು ಅಕ್ಷರ ಕಾರ್ಡ್‌ಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    alphabetNarration3:
      "ಅತ್ಯುತ್ತಮ! ಈಗ ಗುಣಿತಾಕ್ಷರಗಳನ್ನು ಕಲಿಯೋಣ. ಮೇಲೆ ಗುಣಿತಾಕ್ಷರ ಟಾಗಲ್ ಕ್ಲಿಕ್ ಮಾಡಿ",
    syllableNarration1:
      "ಈಗ ಧ್ವನಿಯನ್ನು ಕೇಳಲು ಯಾವುದೇ ಗುಣಿತಾಕ್ಷರ ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    syllableNarration2:
      "ಅದ್ಭುತ! ಇನ್ನಷ್ಟು ಗುಣಿತಾಕ್ಷರ ಕಾರ್ಡ್‌ಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
    syllableNarration3:
      "ಅತ್ಯುತ್ತಮ! ಅಕ್ಷರಮಾಲೆ ಚಾರ್ಟ್ ಅನ್ನು ಹೇಗೆ ಬಳಸುವುದು ಎಂದು ಕಲಿತಿದ್ದೀರಿ!",
    noCardsMessage: "ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಕಾರ್ಡ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ.",
    startButton: "ಅನ್ವೇಷಿಸಲು ಪ್ರಾರಂಭಿಸಿ",
    skipDemo: "ಡೆಮೊ ಸ್ಕಿಪ್ ಮಾಡಿ",
    replayDemo: "ಡೆಮೊ ಮತ್ತೆ ಆಡಿ",
    completion: {
      title: "ಡೆಮೊ ಪೂರ್ಣಗೊಂಡಿದೆ!",
      description: "ಅಕ್ಷರಮಾಲೆ ಚಾರ್ಟ್ ಅನ್ನು ಅನ್ವೇಷಿಸಲು ನೀವು ಸಿದ್ಧರಿದ್ದೀರಿ!",
    },
  },
  hi: {
    title: "वर्णमाला चार्ट",
    description: "ध्वनियों के साथ अक्षर और शब्द सीखें!",
    howToPlay: "कैसे उपयोग करें",
    alphabetLabel: "वर्णमाला",
    syllableLabel: "मात्रा",
    steps: ["वर्णमाला सीखें", "मात्रा सीखें", "पूर्ण!"],
    alphabetInstruction1:
      "ध्वनि सुनने के लिए किसी भी अक्षर कार्ड पर क्लिक करें",
    alphabetInstruction2: "बहुत अच्छा! और अक्षर कार्ड्स पर क्लिक करें",
    alphabetInstruction3:
      "उत्कृष्ट! अब मात्रा सीखते हैं। ऊपर मात्रा टॉगल पर क्लिक करें",
    syllableInstruction1:
      "अब ध्वनि सुनने के लिए किसी भी मात्रा कार्ड पर क्लिक करें",
    syllableInstruction2: "बहुत अच्छा! और मात्रा कार्ड्स पर क्लिक करें",
    syllableInstruction3:
      "उत्कृष्ट! आपने वर्णमाला चार्ट का उपयोग करना सीख लिया!",
    alphabetNarration1: "ध्वनि सुनने के लिए किसी भी अक्षर कार्ड पर क्लिक करें",
    alphabetNarration2: "बहुत अच्छा! और अक्षर कार्ड्स पर क्लिक करें",
    alphabetNarration3:
      "उत्कृष्ट! अब मात्रा सीखते हैं। ऊपर मात्रा टॉगल पर क्लिक करें",
    syllableNarration1:
      "अब ध्वनि सुनने के लिए किसी भी मात्रा कार्ड पर क्लिक करें",
    syllableNarration2: "बहुत अच्छा! और मात्रा कार्ड्स पर क्लिक करें",
    syllableNarration3: "उत्कृष्ट! आपने वर्णमाला चार्ट का उपयोग करना सीख लिया!",
    noCardsMessage: "इस अनुभाग में कोई कार्ड उपलब्ध नहीं है।",
    startButton: "खोजना शुरू करें",
    skipDemo: "डेमो छोड़ें",
    replayDemo: "डेमो फिर से चलाएं",
    completion: {
      title: "डेमो पूर्ण!",
      description: "आप वर्णमाला चार्ट खोजने के लिए तैयार हैं!",
    },
  },
  mr: {
    title: "अक्षर चार्ट",
    description: "आवाजांसह अक्षरे आणि शब्द शिका!",
    howToPlay: "कसे वापरायचे",
    alphabetLabel: "अक्षरे",
    syllableLabel: "मात्रा",
    steps: ["अक्षरे शिका", "मात्रा शिका", "पूर्ण!"],
    alphabetInstruction1: "आवाज ऐकण्यासाठी कोणत्याही अक्षर कार्डवर क्लिक करा",
    alphabetInstruction2: "छान! आणखी अक्षर कार्डांवर क्लिक करा",
    alphabetInstruction3:
      "उत्कृष्ट! आता मात्रा शिकूया. वर मात्रा टॉगल क्लिक करा",
    syllableInstruction1:
      "आता आवाज ऐकण्यासाठी कोणत्याही मात्रा कार्डवर क्लिक करा",
    syllableInstruction2: "छान! आणखी मात्रा कार्डांवर क्लिक करा",
    syllableInstruction3:
      "उत्कृष्ट! तुम्ही अक्षर चार्ट कसे वापरायचे ते शिकलात!",
    alphabetNarration1: "आवाज ऐकण्यासाठी कोणत्याही अक्षर कार्डवर क्लिक करा",
    alphabetNarration2: "छान! आणखी अक्षर कार्डांवर क्लिक करा",
    alphabetNarration3: "उत्कृष्ट! आता मात्रा शिकूया. वर मात्रा टॉगल क्लिक करा",
    syllableNarration1:
      "आता आवाज ऐकण्यासाठी कोणत्याही मात्रा कार्डवर क्लिक करा",
    syllableNarration2: "छान! आणखी मात्रा कार्डांवर क्लिक करा",
    syllableNarration3: "उत्कृष्ट! तुम्ही अक्षर चार्ट कसे वापरायचे ते शिकलात!",
    noCardsMessage: "या विभागात कोणतेही कार्ड उपलब्ध नाहीत.",
    startButton: "शोधणे सुरू करा",
    skipDemo: "डेमो वगळा",
    replayDemo: "डेमो पुन्हा खेळा",
    completion: {
      title: "डेमो पूर्ण झाले!",
      description: "तुम्ही अक्षर चार्ट शोधण्यास तयार आहात!",
    },
  },
};

// Demo Card Component for Preview
const DemoAlphabetCard = ({
  item,
  playAudio,
  isActive,
  mode,
  isHighlighted,
  showHandPointer,
}) => {
  const renderHighlightedWord = () => {
    const originalWord = item.word || "";
    const displayVal = item.display || "";

    if (!isActive || !displayVal || !originalWord) {
      return (
        originalWord.charAt(0).toUpperCase() +
        originalWord.slice(1).toLowerCase()
      );
    }

    const capitalizedWord =
      originalWord.charAt(0).toUpperCase() +
      originalWord.slice(1).toLowerCase();
    const lowerWord = capitalizedWord.toLowerCase();
    const lowerHighlight = displayVal.toLowerCase();

    const index = lowerWord.indexOf(lowerHighlight);
    if (index === -1) return capitalizedWord;

    const before = capitalizedWord.substring(0, index);
    const middle = capitalizedWord.substring(index, index + displayVal.length);
    const after = capitalizedWord.substring(index + displayVal.length);

    return (
      <>
        {before}
        <span
          style={{
            borderBottom: "3px solid #ff0000",
            paddingBottom: "1px",
            display: "inline-block",
            lineHeight: "1",
          }}
        >
          {middle}
        </span>
        {after}
      </>
    );
  };

  return (
    <motion.div
      animate={
        isActive ? { scale: [1, 1.12, 1], y: [0, -14, 0] } : { scale: 1, y: 0 }
      }
      transition={
        isActive
          ? { duration: 0.6, ease: "easeOut" }
          : {
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      style={{ position: "relative" }}
    >
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "16px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "200px",
          cursor: showHandPointer ? "pointer" : "default",
          position: "relative",
          boxShadow: isActive
            ? "0 0 0 3px #6366f1, 0 14px 30px rgba(0,0,0,0.25)"
            : isHighlighted
            ? "0 0 0 4px #fbbf24, 0 0 20px rgba(251, 191, 36, 0.5)"
            : "0 4px 12px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          opacity: isHighlighted || isActive ? 1 : 0.6,
          filter: isHighlighted || isActive ? "none" : "grayscale(0.4)",
          "&:hover": {
            transform: showHandPointer ? "scale(1.02)" : "none",
          },
        }}
        onClick={() => {
          if (!showHandPointer) return;
          if (mode === "alphabet" && item.alaphabetChartAudio) {
            playAudio(item, item.alaphabetChartAudio);
          } else {
            playAudio(item);
          }
        }}
      >
        {/* Hand Pointer Animation */}
        {showHandPointer && (
          <Box
            sx={{
              position: "absolute",
              top: "65%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              animation: "pointBounce 1s ease-in-out infinite",
              "@keyframes pointBounce": {
                "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
                "50%": { transform: "translate(-50%, -60%) scale(1.2)" },
              },
            }}
          >
            <TouchAppIcon
              sx={{
                fontSize: "64px",
                color: "#6366f1",
                filter: "drop-shadow(0 4px 8px rgba(99, 102, 241, 0.4))",
              }}
            />
          </Box>
        )}

        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#333F61",
              fontSize: mode === "alphabet" ? "3rem" : "2.2rem",
              width: "100%",
            }}
          >
            {item.display}
          </Typography>

          <IconButton
            size="small"
            sx={{
              color: "#333F61",
              opacity: isHighlighted ? 1 : 0.5,
              cursor: showHandPointer ? "pointer" : "default",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!showHandPointer) return;
              if (mode === "alphabet" && item.alaphabetChartAudio) {
                playAudio(item, item.alaphabetChartAudio);
              } else {
                playAudio(item);
              }
            }}
            disabled={!showHandPointer}
          >
            <VolumeUpIcon />
          </IconButton>
        </Box>

        {/* Image */}
        {item.image ? (
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: 1,
              overflow: "hidden",
              cursor: showHandPointer ? "pointer" : "default",
              "&:hover": {
                transform: showHandPointer ? "scale(1.05)" : "none",
              },
              transition: "transform 0.2s ease",
            }}
          >
            <img
              src={item.image}
              alt={item.word}
              style={{
                maxWidth: "100%",
                maxHeight: "80px",
                objectFit: "contain",
              }}
            />
          </Box>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        {/* Word */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#333F61",
            textAlign: "center",
            fontSize: "1.2rem",
            mt: 1,
          }}
        >
          {renderHighlightedWord()}
        </Typography>
      </Box>
    </motion.div>
  );
};

// Countdown Component
const CountdownDisplay = ({ count, onComplete }) => {
  const [currentCount, setCurrentCount] = useState(count);

  useEffect(() => {
    if (currentCount === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentCount(currentCount - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentCount, onComplete]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 4,
      }}
    >
      <motion.div
        key={currentCount}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            width: { xs: 150, sm: 200 },
            height: { xs: 150, sm: 200 },
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "4rem", sm: "6rem" },
              fontWeight: "bold",
              color: "#fff",
              fontFamily: "Quicksand",
            }}
          >
            {currentCount}
          </Typography>
        </Box>
      </motion.div>

      {/* Progress dots */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {[3, 2, 1].map((num) => (
          <Box
            key={num}
            sx={{
              width: currentCount <= num ? 20 : 12,
              height: currentCount <= num ? 20 : 12,
              borderRadius: "50%",
              background:
                currentCount <= num
                  ? "linear-gradient(135deg, #6366f1, #a855f7)"
                  : "#d1d5db",
              transition: "all 0.3s ease",
              animation: currentCount === num ? "bounce 0.5s ease" : "none",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// Completion Screen Component
const CompletionScreen = ({ lang, onStartExploring, onReplayDemo }) => {
  const instructions = demoInstructions[lang] || demoInstructions.en;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 4,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            boxShadow: "0 10px 40px rgba(34, 197, 94, 0.4)",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 60, color: "#fff" }} />
        </Box>
      </motion.div>

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#333F61",
          mb: 2,
          fontFamily: "Quicksand",
        }}
      >
        {instructions.completion.title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#64748b",
          mb: 4,
          fontSize: "1.1rem",
        }}
      >
        {instructions.completion.description}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={onReplayDemo}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "50px",
            borderColor: "#6366f1",
            color: "#6366f1",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#4f46e5",
              bgcolor: "rgba(99, 102, 241, 0.1)",
            },
          }}
        >
          {instructions.replayDemo}
        </Button>

        <Button
          variant="contained"
          startIcon={<SportsEsportsIcon />}
          onClick={onStartExploring}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "50px",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
            },
          }}
        >
          {instructions.startButton}
        </Button>
      </Box>
    </Box>
  );
};

// Main AlphabetChartPreview Component
const AlphabetChartPreview = ({ open, onClose, lang, onStartExploring }) => {
  const [previewPhase, setPreviewPhase] = useState("countdown"); // 'countdown' | 'demo' | 'completion'
  const [viewMode, setViewMode] = useState("alphabet"); // 'alphabet' | 'word'
  const [currentPage, setCurrentPage] = useState(0);
  const [playingKey, setPlayingKey] = useState(null);
  const [activeCardKey, setActiveCardKey] = useState(null);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState(0);

  // Track clicks for both phases
  const [alphabetClickCount, setAlphabetClickCount] = useState(0);
  const [syllableClickCount, setSyllableClickCount] = useState(0);
  const [alphabetPhaseComplete, setAlphabetPhaseComplete] = useState(false);
  const [waitingForToggle, setWaitingForToggle] = useState(false);

  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const audioRef = useRef(null);
  const currentSrcRef = useRef(null);
  const narrationRef = useRef(null);

  const activeLang = lang || "en";
  const instructions = demoInstructions[activeLang] || demoInstructions.en;
  const itemsPerPage = 4;

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (narrationRef.current) {
        narrationRef.current.pause();
        narrationRef.current = null;
      }
    };
  }, []);

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setPreviewPhase("countdown");
      setViewMode("alphabet");
      setCurrentPage(0);
      setAlphabetClickCount(0);
      setSyllableClickCount(0);
      setAlphabetPhaseComplete(false);
      setWaitingForToggle(false);
      setHighlightedCardIndex(0);
      setCurrentStepIndex(0);
    }
  }, [open]);

  // Get data based on language
  const rawData = useMemo(() => {
    if (lang === "hi") return letterDataHi;
    if (lang === "te") return letterDataTe;
    if (lang === "kn") return letterDataKn;
    if (lang === "en") return letterDataEn;
    return [];
  }, [lang]);

  const alphabetItems = useMemo(() => {
    return rawData
      .filter((group) => "letter" in group && group.letter)
      .map((group) => {
        const first = group.items?.[0] || {};
        return {
          key: group.letter,
          display: group.letter,
          word: first.word || "",
          image: first.image || "",
          audio: first.singleAudio || first.audio || "",
          alaphabetChartAudio: first.alaphabetChartAudio || "",
        };
      })
      .sort((a, b) => {
        if (activeLang === "hi") {
          const aIndex = HINDI_ORDER_MAP[a.display] ?? Number.MAX_SAFE_INTEGER;
          const bIndex = HINDI_ORDER_MAP[b.display] ?? Number.MAX_SAFE_INTEGER;
          return aIndex - bIndex;
        }
        if (activeLang === "te") {
          const aIndex = TELUGU_ORDER_MAP[a.display] ?? Number.MAX_SAFE_INTEGER;
          const bIndex = TELUGU_ORDER_MAP[b.display] ?? Number.MAX_SAFE_INTEGER;
          return aIndex - bIndex;
        }
        if (activeLang === "kn") {
          const aIndex =
            KANNADA_ORDER_MAP[a.display] ?? Number.MAX_SAFE_INTEGER;
          const bIndex =
            KANNADA_ORDER_MAP[b.display] ?? Number.MAX_SAFE_INTEGER;
          return aIndex - bIndex;
        }
        return (a.display || "").localeCompare(b.display || "", activeLang);
      });
  }, [rawData, activeLang]);

  const wordItems = useMemo(() => {
    if (activeLang !== "en" && wordData[activeLang]) {
      return wordData[activeLang].map((itm, idx) => ({
        key: `${activeLang}-${idx}`,
        display: itm.text,
        word: itm.text,
        image: getAssetUrl(itm.image) || "",
        audio: (itm.audio ? getAssetAudioUrl(itm.audio) : "") || "",
      }));
    }

    return rawData
      .filter((group) => "syllable" in group && group.syllable)
      .map((group) => {
        const first = group.items?.[0] || {};
        return {
          key: group.syllable,
          display: group.syllable,
          word: first.word || "",
          image: first.image || "",
          audio: first.audio || first.singleAudio || "",
        };
      });
  }, [rawData, activeLang]);

  const filteredAlphabetItems = useMemo(
    () =>
      alphabetItems.filter(
        (item) => item.display && item.word && item.audio && item.image
      ),
    [alphabetItems]
  );

  const filteredWordItems = useMemo(
    () =>
      wordItems.filter(
        (item) => item.display && item.word && item.audio && item.image
      ),
    [wordItems]
  );

  const data =
    viewMode === "alphabet" ? filteredAlphabetItems : filteredWordItems;
  const currentItems = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Get narration step key based on current state
  const getNarrationStepKey = () => {
    if (viewMode === "alphabet") {
      if (waitingForToggle) {
        return "alphabetNarration3";
      } else if (alphabetClickCount >= 2) {
        return "alphabetNarration2";
      } else {
        return "alphabetNarration1";
      }
    } else {
      if (syllableClickCount >= 3) {
        return "syllableNarration3";
      } else if (syllableClickCount >= 1) {
        return "syllableNarration2";
      } else {
        return "syllableNarration1";
      }
    }
  };

  // Play narration using audio files with TTS fallback
  const playNarration = async (text, stepKey = null) => {
    // Stop current narration if any
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current = null;
    }
    speechSynthesis.cancel();

    setIsPlayingNarration(true);
    // Get the step key if not provided
    const narrationKey = stepKey || getNarrationStepKey();
    const audioPath = `/audio/audio-preview/Alphabet Chart/${activeLang}/${narrationKey}.wav`;
    try {
      // Try to play the audio file first
      const audio = new Audio(audioPath);
      narrationRef.current = audio;

      await new Promise((resolve, reject) => {
        audio.onended = () => {
          narrationRef.current = null;
          resolve();
        };
        audio.onerror = () => {
          narrationRef.current = null;
          reject(new Error("Audio file not found"));
        };
        audio.play().catch((e) => {
          narrationRef.current = null;
          reject(e);
        });
      });
    } catch (error) {
      // Fall back to TTS
      try {
        await playTTS(text, activeLang);
      } catch (ttsError) {
        console.warn("TTS also failed:", ttsError);
      }
    } finally {
      setIsPlayingNarration(false);
    }
  };

  const handleAlphabetModeProgress = () => {
    const newCount = alphabetClickCount + 1;
    setAlphabetClickCount(newCount);
    const an = currentItems.length;
    if (an > 0) setHighlightedCardIndex((prev) => (prev + 1) % an);

    if (newCount >= 3 && !alphabetPhaseComplete) {
      // Alphabet phase complete, prompt to switch to syllable
      setAlphabetPhaseComplete(true);
      setWaitingForToggle(true);
      setCurrentStepIndex(1);
    }
  };

  const handleSyllableModeProgress = () => {
    const newCount = syllableClickCount + 1;
    setSyllableClickCount(newCount);
    const wn = currentItems.length;
    if (wn > 0) setHighlightedCardIndex((prev) => (prev + 1) % wn);

    if (newCount >= 3) {
      // Demo complete — transition to completion after narration
      setCurrentStepIndex(2);
      setTimeout(() => {
        setPreviewPhase("completion");
      }, 3000);
    }
  };

  // Play card audio
  const playAudio = (item, specificAudio = null) => {
    const audioSrc = specificAudio || item.audio;
    if (!audioSrc) return;

    // Don't allow clicks if waiting for toggle or if narration is playing
    if (waitingForToggle || isPlayingNarration) return;

    if (playingKey === item.key && currentSrcRef.current === audioSrc) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setActiveCardKey(item.key);
    setPlayingKey(item.key);
    currentSrcRef.current = audioSrc;

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;

      // Handle demo progression
      if (previewPhase === "demo") {
        if (viewMode === "alphabet") {
          handleAlphabetModeProgress();
        } else {
          handleSyllableModeProgress();
        }
      }
    };

    audio.onerror = () => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;
    };

    audio.play().catch(() => {
      setPlayingKey(null);
      setActiveCardKey(null);
      currentSrcRef.current = null;
      audioRef.current = null;
    });
  };

  // Handle toggle change
  const handleToggleChange = (_, newMode) => {
    if (!newMode) return;

    // Block switching to syllable if it's not the right time or narration is playing
    if (newMode === "word" && (!waitingForToggle || isPlayingNarration)) {
      return;
    }

    // Block switching back to alphabet once syllable phase has started
    if (newMode === "alphabet" && viewMode === "word") {
      return;
    }

    // Stop ongoing narration if any
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current = null;
    }
    speechSynthesis.cancel();
    setIsPlayingNarration(false);

    if (
      newMode === "word" &&
      waitingForToggle &&
      filteredWordItems.length === 0
    ) {
      setWaitingForToggle(false);
      setCurrentStepIndex(2);
      setPreviewPhase("completion");
      return;
    }

    setViewMode(newMode);
    setCurrentPage(0);
    setHighlightedCardIndex(0);

    if (newMode === "word" && waitingForToggle) {
      setWaitingForToggle(false);
    }
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    // If no data at all, skip demo entirely
    if (filteredAlphabetItems.length === 0 && filteredWordItems.length === 0) {
      stopAllLocalAudio();
      onStartExploring();
      return;
    }
    // If no alphabet data, jump straight to syllable phase
    if (filteredAlphabetItems.length === 0) {
      setAlphabetPhaseComplete(true);
      setViewMode("word");
      setCurrentPage(0);
      setHighlightedCardIndex(0);
      setCurrentStepIndex(1);
    }
    setPreviewPhase("demo");
  };

  const stopAllLocalAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (narrationRef.current) {
      narrationRef.current.pause();
      narrationRef.current = null;
    }
    speechSynthesis.cancel();
    setIsPlayingNarration(false);
    setPlayingKey(null);
    setActiveCardKey(null);
    currentSrcRef.current = null;
    stopAllAudio();
  };

  const handleClose = () => {
    stopAllLocalAudio();
    onClose();
  };

  const handleStartExploring = () => {
    stopAllLocalAudio();
    onStartExploring();
  };

  // Handle skip demo
  const handleSkipDemo = () => {
    stopAllLocalAudio();
    onStartExploring();
  };

  // Handle replay demo
  const handleReplayDemo = () => {
    stopAllLocalAudio();
    setPreviewPhase("countdown");
    setViewMode("alphabet");
    setAlphabetClickCount(0);
    setSyllableClickCount(0);
    setAlphabetPhaseComplete(false);
    setWaitingForToggle(false);
    setHighlightedCardIndex(0);
    setCurrentStepIndex(0);
  };

  // Get current instruction text
  const getCurrentInstruction = () => {
    if (viewMode === "alphabet") {
      if (waitingForToggle) {
        return instructions.alphabetInstruction3;
      } else if (alphabetClickCount >= 2) {
        return instructions.alphabetInstruction2;
      } else {
        return instructions.alphabetInstruction1;
      }
    } else {
      if (syllableClickCount >= 3) {
        return instructions.syllableInstruction3;
      } else if (syllableClickCount >= 1) {
        return instructions.syllableInstruction2;
      } else {
        return instructions.syllableInstruction1;
      }
    }
  };

  // Get current narration text (for TTS)
  const getCurrentNarration = () => {
    if (viewMode === "alphabet") {
      if (waitingForToggle) {
        return instructions.alphabetNarration3;
      } else if (alphabetClickCount >= 2) {
        return instructions.alphabetNarration2;
      } else {
        return instructions.alphabetNarration1;
      }
    } else {
      if (syllableClickCount >= 3) {
        return instructions.syllableNarration3;
      } else if (syllableClickCount >= 1) {
        return instructions.syllableNarration2;
      } else {
        return instructions.syllableNarration1;
      }
    }
  };

  // Track the last played narration to avoid duplicate plays
  const lastPlayedNarrationRef = useRef(null);

  // Auto-play TTS when instruction changes during demo phase
  useEffect(() => {
    if (!open || previewPhase !== "demo") {
      stopAllLocalAudio();
      lastPlayedNarrationRef.current = null;
      return;
    }

    const currentNarration = getCurrentNarration();
    // Only play if this is a new narration text
    if (
      currentNarration &&
      currentNarration !== lastPlayedNarrationRef.current
    ) {
      lastPlayedNarrationRef.current = currentNarration;

      // Small delay to ensure UI has updated
      const timer = setTimeout(() => {
        playNarration(currentNarration);
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    previewPhase,
    viewMode,
    alphabetClickCount,
    syllableClickCount,
    waitingForToggle,
  ]);

  if (!open) return null;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          bgcolor: "#e9eef1",
          color: "#000000",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(25px)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          mt: 9,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          backgroundColor: "#e0e7ec",
          borderBottom: "1px solid #d1dbe0",
          minHeight: { xs: "80px", sm: "90px" },
        }}
      >
        {/* Toggle in Header */}
        {previewPhase === "demo" && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleToggleChange}
            aria-label="view mode"
            sx={{
              "& .MuiToggleButton-root": {
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.2 },
                fontSize: { xs: "1rem", sm: "1.1rem" },
                fontWeight: 600,
                borderRadius: "12px !important",
                textTransform: "none",
                border: "2px solid #94a3b8",
                color: "#334155",
                backgroundColor: "#f8fafc",
                transition: "all 0.2s ease",
              },
              "& .Mui-selected": {
                bgcolor: "#333F61 !important",
                color: "#fff !important",
                borderColor: "#333F61",
                boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
              },
              "& .MuiToggleButtonGroup-grouped": {
                mx: 0.5,
              },
            }}
          >
            <ToggleButton
              value="alphabet"
              sx={{
                pointerEvents: viewMode === "word" ? "none" : "auto",
                cursor: viewMode === "word" ? "default" : "pointer",
                position: "relative",
                "&::after":
                  alphabetPhaseComplete && !waitingForToggle
                    ? {
                        content: '"✓"',
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "#22c55e",
                        color: "white",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }
                    : {},
              }}
            >
              {instructions.alphabetLabel}
            </ToggleButton>
            <ToggleButton
              value="word"
              sx={{
                animation: waitingForToggle
                  ? "pulse 1.5s ease-in-out infinite"
                  : "none",
                "@keyframes pulse": {
                  "0%, 100%": {
                    boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.7)",
                    transform: "scale(1)",
                  },
                  "50%": {
                    boxShadow: "0 0 0 10px rgba(99, 102, 241, 0)",
                    transform: "scale(1.05)",
                  },
                },
                position: "relative",
                cursor:
                  viewMode === "alphabet" &&
                  (!waitingForToggle || isPlayingNarration)
                    ? "default"
                    : "pointer",
                pointerEvents:
                  viewMode === "alphabet" &&
                  (!waitingForToggle || isPlayingNarration)
                    ? "none"
                    : "auto",
                transition: "all 0.3s ease",
                "&::after":
                  syllableClickCount >= 3
                    ? {
                        content: '"✓"',
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "#22c55e",
                        color: "white",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }
                    : {},
              }}
            >
              {instructions.syllableLabel}
              {/* Finger pointer for Syllable toggle - show after narration finishes */}
              {waitingForToggle && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -45,
                    left: "50%",
                    transform: "translateX(-50%)",
                    animation: "pointUp 1s ease-in-out infinite",
                    "@keyframes pointUp": {
                      "0%, 100%": {
                        transform: "translateX(-50%) translateY(0)",
                      },
                      "50%": {
                        transform: "translateX(-50%) translateY(-10px)",
                      },
                    },
                    zIndex: 10,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    👆
                  </Box>
                </Box>
              )}
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        {/* Title for countdown */}
        {previewPhase === "countdown" && (
          <Typography
            sx={{
              fontWeight: "bold",
              color: "#333F61",
              fontFamily: "Quicksand",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              textAlign: "center",
            }}
          >
            {instructions.title} - {instructions.howToPlay}
          </Typography>
        )}

        {/* Close Button */}
        <Box sx={{ position: "absolute", right: { xs: 16, sm: 24 } }}>
          <IconButton
            onClick={handleClose}
            size="medium"
            aria-label="Close"
            sx={{
              color: "#111827",
              bgcolor: "rgba(255,255,255,0.7)",
              borderRadius: "50%",
              "&:hover": {
                bgcolor: "#f3f4f6",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: "1.7rem", sm: "1.5rem" } }} />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Countdown Phase */}
        {previewPhase === "countdown" && (
          <CountdownDisplay count={3} onComplete={handleCountdownComplete} />
        )}

        {/* Demo Phase */}
        {previewPhase === "demo" && (
          <Box
            sx={{
              width: "100%",
              maxWidth: "1000px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Progress Steps */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 2,
              }}
            >
              {instructions.steps.map((step, index) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor:
                          index < currentStepIndex
                            ? "#22c55e"
                            : index === currentStepIndex
                            ? "#6366f1"
                            : "#d1d5db",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {index < currentStepIndex ? "✓" : index + 1}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color:
                          index <= currentStepIndex ? "#333F61" : "#94a3b8",
                        fontWeight: index === currentStepIndex ? 600 : 400,
                        textAlign: "center",
                        maxWidth: 100,
                      }}
                    >
                      {step}
                    </Typography>
                  </Box>
                  {index < instructions.steps.length - 1 && (
                    <Box
                      sx={{
                        width: 40,
                        height: 2,
                        bgcolor:
                          index < currentStepIndex ? "#22c55e" : "#d1d5db",
                        transition: "all 0.3s ease",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Box>

            {/* Instruction Text */}
            <motion.div
              key={getCurrentInstruction()}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  bgcolor: waitingForToggle ? "#fef3c7" : "#fff",
                  borderRadius: "16px",
                  p: 3,
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: waitingForToggle ? "2px solid #fbbf24" : "none",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#333F61",
                    fontWeight: 600,
                    fontFamily: "Quicksand",
                  }}
                >
                  {getCurrentInstruction()}
                </Typography>
              </Box>
            </motion.div>

            {/* Demo Cards Grid */}
            {currentItems.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography sx={{ color: "#64748b", fontSize: "1rem" }}>
                  {instructions.noCardsMessage}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<SportsEsportsIcon />}
                  onClick={handleStartExploring}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                    fontWeight: 600,
                  }}
                >
                  {instructions.startButton}
                </Button>
              </Box>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{ maxWidth: "800px", mx: "auto" }}
              >
                <AnimatePresence mode="wait">
                  {currentItems.slice(0, 4).map((item, index) => (
                    <Grid item xs={6} sm={3} key={item.key}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                      >
                        <DemoAlphabetCard
                          item={item}
                          playAudio={playAudio}
                          isActive={activeCardKey === item.key}
                          mode={viewMode}
                          isHighlighted={
                            index === highlightedCardIndex && !waitingForToggle
                          }
                          showHandPointer={
                            index === highlightedCardIndex &&
                            !waitingForToggle &&
                            !isPlayingNarration &&
                            ((viewMode === "alphabet" &&
                              alphabetClickCount < 3) ||
                              (viewMode === "word" && syllableClickCount < 3))
                          }
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            )}

            {/* Click counters */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                mt: 2,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                  {instructions.alphabetLabel}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    justifyContent: "center",
                    mt: 0.5,
                  }}
                >
                  {[1, 2, 3].map((num) => (
                    <Box
                      key={num}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor:
                          alphabetClickCount >= num ? "#22c55e" : "#d1d5db",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                  {instructions.syllableLabel}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    justifyContent: "center",
                    mt: 0.5,
                  }}
                >
                  {[1, 2, 3].map((num) => (
                    <Box
                      key={num}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor:
                          syllableClickCount >= num ? "#22c55e" : "#d1d5db",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Completion Phase */}
        {previewPhase === "completion" && (
          <CompletionScreen
            lang={activeLang}
            onStartExploring={handleStartExploring}
            onReplayDemo={handleReplayDemo}
          />
        )}
      </Box>

      {/* Footer - Only show in demo phase */}
      {previewPhase === "demo" && (
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleSkipDemo}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              borderColor: "#6366f1",
              color: "#6366f1",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#4f46e5",
                bgcolor: "rgba(99, 102, 241, 0.1)",
              },
            }}
          >
            {instructions.skipDemo}
          </Button>

          <Button
            variant="contained"
            startIcon={<SportsEsportsIcon />}
            onClick={handleStartExploring}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "50px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
              },
            }}
          >
            {instructions.startButton}
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default AlphabetChartPreview;
