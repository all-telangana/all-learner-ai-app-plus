import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
} from "@mui/material";
import MainLayout from "../components/Layout/MainLayout";
import SafeYouTubePlayer from "../components/SafeYouTubePlayer";
import listenImg from "../assets/listen.svg";
import correctSound from "../assets/correct.wav";
import wrongSound from "../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
  sendTestRigScore,
} from "../utils/constants";
import { getFontFamily } from "../utils/fontUtils";
import { useNavigate } from "react-router-dom";
import { response } from "../services/telemetryService";
import { Typography, Stack, IconButton } from "@mui/material";
import { ArrowRight, RotateCcw } from "lucide-react";
import trainImg from "../assets/trainImg.svg";
import { motion, AnimatePresence } from "framer-motion";
import VoiceAnalyser from "../utils/VoiceAnalyser";
import * as s3Assets from "../utils/rFlowS3Links";
import { getAssetUrl } from "../utils/rFlowS3Links";
import { getAssetAudioUrl } from "../utils/rFlowS3Links";

import ballonImg from "../assets/ballon.svg";
import bearImg from "../assets/bear.svg";
import boyImg from "../assets/boy.svg";
import deleteImg from "../assets/delete.svg";
import eraseImg from "../assets/erase.svg";
import listenImgBox from "../assets/listenimgbox.svg";
import boyballonflyImg from "../assets/boyballonfly.svg";
import wordbanaoImg from "../assets/wordbanao.svg";
import dottimg from "../assets/dottimg.svg";
import nextImg from "../assets/nextImg.svg";
import closebuttonImg from "../assets/closebtn.svg";
import { callTelemetryDiscovery } from "../utils/apiUtil";
import audiowaveImg from "../assets/audiowave.svg";
import hintimg from "../assets/hintsicon.svg";

import {
  addLesson,
  addPointer,
  fetchUserPoints,
  createLearnerProgress,
} from "../services/orchestration/orchestrationService";
import { fetchGetSetResult } from "../services/learnerAi/learnerAiService";
import {
  fetchAssessmentData,
  fetchPaginatedContent,
} from "../services/content/contentService";
import { updateLearnerProfile } from "../services/learnerAi/learnerAiService";
import { splitGraphemes } from "split-graphemes";

const theme = createTheme();

const vowelsData = {
  hi: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],

  ta: [
    "அ",
    "ஆ",
    "இ",
    "ஈ",
    "உ",
    "ஊ",
    "எ",
    "ஏ",
    "ஐ",
    "ஒ",
    "ஓ",
    "ஔ",
    "ஃ",
    "ஂ",
    "஁",
  ],

  te: [
    "అ",
    "ఆ",
    "ఇ",
    "ఈ",
    "ఉ",
    "ఊ",
    "ఋ",
    "ఎ",
    "ఏ",
    "ఐ",
    "ఒ",
    "ఓ",
    "ఔ",
    "అం",
    "అః",
  ],

  kn: [
    "ಅ",
    "ಆ",
    "ಇ",
    "ಈ",
    "ಉ",
    "ಊ",
    "ಋ",
    "ಎ",
    "ಏ",
    "ಐ",
    "ಒ",
    "ಓ",
    "ಔ",
    "ಅಂ",
    "ಅಃ",
  ],
};

const barakhadiCharts = {
  hi: {
    क: [
      "क",
      "का",
      "कि",
      "की",
      "कु",
      "कू",
      "कृ",
      "के",
      "कै",
      "को",
      "कौ",
      "कं",
      "कः",
    ],
    ख: [
      "ख",
      "खा",
      "खि",
      "खी",
      "खु",
      "खू",
      "खृ",
      "खे",
      "खै",
      "खो",
      "खौ",
      "खं",
      "खः",
    ],
    ग: [
      "ग",
      "गा",
      "गि",
      "गी",
      "गु",
      "गू",
      "गृ",
      "गे",
      "गै",
      "गो",
      "गौ",
      "गं",
      "गः",
    ],
    घ: [
      "घ",
      "घा",
      "घि",
      "घी",
      "घु",
      "घू",
      "घृ",
      "घे",
      "घै",
      "घो",
      "घौ",
      "घं",
      "घः",
    ],
    ङ: [
      "ङ",
      "ङा",
      "ङि",
      "ङी",
      "ङु",
      "ङू",
      "ङृ",
      "ङे",
      "ङै",
      "ङो",
      "ङौ",
      "ङं",
      "ङः",
    ],

    च: [
      "च",
      "चा",
      "चि",
      "ची",
      "चु",
      "चू",
      "चृ",
      "चे",
      "चै",
      "चो",
      "चौ",
      "चं",
      "चः",
    ],
    छ: [
      "छ",
      "छा",
      "छि",
      "छी",
      "छु",
      "छू",
      "छृ",
      "छे",
      "छै",
      "छो",
      "छौ",
      "छं",
      "छः",
    ],
    ज: [
      "ज",
      "जा",
      "जि",
      "जी",
      "जु",
      "जू",
      "जृ",
      "जे",
      "जै",
      "जो",
      "जौ",
      "जं",
      "जः",
    ],
    झ: [
      "झ",
      "झा",
      "झि",
      "झी",
      "झु",
      "झू",
      "झृ",
      "झे",
      "झै",
      "झो",
      "झौ",
      "झं",
      "झः",
    ],
    ञ: [
      "ञ",
      "ञा",
      "ञि",
      "ञी",
      "ञु",
      "ञू",
      "ञृ",
      "ञे",
      "ञै",
      "ञो",
      "ञौ",
      "ञं",
      "ञः",
    ],

    ट: [
      "ट",
      "टा",
      "टि",
      "टी",
      "टु",
      "टू",
      "टृ",
      "टे",
      "टै",
      "टो",
      "टौ",
      "टं",
      "टः",
    ],
    ठ: [
      "ठ",
      "ठा",
      "ठि",
      "ठी",
      "ठु",
      "ठू",
      "ठृ",
      "ठे",
      "ठै",
      "ठो",
      "ठौ",
      "ठं",
      "ठः",
    ],
    ड: [
      "ड",
      "डा",
      "डि",
      "डी",
      "डु",
      "डू",
      "डृ",
      "डे",
      "डै",
      "डो",
      "डौ",
      "डं",
      "डः",
    ],
    ढ: [
      "ढ",
      "ढा",
      "ढि",
      "ढी",
      "ढु",
      "ढू",
      "ढृ",
      "ढे",
      "ढै",
      "ढो",
      "ढौ",
      "ढं",
      "ढः",
    ],
    ण: [
      "ण",
      "णा",
      "णि",
      "णी",
      "णु",
      "णू",
      "णृ",
      "णे",
      "णै",
      "णो",
      "णौ",
      "णं",
      "णः",
    ],

    त: [
      "त",
      "ता",
      "ति",
      "ती",
      "तु",
      "तू",
      "तृ",
      "ते",
      "तै",
      "तो",
      "तौ",
      "तं",
      "तः",
    ],
    थ: [
      "थ",
      "था",
      "थि",
      "थी",
      "थु",
      "थू",
      "थृ",
      "थे",
      "थै",
      "थो",
      "थौ",
      "थं",
      "थः",
    ],
    द: [
      "द",
      "दा",
      "दि",
      "दी",
      "दु",
      "दू",
      "दृ",
      "दे",
      "दै",
      "दो",
      "दौ",
      "दं",
      "दः",
    ],
    ध: [
      "ध",
      "धा",
      "धि",
      "धी",
      "धु",
      "धू",
      "धृ",
      "धे",
      "धै",
      "धो",
      "धौ",
      "धं",
      "धः",
    ],
    न: [
      "न",
      "ना",
      "नि",
      "नी",
      "नु",
      "नू",
      "नृ",
      "ने",
      "नै",
      "नो",
      "नौ",
      "नं",
      "नः",
    ],

    प: [
      "प",
      "पा",
      "पि",
      "पी",
      "पु",
      "पू",
      "पृ",
      "पे",
      "पै",
      "पो",
      "पौ",
      "पं",
      "पः",
    ],
    फ: [
      "फ",
      "फा",
      "फि",
      "फी",
      "फु",
      "फू",
      "फृ",
      "फे",
      "फै",
      "फो",
      "फौ",
      "फं",
      "फः",
    ],
    ब: [
      "ब",
      "बा",
      "बि",
      "बी",
      "बु",
      "बू",
      "बृ",
      "बे",
      "बै",
      "बो",
      "बौ",
      "बं",
      "बः",
    ],
    भ: [
      "भ",
      "भा",
      "भि",
      "भी",
      "भु",
      "भू",
      "भृ",
      "भे",
      "भै",
      "भो",
      "भौ",
      "भं",
      "भः",
    ],
    म: [
      "म",
      "मा",
      "मि",
      "मी",
      "मु",
      "मू",
      "मृ",
      "मे",
      "मै",
      "मो",
      "मौ",
      "मं",
      "मः",
    ],

    य: [
      "य",
      "या",
      "यि",
      "यी",
      "यु",
      "यू",
      "यृ",
      "ये",
      "यै",
      "यो",
      "यौ",
      "यं",
      "यः",
    ],
    र: [
      "र",
      "रा",
      "रि",
      "री",
      "रु",
      "रू",
      "रृ",
      "रे",
      "रै",
      "रो",
      "रौ",
      "रं",
      "रः",
    ],
    ल: [
      "ल",
      "ला",
      "लि",
      "ली",
      "लु",
      "लू",
      "लृ",
      "ले",
      "लै",
      "लो",
      "लौ",
      "लं",
      "लः",
    ],
    व: [
      "व",
      "वा",
      "वि",
      "वी",
      "वु",
      "वू",
      "वृ",
      "वे",
      "वै",
      "वो",
      "वौ",
      "वं",
      "वः",
    ],

    श: [
      "श",
      "शा",
      "शि",
      "शी",
      "शु",
      "शू",
      "शृ",
      "शे",
      "शै",
      "शो",
      "शौ",
      "शं",
      "शः",
    ],
    ष: [
      "ष",
      "षा",
      "षि",
      "षी",
      "षु",
      "षू",
      "षृ",
      "षे",
      "ষৈ",
      "ষো",
      "ষৌ",
      "ষং",
      "ষঃ",
    ],
    स: [
      "स",
      "सा",
      "सि",
      "सी",
      "सु",
      "सू",
      "सृ",
      "से",
      "सै",
      "सो",
      "सौ",
      "सं",
      "सः",
    ],
    ह: [
      "ह",
      "हा",
      "हि",
      "ही",
      "हु",
      "हू",
      "हृ",
      "हे",
      "है",
      "हो",
      "हौ",
      "हं",
      "हः",
    ],
  },

  ta: {
    க: [
      "க",
      "கா",
      "கி",
      "கீ",
      "கு",
      "கூ",
      "கெ",
      "கே",
      "கை",
      "கொ",
      "கோ",
      "கௌ",
      "கஂ",
      "கஃ",
      "க஁",
    ],
    ங: [
      "ங",
      "ஙா",
      "ஙி",
      "ஙீ",
      "ஙு",
      "ஙூ",
      "ஙெ",
      "ஙே",
      "ஙை",
      "ஙொ",
      "ஙோ",
      "ஙௌ",
      "ஙஂ",
      "ஙஃ",
      "ங஁",
    ],
    ச: [
      "ச",
      "சா",
      "சி",
      "சீ",
      "சு",
      "சூ",
      "செ",
      "சே",
      "சை",
      "சொ",
      "சோ",
      "சௌ",
      "சஂ",
      "சஃ",
      "ச஁",
    ],
    ஞ: [
      "ஞ",
      "ஞா",
      "ஞி",
      "ஞீ",
      "ஞு",
      "ஞூ",
      "ஞெ",
      "ஞே",
      "ஞை",
      "ஞொ",
      "ஞோ",
      "ஞௌ",
      "ஞஂ",
      "ஞஃ",
      "ஞ஁",
    ],
    ட: [
      "ட",
      "டா",
      "டி",
      "டீ",
      "டு",
      "டூ",
      "டெ",
      "டே",
      "டை",
      "டொ",
      "டோ",
      "டௌ",
      "டஂ",
      "டஃ",
      "ட஁",
    ],
    ண: [
      "ண",
      "ணா",
      "ணி",
      "ணீ",
      "ணு",
      "ணூ",
      "ணெ",
      "ணே",
      "ணை",
      "ணொ",
      "ணோ",
      "ணௌ",
      "ணஂ",
      "ணஃ",
      "ண஁",
    ],
    த: [
      "த",
      "தா",
      "தி",
      "தீ",
      "து",
      "தூ",
      "தெ",
      "தே",
      "தை",
      "தொ",
      "தோ",
      "தௌ",
      "தஂ",
      "தஃ",
      "த஁",
    ],
    ந: [
      "ந",
      "நா",
      "நி",
      "நீ",
      "நு",
      "நூ",
      "நெ",
      "நே",
      "நை",
      "நொ",
      "நோ",
      "நௌ",
      "நஂ",
      "நஃ",
      "ந஁",
    ],
    ப: [
      "ப",
      "பா",
      "பி",
      "பீ",
      "பு",
      "பூ",
      "பெ",
      "பே",
      "பை",
      "பொ",
      "போ",
      "பௌ",
      "பஂ",
      "பஃ",
      "ப஁",
    ],
    ம: [
      "ம",
      "மா",
      "மி",
      "மீ",
      "மு",
      "மூ",
      "மெ",
      "மே",
      "மை",
      "மொ",
      "மோ",
      "மௌ",
      "மஂ",
      "மஃ",
      "ம஁",
    ],
    ய: [
      "ய",
      "யா",
      "யி",
      "யீ",
      "யு",
      "யூ",
      "யெ",
      "யே",
      "யை",
      "யொ",
      "யோ",
      "யௌ",
      "யஂ",
      "யஃ",
      "ய஁",
    ],
    ர: [
      "ர",
      "ரா",
      "ரி",
      "ரீ",
      "ரு",
      "ரூ",
      "ரெ",
      "ரே",
      "ரை",
      "ரொ",
      "ரோ",
      "ரௌ",
      "ரஂ",
      "ரஃ",
      "ர஁",
    ],
    ல: [
      "ல",
      "லா",
      "லி",
      "லீ",
      "லு",
      "லூ",
      "லெ",
      "லே",
      "லை",
      "லொ",
      "லோ",
      "லௌ",
      "லஂ",
      "லஃ",
      "ல஁",
    ],
    வ: [
      "வ",
      "வா",
      "வி",
      "வீ",
      "வு",
      "வூ",
      "வெ",
      "வே",
      "வை",
      "வொ",
      "வோ",
      "வௌ",
      "வஂ",
      "வஃ",
      "வ஁",
    ],
    ழ: [
      "ழ",
      "ழா",
      "ழி",
      "ழீ",
      "ழு",
      "ழூ",
      "ழெ",
      "ழே",
      "ழை",
      "ழொ",
      "ழோ",
      "ழௌ",
      "ழஂ",
      "ழஃ",
      "ழ஁",
    ],
    ள: [
      "ள",
      "ளா",
      "ளி",
      "ளீ",
      "ளு",
      "ளூ",
      "ளெ",
      "ளே",
      "ளை",
      "ளொ",
      "ளோ",
      "ளௌ",
      "ளஂ",
      "ளஃ",
      "ள஁",
    ],
    ற: [
      "ற",
      "றா",
      "றி",
      "றீ",
      "று",
      "றூ",
      "றெ",
      "றே",
      "றை",
      "றொ",
      "றோ",
      "றௌ",
      "றஂ",
      "றஃ",
      "ற஁",
    ],
    ன: [
      "ன",
      "னா",
      "னி",
      "னீ",
      "னு",
      "னூ",
      "னெ",
      "னே",
      "னை",
      "னொ",
      "னோ",
      "னௌ",
      "னஂ",
      "னஃ",
      "ன஁",
    ],
  },

  te: {
    క: [
      "క",
      "కా",
      "కి",
      "కీ",
      "కు",
      "కూ",
      "కృ",
      "కె",
      "కే",
      "కై",
      "కొ",
      "కో",
      "కౌ",
      "కం",
      "కః",
    ],
    ఖ: [
      "ఖ",
      "ఖా",
      "ఖి",
      "ఖీ",
      "ఖు",
      "ఖూ",
      "ఖృ",
      "ఖె",
      "ఖే",
      "ఖై",
      "ఖొ",
      "ఖో",
      "ఖౌ",
      "ఖం",
      "ఖః",
    ],
    గ: [
      "గ",
      "గా",
      "గి",
      "గీ",
      "గు",
      "గూ",
      "గృ",
      "గె",
      "గే",
      "గై",
      "గొ",
      "గో",
      "గౌ",
      "గం",
      "గః",
    ],
    ఘ: [
      "ఘ",
      "ఘా",
      "ఘి",
      "ఘీ",
      "ఘు",
      "ఘూ",
      "ఘృ",
      "ఘె",
      "ఘే",
      "ఘై",
      "ఘొ",
      "ఘో",
      "ఘౌ",
      "ఘం",
      "ఘః",
    ],
    ఙ: [
      "ఙ",
      "ఙా",
      "ఙి",
      "ఙీ",
      "ఙు",
      "ఙూ",
      "ఙృ",
      "ఙె",
      "ఙే",
      "ఙై",
      "ఙొ",
      "ఙో",
      "ఙౌ",
      "ఙం",
      "ఙః",
    ],
    చ: [
      "చ",
      "చా",
      "చి",
      "చీ",
      "చు",
      "చూ",
      "చృ",
      "చె",
      "చే",
      "చై",
      "చొ",
      "చో",
      "చౌ",
      "చం",
      "చః",
    ],
    ఛ: [
      "ఛ",
      "ఛా",
      "ఛి",
      "ఛీ",
      "ఛు",
      "ఛూ",
      "ఛృ",
      "ఛె",
      "ఛే",
      "ఛై",
      "ఛొ",
      "ఛో",
      "ఛౌ",
      "ఛం",
      "ఛః",
    ],
    జ: [
      "జ",
      "జా",
      "జి",
      "జీ",
      "జు",
      "జూ",
      "జృ",
      "జె",
      "జే",
      "జై",
      "జొ",
      "జో",
      "జౌ",
      "జం",
      "జః",
    ],
    ఝ: [
      "ఝ",
      "ఝా",
      "ఝి",
      "ఝీ",
      "ఝు",
      "ఝూ",
      "ఝృ",
      "ఝె",
      "ఝే",
      "ఝై",
      "ఝొ",
      "ఝో",
      "ఝౌ",
      "ఝం",
      "ఝః",
    ],
    ఞ: [
      "ఞ",
      "ఞా",
      "ఞి",
      "ఞీ",
      "ఞు",
      "ఞూ",
      "ఞృ",
      "ఞె",
      "ఞే",
      "ఞై",
      "ఞొ",
      "ఞో",
      "ఞౌ",
      "ఞం",
      "ఞః",
    ],
    ట: [
      "ట",
      "టా",
      "టి",
      "టీ",
      "టు",
      "టూ",
      "టృ",
      "టె",
      "టే",
      "టై",
      "టొ",
      "టో",
      "టౌ",
      "టం",
      "టః",
    ],
    ఠ: [
      "ఠ",
      "ఠా",
      "ఠి",
      "ఠీ",
      "ఠు",
      "ఠూ",
      "ఠృ",
      "ఠె",
      "ఠే",
      "ఠై",
      "ఠొ",
      "ఠో",
      "ఠౌ",
      "ఠం",
      "ఠః",
    ],
    డ: [
      "డ",
      "డా",
      "డి",
      "డీ",
      "డు",
      "డూ",
      "డృ",
      "డె",
      "డే",
      "డై",
      "డొ",
      "డో",
      "డౌ",
      "డం",
      "డః",
    ],
    ఢ: [
      "ఢ",
      "ఢా",
      "ఢి",
      "ఢీ",
      "ఢు",
      "ఢూ",
      "ఢృ",
      "ఢె",
      "ఢే",
      "ఢై",
      "ఢొ",
      "ఢో",
      "ఢౌ",
      "ఢం",
      "ఢః",
    ],
    ణ: [
      "ణ",
      "ణా",
      "ణి",
      "ణీ",
      "ణు",
      "ణూ",
      "ణృ",
      "ణె",
      "ణే",
      "ణై",
      "ణొ",
      "ణో",
      "ణౌ",
      "ణం",
      "ణః",
    ],
    త: [
      "త",
      "తా",
      "తి",
      "తీ",
      "తు",
      "తూ",
      "తృ",
      "తె",
      "తే",
      "తై",
      "తొ",
      "తో",
      "తౌ",
      "తం",
      "తః",
    ],
    థ: [
      "థ",
      "థా",
      "థి",
      "థీ",
      "థు",
      "థూ",
      "థృ",
      "థె",
      "థే",
      "థై",
      "థొ",
      "థో",
      "థౌ",
      "థం",
      "థః",
    ],
    ద: [
      "ద",
      "దా",
      "ది",
      "దీ",
      "దు",
      "దూ",
      "దృ",
      "దె",
      "దే",
      "దై",
      "దొ",
      "దో",
      "దౌ",
      "దం",
      "దః",
    ],
    ధ: [
      "ధ",
      "ధా",
      "ధి",
      "ధీ",
      "ధు",
      "ధూ",
      "ధృ",
      "ధె",
      "ధే",
      "ధై",
      "ధొ",
      "ధో",
      "ధౌ",
      "ధం",
      "ధః",
    ],
    న: [
      "న",
      "నా",
      "ని",
      "నీ",
      "ను",
      "నూ",
      "నృ",
      "నె",
      "నే",
      "నై",
      "నొ",
      "నో",
      "నౌ",
      "నం",
      "నః",
    ],
    ప: [
      "ప",
      "పా",
      "పి",
      "పీ",
      "పు",
      "పూ",
      "పృ",
      "పె",
      "పే",
      "పై",
      "పొ",
      "పో",
      "పౌ",
      "పం",
      "పః",
    ],
    ఫ: [
      "ఫ",
      "ఫా",
      "ఫి",
      "ఫీ",
      "ఫు",
      "ఫూ",
      "ఫృ",
      "ఫె",
      "ఫే",
      "ఫై",
      "ఫొ",
      "ఫో",
      "ఫౌ",
      "ఫం",
      "ఫః",
    ],
    బ: [
      "బ",
      "బా",
      "బి",
      "బీ",
      "బు",
      "బూ",
      "బృ",
      "బె",
      "బే",
      "బై",
      "బొ",
      "బో",
      "బౌ",
      "బం",
      "బః",
    ],
    భ: [
      "భ",
      "భా",
      "భి",
      "భీ",
      "భు",
      "భూ",
      "భృ",
      "భె",
      "భే",
      "భై",
      "భొ",
      "భో",
      "భౌ",
      "భం",
      "భః",
    ],
    మ: [
      "మ",
      "మా",
      "మి",
      "మీ",
      "ము",
      "మూ",
      "మృ",
      "మె",
      "మే",
      "మై",
      "మొ",
      "మో",
      "మౌ",
      "మం",
      "మః",
    ],
    య: [
      "య",
      "యా",
      "యి",
      "యీ",
      "యు",
      "యూ",
      "యృ",
      "యె",
      "యే",
      "యై",
      "యొ",
      "యో",
      "యౌ",
      "యం",
      "యః",
    ],
    ర: [
      "ర",
      "రా",
      "రి",
      "రీ",
      "రు",
      "రూ",
      "రృ",
      "రె",
      "రే",
      "రై",
      "రొ",
      "రో",
      "రౌ",
      "రం",
      "రః",
    ],
    ల: [
      "ల",
      "లా",
      "లి",
      "లీ",
      "లు",
      "లూ",
      "లృ",
      "లె",
      "లే",
      "లై",
      "లొ",
      "లో",
      "లౌ",
      "లం",
      "లః",
    ],
    వ: [
      "వ",
      "వా",
      "వి",
      "వీ",
      "వు",
      "వూ",
      "వృ",
      "వె",
      "వే",
      "వై",
      "వొ",
      "వో",
      "వౌ",
      "వం",
      "వః",
    ],
    శ: [
      "శ",
      "శా",
      "శి",
      "శీ",
      "శు",
      "శూ",
      "శృ",
      "శె",
      "శే",
      "శై",
      "శొ",
      "శో",
      "శౌ",
      "శం",
      "శః",
    ],
    ష: [
      "ష",
      "షా",
      "షి",
      "షీ",
      "షు",
      "షూ",
      "షృ",
      "షె",
      "షే",
      "షై",
      "షొ",
      "షో",
      "షౌ",
      "షం",
      "షః",
    ],
    స: [
      "స",
      "సా",
      "సి",
      "సీ",
      "సు",
      "సూ",
      "సృ",
      "సె",
      "సే",
      "సై",
      "సొ",
      "సో",
      "సౌ",
      "సం",
      "సః",
    ],
    హ: [
      "హ",
      "హా",
      "హి",
      "హీ",
      "హు",
      "హూ",
      "హృ",
      "హె",
      "హే",
      "హై",
      "హొ",
      "హో",
      "హౌ",
      "హం",
      "హః",
    ],
    ళ: [
      "ళ",
      "ళా",
      "ళి",
      "ళీ",
      "ళు",
      "ళూ",
      "ళృ",
      "ళె",
      "ళే",
      "ళై",
      "ళొ",
      "ళో",
      "ళౌ",
      "ళం",
      "ళః",
    ],
  },

  kn: {
    ಕ: [
      "ಕ",
      "ಕಾ",
      "ಕಿ",
      "ಕೀ",
      "ಕು",
      "ಕೂ",
      "ಕೃ",
      "ಕೆ",
      "ಕೇ",
      "ಕೈ",
      "ಕೊ",
      "ಕೋ",
      "ಕೌ",
      "ಕಂ",
      "ಕಃ",
    ],
    ಖ: [
      "ಖ",
      "ಖಾ",
      "ಖಿ",
      "ಖೀ",
      "ಖು",
      "ಖೂ",
      "ಖೃ",
      "ಖೆ",
      "ಖೇ",
      "ಖೈ",
      "ಖೊ",
      "ಖೋ",
      "ಖೌ",
      "ಖಂ",
      "ಖಃ",
    ],
    ಗ: [
      "ಗ",
      "ಗಾ",
      "ಗಿ",
      "ಗೀ",
      "ಗು",
      "ಗೂ",
      "ಗೃ",
      "ಗೆ",
      "ಗೇ",
      "ಗೈ",
      "ಗೊ",
      "ಗೋ",
      "ಗೌ",
      "ಗಂ",
      "ಗಃ",
    ],
    ಘ: [
      "ಘ",
      "ಘಾ",
      "ಘಿ",
      "ಘೀ",
      "ಘು",
      "ಘೂ",
      "ಘೃ",
      "ಘೆ",
      "ಘೇ",
      "ಘೈ",
      "ಘೊ",
      "ಘೋ",
      "ಘೌ",
      "ಘಂ",
      "ಘಃ",
    ],
    ಙ: [
      "ಙ",
      "ಙಾ",
      "ಙಿ",
      "ಙೀ",
      "ಙು",
      "ಙೂ",
      "ಙೃ",
      "ಙೆ",
      "ಙೇ",
      "ಙೈ",
      "ಙೊ",
      "ಙೋ",
      "ಙೌ",
      "ಙಂ",
      "ಙಃ",
    ],
    ಚ: [
      "ಚ",
      "ಚಾ",
      "ಚಿ",
      "ಚೀ",
      "ಚು",
      "ಚೂ",
      "ಚೃ",
      "ಚೆ",
      "ಚೇ",
      "ಚೈ",
      "ಚೊ",
      "ಚೋ",
      "ಚೌ",
      "ಚಂ",
      "ಚಃ",
    ],
    ಛ: [
      "ಛ",
      "ಛಾ",
      "ಛಿ",
      "ಛೀ",
      "ಛು",
      "ಛೂ",
      "ಛೃ",
      "ಛೆ",
      "ಛೇ",
      "ಛೈ",
      "ಛೊ",
      "ಛೋ",
      "ಛೌ",
      "ಛಂ",
      "ಛಃ",
    ],
    ಜ: [
      "ಜ",
      "ಜಾ",
      "ಜಿ",
      "ಜೀ",
      "ಜು",
      "ಜೂ",
      "ಜೃ",
      "ಜೆ",
      "ಜೇ",
      "ಜೈ",
      "ಜೊ",
      "ಜೋ",
      "ಜೌ",
      "ಜಂ",
      "ಜಃ",
    ],
    ಝ: [
      "ಝ",
      "ಝಾ",
      "ಝಿ",
      "ಝೀ",
      "ಝು",
      "ಝೂ",
      "ಝೃ",
      "ಝೆ",
      "ಝೇ",
      "ಝೈ",
      "ಝೊ",
      "ಝೋ",
      "ಝೌ",
      "ಝಂ",
      "ಝಃ",
    ],
    ಞ: [
      "ಞ",
      "ಞಾ",
      "ಞಿ",
      "ಞೀ",
      "ಞು",
      "ಞೂ",
      "ಞೃ",
      "ಞೆ",
      "ಞೇ",
      "ಞೈ",
      "ಞೊ",
      "ಞೋ",
      "ಞೌ",
      "ಞಂ",
      "ಞಃ",
    ],
    ಟ: [
      "ಟ",
      "ಟಾ",
      "ಟಿ",
      "ಟೀ",
      "ಟು",
      "ಟೂ",
      "ಟೃ",
      "ಟೆ",
      "ಟೇ",
      "ಟೈ",
      "ಟೊ",
      "ಟೋ",
      "ಟೌ",
      "ಟಂ",
      "ಟಃ",
    ],
    ಠ: [
      "ಠ",
      "ಠಾ",
      "ಠಿ",
      "ಠೀ",
      "ಠು",
      "ಠೂ",
      "ಠೃ",
      "ಠೆ",
      "ಠೇ",
      "ಠೈ",
      "ಠೊ",
      "ಠೋ",
      "ಠೌ",
      "ಠಂ",
      "ಠಃ",
    ],
    ಡ: [
      "ಡ",
      "ಡಾ",
      "ಡಿ",
      "ಡೀ",
      "ಡು",
      "ಡೂ",
      "ಡೃ",
      "ಡೆ",
      "ಡೇ",
      "ಡೈ",
      "ಡೊ",
      "ಡೋ",
      "ಡೌ",
      "ಡಂ",
      "ಡಃ",
    ],
    ಢ: [
      "ಢ",
      "ಢಾ",
      "ಢಿ",
      "ಢೀ",
      "ಢು",
      "ಢೂ",
      "ಢೃ",
      "ಢೆ",
      "ಢೇ",
      "ಢೈ",
      "ಢೊ",
      "ಢೋ",
      "ಢೌ",
      "ಢಂ",
      "ಢಃ",
    ],
    ಣ: [
      "ಣ",
      "ಣಾ",
      "ಣಿ",
      "ಣೀ",
      "ಣು",
      "ಣೂ",
      "ಣೃ",
      "ಣೆ",
      "ಣೇ",
      "ಣೈ",
      "ಣೊ",
      "ಣೋ",
      "ಣೌ",
      "ಣಂ",
      "ಣಃ",
    ],
    ತ: [
      "ತ",
      "ತಾ",
      "ತಿ",
      "ತೀ",
      "ತು",
      "ತೂ",
      "ತೃ",
      "ತೆ",
      "ತೇ",
      "ತೈ",
      "ತೊ",
      "ತೋ",
      "ತೌ",
      "ತಂ",
      "ತಃ",
    ],
    ಥ: [
      "ಥ",
      "ಥಾ",
      "ಥಿ",
      "ಥೀ",
      "ಥು",
      "ಥೂ",
      "ಥೃ",
      "ಥೆ",
      "ಥೇ",
      "ಥೈ",
      "ಥೊ",
      "ಥೋ",
      "ಥೌ",
      "ಥಂ",
      "ಥಃ",
    ],
    ದ: [
      "ದ",
      "ದಾ",
      "ದಿ",
      "ದೀ",
      "ದು",
      "ದೂ",
      "ದೃ",
      "ದೆ",
      "ದೇ",
      "ದೈ",
      "ದೊ",
      "ದೋ",
      "ದೌ",
      "ದಂ",
      "ದಃ",
    ],
    ಧ: [
      "ಧ",
      "ಧಾ",
      "ಧಿ",
      "ಧೀ",
      "ಧು",
      "ಧೂ",
      "ಧೃ",
      "ಧೆ",
      "ಧೇ",
      "ಧೈ",
      "ಧೊ",
      "ಧೋ",
      "ಧೌ",
      "ಧಂ",
      "ಧಃ",
    ],
    ನ: [
      "ನ",
      "ನಾ",
      "ನಿ",
      "ನೀ",
      "ನು",
      "ನೂ",
      "ನೃ",
      "ನೆ",
      "ನೇ",
      "ನೈ",
      "ನೊ",
      "ನೋ",
      "ನೌ",
      "ನಂ",
      "ನಃ",
    ],
    ಪ: [
      "ಪ",
      "ಪಾ",
      "ಪಿ",
      "ಪೀ",
      "ಪು",
      "ಪೂ",
      "ಪೃ",
      "ಪೆ",
      "ಪೇ",
      "ಪೈ",
      "ಪೊ",
      "ಪೋ",
      "ಪೌ",
      "ಪಂ",
      "ಪಃ",
    ],
    ಫ: [
      "ಫ",
      "ಫಾ",
      "ಫಿ",
      "ಫೀ",
      "ಫು",
      "ಫೂ",
      "ಫೃ",
      "ಫೆ",
      "ಫೇ",
      "ಫೈ",
      "ಫೊ",
      "ಫೋ",
      "ಫೌ",
      "ಫಂ",
      "ಫಃ",
    ],
    ಬ: [
      "ಬ",
      "ಬಾ",
      "ಬಿ",
      "ಬೀ",
      "ಬು",
      "ಬೂ",
      "ಬೃ",
      "ಬೆ",
      "ಬೇ",
      "ಬೈ",
      "ಬೊ",
      "ಬೋ",
      "ಬೌ",
      "ಬಂ",
      "ಬಃ",
    ],
    ಭ: [
      "ಭ",
      "ಭಾ",
      "ಭಿ",
      "ಭೀ",
      "ಭು",
      "ಭೂ",
      "ಭೃ",
      "ಭೆ",
      "ಭೇ",
      "ಭೈ",
      "ಭೊ",
      "ಭೋ",
      "ಭೌ",
      "ಭಂ",
      "ಭಃ",
    ],
    ಮ: [
      "ಮ",
      "ಮಾ",
      "ಮಿ",
      "ಮೀ",
      "ಮು",
      "ಮೂ",
      "ಮೃ",
      "ಮೆ",
      "ಮೇ",
      "ಮೈ",
      "ಮೊ",
      "ಮೋ",
      "ಮೌ",
      "ಮಂ",
      "ಮಃ",
    ],
    ಯ: [
      "ಯ",
      "ಯಾ",
      "ಯಿ",
      "ಯೀ",
      "ಯು",
      "ಯೂ",
      "ಯೃ",
      "ಯೆ",
      "ಯೇ",
      "ಯೈ",
      "ಯೊ",
      "ಯೋ",
      "ಯೌ",
      "ಯಂ",
      "ಯಃ",
    ],
    ರ: [
      "ರ",
      "ರಾ",
      "ರಿ",
      "ರೀ",
      "ರು",
      "ರೂ",
      "ರೃ",
      "ರೆ",
      "ರೇ",
      "ರೈ",
      "ರೊ",
      "ರೋ",
      "ರೌ",
      "ರಂ",
      "ರಃ",
    ],
    ಲ: [
      "ಲ",
      "ಲಾ",
      "ಲಿ",
      "ಲೀ",
      "ಲು",
      "ಲೂ",
      "ಲೃ",
      "ಲೆ",
      "ಲೇ",
      "ಲೈ",
      "ಲೊ",
      "ಲೋ",
      "ಲೌ",
      "ಲಂ",
      "ಲಃ",
    ],
    ವ: [
      "ವ",
      "ವಾ",
      "ವಿ",
      "ವೀ",
      "ವು",
      "ವೂ",
      "ವೃ",
      "ವೆ",
      "ವೇ",
      "ವೈ",
      "ವೊ",
      "ವೋ",
      "ವೌ",
      "ವಂ",
      "ವಃ",
    ],
    ಶ: [
      "ಶ",
      "ಶಾ",
      "ಶಿ",
      "ಶೀ",
      "ಶು",
      "ಶೂ",
      "ಶೃ",
      "ಶೆ",
      "ಶೇ",
      "ಶೈ",
      "ಶೊ",
      "ಶೋ",
      "ಶೌ",
      "ಶಂ",
      "ಶಃ",
    ],
    ಷ: [
      "ಷ",
      "ಷಾ",
      "ಷಿ",
      "ಷೀ",
      "ಷು",
      "ಷೂ",
      "ಷೃ",
      "ಷೆ",
      "ಷೇ",
      "ಷೈ",
      "ಷೊ",
      "ಷೋ",
      "ಷೌ",
      "ಷಂ",
      "ಷಃ",
    ],
    ಸ: [
      "ಸ",
      "ಸಾ",
      "ಸಿ",
      "ಸೀ",
      "ಸು",
      "ಸೂ",
      "ಸೃ",
      "ಸೆ",
      "ಸೇ",
      "ಸೈ",
      "ಸೊ",
      "ಸೋ",
      "ಸೌ",
      "ಸಂ",
      "ಸಃ",
    ],
    ಹ: [
      "ಹ",
      "ಹಾ",
      "ಹಿ",
      "ಹೀ",
      "ಹು",
      "ಹೂ",
      "ಹೃ",
      "ಹೆ",
      "ಹೇ",
      "ಹೈ",
      "ಹೊ",
      "ಹೋ",
      "ಹೌ",
      "ಹಂ",
      "ಹಃ",
    ],
    ಳ: [
      "ಳ",
      "ಳಾ",
      "ಳಿ",
      "ಳೀ",
      "ಳು",
      "ಳೂ",
      "ಳೃ",
      "ಳೆ",
      "ಳೇ",
      "ಳೈ",
      "ಳೊ",
      "ಳೋ",
      "ಳೌ",
      "ಳಂ",
      "ಳಃ",
    ],
  },
};

export const wordData = {
  hi: [
    {
      text: "कार",
      audio: "ed1a6a41-893f-49e6-9e9f-dba1e89f7480.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कारAudio),
    },
    {
      text: "रात",
      audio: "5a49dd77-a776-4862-a38b-dcff186befe3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रातAudio),
    },
    {
      text: "पिता",
      audio: "004dfced-6aa6-47cb-8369-03e8fe9e5762.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पिताAudio),
    },
    {
      text: "किला",
      audio: "d8e9b508-93a9-4f27-bece-15935d16fe03.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.किलाAudio),
    },
    {
      text: "तीर",
      audio: "184e3253-8e03-425c-991a-3071943aa704.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तीरAudio),
    },
    {
      text: "गीत",
      audio: "fd38e29a-123a-4c49-9cce-8b51fd1fcd45.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गीतAudio),
    },
    {
      text: "सुख",
      audio: "22aa573a-3123-4dba-ba0f-dd285509a8e3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सुखAudio),
    },
    {
      text: "रुक",
      audio: "56ba2119-6d54-403b-b4e9-8ea8d2339917.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुकAudio),
    },
    {
      text: "मुख",
      audio: "57b73b9b-ab7e-4cc9-be80-24430a7d0124.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मुखAudio),
    },
    {
      text: "फूल",
      audio: "7b1613c9-34c3-4ed8-b365-31fb58ae8ef5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.फूलAudio),
    },
    {
      text: "रूह",
      audio: "1cdaf044-2ef5-4f52-b6e9-0fa0b9393492.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रूहAudio),
    },
    {
      text: "गृह",
      audio: "0d485e95-9904-4236-8624-d8e948380cba.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गृहAudio),
    },
    {
      text: "कृपा",
      audio: "88dd1023-c26d-41e8-9fae-65138b6752e8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कृपाAudio),
    },
    {
      text: "तेल",
      audio: "cb29f1ee-ccfe-4d41-836a-ad69272fda1d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तेलAudio),
    },
    {
      text: "केला",
      audio: "60458bcf-df7e-4f4d-af23-40c1f5563581.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.केलाAudio),
    },
    {
      text: "बैठ",
      audio: "197a75bc-811d-4e6e-8108-f3a2cd3fedbd.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बैठAudio),
    },
    {
      text: "कैसे",
      audio: "c7138dbb-94aa-49a8-b8fb-d4ca41079b58.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कैसेAudio),
    },
    {
      text: "शोर",
      audio: "086593d8-15d2-4c14-a743-38ac7a382bbe.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.शोरAudio),
    },
    {
      text: "मोर",
      audio: "1f568831-522b-4b82-b4aa-deb7b97f9768.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मोरAudio),
    },
    {
      text: "कौन",
      audio: "8d5b767d-acc0-4916-a75b-19eee1269f27.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कौनAudio),
    },
    {
      text: "मौज",
      audio: "7c1f7f39-b75e-431d-b468-0310c655f2ca.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मौजAudio),
    },
    {
      text: "हंस",
      audio: "4c80a8a6-b55a-45a7-b7f6-6bbf18e05561.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.हंसAudio),
    },
    {
      text: "नमः",
      audio: "dfdc7273-12ae-45e1-81cf-dd3bfe096ff3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.नमःAudio),
    },
    {
      text: "पानी",
      audio: "f676c2e5-b49c-451a-b6fa-42bb5d137030.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पानीAudio),
    },
    {
      text: "रुचि",
      audio: "07bd5d45-e2fc-442d-b1cc-ff1cd510a710.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुचिAudio),
    },
    {
      text: "सामने",
      audio: "7bc800b1-5caa-4df5-9a63-20dc77ba3107.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सामनेAudio),
    },
    {
      text: "शुरू",
      audio: "0e11f925-1006-4a7e-ae36-7d103b528b41.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.शुरूAudio),
    },
    {
      text: "होगा",
      audio: "65535afd-3e4f-40cf-98ff-22bd72e6405a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.होगाAudio),
    },
    {
      text: "दिशा",
      audio: "8de794ff-dcb0-483c-991e-f2d09dce8893.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.दिशाAudio),
    },
    {
      text: "कितने",
      audio: "0ca4f842-0f54-4cf5-a649-ec4b3cf05d7f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कितनेAudio),
    },
    {
      text: "गोभी",
      audio: "06969b26-1588-4064-aa61-fb8c3a7d665f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गोभीAudio),
    },
    {
      text: "सुना",
      audio: "5ca9dc01-e318-4201-8a97-bce48ec89d22.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सुनाAudio),
    },
    {
      text: "रुपया",
      audio: "e2b6df09-04e1-4fbc-b363-796e783169b9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुपयाAudio),
    },
    {
      text: "कविता",
      audio: "21ba9b0b-a4e9-493a-8fa8-72573476724c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कविताAudio),
    },
    {
      text: "मिला",
      audio: "a3c77ef0-6998-4568-ac96-8663d37d8e06.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मिलाAudio),
    },
    {
      text: "सोमारू",
      audio: "f8ae8f6e-7146-4255-92fc-f855715496c9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सोमारूAudio),
    },
    {
      text: "पहेली",
      audio: "760ed308-04f2-4be6-9e04-767fe5b6503d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पहेलीAudio),
    },
    {
      text: "कहानी",
      audio: "3e8c5933-8d58-46b2-81b6-f146d9dc03b2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कहानीAudio),
    },
    {
      text: "तोसिया",
      audio: "65f320e0-a177-4278-a4c9-8342c69f64d8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तोसियाAudio),
    },
    {
      text: "बारिश",
      audio: "02907e35-3140-4549-bcd5-0440c5e3f091.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बारिशAudio),
    },
    {
      text: "कटोरी",
      audio: "87751809-a287-48f7-ab21-d9927a27b10e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कटोरीAudio),
    },
    {
      text: "थाली",
      audio: "5e379647-9f49-4c9f-99ce-bb07d13aa5ec.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.थालीAudio),
    },
    {
      text: "मुझे",
      audio: "e0f54b9e-257c-4412-8f18-3da880f84016.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मुझेAudio),
    },
    {
      text: "तैरना",
      audio: "c4a15974-7f17-4cee-99f4-e7d1e8e30aad.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तैरनाAudio),
    },
    {
      text: "पिताजी",
      audio: "b9fcd2fe-063d-479e-9bee-87bc27f8ee8d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.पिताजीAudio),
    },
    {
      text: "जाता",
      audio: "fadeba57-dbe0-4d24-921a-cc540a9844bd.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.जाताAudio),
    },
    {
      text: "खाने",
      audio: "2098c754-2cef-4103-be9e-6cbdaf0d6775.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.खानेAudio),
    },
    {
      text: "केतकी",
      audio: "38e26d87-2bba-4c79-9b61-ae16fd687286.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.केतकीAudio),
    },
    {
      text: "सारा",
      audio: "be5b0350-762a-47a1-88fd-2d99c0e19ec1.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.साराAudio),
    },
    {
      text: "नीमा",
      audio: "b66da551-e66d-4863-9e31-f2d14f95e165.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.नीमाAudio),
    },
    {
      text: "लिखना",
      audio: "8315af5d-69dc-43b8-880c-fed23bfbbcca.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.लिखनाAudio),
    },
    {
      text: "लेकिन",
      audio: "cb3f8cbe-dd90-4110-8fe2-dbb95888e861.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.लेकिनAudio),
    },
    {
      text: "देखा",
      audio: "057ab9a6-49d4-4c70-877a-b28099266a02.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.देखाAudio),
    },
    {
      text: "सभी",
      audio: "c938d2d8-84fd-4695-bc38-6ca9f05ddf74.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सभीAudio),
    },
    {
      text: "गाना",
      audio: "9e080c4c-0738-4530-ad72-776f84cfe585.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गानाAudio),
    },
    {
      text: "मेरे",
      audio: "4fd1a368-7e4a-468c-96c0-81e51f3b51c9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मेरेAudio),
    },
    {
      text: "सवारी",
      audio: "353eeb59-e37a-4683-b19f-ef3f01f0f873.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सवारीAudio),
    },
    {
      text: "दादाजी",
      audio: "6f455848-7055-43a5-978a-7d3a022d3921.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.दादाजीAudio),
    },
    {
      text: "खेलने",
      audio: "4d96893c-74fd-45c7-b899-2037873ca9d6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.खेलनेAudio),
    },
    {
      text: "भाषा",
      audio: "81a25aa1-0e26-4f57-832d-62383fff0c7b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.भाषाAudio),
    },
    {
      text: "चाचाजी",
      audio: "80ae979e-08ef-4d24-8c12-53b4aa953f9d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.चाचाजीAudio),
    },
    {
      text: "सही",
      audio: "f092465e-5b7e-4b7a-a672-c84d67995393.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सहीAudio),
    },
    {
      text: "बिरंगे",
      audio: "1be5f6b1-eb74-4e29-96f2-bcf76bafe212.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बिरंगेAudio),
    },
    {
      text: "कुछ",
      audio: "20565cd7-0306-42ce-b104-c79773604a95.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.कुछAudio),
    },
    {
      text: "दुनिया",
      audio: "efd155ed-c03e-49ab-8ece-f56a14955e14.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.दुनियाAudio),
    },
    {
      text: "किसी",
      audio: "2c9b8b15-0665-4196-bd62-472488bac265.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.किसीAudio),
    },
    {
      text: "तुमने",
      audio: "106ab882-e79b-4784-87fc-9671a7f20210.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तुमनेAudio),
    },
    {
      text: "चाची",
      audio: "ba26441e-1fbb-4656-b4fe-ccc0ccb9d7c9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.चाचीAudio),
    },
    {
      text: "रोटी",
      audio: "b07a6dc0-7019-4298-a267-174954bd0568.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रोटीAudio),
    },
    {
      text: "छोटी",
      audio: "dd68999c-c976-4239-8f46-03363901ee00.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.छोटीAudio),
    },
    {
      text: "खिलौने",
      audio: "30d0f48d-b396-4909-9358-7d8d93a4290e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.खिलौनेAudio),
    },
    {
      text: "गिनो",
      audio: "8b2dde34-42c5-4ff1-8385-470bb7fcd061.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गिनोAudio),
    },
    {
      text: "लिखो",
      audio: "4ceba180-cf06-443f-ac2b-ee035a864340.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.लिखोAudio),
    },
    {
      text: "देखो",
      audio: "199c5bbd-2038-4a18-b376-62190792ea3f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.देखोAudio),
    },
    {
      text: "जितनी",
      audio: "f7dd6e51-c586-45bc-99db-7aff0062e326.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.जितनीAudio),
    },
    {
      text: "निकला",
      audio: "3ded609f-b566-4cb1-b142-df9af9db4cc9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.निकलाAudio),
    },
    {
      text: "बोला",
      audio: "cc9ee737-cb24-4e90-8b40-5e3f04d6ee36.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बोलाAudio),
    },
    {
      text: "चूजा",
      audio: "8f3a6733-dab1-4306-97eb-27a6a289a630.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.चूजाAudio),
    },
    {
      text: "घूमने",
      audio: "6c24884c-1d68-41cf-bf72-b25677932fff.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.घूमनेAudio),
    },
    {
      text: "बोले",
      audio: "e1657c7d-2dda-4458-9ab5-a65beadcb656.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.बोलेAudio),
    },
    {
      text: "गिलास",
      audio: "aebc36b5-0383-453b-bcba-e717bf86a793.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.गिलासAudio),
    },
    {
      text: "मिलाना",
      audio: "42f84f49-85a0-4775-8853-8a4edc8a9659.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.मिलानाAudio),
    },
    {
      text: "रूठा",
      audio: "fe14271e-ebbc-40f2-9e83-4a2a7dfec66b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रूठाAudio),
    },
    {
      text: "रुकना",
      audio: "08f71060-0783-43e0-aca5-6dede7032337.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुकनाAudio),
    },
    {
      text: "रुकाव",
      audio: "d79eacc9-99bf-47cf-9de1-3a89f35d1509.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रुकावAudio),
    },
    {
      text: "रूपा",
      audio: "8f4f937e-4efc-4297-a271-4e9877599667.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.रूपाAudio),
    },
    {
      text: "सिपाही",
      audio: "03a37f06-546d-4658-8a56-1e604dae63f1.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.सिपाहीAudio),
    },
    {
      text: "तितली",
      audio: "4f285c9e-17ce-441e-9cc3-0f1bacd8e7be.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.तितलीAudio),
    },
    {
      text: "हाथी",
      audio: "9fedf55c-5913-4aee-a2a4-4573284519bd.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.हाथी2Audio),
    },
    {
      text: "छाता",
      audio: "b9bdb287-48ef-49a7-816a-5ef7029dbbc4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.छाताAudio),
    },
    {
      text: "धनिया",
      audio: "b796798f-182c-4c47-9489-dc4dca75da10.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.धनियाAudio),
    },
  ],

  ta: [
    {
      text: "மலை",
      audio: "bf0f13d5-f206-4fe2-b0fc-39462362b948.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மலைAudio),
    },
    {
      text: "நதி",
      audio: "47c2b4ee-88bf-4b4f-92e6-07716978b021.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.நதிAudio),
    },
    {
      text: "புழு",
      audio: "49500432-222b-475c-81c9-d331adfbca3a.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.புழுAudio),
    },
    {
      text: "வலி",
      audio: "5c7cdc08-b216-4317-80e2-a2995aeb1239.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.வலிAudio),
    },
    {
      text: "தலை",
      audio: "e782655f-6da9-4dc8-9f36-ce404c4c53c2.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.தலைAudio),
    },
    {
      text: "நாடு",
      audio: "37a8ced6-8fa4-451d-a712-627c09bd8398.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.நாடுAudio),
    },
    {
      text: "மாடு",
      audio: "37a8ced6-8fa4-451d-a712-627c09bd8398.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மாடுAudio),
    },
    {
      text: "மழை",
      audio: "0d6e3293-7cd1-40ac-a971-46062a2c5bda.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.மழைAudio),
    },
    {
      text: "கடை",
      audio: "81bf37f3-4517-4af1-94d6-d8f801e20534.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.கடைAudio),
    },
    {
      text: "வீடு",
      audio: "7837a882-d5c5-40b6-b4d2-3d72d42427c7.mp3",
      segmentedAudio: getAssetAudioUrl(s3Assets.வீடுAudio),
    },
  ],

  te: [
    {
      text: "గది",
      audio: "99be1000-4455-456b-aec4-7bb64eb03357.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గదిAudio),
      image: "a412d0ae-c80b-42b2-aa37-d0d01cd35478.png",
    },
    {
      text: "చేను",
      audio: "5cb22860-042d-4faa-972d-d9f5c51f9616.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చేనుAudio),
      image: "6d77c3e7-096d-404d-87ad-a374bcbc5274.png",
    },
    {
      text: "చీర",
      audio: "b3fd1e21-d332-4c24-b57b-875343e509cc.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చీరAudio),
      image: "fc0b7594-ea85-4c4b-bd23-724b1fff54ec.png",
    },
    {
      text: "గెల",
      audio: "12fc97c2-ed14-4ed5-b3e0-5830e083977b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గెలAudio),
      image: "de4b43c5-67a0-4689-b39c-7c8b3f45d0f3.png",
    },
    {
      text: "సౌధం",
      audio: "b8238760-b23f-48a7-836b-5d9a383b42d2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సౌధంAudio),
      image: "d35e6253-d1a9-431c-acd0-b28acbb708f8.png",
    },
    {
      text: "గృహం",
      audio: "152bb7b3-89e5-4d38-a57e-a389ebf62571.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గృహంAudio),
      image: "91234a7f-da48-41a0-a792-0393882716bf.png",
    },
    {
      text: "జాతర",
      audio: "09412f04-c180-4411-bab4-c1ba07eef7c4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జాతరAudio),
      image: "11d8d43d-2906-42cf-aac2-e2e9cd0f77d7.png",
    },
    {
      text: "గీరు",
      audio: "76a165f2-960e-4445-9c60-89ac34197a2b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గీరుAudio),
      image: "1734e535-62d4-4c73-8fb5-9a3b6d7c6247.png",
    },
    {
      text: "జైలు",
      audio: "84ac6622-8ec6-4634-94f7-2a6fd1cc2dcf.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జైలుAudio),
      image: "833f3cf5-0a7a-44c2-86a0-5c5ad68ba01d.png",
    },
    {
      text: "కోకిల",
      audio: "adfb12ce-cc02-447d-bea6-c75455fa4eb3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.కోకిలAudio),
      image: "3e136472-4fc9-4acc-9582-5f7118c9f983.png",
    },
    {
      text: "నౌక",
      audio: "99db1186-5a62-4ae2-9987-1b10e5288107.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నౌకAudio),
      image: "e624459d-ec03-4d3c-9138-6826c1561b5b.png",
    },
    {
      text: "నీకు",
      audio: "d767350b-192c-46ab-8794-c23936999100.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నీకుAudio),
      image: "b94ad383-8a3b-4b0d-972c-4028a5fa0d9a.png",
    },
    {
      text: "పోరు",
      audio: "78868085-2c81-4c3b-ad59-79efa6d8d4b0.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పోరుAudio),
      image: "ee3484f6-b1cd-4deb-884d-51c3bbb89f2c.png",
    },
    {
      text: "మెడ",
      audio: "87961184-a658-4be4-912f-6b6209535e00.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మెడAudio),
      image: "4bbc1ce5-b04a-4ffc-8cd4-81e4688e4fe3.png",
    },
    {
      text: "టోపీ",
      audio: "cfa1ccfd-7d25-409d-a5f9-95479d761229.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.టోపీAudio),
      image: "e2369a79-5712-4360-9a29-15a4bdd78ab4.png",
    },
    {
      text: "డైరీ",
      audio: "bba5dbcf-9587-4a06-9fe2-999aed9e32c5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.డైరీAudio),
      image: "f42a9d60-2521-482d-80b5-c1c53d0ee7e0.png",
    },
    {
      text: "రోకలి",
      audio: "0ce83c53-9c18-407f-804f-223dfa032061.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.రోకలిAudio),
      image: "cc334694-4d70-41a2-8e25-f727d0d62a67.png",
    },
    {
      text: "సూది",
      audio: "73e2d863-5038-41ff-95bf-98529ac03fa8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సూదిAudio),
      image: "4d2a8a6a-f875-4a90-aee4-43f78a8ea152.png",
    },
    {
      text: "జౌళి",
      audio: "a058121e-cf67-487c-8c87-9ce17e85ab78.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జౌళిAudio),
      image: "51cfde8d-121c-422f-a114-5d1e16103a0f.png",
    },
    {
      text: "సీసా",
      audio: "e4f2e7f1-0089-4364-9073-277f18bcb06f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సీసాAudio),
      image: "f19063f9-be03-499e-bbe6-515242967a59.png",
    },
    {
      text: "బంతి",
      audio: "0fc8d70e-4c08-4404-985e-607d2ddd4d5c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బంతిAudio),
      image: "7df79593-184f-4cd0-9afe-cea8cf089b8b.png",
    },
    {
      text: "టౌను",
      audio: "e1f8bfe3-bbad-4f8b-ae88-55fe53364e2e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.టౌనుAudio),
      image: "3cd85cd7-2b7a-454b-8f35-779f22fd394a.png",
    },
    {
      text: "బాలిక",
      audio: "5a661a20-5587-4a05-8b04-7bb80c78af7f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బాలికAudio),
      image: "5a305c06-d14e-4d24-adae-f7186211f62b.png",
    },
    {
      text: "నెమలి",
      audio: "ba2d7442-074d-454e-9c24-2780eb6f2e59.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నెమలిsplitAudio),
      image: "dca125fa-2293-4f78-ac7d-f89879d99bc8.png",
    },
    {
      text: "పశువు",
      audio: "b19ed5da-a06f-4d28-8736-b56ccf2b81ea.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పశువుAudio),
      image: "890c0bd7-4b36-4302-9926-22de387e7c91.png",
    },
    {
      text: "బూడిద",
      audio: "222cf053-ce7d-43e6-9e5d-0e573a110b31.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బూడిదAudio),
      image: "cca211fe-c2c7-40a8-8786-4cbee2db69df.png",
    },
    {
      text: "నుదురు",
      audio: "3e27d58d-72c3-4cc3-8886-e0444293f576.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నుదురుAudio),
      image: "e88113f6-dfce-412c-9a74-0fbbd9197381.png",
    },
    {
      text: "మైదానం",
      audio: "62d51ed5-c606-435e-a23d-cee6cbd5446d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మైదానంAudio),
      image: "15d25aa8-be33-45f8-99a4-4a82dfd87583.png",
    },
    {
      text: "నొసలు",
      audio: "b94dff85-d1c9-474c-a067-b458c7560347.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నొసలుAudio),
      image: "c556a6b5-487a-4917-b2d8-abf8293175b1.png",
    },
    {
      text: "పొదుపు",
      audio: "f714b74a-f9ba-4bf3-a09a-0a984a7696c6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పొదుపుAudio),
      image: "e54e4cef-714c-41dc-8f73-80561416ff94.png",
    },
    {
      text: "జెండా",
      audio: "f5129861-6aa7-4849-988d-dfa1831e3a75.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జెండాAudio),
      image: "a16f477e-182b-4688-8a14-aea49be252c5.png",
    },
    {
      text: "పెరుగు",
      audio: "ae7f1913-1652-4979-8323-7a1c9fa83c56.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పెరుగుAudio),
      image: "e9435fac-5d6b-4769-b3af-afd1de59a36e.png",
    },
    {
      text: "భూకంపం",
      audio: "0bf66c03-37ba-49c8-86bf-7dad77bf4395.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.భూకంపంAudio),
      image: "6d3f703e-e1ed-44f3-83ee-51ec68b72d05.png",
    },
    {
      text: "పావురం",
      audio: "e346c5ad-7bb6-4b64-81bd-359ac7ef566f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పావురంAudio),
      image: "710a4d93-ddcd-4487-a829-c2eb9017ca38.png",
    },
    {
      text: "జూకాలు",
      audio: "c6f92ef1-874e-48c6-9417-b58b3c7ac707.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జూకాలుAudio),
      image: "4f2c3ffd-8d5d-4a91-a8fb-16345b040ee2.png",
    },
    {
      text: "పసిడి",
      audio: "f1838fba-64c7-4768-a9e7-7750a250a4c6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పసిడిAudio),
      image: "a0c79728-e6ea-42ad-9a7b-6c37eaba02f1.png",
    },
    {
      text: "గాజులు",
      audio: "2d938405-8a58-4650-b174-d15988d930e5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గాజులుAudio),
      image: "5515f309-6a1c-407c-b598-64745ca1df32.png",
    },
    {
      text: "నృపతి",
      audio: "35db88d9-bd7f-4d6c-b966-fd32f9a2e791.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నృపతిAudio),
      image: "4024439e-aaf3-4334-8f4c-18a73f06e535.png",
    },
    {
      text: "పైసలు",
      audio: "1f15e531-f83f-440b-b037-b7ec15ab2ba3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పైసలుAudio),
      image: "62f77432-0424-4996-8c96-32c9c235027e.png",
    },
    {
      text: "మొదలు",
      audio: "06b635ed-ee50-4979-bf3d-6120053e423c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మొదలుAudio),
      image: "673c3eb9-d7d2-41bd-a493-dc76d745d7e7.png",
    },
    {
      text: "మాటలు",
      audio: "7ff704dc-f1f0-48d0-8ab3-6fa3de08c68e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మాటలుAudio),
      image: "d9e87544-c93f-4c00-a6f9-cfe951fa7528.png",
    },
    {
      text: "వివాహం",
      audio: "80f926b8-3fa2-4d18-838a-9ef3d6b04b45.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.వివాహంAudio),
      image: "8ddc1a76-9d67-4d1e-a13f-f1d4b8cd0842.png",
    },
    {
      text: "మూకుడు",
      audio: "ea8f4894-3848-44a9-98d0-b133b76942ce.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మూకుడుAudio),
      image: "051f14a1-9841-4f86-909d-e0b4406868b1.png",
    },
    {
      text: "హృదయం",
      audio: "20d376c1-453f-4b9b-b573-08016932afde.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.హృదయంAudio),
      image: "6b1569b0-f4dc-44c4-ac06-618ff0737979.png",
    },
    {
      text: "బేడీలు",
      audio: "be6164c1-4529-4862-8586-a714b2b88652.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బేడీలుAudio),
      image: "d21c747d-17cf-45ff-84c2-1107dd1a1f6b.png",
    },
    {
      text: "శైశవం",
      audio: "aec28d63-9afe-4b42-bd37-5ceef3255def.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.శైశవంAudio),
      image: "aba49865-3b6b-4a4f-a55b-a0ad217c2486.png",
    },
    {
      text: "గొడుగు",
      audio: "dc4638d0-11b6-4270-b9a2-0056fea38ad5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గొడుగుAudio),
      image: "6af4fdbf-f682-4ea4-8892-3c604254b8a4.png",
    },
    {
      text: "పొడవైన",
      audio: "4a9a9fe9-643a-4a95-bd60-ffa1d5cd2981.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పొడవైనAudio),
      image: "cb45acc9-82b5-4229-bac6-7d3f5b38ba09.png",
    },
    {
      text: "సొరకాయ",
      audio: "336d1c4f-0858-4afb-811b-121576a5cc97.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సొరకాయAudio),
      image: "06288e6d-5de0-48c0-93f7-62396c781901.png",
    },
    {
      text: "జలపాతం",
      audio: "4ea80f33-49fc-44bb-b16a-65db31c46495.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జలపాతంAudio),
      image: "d3d85f0b-0b28-4794-b6a3-a93b19ec933b.png",
    },
    {
      text: "గిజిగాడు",
      audio: "b9bf7602-1ac2-4101-b45e-4ee2c7d0f99e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గిజిగాడుAudio),
      image: "07b0c519-e7cb-4672-8cda-1fd21543b813.png",
    },
    {
      text: "ఊరేగింపు",
      audio: "2c66e48d-3b6a-4df5-842a-b95a041a3741.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ఊరేగింపుAudio),
      image: "7d1e1579-63c6-4181-8d8b-d3f357dda882.png",
    },
    {
      text: "చూడలేదు",
      audio: "41640d7e-a923-4cc2-a174-072f27000c31.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చూడలేదుAudio),
      image: "0456a5d0-e645-4bb7-839a-0c0e01d05ec5.png",
    },
    {
      text: "గులాబీలు",
      audio: "74b1483a-2701-4608-9f5c-572fa8e3bbe2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గులాబీలుAudio),
      image: "1d9a6c6b-7879-41e8-8d1a-40631dda2891.png",
    },
    {
      text: "మీగడ",
      audio: "c669e1a0-18c7-4531-ad23-8dca74ad2803.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మీగడAudio),
      image: "0b46d98e-dbdd-485d-8472-51e93fd73d47.png",
    },
    {
      text: "చీపురు",
      audio: "8277b035-401b-488d-a113-8f9cf226c118.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చీపురుAudio),
      image: "80bed291-3043-46ae-8b4a-da909d464147.png",
    },
    {
      text: "రెండు",
      audio: "5679c906-2d8c-4ff7-9c6a-2861f6cbe1a7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.రెండుAudio),
      image: "5a576136-cc9c-4c95-80b1-f2de07a6194d.png",
    },
    {
      text: "మేఘం",
      audio: "ab6251b6-aff3-475f-af7f-841e8068b978.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మేఘంAudio),
      image: "d59582fd-2d76-4498-81f6-73e0c963ffda.png",
    },
    {
      text: "నేల",
      audio: "07510b3c-1efd-4cc9-9a0d-7cf68640fd5e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నేలAudio),
      image: "3dc59fdc-08e0-4d82-bbb4-404759377fc7.png",
    },
    {
      text: "తోలు",
      audio: "a661db28-f049-4268-99a2-6cbf10ba23c0.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.తోలుAudio),
      image: "53a752bd-4f2b-431a-abad-b16c3adf4878.png",
    },
    {
      text: "పూజారి",
      audio: "aec1ba7e-4fe4-4ee0-8579-8ef868b10630.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పూజారిAudio),
    },
    {
      text: "జాలరి",
      audio: "28b14c01-2219-4f36-b7c9-97312bae3e8a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జాలరిAudio),
    },
    {
      text: "కూజా",
      audio: "8089314a-507c-481f-9864-b3cf1e85c9d4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.కూజాAudio),
    },
    {
      text: "దివిటి",
      audio: "3a63307c-7927-4a42-af7f-eb80653f1a67.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.దివిటిAudio),
    },
    {
      text: "గాలి",
      audio: "99bf2848-634c-4fe8-846d-8db895137461.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గాలిAudio),
    },
    {
      text: "గోడ",
      audio: "887c77b8-e4c3-4b1a-925a-d1f7f2801797.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గోడAudio),
    },
    {
      text: "దురద",
      audio: "4d1acab5-5e40-407d-a577-01bea8a05203.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.దురదAudio),
    },
    {
      text: "చదువు",
      audio: "104ee587-c591-494d-91da-2973160a72e4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చదువుAudio),
    },
    {
      text: "చేదు",
      audio: "aa994426-43e8-42b4-a20e-605bf8eff8e2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చేదుAudio),
    },
    {
      text: "కూతురు",
      audio: "926741d2-4784-4613-89d2-8c847c8c7af4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.కూతురుAudio),
    },
    {
      text: "పెసలు",
      audio: "8f301de3-f6c5-444f-93d7-d6741a24031d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పెసలుAudio),
    },
    {
      text: "హారం",
      audio: "cb7d1ec9-d125-4675-99ed-795e40b598c5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.హారంAudio),
    },
    {
      text: "కిటికి",
      audio: "ee52f2c6-cbd4-49d2-b11c-dd4b619558cb.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.కిటికిAudio),
    },
    {
      text: "చీకటి",
      audio: "b8a3ac68-8037-4947-b831-6505c13f4c7e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చీకటిAudio),
    },
    {
      text: "శునకం",
      audio: "b6ccd267-a185-47b9-89de-77e2a7633b30.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.శునకంAudio),
    },
    {
      text: "గెలుపు",
      audio: "432b6c3b-69ac-4910-9b07-6f8f028cc60e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గెలుపుAudio),
    },
    {
      text: "మేక",
      audio: "1daa13cb-4556-4f39-adf7-4f6d603ac1bd.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మేకAudio),
    },
    {
      text: "కోడి",
      audio: "78f5e8cf-ce12-4ece-8f66-7cb3f127185a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.కోడిAudio),
    },
    {
      text: "పాలు",
      audio: "6f4af884-14b5-499a-be8d-98f7360a05ee.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పాలు2Audio),
    },
    {
      text: "నీడ",
      audio: "7adf2896-aaa5-4c0f-b7d4-708c9549ea5d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.నీడAudio),
    },
    {
      text: "పూవులు",
      audio: "56674e51-b2d2-4878-a538-6ee62b15d58d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పూవులుAudio),
    },
    {
      text: "గురువు",
      audio: "94fda31e-3e16-4274-9c9f-d206a89be48d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గురువుAudio),
    },
    {
      text: "జూలు",
      audio: "6864cfd4-45e0-48be-aa20-055a31b2e8c7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జూలుAudio),
    },
    {
      text: "దుకాణం",
      audio: "96633501-7e6d-4c84-a4e2-fac2e2d7ca3d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.దుకాణంAudio),
    },
    {
      text: "పీట",
      audio: "afe1b8de-1d0a-45f9-980b-4e3bc35514a9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.పీటAudio),
    },
    {
      text: "సాగరం",
      audio: "e51544df-0016-4f94-9411-2344d73b8e9c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.సాగరంAudio),
    },
    {
      text: "మీసాలు",
      audio: "936658cf-daa7-4e97-8098-b5bea062feec.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మీసాలుAudio),
    },
    {
      text: "తిలకం",
      audio: "89762672-d90b-463e-9bcd-5cda1da47deb.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.తిలకంAudio),
    },
    {
      text: "చామంతి",
      audio: "caa3a4fb-726d-4e07-9e77-707696d8b1ad.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చామంతిAudio),
    },
    {
      text: "గిరి",
      audio: "808470e2-db4f-4dfe-b15c-1e565c6eb29f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.గిరిAudio),
    },
    {
      text: "తోక",
      audio: "f4c70a34-054c-4617-acf6-13fd7a9b9224.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.తోకAudio),
    },
    {
      text: "మామిడి",
      audio: "d88e6f1f-06ee-448f-8489-9c305cf60d22.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మామిడిAudio),
    },
    {
      text: "మీనం",
      audio: "946144d3-d395-49ab-85b3-8e0ca89a676e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మీనంAudio),
    },
    {
      text: "మూతి",
      audio: "e341db0c-b86e-452c-bced-fb2d170c7da7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.మూతిAudio),
    },
    {
      text: "రోజా",
      audio: "f687bf5f-d27a-44e7-80ea-d979f37023e3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.రోజాAudio),
    },
    {
      text: "బజారు",
      audio: "bd7ede7f-63b0-4f52-9416-10002d738733.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.బజారుAudio),
    },
    {
      text: "రూపాయి",
      audio: "91523dff-d547-4490-8a5b-bfa00cd3fc09.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.రూపాయిAudio),
    },
    {
      text: "చపాతీ",
      audio: "1df86b9a-ec60-44a6-befd-9de0e9f6e467.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.చపాతీAudio),
    },
    {
      text: "జంతువు",
      audio: "2e5128f6-a445-4ddf-a03c-fb8f2bd16c77.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.జంతువుAudio),
    },
    {
      text: "వేపాకు",
      audio: "6ce13b8d-fb3f-413a-bf3f-79df9cf2ae81.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.వేపాకుAudio),
    },
  ],

  kn: [
    {
      text: "ಕಾಗೆ",
      audio: "640f5b57-8228-42f8-adde-315dfc18b131.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕಾಗೆAudio),
      image: "e253a336-c072-4c06-91ce-764e5bd688b3.png",
    },
    {
      text: "ಮಾಲೆ",
      audio: "99dce746-98fe-4884-8466-9ae04e3b01bb.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮಾಲೆAudio),
      image: "28e07d8f-bbe1-42ee-9907-4fe4b3fe8eb8.png",
    },
    {
      text: "ಗಿಳಿ",
      audio: "a5d97e00-305b-4bb5-a411-59521c5cc59e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗಿಳಿAudio),
      image: "1c66cc89-cee5-4ae4-b065-9c4f897351a0.png",
    },
    {
      text: "ಸಿರಿ",
      audio: "3b64139f-06fb-4f5d-9692-434a632c13af.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸಿರಿAudio),
    },
    {
      text: "ಗುರು",
      audio: "4f81d178-39a5-4db3-bf6d-2be5b827ab95.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗುರುAudio),
      image: "b35db194-aec3-4637-b18d-0dfcbf2bfeb4.png",
    },
    {
      text: "ಹುಲಿ",
      audio: "3e2eae4a-c015-4a8a-b9e9-153933b20180.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹುಲಿAudio),
      image: "d6bfebb5-6731-40c3-b577-57eeed620104.png",
    },
    {
      text: "ಮೂರು",
      audio: "fb07e346-2dc9-4620-b839-02235827f0e0.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೂರುAudio),
      image: "c4314928-d735-494e-b476-b21b628aeeae.png",
    },
    {
      text: "ಗೂಡು",
      audio: "a639c3f3-f94c-45be-b09a-50cf211d8f0f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೂಡುAudio),
      image: "0a343fec-8a96-42fa-9a6d-0b41cbf3f2c3.png",
    },
    {
      text: "ನೃಪ",
      audio: "8d335489-a84c-4f10-81d8-94e64595d2c1.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೃಪAudio),
    },
    {
      text: "ಕೃತಿ",
      audio: "bb88b0d2-3d70-4b47-9d5f-a30a90c6a4b4.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೃತಿAudio),
      image: "46580622-a58e-431b-9183-d2d2528fb8c1.png",
    },
    {
      text: "ಕೆರೆ",
      audio: "80e0b2c1-9e0d-4690-806f-023cefcd1714.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೆರೆAudio),
      image: "76579bd6-8a3c-4349-9396-f14678374c97.png",
    },
    {
      text: "ಮೆರೆ",
      audio: "77a87356-f84e-4703-ba13-bb38fcdbd20a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೆರೆAudio),
      image: "93cf4b16-18c6-4b7f-8f48-8407a0f8692b.png",
    },
    {
      text: "ದೇವಿ",
      audio: "d3830e93-7aed-4679-bd07-dc2d00eb3435.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ದೇವಿAudio),
      image: "4e7b5fde-585c-49ca-9e46-4897a39f3762.png",
    },
    {
      text: "ವೇಷ",
      audio: "20482681-fda8-4332-b807-7991e72b732a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ವೇಷAudio),
      image: "f76d3bc6-6e04-4de3-8e53-2a8460385701.png",
    },
    {
      text: "ಕೈದಿ",
      audio: "003c8ba2-5e95-4867-b585-8112d3e76cfe.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೈದಿAudio),
      image: "68ef05f4-86c1-482f-9193-125ed968ec08.png",
    },
    {
      text: "ಪೈರು",
      audio: "db39a2c8-c662-47ec-99a7-18b323140152.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪೈರುAudio),
      image: "e58ee2c5-1862-4ad9-b2b0-a8c51dcaf6fc.png",
    },
    {
      text: "ಹೊರೆ",
      audio: "a60f497e-0f5d-4949-b5f8-0ff8cc8baece.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹೊರೆAudio),
      image: "dd73e654-4008-436b-aeed-682b3d665324.png",
    },
    {
      text: "ಕೊಳೆ",
      audio: "786e40da-51eb-4087-90c1-18de17fc64af.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೊಳೆAudio),
      image: "f8d81fef-871a-47ef-aa27-1f04b3be1e42.png",
    },
    {
      text: "ಹೋರಿ",
      audio: "74861ae4-7866-44df-b598-d9858b5aa109.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹೋರಿAudio),
      image: "b666a936-bfe3-4173-92a4-55d4c86d5e06.png",
    },
    {
      text: "ನೋಟು",
      audio: "f5c6af01-acc7-43fa-963c-923a23c5d195.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೋಟುAudio),
      image: "2241d366-02f6-4cfb-9876-90b233c2a79e.png",
    },
    {
      text: "ದೌಡು",
      audio: "75370ff7-f511-4b30-b04f-3b627b38140d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ದೌಡುAudio),
      image: "a832da6c-8fe8-4384-91f3-cd5eaf57e59e.png",
    },
    {
      text: "ಜೌಗು",
      audio: "12ad62f1-8387-4783-bf77-5b7b451d9409.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಜೌಗುAudio),
      image: "f7e767ca-7d1c-4eb5-95d2-ce9a8ca76493.png",
    },
    {
      text: "ಕಂಸ",
      audio: "b1c59fd6-caf5-4649-bddc-587ce20e7a2b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕಂಸAudio),
      image: "5b444c61-2774-4afd-83dd-4510ec177c53.png",
    },
    {
      text: "ನಂದಿ",
      audio: "b7220ae0-cb33-4294-b532-062876eb4b7e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನಂದಿAudio),
      image: "6554e275-2e00-4dcc-9b83-132f8ecb71d4.png",
    },
    {
      text: "ಹಾವು",
      audio: "583d7560-0eb1-481c-9497-cb9069dfd357.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹಾವುAudio),
      image: "03531c43-0a46-49e4-ab85-b0ef3d943817.png",
    },
    {
      text: "ಬಿಳಿ",
      audio: "e6015919-6993-4fae-b5ab-88dda8b3c0b6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬಿಳಿAudio),
      image: "e5113c99-d0f3-4a2e-bfd5-a629220bd259.png",
    },
    {
      text: "ಹೊಗೆ",
      audio: "9b7a9d58-a3a8-4261-a12a-d3e95deda693.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹೊಗೆAudio),
      image: "6cb23acd-f1cb-40ea-b30a-d19be2198c4d.png",
    },
    {
      text: "ಕೆನೆ",
      audio: "18494ea5-d06d-449b-b554-42d1838c834d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೆನೆAudio),
      image: "cbdc6d69-c2eb-4add-a1e0-a2078e032c1b.png",
    },
    {
      text: "ಕೇಳು",
      audio: "8d906ef5-8665-423f-8a41-88844ab5bf3d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೇಳುAudio),
      image: "abd0a043-baf0-4a5f-ab3e-3b65ac659b72.png",
    },
    {
      text: "ನೌಕೆ",
      audio: "8b5dc5e8-d5e7-4156-9aa9-f4aba931d8cc.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೌಕೆAudio),
      image: "b719896c-d994-4d0e-80eb-d8681ff2cc6e.png",
    },
    {
      text: "ನಾಳೆ",
      audio: "306fd589-aa0c-47c7-a141-7d0110dd3d2c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನಾಳೆAudio),
      image: "ea171f42-8eac-471a-b991-c1ffb136576f.png",
    },
    {
      text: "ಚೀಟಿ",
      audio: "c273bae5-641e-4c68-a79e-737f78cfa187.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಚೀಟಿAudio),
      image: "105945aa-0d2a-4f20-938b-2cb132f714e6.png",
    },
    {
      text: "ಠೀವಿ",
      audio: "9b37c83c-046c-46a1-9700-4ac52f14b152.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಠೀವಿAudio),
      image: "99ff1b88-0434-46f0-80cd-56824e50e9df.png",
    },
    {
      text: "ಸುಲಿ",
      audio: "1939ff11-8138-4dcd-9590-87538f0d4533.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸುಲಿAudio),
      image: "e8de0e66-87d1-4adf-ab0b-68a41b1a4d56.png",
    },
    {
      text: "ಬೆವರು",
      audio: "c6b057ca-9d39-43d7-a6f4-043e42687849.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬೆವರುAudio),
      image: "4b404cd8-bad2-42ba-96fa-724106f56e0c.png",
    },
    {
      text: "ಹೇರು",
      audio: "de658972-f471-4a33-946a-41150b66a020.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹೇರುAudio),
      image: "92ab3f00-fb55-4907-9319-b33fb2685d8e.png",
    },
    {
      text: "ಹಾಡು",
      audio: "e1a93d65-2692-4e72-961c-a3e07897063d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹಾಡುAudio),
      image: "e54a370c-a7c3-4ec6-b035-b383c24f32ee.png",
    },
    {
      text: "ತೊರೆ",
      audio: "34bf58ce-6b2d-490d-8c59-81e27e242344.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ತೊರೆAudio),
      image: "bf6db23c-f0a7-4f36-9a06-62c1dd410590.png",
    },
    {
      text: "ಚೇಳು",
      audio: "669e74d0-3062-44ee-9870-f895cf2b9244.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಚೇಳುAudio),
      image: "f8e90a67-d8e9-493d-8d00-7e33cfe84f3d.png",
    },
    {
      text: "ಗೇಟು",
      audio: "6a92fef1-f3f6-41e3-8384-847f91458fe9.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೇಟುAudio),
      image: "2bdd8908-0b3c-422e-becc-0b944b3c8da3.png",
    },
    {
      text: "ಜೈಲು",
      audio: "9c5137c7-e192-43b3-b4c8-f7443700efab.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಜೈಲುAudio),
      image: "05a2bde9-53db-4748-b265-8029272e189a.png",
    },
    {
      text: "ಬಾಯಿ",
      audio: "e9625e8e-5108-4c03-a41c-f1a18c3bed78.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬಾಯಿAudio),
      image: "014cd9da-eace-4622-a808-cde08cb14ecb.png",
    },
    {
      text: "ಮೊರೆ",
      audio: "bc477f33-447a-4100-8be4-347dcdb1f170.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೊರೆAudio),
      image: "0cb43293-5634-4fe4-a3a2-1914d1e7bc42.png",
    },
    {
      text: "ಡಾಬಾ",
      audio: "e17983d7-75a6-4efb-a31a-a291c6f0d28d.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಡಾಬಾAudio),
      image: "4cc4156b-12cc-41c6-a2ac-96e1a55babe5.png",
    },
    {
      text: "ಗೋವು",
      audio: "dd891c81-eb46-4c87-895a-d206c5e6f162.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೋವುAudio),
      image: "52a0bf00-0577-4024-aec1-a493428f9584.png",
    },
    {
      text: "ಕುದಿಸು",
      audio: "fcd85161-a975-4150-99e3-d109efaa51fc.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕುದಿಸುAudio),
      image: "70f2f7a1-0251-4fc2-99c3-2463d3c69625.png",
    },
    {
      text: "ಡೋಲು",
      audio: "bddf7f73-4045-47ff-97b7-8c5f923e7e07.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಡೋಲುAudio),
      image: "b4261f0c-4a6a-447c-9a86-552afc73bdd7.png",
    },
    {
      text: "ಪೌಳಿ",
      audio: "5aeed7b3-b676-40f7-a2fb-183b263cf9c7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪೌಳಿAudio),
      image: "50f61d8d-78a5-4bac-b8a5-0deb4fc2cae7.png",
    },
    {
      text: "ಮೋರಿ",
      audio: "9d6c2910-9192-48e7-9e20-1f8819576da2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೋರಿAudio),
      image: "4ca102cf-ea65-4a84-b2b9-8fec60493131.png",
    },
    {
      text: "ನೀರು",
      audio: "7a235fbe-b81b-4c90-83d9-902fa8072868.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೀರುAudio),
      image: "425cc296-48c8-4c6b-ac30-de0f32751cfd.png",
    },
    {
      text: "ದೋಣಿ",
      audio: "32444ad8-33c3-4456-b1ab-5d11441c813e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ದೋಣಿAudio),
      image: "993dd0c4-fff6-4542-b1d0-a836adbdbec4.png",
    },
    {
      text: "ದಾರಿ",
      audio: "23989e7e-e9ea-4631-b59e-90ca0cd54c03.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ದಾರಿAudio),
      image: "a80195ff-96ad-4807-98c8-b4d1bf34e9ca.png",
    },
    {
      text: "ಸೇರು",
      audio: "09d87fb9-a94a-4e1f-9bc4-06384fda1c1f.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸೇರುAudio),
    },
    {
      text: "ಲೈಲಾ",
      audio: "7496ead7-32fa-4f82-996f-2ab5415ec099.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಲೈಲಾAudio),
    },
    {
      text: "ವೈರಿ",
      audio: "96c9c6ae-5697-4ed8-b875-755b79dbcf2e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ವೈರಿAudio),
    },
    {
      text: "ಕುರಿ",
      audio: "9bf872d8-ad12-4a45-b00d-b29aa9585238.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕುರಿAudio),
    },
    {
      text: "ಗಾಡಿ",
      audio: "a3e5b96b-19c9-4f29-a969-f4aafa8b4613.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗಾಡಿAudio),
      image: "52235a07-dc63-4744-a1db-c25489a63f3e.png",
    },
    {
      text: "ಸೌತೆ",
      audio: "d708c765-678d-4783-be2f-53f6a549799c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸೌತೆAudio),
      image: "28ed196c-1614-4a16-af00-aaf6ee5f67a9.png",
    },
    {
      text: "ಸಾರಿಗೆ",
      audio: "173765b0-b114-456e-88e1-1d2f6711ccff.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸಾರಿಗೆAudio),
    },
    {
      text: "ರಾಣಿ",
      audio: "5d1023e2-6e64-41bb-9ca1-8852e3419445.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ರಾಣಿAudio),
    },
    {
      text: "ಗೌರಿ",
      audio: "3a6ee0b9-fbb3-43bf-b29e-e3c645aa5eaa.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೌರಿAudio),
    },
    {
      text: "ವೋಟು",
      audio: "ae0a9859-c591-4336-b7e5-e57ffbd9c0d1.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ವೋಟುAudio),
    },
    {
      text: "ತೊಲೆ",
      audio: "e1cf8190-8ab8-4d59-beb3-e6d7187a9da3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ತೊಲೆAudio),
    },
    {
      text: "ಡೌಲು",
      audio: "aed19454-f201-4dd3-9fea-90bb24b492b0.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಡೌಲುAudio),
    },
    {
      text: "ಮೌನಿ",
      audio: "fae27992-6037-4a79-b168-3cbd547da140.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೌನಿAudio),
    },
    {
      text: "ಸೌದೆ",
      audio: "115b8d3f-cfdd-4743-8a43-875b91185a8a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸೌದೆAudio),
    },
    {
      text: "ತೌರು",
      audio: "84d65deb-c537-4ab3-9964-365273af469c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ತೌರುAudio),
    },
    {
      text: "ಕೋಡು",
      audio: "2d134b91-528b-41e0-a741-1f1fc85b29eb.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೋಡುAudio),
    },
    {
      text: "ಗೋಡೆ",
      audio: "2bfa5734-2682-4f68-98e5-cdf56ecf620a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೋಡೆAudio),
      image: "793f9411-c33c-4787-87da-d0c9b1b60948.png",
    },
    {
      text: "ಚೋಟು",
      audio: "9e7e572a-a5d6-4b11-befc-a9cf1f920306.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಚೋಟುAudio),
    },
    {
      text: "ರೋಗಿ",
      audio: "33b9a315-15d4-41d8-9127-20032c44914c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ರೋಗಿAudio),
    },
    {
      text: "ಟೋಪಿ",
      audio: "7e4e3651-727b-4c8f-8f31-6430ee7e51d7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಟೋಪಿAudio),
      image: "65f987a6-d9bf-49e4-8f1a-ce4af51438a5.png",
    },
    {
      text: "ತೋಟಿ",
      audio: "fe614db1-e930-4f2a-9f83-a60e9b6527f8.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ತೋಟಿAudio),
    },
    {
      text: "ಕೈದು",
      audio: "d16a3bd2-1896-4d28-8da8-90017fc4c100.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೈದುAudio),
    },
    {
      text: "ಪೈಪು",
      audio: "dd9080a5-6cb8-4610-b139-e0ee6dd15eab.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪೈಪುAudio),
    },
    {
      text: "ಬೆಳೆ",
      audio: "c0b43c86-0c47-4f89-bd04-51551de6f19e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬೆಳೆAudio),
    },
    {
      text: "ಸೆಖೆ",
      audio: "15bedb48-e5be-462e-8fb5-90586eb0bb29.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸೆಖೆAudio),
    },
    {
      text: "ಪೇಡೆ",
      audio: "f6ff3ce6-b6c9-417d-8f93-b7d239ce3bcc.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪೇಡೆAudio),
    },
    {
      text: "ರಂಭೆ",
      audio: "59e16e72-638a-4840-8430-689fe413311e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ರಂಭೆAudio),
    },
    {
      text: "ಗುಡಿಸು",
      audio: "7b0a9203-de74-474f-884f-cfb6bba71d6b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗುಡಿಸುAudio),
    },
    {
      text: "ಯುವತಿ",
      audio: "06d3a786-fceb-44e7-a751-f750b9577334.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಯುವತಿAudio),
      image: "d682a9c4-3f7d-4be8-8ff0-40449136518d.png",
    },
    {
      text: "ಪಾಲಿಸು",
      audio: "b311bd3e-bd0b-4e2f-a894-460678ad1146.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಪಾಲಿಸುAudio),
    },
    {
      text: "ಕಿಟಕಿ",
      audio: "a8e3cb6f-a6d4-4991-a459-6babf339508c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕಿಟಕಿAudio),
      image: "d642d4c3-f736-4573-ad99-068a7740711b.png",
    },
    {
      text: "ಚಿರತೆ",
      audio: "4ce023a0-740a-414b-9905-13d84842eda6.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಚಿರತೆAudio),
      image: "840eff6d-3c9a-4b43-83b5-828b7b6d455f.png",
    },
    {
      text: "ವಾಸಿಸು",
      audio: "29ba902f-8a40-4458-9105-b306c35790a7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ವಾಸಿಸುAudio),
    },
    {
      text: "ಹೆರಳು",
      audio: "99fbb746-0b52-4075-8a85-90ff6eb84c4b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹೆರಳುAudio),
    },
    {
      text: "ಯಾರಿಗೆ",
      audio: "288eb90f-9757-47c2-b643-c5f665a2b922.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಯಾರಿಗೆAudio),
    },
    {
      text: "ತಾವರೆ",
      audio: "79b898b0-45fd-4d59-b45d-4a9175fa18a3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ತಾವರೆAudio),
    },
    {
      text: "ಜಿನುಗು",
      audio: "09c0f7c4-faa8-4583-9ce2-208f10a03a0b.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಜಿನುಗುAudio),
    },
    {
      text: "ಜೋಗುಳ",
      audio: "90768cd0-4fa0-448c-bc63-491f0a35795a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಜೋಗುಳAudio),
    },
    {
      text: "ತೋರಿಸು",
      audio: "aa0fd994-973b-45b5-8b38-2b3f7782d75c.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ತೋರಿಸುAudio),
    },
    {
      text: "ಯೋಜಿಸು",
      audio: "6251dbd1-e721-4b88-bbc0-7ff273d2a156.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಯೋಜಿಸುAudio),
    },
    {
      text: "ಕೌತುಕ",
      audio: "ead4fa16-0876-4cf8-b867-2ddf755783e2.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಕೌತುಕAudio),
    },
    {
      text: "ಜೊತೆಗೆ",
      audio: "413b947f-7cc2-4647-a81d-e2a7c95915d3.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಜೊತೆಗೆAudio),
    },
    {
      text: "ಬೇಸಿಗೆ",
      audio: "c3222f8c-ed2a-4c58-9874-b8e0a4cc6dac.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬೇಸಿಗೆAudio),
      image: "884a48f5-796b-4123-b93a-1496aa2e411b.png",
    },
    {
      text: "ಟೊಮೆಟೊ",
      audio: "237c4721-18e8-44a8-a730-210f4c3621d7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಟೊಮೆಟೊAudio),
    },
    {
      text: "ಮೈಮರೆ",
      audio: "d2283c19-b572-45e3-b1cb-de1612d3b857.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೈಮರೆAudio),
    },
    {
      text: "ಮೈಸೂರು",
      audio: "fd72d9cf-58d7-46cd-b15b-207720b05cf5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮೈಸೂರುAudio),
    },
    {
      text: "ಯೌವನ",
      audio: "86f7e626-51ff-431f-800f-ee3799a831f5.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಯೌವನAudio),
    },
    {
      text: "ಮುದುಕ",
      audio: "e3a96bbc-6065-412e-9eb6-c67a2d620e5e.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಮುದುಕAudio),
      image: "5d7c8c79-0aaf-4e9d-a90b-58456a658210.png",
    },
    {
      text: "ಸೈನಿಕ",
      audio: "757c65fe-2aae-4090-b51c-ba2249280042.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಸೈನಿಕAudio),
      image: "211f3153-2537-4865-89ff-13c20a091217.png",
    },
    {
      text: "ನೇರಳೆ",
      audio: "7ebb715f-cae4-438f-b414-390e3bf9608a.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ನೇರಳೆAudio),
    },
    {
      text: "ಹೈದರಾಲಿ",
      audio: "22fca0e2-1a3f-44ab-9d96-25b38ef51212.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಹೈದರಾಲಿAudio),
    },
    {
      text: "ಬೆದರಿಕೆ",
      audio: "30b5f29d-6fe8-4658-82c8-8bb0bb219cb7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಬೆದರಿಕೆAudio),
    },
    {
      text: "ಗೃಹ",
      audio: "31b5f29d-6fe8-4658-82c8-8bb0bb219cb7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಗೃಹAudio),
      image: "e805c013-eb29-4bf3-abd0-19809c0cb058.png",
    },
    {
      text: "ಜೇನು",
      audio: "32b5f29d-6fe8-4658-82c8-8bb0bb219cb7.wav",
      segmentedAudio: getAssetAudioUrl(s3Assets.ಜೇನುAudio),
      image: "912c90ab-ea2f-486c-bfb1-84fd8fcca85b.png",
    },
  ],
};

export const TeluguGunithas = [
  {
    audio: "ka.wav",
    image: "ka1.png",
  },
  {
    audio: "Kaa.wav",
    image: "kaa2.png",
  },
  {
    audio: "Ke.wav",
    image: "ki1.png",
  },
  {
    audio: "Kee.wav",
    image: "kii2.png",
  },
  {
    audio: "Ku.wav",
    image: "ku1.png",
  },
  {
    audio: "Koo.wav",
    image: "ku2.png",
  },
  {
    audio: "Kru.wav",
    image: "kru.png",
  },
  {
    audio: "Kroo.wav",
    image: "kru2.png",
  },
  {
    audio: "ke1.wav",
    image: "ke1.png",
  },
  {
    audio: "Kee1.wav",
    image: "ke2.png",
  },
  {
    audio: "Kai.wav",
    image: "kai.png",
  },
  {
    audio: "Ko.wav",
    image: "ko1.png",
  },
  {
    audio: "Koo1.wav",
    image: "ko2.png",
  },
  {
    audio: "Kau.wav",
    image: "kau.png",
  },
  {
    audio: "Kam.wav",
    image: "kam.png",
  },
  {
    audio: "Kaha.wav",
    image: "kaha.png",
  },
  {
    audio: "Ju.wav",
    image: "ju.png",
  },
  {
    audio: "Joo.wav",
    image: "joo2.png",
  },
  {
    audio: "Yaa.wav",
    image: "yaa-second.png",
  },
  {
    audio: "yi.wav",
    image: "yi1.png",
  },
  {
    audio: "yee.wav",
    image: "yi-second.png",
  },
  {
    audio: "Paa.wav",
    image: "paa-second.png",
  },
  {
    audio: "saa.wav",
    image: "saa-second.png",
  },
  {
    audio: "pu.wav",
    image: "Pu1.png",
  },
  {
    audio: "poo.wav",
    image: "pu2.png",
  },
  {
    audio: "vu.wav",
    image: "vu1.png",
  },
  {
    audio: "voo.wav",
    image: "vu2.png",
  },
  {
    audio: "po.wav",
    image: "po1.png",
  },
  {
    audio: "poo1.wav",
    image: "po2nd.png",
  },
  {
    audio: "mo.wav",
    image: "mo1.png",
  },
  {
    audio: "moo.wav",
    image: "mo2nd.png",
  },
  {
    audio: "sau.wav",
    image: "Sau.png",
  },
];

export const KannadaGunithas = [
  {
    audio: "308e37dc-7a5b-4110-b3fd-9569bd82b588.wav",
    image: "240cc0fc-84d7-426e-8e8e-a4167a4cf07c.png",
  },
  {
    audio: "9fc48b40-6ad8-4c29-9599-439fb7c62a47.wav",
    image: "2eb6b9fd-d333-465a-a481-199ff2bfe27a.png",
  },
  {
    audio: "7383626d-6b2a-4010-98e1-cb1ab35b99be.wav",
    image: "c856ee50-0643-45aa-bf51-5d4feb98f786.png",
  },
  {
    audio: "3512fafc-4479-4c7b-a622-09bc37e65377.wav",
    image: "ddc67658-7b77-4cc4-a648-0eb43eb2bd1a.png",
  },
  {
    audio: "a3cfc183-00cc-4a6e-9c09-ea3c80c985de.wav",
    image: "b72d9271-7e77-4bbe-ba30-432c512689e1.png",
  },
  {
    audio: "caef3f40-8425-4f76-8a85-f10810a21158.wav",
    image: "ef3fbb39-7c73-4db8-a338-a528ac1060ea.png",
  },
  {
    audio: "e92eb339-f7a6-477a-b9ad-3328254f2581.wav",
    image: "1f6f0c10-4eff-4393-9965-964566fe2025.png",
  },
  {
    audio: "2a4407d9-e4c9-4a25-9497-970272faedf9.wav",
    image: "492f2b47-b5aa-4a54-b025-57f984211648.png",
  },
  {
    audio: "a9ac76c6-9baf-4462-8693-c8946d9fba74.wav",
    image: "35c17022-d984-4c8d-b020-5f675db40676.png",
  },
  {
    audio: "88afc29e-4b5b-4101-b6bf-7bda2eb7a89d.wav",
    image: "28e6bea9-de66-4020-a752-292830c7d4d9.png",
  },
  {
    audio: "19610e31-7d68-4576-9664-57115ffaa308.wav",
    image: "7ecd088f-3a90-40a2-8c81-01ce34aeb93b.png",
  },
  {
    audio: "3c9ef757-37bf-4b5e-8881-9cc9ed1b687d.wav",
    image: "2f0a6cd3-c186-45e3-bb69-5eeea8945e2d.png",
  },
  {
    audio: "c6528225-6aeb-454b-af78-ad4ce404ceff.wav",
    image: "9b36cefc-f97b-4407-96db-2853016945e0.png",
  },
  {
    audio: "7d012300-9125-4a0b-8e39-5847efda0adf.wav",
    image: "4685c085-539a-4783-8e53-1385bdba71e9.png",
  },
  {
    audio: "9aa231bf-47ea-43b7-87f8-8c768ff35281.wav",
    image: "2122084b-6eb0-4518-85df-0d5dca3153fb.png",
  },
  {
    audio: "426cb98c-d48c-42b9-ac53-eed5eb3add3f.wav",
    image: "a4db46bb-82a7-4f02-aeef-4f34d076e7b8.png",
  },
  {
    audio: "49f6314e-3c34-4cce-89dd-59f9bb957356.wav",
    image: "b9317183-7bfc-4216-afa3-3c8b46d93452.png",
  },
  {
    audio: "c926b757-6438-4830-bc00-d6f0f2d08b9c.wav",
    image: "f909d924-a6be-451a-a8db-75306465989d.png",
  },
  {
    audio: "2bb85642-0135-443c-a83a-4390acd3a26b.wav",
    image: "73d404ed-1940-41bc-8a5d-d42d3fb40258.png",
  },
  {
    audio: "087e23f9-72a1-4889-8305-3c6c95f39485.wav",
    image: "41d66b7b-d7bb-478f-8a60-63f63664aa86.png",
  },
  {
    audio: "36a5f61d-892d-4132-abd2-176cfec1279b.wav",
    image: "eff49634-8bce-4f88-b46d-1bcfab2c5f71.png",
  },
  {
    audio: "16ce6a96-0c42-4598-b74d-e3fa6b29a3db.wav",
    image: "371db4e5-a4a7-48b6-bd33-f7d490b358d9.png",
  },
  {
    audio: "05b3a5cb-47a5-4138-a40e-befdb4d6becc.wav",
    image: "d313099d-c9c3-48d3-bb25-3b390c843ecc.png",
  },
  {
    audio: "7e07d85e-c34c-4517-9534-0c278396b0f5.wav",
    image: "0221666b-8efc-4ae6-9fd9-521cd2dd5de4.png",
  },
  {
    audio: "99e9c9d2-c12e-4d6f-b66d-c7f4750fd4de.wav",
    image: "d6a83829-aa7c-4b09-8ba8-b38d57b1ebd3.png",
  },
  {
    audio: "448d3297-6a30-401a-9b6d-a2beca4f9d23.wav",
    image: "9741a6ba-4da7-4e91-bb09-3d178f64202d.png",
  },
  {
    audio: "45ebb5e2-efa4-4b68-a6b8-5117f0255e4d.wav",
    image: "52bead5e-48dd-4d73-8cb1-e9868b8b0fc8.png",
  },
  {
    audio: "01b049ee-f204-4016-832a-a02f993974aa.wav",
    image: "31d61c84-7207-479f-b82e-195b18104d2d.png",
  },
  {
    audio: "c0066b53-04b4-47de-927e-b32e853e2d2c.wav",
    image: "ce502389-2462-4165-a02e-3af5ddb8d253.png",
  },
  {
    audio: "ce5767f5-6fbb-43f8-be3a-16ea8682a4e2.wav",
    image: "f854e4a0-3740-4af8-a911-cd3b9b861bb7.png",
  },
  {
    audio: "6cb6c7dc-b3d8-4312-9e7e-d5146f6e295f.wav",
    image: "40639681-dcb9-4f67-95c9-35fa61db1102.png",
  },
  {
    audio: "78ee1aec-9cd5-4681-b5c5-60d139a0d3c0.wav",
    image: "bed78664-f7a3-4fe9-82ea-804242be602f.png",
  },
];

export const HindiGunithas = [
  {
    audio: "b97601ed-f3c9-4e14-aba2-6111fb50ef97.wav",
    image: "d25d0564-4600-43f6-aecf-22e47bc2e8ea.png",
  },
  {
    audio: "56a5ee11-6ea9-4f25-97c0-c86a3a112f8a.wav",
    image: "67f596fd-41a3-4a52-9e84-217403a51405.png",
  },
  {
    audio: "f381bdc5-b123-4f37-a642-e935563d66c1.wav",
    image: "21abd708-67a7-4ea0-ac33-008e8c11b4e3.png",
  },
  {
    audio: "c170474a-03e5-48be-a6aa-b8221f15d416.wav",
    image: "188a1a01-6276-4766-beaa-af8106429194.png",
  },
  {
    audio: "55bdbd35-e49f-4bfb-be4e-9fd8e5d3ad99.wav",
    image: "f9fb6dbf-0e2f-4d46-a72d-2e1149b5e39e.png",
  },
  {
    audio: "1c14c46a-18a3-405f-bc49-66b408654a61.wav",
    image: "94bb18cd-f831-4b3b-957d-79370f360868.png",
  },
  {
    audio: "fc0202ba-b95c-44c4-8a4d-11cd5e1e21c8.wav",
    image: "a6437b62-fe2e-496b-abdb-0025fcdf431e.png",
  },
  {
    audio: "6c713899-af8b-4137-82cf-03668b2500f5.wav",
    image: "5aeeaf34-5753-44cb-a96e-039e17265f60.png",
  },
  {
    audio: "d34511a9-42d3-49e1-b900-91ae48c6c4db.wav",
    image: "0bb11734-632f-4f7a-994d-fb328302ca25.png",
  },
  {
    audio: "28f589e1-c2ac-47a5-8a7c-fd0d9c8f0446.wav",
    image: "0be39b00-8fd1-4786-bda1-0763a4db9681.png",
  },
  {
    audio: "9c03c953-08f8-4a8b-a832-89e27f02a942.wav",
    image: "a8ba18e2-1b33-4bd8-bafe-f485a429c457.png",
  },
  {
    audio: "2d6bbc66-3a02-4e75-9b1c-4a3a05e8478b.wav",
    image: "76435667-9511-4c4f-a7fa-0441824cdb01.png",
  },
  {
    audio: "3e54fe8a-331b-4f3c-b802-5ed832a03b9d.wav",
    image: "0957b704-322e-44f8-9b2e-ac12d4f44940.png",
  },
];

function getScriptFromLang(lang) {
  const scriptMap = {
    hi: "devanagari",
    kn: "kannada",
    te: "telugu",
    ta: "tamil",
  };
  return scriptMap[lang] || "devanagari";
}

function getConsonantsFromWord(word, lang) {
  const chart = barakhadiCharts[lang];
  if (!chart) return [];

  const consonants = Object.keys(chart);
  return Array.from(word).filter((char) => consonants.includes(char));
}

function getBarakhadiForWord(word, lang) {
  const chart = barakhadiCharts[lang];
  if (!chart) return {};

  const wordConsonants = getConsonantsFromWord(word, lang);
  const allConsonants = Object.keys(chart);

  let selectedConsonants = [...wordConsonants];
  const needed = 4 - selectedConsonants.length;

  if (needed > 0) {
    const availableConsonants = allConsonants.filter(
      (c) => !selectedConsonants.includes(c)
    );
    const randomConsonants = availableConsonants
      .sort(() => Math.random() - 0.5)
      .slice(0, needed);
    selectedConsonants = [...selectedConsonants, ...randomConsonants];
  } else if (selectedConsonants.length > 4) {
    selectedConsonants = selectedConsonants.slice(0, 4);
  }

  selectedConsonants = selectedConsonants.sort(() => Math.random() - 0.5);

  const barakhadi = {};
  selectedConsonants.forEach((consonant) => {
    barakhadi[consonant] = chart[consonant] || [];
  });

  return barakhadi;
}

const playAudio = (audioUrl) => {
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  }
};

const Barakhadi = ({
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  showTimer,
  points,
  steps,
  currentStep,
  contentId,
  contentType,
  level,
  isDiscover,
  progressData,
  showProgress,
  playTeacherAudio = () => {},
  callUpdateLearner,
  disableScreen,
  isShowCase,
  handleBack,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  customWords, // Array of words to filter (e.g., ["నది", "చేప", "చీర"] for Telugu F2)
}) => {
  steps = 1;

  const [word, setWord] = useState("");
  const [targetWord, setTargetWord] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFullChart, setShowFullChart] = useState(false);
  const [currentBarakhadi, setCurrentBarakhadi] = useState({});
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [incorrectCell, setIncorrectCell] = useState(null);
  const [isWordWrong, setIsWordWrong] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const navigate = useNavigate();
  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);
  const lang = getLocalData("lang") || "hi";
  const [showAudioWave, setShowAudioWave] = useState(false);
  const [showWordAudioWave, setShowWordAudioWave] = useState(false);
  const sessionId = getLocalData("sessionId");
  const virtualId = getLocalData("virtualId");
  const [currentCollectionId, setCurrentCollectionId] = useState("");
  const [totalSyllableCount, setTotalSyllableCount] = useState("");
  const [open, setOpen] = useState(false);

  const langWiseAnswers = {
    en: {
      c: true,
      j: true,
      x: true,
      k: true,
      h: true,
      n: true,
      p: true,
      u: true,
      s: true,
      o: true,
    },
    ta: {
      அ: true,
      ஆ: true,
      இ: true,
      ஈ: true,
      உ: true,
      ஊ: true,
      எ: true,
      ஏ: true,
      ஐ: true,
      ஒ: true,
    },
    te: {
      అ: true,
      ఆ: true,
      ఇ: true,
      ఈ: true,
      ఉ: true,
      ఊ: true,
      ఎ: true,
      ఏ: true,
      ఐ: true,
      ఒ: true,
    },
    kn: {
      ಅ: true,
      ಆ: true,
      ಇ: true,
      ಈ: true,
      ಉ: true,
      ಊ: true,
      ಎ: true,
      ಏ: true,
      ಐ: true,
      ಒ: true,
    },
    hi: {
      अ: true,
      आ: true,
      इ: true,
      ई: true,
      उ: true,
      ऊ: true,
      ए: true,
      ऐ: true,
      ओ: true,
      औ: true,
    },
  };

  const swar = vowelsData[lang] || vowelsData.hi;
  const vowels = vowelsData[lang] || vowelsData.hi;

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
        console.log(
          "Voices loaded successfully:",
          voices.map((v) => ({ name: v.name, lang: v.lang }))
        );

        const hasTamil = voices.some(
          (v) => v.lang === "ta-IN" || v.lang.startsWith("ta")
        );
        if (!hasTamil && lang === "ta") {
          setVoiceStatus("Tamil voice not available. Using Hindi instead.");
        } else {
          setVoiceStatus("");
        }
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  const getWordData = () => {
    return wordData[lang] || wordData.hi;
  };

  // Get all words for the language
  let wordDataList = getWordData();

  // Filter wordDataList based on customWords if provided (similar to how LetterTrain filters with customLetters)
  if (customWords && Array.isArray(customWords) && customWords.length > 0) {
    // Normalize customWords for comparison (trim whitespace)
    const normalizedCustomWords = customWords
      .map((word) => (word && typeof word === "string" ? word.trim() : ""))
      .filter(Boolean);

    console.log("Barakhadi - Filtering words based on customWords:", {
      customWords,
      normalizedCustomWords,
      totalWordsBeforeFilter: wordDataList.length,
    });

    // Filter wordDataList to only include words that match customWords
    wordDataList = wordDataList.filter((wordItem) => {
      const wordText = wordItem?.text;
      if (!wordText || typeof wordText !== "string") {
        return false;
      }
      // Check if the word text matches any of the custom words
      return normalizedCustomWords.includes(wordText.trim());
    });

    console.log("Barakhadi - Filtered wordDataList:", {
      filteredWordsCount: wordDataList.length,
      filteredWords: wordDataList.map((item) => item.text),
    });
  } else {
    console.log("Barakhadi - No customWords provided, using all words:", {
      totalWords: wordDataList.length,
    });
  }

  const getTitle = () => {
    const titles = {
      hi: "हिंदी बारहखड़ी चार्ट",
      ta: "தமிழ் பாராகடி சார்ட்",
      te: "తెలుగు గుణింతాలు చార్ట్",
      kn: "ಕನ್ನಡ ಬಾರಾಖಡಿ ಚಾರ್ಟ್",
    };
    return titles[lang] || titles.hi;
  };

  const getButtonTexts = () => {
    const texts = {
      hi: {
        listen: "सुनो",
        delete: "पिछला मिटाओ",
        erase: "सब मिटाओ",
        viewChart: "पूरा चार्ट देखें",
      },
      ta: {
        listen: "கேள்",
        delete: "கடைசியை நீக்கு",
        erase: "அனைத்தையும் துடை",
        viewChart: "முழு விளக்கப்படத்தைக் காண்க",
      },
      te: {
        listen: "వినండి",
        delete: "చివరిది తొలగించు",
        erase: "అన్నీ తొలగించు",
        viewChart: "పూర్తి చార్ట్ చూడండి",
      },
      kn: {
        listen: "ಕೇಳಿ",
        delete: "ಕೊನೆಯದನ್ನು ಅಳಿಸಿ",
        erase: "ಎಲ್ಲಾ ಅಳಿಸಿ",
        viewChart: "ಪೂರ್ಣ ಚಾರ್ಟ್ ನೋಡಿ",
      },
    };
    return texts[lang] || texts.hi;
  };

  const buttonTexts = getButtonTexts();

  const getChartTitle = () => {
    const titles = {
      hi: "हिंदी बारहखड़ी चार्ट",
      ta: "தமிழ் மெய்யெழுத்துக்கள்",
      te: "తెలుగు గుణింతాలు చార్ట్",
      kn: "ಕನ್ನಡ ಬಾರಾಖಡಿ ಚಾರ್ಟ್",
    };
    return titles[lang] || titles.hi;
  };

  const getSpeechLang = () => {
    const langCodes = {
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
    };

    const requestedCode = langCodes[lang] || "hi-IN";
    const voices = speechSynthesis.getVoices();

    const isVoiceAvailable = voices.some(
      (voice) =>
        voice.lang === requestedCode ||
        voice.lang.startsWith(requestedCode.split("-")[0])
    );

    console.log("Voice availability check:", {
      requested: requestedCode,
      available: isVoiceAvailable,
      allVoices: voices.map((v) => v.lang),
    });

    if (!isVoiceAvailable) {
      console.log(`Voice for ${requestedCode} not available, using fallback`);

      if (voices.some((v) => v.lang === "hi-IN" || v.lang.startsWith("hi"))) {
        return "hi-IN";
      } else if (
        voices.some((v) => v.lang === "en-US" || v.lang.startsWith("en"))
      ) {
        return "en-US";
      } else if (voices.length > 0) {
        return voices[0].lang;
      }
    }

    return requestedCode;
  };

  const getInstructionAltText = () => {
    const altTexts = {
      hi: "शब्द",
      ta: "சொல்",
      te: "పదం",
      kn: "ಪದ",
    };
    return altTexts[lang] || altTexts.hi;
  };

  useEffect(() => {
    // Only set initial word if wordDataList has items
    if (wordDataList && wordDataList.length > 0) {
      const initialTargetWord = wordDataList[0].text;
      setTargetWord(initialTargetWord);
      const barakhadi = getBarakhadiForWord(initialTargetWord, lang);
      setCurrentBarakhadi(barakhadi);
      setCurrentWordIndex(0); // Reset word index when word list changes
    } else {
      console.warn(
        "Barakhadi - wordDataList is empty, cannot set initial target word"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, customWords]); // wordDataList is computed from lang and customWords, so we don't need it in deps

  useEffect(() => {
    if (targetWord) {
      const barakhadi = getBarakhadiForWord(targetWord, lang);
      setCurrentBarakhadi(barakhadi);
    }
  }, [targetWord, lang]);

  useEffect(() => {
    // Removed unnecessary getAssessment & Pagination API calls
    console.log(
      "Barakhadi component mounted - skipping assessment/pagination API calls"
    );
  }, []);

  const handleCompletion = async () => {
    const sub_session_id = getLocalData("sub_session_id");
    let currentContentType = "Char";

    try {
      const milestoneLevel = "B";

      let requestBody = {
        original_text: "Char",
        audio: "",
        //user_id: virtualId,
        session_id: sessionId,
        language: lang,
        date: new Date(),
        sub_session_id,
        contentId: contentId,
        contentType: "Char",
        mechanics_id: getLocalData("mechanism_id") || "",
        milestone: milestoneLevel,
        ansSelectionStatus: langWiseAnswers[lang],
      };

      const result = await updateLearnerProfile(lang, requestBody);
      console.log("Learner progress result:", result);
    } catch (error) {
      console.error("Error creating learner progress:", error);
    }

    // Removed fetchGetSetResult call since currentCollectionId and totalSyllableCount

    if (!(localStorage.getItem("contentSessionId") !== null)) {
      let point = 1;
      let milestone = "B";

      if (point !== 1) {
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        return;
      }

      try {
        const result = await addPointer(point, milestone);
        const awardedPoints = result?.result?.points;
        if (awardedPoints !== 1) {
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          return;
        }
      } catch (error) {
        console.error("Error adding points:", error);
      }
    } else {
      sendTestRigScore(5);
    }
    navigate("/discover-start");
  };

  const handleNextWord = () => {
    // Safety check: ensure wordDataList has items
    if (!wordDataList || wordDataList.length === 0) {
      console.warn("Barakhadi - handleNextWord: wordDataList is empty");
      // If handleNext prop is provided (e.g., from F2 flow), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default behavior for non-flow usage
        setLocalData("rFlow", false);
        setLocalData("mFail", false);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        callTelemetryDiscovery("R1-Barakhadi");
      }
      return;
    }

    console.log("Barakhadi handleNextWord:", {
      currentWordIndex,
      wordDataListLength: wordDataList.length,
      isLastItem: currentWordIndex >= wordDataList.length - 1,
      customWords,
      hasHandleNext: !!handleNext,
    });

    const nextIndex = currentWordIndex + 1;

    // Check if we've reached the end of the word list
    if (nextIndex < wordDataList.length) {
      // Safety check: ensure nextIndex is valid and has text property
      if (wordDataList[nextIndex] && wordDataList[nextIndex].text) {
        // Move to next word
        setCurrentWordIndex(nextIndex);
        setTargetWord(wordDataList[nextIndex].text);
        setWord("");
        setShowConfetti(false);
        setIncorrectCell(null);
        setIsWordWrong(false);
      } else {
        console.warn(
          "Barakhadi - handleNextWord: Invalid nextIndex or missing text",
          {
            nextIndex,
            wordDataListLength: wordDataList.length,
            wordDataListNextIndex: wordDataList[nextIndex],
          }
        );
        // If invalid, treat as completion
        if (handleNext && typeof handleNext === "function") {
          handleNext();
        } else {
          setLocalData("rFlow", false);
          setLocalData("mFail", false);
          if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
            navigate("/");
          } else {
            navigate("/discover-start");
          }
          callTelemetryDiscovery("R1-Barakhadi");
        }
      }
    } else {
      // Reached end of word list - complete the Barakhadi step
      console.log(
        "Barakhadi completed - all customWords done. Calling handleNext."
      );
      // If handleNext prop is provided (e.g., from F2 flow), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default behavior for non-flow usage (R0, R1, etc.)
        setLocalData("rFlow", false);
        setLocalData("mFail", false);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        callTelemetryDiscovery("R1-Barakhadi");
      }
      // Don't continue - exit here
      return;
    }
  };

  const handleLetterClick = (letter, rowIndex, colIndex) => {
    // Use grapheme segmentation for Indic scripts to correctly compare
    // multi-codepoint characters (e.g., "ది" should not match "ద")
    const targetGraphemes = splitGraphemes(targetWord);
    const wordGraphemes = splitGraphemes(word);
    const nextExpectedGrapheme = targetGraphemes[wordGraphemes.length];

    const isCorrect = letter === nextExpectedGrapheme;

    const newWord = word + letter;
    setWord(newWord);

    if (isCorrect) {
      setIsWordWrong(false);
      if (newWord === targetWord) {
        correctAudio.play();
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    } else {
      // when user seclect wrong option then colour is red.
      wrongAudio.play();
      setIsWordWrong(true);
      setIncorrectCell({ rowIndex, colIndex });
      setTimeout(() => {
        setIncorrectCell(null);
      }, 500);
    }
  };

  const handleErase = () => {
    setWord("");
    setIncorrectCell(null);
    setIsWordWrong(false);
  };

  const handleDelete = () => {
    // Use grapheme segmentation to delete the last visual character,
    // not just the last code point (important for Indic scripts)
    const wordGraphemes = splitGraphemes(word);
    wordGraphemes.pop();
    const newWord = wordGraphemes.join("");
    setWord(newWord);
    setIncorrectCell(null);
    // Check if the remaining word is still correct so far using grapheme comparison
    if (newWord.length > 0) {
      const targetGraphemes = splitGraphemes(targetWord);
      const newWordGraphemes = splitGraphemes(newWord);
      const isCorrectSoFar = newWordGraphemes.every(
        (g, i) => g === targetGraphemes[i]
      );
      setIsWordWrong(!isCorrectSoFar);
    } else {
      setIsWordWrong(false);
    }
  };
  const handleListen = () => {
    if (word.length > 0) {
      console.log("Playing audio for user-typed word:", word);

      if (word === targetWord) {
        if (currentWordData) {
          playSegmentedAudio(currentWordData);
        } else {
          playTTS(word);
        }
      } else {
        playTTS(word);
      }
    }
  };

  const playTTS = (textToSpeak) => {
    if (!voicesReady) {
      console.log("Voices not loaded yet, retrying in 500ms...");
      setTimeout(() => playTTS(textToSpeak), 500);
      return;
    }

    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const requestedLang = getSpeechLang();
      const voices = speechSynthesis.getVoices();

      // Find the best available voice
      let selectedVoice = null;

      // First try: Exact match
      selectedVoice = voices.find((voice) => voice.lang === requestedLang);

      // Second try: Language family match (e.g., ta-IN for ta)
      if (!selectedVoice) {
        const langFamily = requestedLang.split("-")[0];
        selectedVoice = voices.find((voice) =>
          voice.lang.startsWith(langFamily)
        );
      }

      // Third try: Hindi fallback
      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "hi-IN" || voice.lang.startsWith("hi")
        );
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(
          (voice) => voice.lang === "en-US" || voice.lang.startsWith("en")
        );
      }

      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0];
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        console.log("Using voice:", selectedVoice.name, selectedVoice.lang);
      } else {
        utterance.lang = requestedLang;
        console.log("No suitable voice found, using default");
      }

      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      console.log("TTS Final Settings:", {
        text: textToSpeak,
        requestedLang: requestedLang,
        actualLang: utterance.lang,
        voice: utterance.voice?.name,
      });

      utterance.onstart = () => {
        console.log("TTS started successfully");
        setShowAudioWave(true);
      };

      utterance.onend = () => {
        console.log("TTS ended");
        setShowAudioWave(false);
      };

      utterance.onerror = (event) => {
        console.error("TTS error:", event);
        setShowAudioWave(false);
      };

      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const playSegmentedAudio = (wordData) => {
    if (wordData && wordData.segmentedAudio) {
      setShowAudioWave(true);

      const audio = new Audio(wordData.segmentedAudio);

      audio.play().catch((error) => {
        console.error("Error playing segmented audio:", error);
        setShowAudioWave(false);
        playTTS(wordData.text);
      });

      audio.onended = () => {
        setShowAudioWave(false);
      };

      setTimeout(() => {
        setShowAudioWave(false);
      }, 5000);
    } else {
      playTTS(wordData.text);
    }
  };

  const playWordAudio = (wordData) => {
    if (wordData && wordData.audio) {
      setShowWordAudioWave(true);

      const audioUrl = `${process.env.REACT_APP_AWS_S3_BUCKET_CONTENT_URL}/mechanics_audios/${wordData.audio}`;
      console.log("Attempting to play audio from:", audioUrl);

      const audio = new Audio(audioUrl);

      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
        setShowWordAudioWave(false);
        playTTS(wordData.text);
      });

      audio.onended = () => {
        console.log("Audio playback completed");
        setShowWordAudioWave(false);
      };

      audio.onerror = (e) => {
        console.error("Audio element error:", e);
        setShowWordAudioWave(false);
      };
    } else {
      console.log("No audio found, using TTS");
      playTTS(wordData.text);
    }
  };

  const debugVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log("=== VOICE DEBUG INFO ===");
    console.log("Total voices:", voices.length);
    console.log(
      "Available languages:",
      [...new Set(voices.map((v) => v.lang))].sort()
    );
    console.log(
      "Detailed voices:",
      voices.map((v) => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
        default: v.default,
      }))
    );
  };

  // Safety check: ensure wordDataList has items before accessing
  const currentWordData =
    wordDataList && wordDataList.length > 0
      ? wordDataList.find((item) => item.text === targetWord) || wordDataList[0]
      : null;
  const vyajan = Object.keys(currentBarakhadi);

  const generateFullBarakhadi = () => {
    return barakhadiCharts[lang] || {};
  };

  const containerStyle = {
    fontFamily: "sans-serif",
    background: "#f2fbe9",
    padding: "0px",
    textAlign: "center",
    overflow: "hidden",
  };

  const cardStyle = {
    background: "#fff",
    padding: "23px",
    borderRadius: "12px",
    display: "inline-block",
    position: "relative",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    width: "95%",
    maxWidth: "1200px",
    height: "70vh",
  };

  const titleStyle = {
    fontSize: "15px",
    fontWeight: "bold",
    color: "rgba(51, 63, 97, 1)",
    marginBottom: "10px",
    marginTop: "-12px",
    fontFamily: "Quicksand",
    gap: "10px",
  };

  const wordBoxStyle = {
    border: "1px dashed #ff9800",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    zIndex: 1000,
    background: "#FFF9ED",
    height: "130px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  };

  const btnRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "200px",
    marginTop: "auto",
    flexShrink: 0,
  };

  const buttonStyle = {
    padding: "8px 30px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    height: "35px",
    flexDirection: "column",
  };

  const disabledButtonStyle = {
    padding: "8px 30px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    boxShadow: "0px 4px 6px rgba(0, 128, 0, 0.3)",
    opacity: 0.6,
    cursor: "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "13px",
    height: "35px",
  };

  const tableStyle = {
    marginTop: "50px",
    borderCollapse: "collapse",
    width: "100%",
    tableLayout: "fixed",
    position: "relative",
  };

  const tdStyle = {
    padding: "4px",
    border: "1px solid #ccc",
    fontSize: lang === "te" ? "28px" : "23px",
    textAlign: "center",
    width: "58px",
    cursor: "pointer",
    fontWeight: lang === "te" ? 400 : 800,
    fontFamily: getFontFamily(lang),
    transition: "background-color 0.3s ease",
  };

  const circleStyle = {
    width: lang === "te" ? "28px" : "22px",
    height: lang === "te" ? "28px" : "22px",
    borderRadius: "50%",
    background: "#2c3e50",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: lang === "te" ? "normal" : "bold",
    fontSize: lang === "te" ? "16px" : "12px",
    fontFamily: getFontFamily(lang),
    lineHeight: "1",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.15)",
    margin: "0 auto",
    marginBottom: "4px",
  };

  const leftCircleStyle = {
    position: "absolute",
    width: lang === "te" ? "34px" : "28px",
    height: lang === "te" ? "34px" : "28px",
    borderRadius: "50%",
    background: "#ffeb3b",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: lang === "te" ? "normal" : "bold",
    fontSize: lang === "te" ? "18px" : "12px",
    fontFamily: getFontFamily(lang),
    lineHeight: "1",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.15)",
    border: "1px solid black",
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      parentWords={parentWords}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      <div style={containerStyle}>
        {showConfetti && <Confetti />}
        <img
          src={hintimg}
          alt="hint"
          style={{
            width: "50px",
            height: "50px",
            position: "absolute",
            top: "20px",
            left: "0px",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={() => setOpen(true)}
        />

        {/* Modal */}
        {open && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "90vh",
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 11000,
            }}
          >
            <div
              style={{
                position: "relative",
                background: "#000",
                padding: "10px",
                borderRadius: "12px",
                maxWidth: "90%",
                width: "900px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              <SafeYouTubePlayer
                videoId="OGyRSlAEkN4"
                style={{ borderRadius: "8px", zIndex: 99999 }}
              />
            </div>
          </div>
        )}
        {voiceStatus && (
          <div
            style={{
              position: "fixed",
              bottom: 10,
              left: 10,
              background: "yellow",
              padding: "5px",
              fontSize: "12px",
              borderRadius: "5px",
              border: "1px solid orange",
            }}
          >
            {voiceStatus}
          </div>
        )}

        <style>
          {`
            @keyframes pulse {
              0% {
                transform: scale(0.6);
                opacity: 0;
              }
              50% {
                opacity: 1;
              }
              100% {
                transform: scale(1.4);
                opacity: 0;
              }
            }
          `}
        </style>

        {showFullChart && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "85%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              zIndex: 10000,
              margin: "20px",
              overflow: "auto",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                padding: "10px",
                width: "100%",
                maxWidth: "1100px",
                margin: "0 auto",
                position: "relative",
                minHeight: "auto",
              }}
            >
              <img
                src={closebuttonImg}
                alt="Close"
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => setShowFullChart(false)}
              />

              <h2
                style={{
                  textAlign: "center",
                  color: "rgba(51, 63, 97, 1)",
                  marginBottom: "20px",
                  fontSize: "30px",
                  fontWeight: 700,
                  marginRight: "30px",
                  marginTop: "10px",
                  fontFamily: "Quicksand",
                }}
              >
                {getChartTitle()}
              </h2>

              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    borderCollapse: "collapse",
                    textAlign: "center",
                    margin: "0 auto",
                  }}
                >
                  {/* HEADER */}
                  <thead>
                    <tr>
                      {/* Top-left empty */}
                      <th
                        style={{
                          width: "60px",
                          height: "60px",
                          position: "sticky",
                          top: 0,
                          left: 0,
                          zIndex: 3,
                          background: "#fff",
                        }}
                      ></th>

                      {vowels.map((v, i) => (
                        <th
                          key={i}
                          style={{
                            width: "60px",
                            height: "60px",
                            border: "none",
                            position: "sticky",
                            top: 0,
                            zIndex: 2,
                            background: "#fff",
                          }}
                        >
                          <div
                            style={{
                              width: "clamp(32px, 6vw, 52px)", // 👈 responsive circle
                              height: "clamp(32px, 6vw, 52px)",
                              borderRadius: "50%",
                              background: "#1a237e",
                              color: "white",
                              fontWeight: lang === "te" ? "normal" : "bold",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "auto",
                              fontSize: lang === "te" ? "28px" : "18px",
                              fontFamily: getFontFamily(lang),
                            }}
                          >
                            {v}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody>
                    {Object.entries(generateFullBarakhadi()).map(
                      ([consonant, syllables], rowIdx) => (
                        <tr key={rowIdx}>
                          {/* FIRST COLUMN */}
                          <td
                            style={{
                              width: "60px",
                              height: "60px",
                              border: "none",
                              position: "sticky",
                              left: 0,
                              zIndex: 1,
                              background: "#fff",
                            }}
                          >
                            <div
                              style={{
                                width: "clamp(32px, 6vw, 52px)",
                                height: "clamp(32px, 6vw, 52px)",
                                borderRadius: "50%",
                                background: "#fbc02d",
                                fontWeight: lang === "te" ? "normal" : "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "auto",
                                fontSize: lang === "te" ? "28px" : "18px",
                                fontFamily: getFontFamily(lang),
                              }}
                            >
                              {consonant}
                            </div>
                          </td>

                          {/* INNER CELLS */}
                          {syllables.map((syllable, idx) => (
                            <td
                              key={idx}
                              style={{
                                width: "60px",
                                height: "60px",
                                border: "1px solid #ddd",
                                fontSize: lang === "te" ? "28px" : "18px",
                                fontWeight: lang === "te" ? "normal" : "bold",
                                fontFamily: getFontFamily(lang),
                              }}
                            >
                              {syllable}
                            </td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div style={cardStyle}>
          <div style={titleStyle}>
            <span
              style={{
                fontSize: lang === "te" ? "30px" : "22px",
                fontWeight: lang === "te" ? "400" : "700",
                color: "#333F61",
                fontFamily: getFontFamily(lang),
              }}
            >
              {lang === "hi"
                ? "शब्द बनाओ"
                : lang === "ta"
                ? "சொல்லை உருவாக்கு"
                : lang === "te"
                ? "తెలుగు గుణింతాలు చార్ట్"
                : lang === "kn"
                ? "ಪದವನ್ನು ರಚಿಸಿ"
                : "Make a Word"}
            </span>
          </div>

          <div
            style={{
              ...wordBoxStyle,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "105px",
              padding: "15px 20px",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "15px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    background: "rgba(51, 63, 97, 1)",
                    color: "#fff",
                    padding: lang === "te" ? "0px 24px 8px 24px" : "2px 24px",
                    borderRadius: "6px",
                    minWidth: "80px",
                    textAlign: "center",
                    display: "inline-block",
                    fontFamily: getFontFamily(lang),
                    fontSize: lang === "te" ? "28px" : "20px",
                    fontWeight: "normal",
                    lineHeight: lang === "te" ? "1.1" : "normal",
                    verticalAlign: "middle",
                  }}
                >
                  {currentWordData?.text || ""}
                </span>

                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {showWordAudioWave ? (
                    <img
                      src={audiowaveImg}
                      alt="audio playing"
                      style={{
                        width: "90px",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : (
                    <>
                      <img
                        src={listenImg}
                        alt="listen"
                        style={{
                          width: "39px",
                          cursor: "pointer",
                          position: "relative",
                          zIndex: 1,
                        }}
                        onClick={() =>
                          currentWordData && playWordAudio(currentWordData)
                        }
                      />
                      <div
                        style={{
                          position: "absolute",
                          width: "45px",
                          height: "45px",
                          backgroundColor: "#A856FF",
                          borderRadius: "50%",
                          animation: "pulse 1.2s linear infinite",
                          top: "-9%",
                          left: "9%",
                          transform: "translate(-50%, -50%)",
                          zIndex: -1,
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  border: "1px solid orange",
                  borderRadius: "10px",
                  height: "50px",
                  width: "65%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  fontSize: lang === "te" ? "26px" : "22px",
                  fontWeight: lang === "te" ? "normal" : "bold",
                  color:
                    word === targetWord
                      ? "#27ae60"
                      : isWordWrong
                      ? "#d32f2f"
                      : "#2c3e50",
                  background:
                    word === targetWord
                      ? "#E8F5E8"
                      : isWordWrong
                      ? "#FFE8E8"
                      : "#FFFFFF",
                  paddingLeft: "20px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: "background 0.3s ease, color 0.3s ease",
                  marginBottom: "60px",
                  fontFamily: getFontFamily(lang),
                }}
              >
                {word ? word : <span style={{ opacity: 0.4 }}></span>}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "22px",
                  width: "40%",
                  marginBottom: "80px",
                }}
              >
                <button
                  style={
                    word.length === 0
                      ? {
                          ...disabledButtonStyle,
                          boxShadow: "3px 4px 6px rgba(0, 128, 0, 0.3)",
                          backgroundColor: "#E4F5FF",
                          border: "2px solid #1CB0F6",
                          color: "#333F61",
                          width: "85px",
                          height: "40px",
                          flexDirection: "row",
                        }
                      : {
                          ...buttonStyle,
                          boxShadow: "3px 4px 6px rgba(0, 128, 0, 1.6)",
                          backgroundColor: "#E4F5FF",
                          color: "#333F61",
                          width: "85px",
                          height: "40px",
                          flexDirection: "row",
                        }
                  }
                  onClick={handleListen}
                  disabled={word.length === 0}
                >
                  <img
                    src={listenImgBox}
                    alt="listen"
                    style={{ height: "30px" }}
                  />
                </button>

                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "white",
                    color: "#333F61",
                    width: "85px",
                    height: "40px",
                    flexDirection: "row",
                    boxShadow: "3px 4px 6px rgba(255, 165, 0, 1.6)",
                  }}
                  onClick={handleDelete}
                >
                  <img src={eraseImg} alt="delete" style={{ height: "30px" }} />
                </button>

                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "white",
                    color: "#333F61",
                    width: "85px",
                    height: "40px",
                    flexDirection: "row",
                    boxShadow: "3px 4px 6px rgba(255, 0, 0, 1.6)",
                  }}
                  onClick={handleErase}
                >
                  <img src={deleteImg} alt="erase" style={{ height: "30px" }} />
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              paddingLeft: "60px",
              marginTop: "30px",
              //height: "300px",
            }}
          >
            {vyajan.map((v, i) => (
              <div
                key={i}
                style={{
                  ...leftCircleStyle,
                  left: "19px",
                  top: `${i * 45 + 25}px`,
                }}
              >
                {v}
              </div>
            ))}

            <table style={tableStyle}>
              <thead>
                <tr>
                  {swar.map((v, i) => (
                    <th key={i}>
                      <div style={circleStyle}>{v}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vyajan.map((consonant, rowIndex) => (
                  <tr key={rowIndex}>
                    {currentBarakhadi[consonant]?.map((cell, colIndex) => {
                      const isIncorrectCell =
                        incorrectCell?.rowIndex === rowIndex &&
                        incorrectCell?.colIndex === colIndex;
                      return (
                        <td
                          key={colIndex}
                          style={{
                            ...tdStyle,
                            backgroundColor: isIncorrectCell
                              ? "#FFE8E8"
                              : tdStyle.backgroundColor || "transparent",
                            transition: "background-color 0.3s ease",
                          }}
                          onClick={() =>
                            handleLetterClick(cell, rowIndex, colIndex)
                          }
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                padding: "0 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "#F8FBFF",
                  border: "1px solid rgba(231, 232, 236, 1)",
                  borderRadius: "12px",
                  padding: "6px 14px",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                }}
                onClick={() => setShowFullChart(true)}
              >
                <img src={dottimg} alt="dots" style={{ height: "24px" }} />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "rgba(51,63,97,1)",
                    fontFamily: "Quicksand",
                  }}
                >
                  {buttonTexts.viewChart}
                </span>
              </div>

              <img
                src={nextImg}
                alt="next"
                style={{ height: "32px", cursor: "pointer" }}
                onClick={handleNextWord}
              />
            </div>
          </div>

          <img
            src={boyballonflyImg}
            alt="boy balloon"
            style={{
              position: "absolute",
              top: "10px",
              right: "120px",
              width: "60px",
              zIndex: 1,
            }}
          />

          <img
            src={boyImg}
            alt="boy"
            style={{
              position: "absolute",
              top: "48px",
              right: "60px",
              width: "60px",
            }}
          />
          <img
            src={bearImg}
            alt="bear"
            style={{
              position: "absolute",
              bottom: "-50px",
              right: "0px",
              width: "clamp(60px, 5vw, 170px)",
            }}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Barakhadi;
