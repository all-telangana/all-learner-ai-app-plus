import React, { useState, useEffect, useRef, useMemo } from "react";
import Confetti from "react-confetti";
import * as Assets from "../utils/imageAudioLinks";
import {
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import MainLayout from "../components/Layout/MainLayout";
import SafeYouTubePlayer from "../components/SafeYouTubePlayer";
import listenImg from "../assets/listen.svg";
// import Mic from "../assets/mikee.svg";
// import Stop from "../assets/pausse.svg";
import correctSound from "../assets/correct.wav";
import wrongSound from "../assets/audio/wrong.wav";
import RecordVoiceVisualizer from "../utils/RecordVoiceVisualizer";
import {
  practiceSteps,
  getLocalData,
  NextButtonRound,
  RetryIcon,
  setLocalData,
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
import { ArrowLeft } from "lucide-react"; // or your icon library
import hintimg from "../assets/hintsicon.svg";
import ZoomableImage from "../components/Practice/ZoomableImage";
import { splitGraphemes } from "split-graphemes";

const theme = createTheme();

export const dataEn = [
  {
    syllable: "he",
    items: [
      {
        id: 1,
        title: "Syllable",
        syllable: "he",
        word: "Hear",
        image: getAssetUrl(s3Assets.HearImg),
        audio: getAssetAudioUrl(s3Assets.HearSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HearSingleAudio),
      },
      {
        id: 2,
        title: "Syllable",
        syllable: "he",
        word: "teacher",
        image: getAssetUrl(s3Assets.teacherImg),
        audio: getAssetAudioUrl(s3Assets.teacherAudio),
        singleAudio: getAssetAudioUrl(s3Assets.teacherAudio),
      },
    ],
  },
  {
    syllable: "in",
    items: [
      {
        id: 3,
        title: "Syllable",
        syllable: "in",
        word: "Pin",
        image: getAssetUrl(s3Assets.PinImg),
        audio: getAssetAudioUrl(s3Assets.PinAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PinAudio),
      },
      {
        id: 4,
        title: "Syllable",
        syllable: "in",
        word: "Winter",
        image: getAssetUrl(s3Assets.WinterImg),
        audio: getAssetAudioUrl(s3Assets.WinterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WinterAudio),
      },
    ],
  },
  {
    syllable: "an",
    items: [
      {
        id: 5,
        title: "Syllable",
        syllable: "an",
        word: "Ant",
        image: getAssetUrl(s3Assets.AntImg),
        audio: getAssetAudioUrl(s3Assets.AntAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AntAudio),
      },
      {
        id: 6,
        title: "Syllable",
        syllable: "an",
        word: "plant",
        image: getAssetUrl(s3Assets.plantImg),
        audio: getAssetAudioUrl(s3Assets.plantAudio),
        singleAudio: getAssetAudioUrl(s3Assets.plantAudio),
      },
    ],
  },
  {
    syllable: "at",
    items: [
      {
        id: 7,
        title: "Syllable",
        syllable: "at",
        word: "atlas",
        image: getAssetUrl(s3Assets.atlasImg),
        audio: getAssetAudioUrl(s3Assets.atlasSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.atlasSingleAudio),
      },
      {
        id: 8,
        title: "Syllable",
        syllable: "at",
        word: "Cattle",
        image: getAssetUrl(s3Assets.CattleImg),
        audio: getAssetAudioUrl(s3Assets.CattleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CattleAudio),
      },
    ],
  },
  {
    syllable: "or",
    items: [
      {
        id: 9,
        title: "Syllable",
        syllable: "or",
        word: "orange",
        image: getAssetUrl(s3Assets.orangeImg),
        audio: getAssetAudioUrl(s3Assets.orangeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.orangeAudio),
      },
      {
        id: 10,
        title: "Syllable",
        syllable: "or",
        word: "store",
        image: getAssetUrl(s3Assets.storeImg),
        audio: getAssetAudioUrl(s3Assets.storeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.storeAudio),
      },
    ],
  },
  {
    syllable: "of",
    items: [
      {
        id: 11,
        title: "Syllable",
        syllable: "of",
        word: "Office",
        image: getAssetUrl(s3Assets.OfficeImg),
        audio: getAssetAudioUrl(s3Assets.OfficeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.OfficeAudio),
      },
      {
        id: 12,
        title: "Syllable",
        syllable: "of",
        word: "Soft",
        image: getAssetUrl(s3Assets.SoftImg),
        audio: getAssetAudioUrl(s3Assets.SoftAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SoftAudio),
      },
    ],
  },
  {
    syllable: "it",
    items: [
      {
        id: 13,
        title: "Syllable",
        syllable: "it",
        word: "sit",
        image: getAssetUrl(s3Assets.sitImg),
        audio: getAssetAudioUrl(s3Assets.sitSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.sitSingleAudio),
      },
      {
        id: 14,
        title: "Syllable",
        syllable: "it",
        word: "fruits",
        image: getAssetUrl(s3Assets.fruitsImg),
        audio: getAssetAudioUrl(s3Assets.fruitsAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fruitsAudio),
      },
    ],
  },
  {
    syllable: "as",
    items: [
      {
        id: 15,
        title: "Syllable",
        syllable: "as",
        word: "Gas",
        image: getAssetUrl(s3Assets.GasImg),
        audio: getAssetAudioUrl(s3Assets.GasAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GasAudio),
      },
      {
        id: 16,
        title: "Syllable",
        syllable: "as",
        word: "basket",
        image: getAssetUrl(s3Assets.basketImg),
        audio: getAssetAudioUrl(s3Assets.basketAudio),
        singleAudio: getAssetAudioUrl(s3Assets.basketAudio),
      },
    ],
  },
  {
    syllable: "me",
    items: [
      {
        id: 17,
        title: "Syllable",
        syllable: "me",
        word: "meat",
        image: getAssetUrl(s3Assets.meatImg),
        audio: getAssetAudioUrl(s3Assets.meatAudio),
        singleAudio: getAssetAudioUrl(s3Assets.meatAudio),
      },
      {
        id: 18,
        title: "Syllable",
        syllable: "me",
        word: "Camel",
        image: getAssetUrl(s3Assets.CamelImg),
        audio: getAssetAudioUrl(s3Assets.CamelAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CamelAudio),
      },
    ],
  },
  {
    syllable: "be",
    items: [
      {
        id: 19,
        title: "Syllable",
        syllable: "be",
        word: "bear",
        image: getAssetUrl(s3Assets.bearImg),
        audio: getAssetAudioUrl(s3Assets.bearAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bearAudio),
      },
      {
        id: 20,
        title: "Syllable",
        syllable: "be",
        word: "beautiful",
        image: getAssetUrl(s3Assets.beautifulImg),
        audio: getAssetAudioUrl(s3Assets.beautifulAudio),
        singleAudio: getAssetAudioUrl(s3Assets.beautifulAudio),
      },
    ],
  },
  {
    syllable: "her",
    items: [
      {
        id: 21,
        title: "Syllable",
        syllable: "her",
        word: "feather",
        image: getAssetUrl(s3Assets.featherImg),
        audio: getAssetAudioUrl(s3Assets.featherAudio),
        singleAudio: getAssetAudioUrl(s3Assets.featherAudio),
      },
      {
        id: 22,
        title: "Syllable",
        syllable: "her",
        word: "Mother",
        image: getAssetUrl(s3Assets.MotherImg),
        audio: getAssetAudioUrl(s3Assets.MotherSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MotherSingleAudio),
      },
    ],
  },
  {
    syllable: "ate",
    items: [
      {
        id: 23,
        title: "Syllable",
        syllable: "ate",
        word: "Date",
        image: getAssetUrl(s3Assets.DateImg),
        audio: getAssetAudioUrl(s3Assets.DateAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DateAudio),
      },
      {
        id: 24,
        title: "Syllable",
        syllable: "ate",
        word: "Gate",
        image: getAssetUrl(s3Assets.GateImg),
        audio: getAssetAudioUrl(s3Assets.GateAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GateAudio),
      },
    ],
  },
  {
    syllable: "all",
    items: [
      {
        id: 25,
        title: "Syllable",
        syllable: "all",
        word: "Tall",
        image: getAssetUrl(s3Assets.TallImg),
        audio: getAssetAudioUrl(s3Assets.TallAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TallAudio),
      },
      {
        id: 26,
        title: "Syllable",
        syllable: "all",
        word: "Balloon",
        image: getAssetUrl(s3Assets.BalloonImg),
        audio: getAssetAudioUrl(s3Assets.BalloonAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BalloonAudio),
      },
    ],
  },
  {
    syllable: "men",
    items: [
      {
        id: 27,
        title: "Syllable",
        syllable: "men",
        word: "Menu",
        image: getAssetUrl(s3Assets.MenuImg),
        audio: getAssetAudioUrl(s3Assets.MenuAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MenuAudio),
      },
      {
        id: 28,
        title: "Syllable",
        syllable: "men",
        word: "Women",
        image: getAssetUrl(s3Assets.WomenImg),
        audio: getAssetAudioUrl(s3Assets.WomenAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WomenAudio),
      },
    ],
  },
  {
    syllable: "ear",
    items: [
      {
        id: 29,
        title: "Syllable",
        syllable: "ear",
        word: "hear",
        image: getAssetUrl(s3Assets.hearImg),
        audio: getAssetAudioUrl(s3Assets.hearAudio),
        singleAudio: getAssetAudioUrl(s3Assets.hearAudio),
      },
      {
        id: 30,
        title: "Syllable",
        syllable: "ear",
        word: "Near",
        image: getAssetUrl(s3Assets.NearImg),
        audio: getAssetAudioUrl(s3Assets.NearAudio),
        singleAudio: getAssetAudioUrl(s3Assets.NearAudio),
      },
    ],
  },
  {
    syllable: "rat",
    items: [
      {
        id: 31,
        title: "Syllable",
        syllable: "rat",
        word: "Rattle",
        image: getAssetUrl(s3Assets.RattleImg),
        audio: getAssetAudioUrl(s3Assets.RattleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.RattleAudio),
      },
      {
        id: 32,
        title: "Syllable",
        syllable: "rat",
        word: "decorate",
        image: getAssetUrl(s3Assets.decorateImg),
        audio: getAssetAudioUrl(s3Assets.decorateAudio),
        singleAudio: getAssetAudioUrl(s3Assets.decorateAudio),
      },
    ],
  },
  {
    syllable: "Up",
    items: [
      {
        id: 33,
        title: "Syllable",
        syllable: "Up",
        word: "Upset",
        image: getAssetUrl(s3Assets.UpsetImg),
        audio: getAssetAudioUrl(s3Assets.UpsetAudio),
        singleAudio: getAssetAudioUrl(s3Assets.UpsetAudio),
      },
      {
        id: 34,
        title: "Syllable",
        syllable: "Up",
        word: "Puppy",
        image: getAssetUrl(s3Assets.PuppyImg),
        audio: getAssetAudioUrl(s3Assets.PuppyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PuppyAudio),
      },
    ],
  },
  {
    syllable: "Us",
    items: [
      {
        id: 35,
        title: "Syllable",
        syllable: "Us",
        word: "Bus",
        image: getAssetUrl(s3Assets.BusImg),
        audio: getAssetAudioUrl(s3Assets.BusAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BusAudio),
      },
      {
        id: 36,
        title: "Syllable",
        syllable: "Us",
        word: "Dust",
        image: getAssetUrl(s3Assets.DustImg),
        audio: getAssetAudioUrl(s3Assets.DustAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DustAudio),
      },
    ],
  },
  {
    syllable: "Am",
    items: [
      {
        id: 37,
        title: "Syllable",
        syllable: "Am",
        word: "Jam",
        image: getAssetUrl(s3Assets.JamImg),
        audio: getAssetAudioUrl(s3Assets.JamAudio),
        singleAudio: getAssetAudioUrl(s3Assets.JamAudio),
      },
      {
        id: 38,
        title: "Syllable",
        syllable: "Am",
        word: "Camel",
        image: getAssetUrl(s3Assets.Camel2Img),
        audio: getAssetAudioUrl(s3Assets.Camel2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.Camel2Audio),
      },
    ],
  },
  {
    syllable: "My",
    items: [
      {
        id: 39,
        title: "Syllable",
        syllable: "My",
        word: "Mynah",
        image: getAssetUrl(s3Assets.MynahImg),
        audio: getAssetAudioUrl(s3Assets.MynahAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MynahAudio),
      },
      {
        id: 40,
        title: "Syllable",
        syllable: "My",
        word: "Tummy",
        image: getAssetUrl(s3Assets.TummyImg),
        audio: getAssetAudioUrl(s3Assets.TummyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TummyAudio),
      },
    ],
  },
  {
    syllable: "So",
    items: [
      {
        id: 41,
        title: "Syllable",
        syllable: "So",
        word: "Sofa",
        image: getAssetUrl(s3Assets.SofaImg),
        audio: getAssetAudioUrl(s3Assets.SofaAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SofaAudio),
      },
      {
        id: 42,
        title: "Syllable",
        syllable: "So",
        word: "Person",
        image: getAssetUrl(s3Assets.PersonImg),
        audio: getAssetAudioUrl(s3Assets.PersonAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PersonAudio),
      },
    ],
  },
  {
    syllable: "No",
    items: [
      {
        id: 43,
        title: "Syllable",
        syllable: "No",
        word: "Nose",
        image: getAssetUrl(s3Assets.NoseImg),
        audio: getAssetAudioUrl(s3Assets.NoseAudio),
        singleAudio: getAssetAudioUrl(s3Assets.NoseAudio),
      },
      {
        id: 44,
        title: "Syllable",
        syllable: "No",
        word: "Piano",
        image: getAssetUrl(s3Assets.PianoImg),
        audio: getAssetAudioUrl(s3Assets.PianoAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PianoAudio),
      },
    ],
  },
  {
    syllable: "is",
    items: [
      {
        id: 45,
        title: "Syllable",
        syllable: "is",
        word: "list",
        image: getAssetUrl(s3Assets.listImg),
        audio: getAssetAudioUrl(s3Assets.listAudio),
        singleAudio: getAssetAudioUrl(s3Assets.listAudio),
      },
      {
        id: 46,
        title: "Syllable",
        syllable: "is",
        word: "fish",
        image: getAssetUrl(s3Assets.fishImg),
        audio: getAssetAudioUrl(s3Assets.fishAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fishAudio),
      },
    ],
  },
  {
    syllable: "Ox",
    items: [
      {
        id: 47,
        title: "Syllable",
        syllable: "Ox",
        word: "Oxen",
        image: getAssetUrl(s3Assets.OxenImg),
        audio: getAssetAudioUrl(s3Assets.OxenAudio),
        singleAudio: getAssetAudioUrl(s3Assets.OxenAudio),
      },
      {
        id: 48,
        title: "Syllable",
        syllable: "Ox",
        word: "Boxer",
        image: getAssetUrl(s3Assets.BoxerImg),
        audio: getAssetAudioUrl(s3Assets.BoxerAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BoxerAudio),
      },
    ],
  },
  {
    syllable: "Do",
    items: [
      {
        id: 49,
        title: "Syllable",
        syllable: "Do",
        word: "Doll",
        image: getAssetUrl(s3Assets.DollImg),
        audio: getAssetAudioUrl(s3Assets.DollAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DollAudio),
      },
      {
        id: 50,
        title: "Syllable",
        syllable: "Do",
        word: "Indoor",
        image: getAssetUrl(s3Assets.IndoorImg),
        audio: getAssetAudioUrl(s3Assets.IndoorAudio),
        singleAudio: getAssetAudioUrl(s3Assets.IndoorAudio),
      },
    ],
  },
  {
    syllable: "Go",
    items: [
      {
        id: 51,
        title: "Syllable",
        syllable: "Go",
        word: "Gold",
        image: getAssetUrl(s3Assets.GoldImg),
        audio: getAssetAudioUrl(s3Assets.GoldAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GoldAudio),
      },
      {
        id: 52,
        title: "Syllable",
        syllable: "Go",
        word: "Wagon",
        image: getAssetUrl(s3Assets.WagonImg),
        audio: getAssetAudioUrl(s3Assets.WagonAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WagonAudio),
      },
    ],
  },
  {
    syllable: "on",
    items: [
      {
        id: 53,
        title: "Syllable",
        syllable: "on",
        word: "Online",
        image: getAssetUrl(s3Assets.OnlineImg),
        audio: getAssetAudioUrl(s3Assets.OnlineAudio),
        singleAudio: getAssetAudioUrl(s3Assets.OnlineAudio),
      },
      {
        id: 54,
        title: "Syllable",
        syllable: "on",
        word: "tongue",
        image: getAssetUrl(s3Assets.tongueImg),
        audio: getAssetAudioUrl(s3Assets.tongueAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tongueAudio),
      },
    ],
  },
  {
    syllable: "to",
    items: [
      {
        id: 55,
        title: "Syllable",
        syllable: "to",
        word: "tomorrow",
        image: getAssetUrl(s3Assets.tomorrowImg),
        audio: getAssetAudioUrl(s3Assets.tomorrowAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tomorrowAudio),
      },
      {
        id: 56,
        title: "Syllable",
        syllable: "to",
        word: "store",
        image: getAssetUrl(s3Assets.store2Img),
        audio: getAssetAudioUrl(s3Assets.store2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.store2Audio),
      },
    ],
  },
  {
    syllable: "Act",
    items: [
      {
        id: 57,
        title: "Syllable",
        syllable: "Act",
        word: "Actor",
        image: getAssetUrl(s3Assets.ActorImg),
        audio: getAssetAudioUrl(s3Assets.ActorAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ActorAudio),
      },
      {
        id: 58,
        title: "Syllable",
        syllable: "Act",
        word: "Tractor",
        image: getAssetUrl(s3Assets.TractorImg),
        audio: getAssetAudioUrl(s3Assets.TractorAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TractorAudio),
      },
    ],
  },
  {
    syllable: "Age",
    items: [
      {
        id: 59,
        title: "Syllable",
        syllable: "Age",
        word: "Agent",
        image: getAssetUrl(s3Assets.AgentImg),
        audio: getAssetAudioUrl(s3Assets.AgentAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AgentAudio),
      },
      {
        id: 60,
        title: "Syllable",
        syllable: "Age",
        word: "Cage",
        image: getAssetUrl(s3Assets.CageImg),
        audio: getAssetAudioUrl(s3Assets.CageAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CageAudio),
      },
    ],
  },
  {
    syllable: "Air",
    items: [
      {
        id: 61,
        title: "Syllable",
        syllable: "Air",
        word: "Airport",
        image: getAssetUrl(s3Assets.AirportImg),
        audio: getAssetAudioUrl(s3Assets.AirportAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AirportAudio),
      },
      {
        id: 62,
        title: "Syllable",
        syllable: "Air",
        word: "Chair",
        image: getAssetUrl(s3Assets.ChairImg),
        audio: getAssetAudioUrl(s3Assets.ChairAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ChairAudio),
      },
    ],
  },
  {
    syllable: "Arm",
    items: [
      {
        id: 63,
        title: "Syllable",
        syllable: "Arm",
        word: "Army",
        image: getAssetUrl(s3Assets.Army2Img),
        audio: getAssetAudioUrl(s3Assets.Army2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.Army2Audio),
      },
      {
        id: 64,
        title: "Syllable",
        syllable: "Arm",
        word: "Farmer",
        image: getAssetUrl(s3Assets.FarmerImg),
        audio: getAssetAudioUrl(s3Assets.FarmerAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FarmerAudio),
      },
    ],
  },
  {
    syllable: "Art",
    items: [
      {
        id: 65,
        title: "Syllable",
        syllable: "Art",
        word: "Artist",
        image: getAssetUrl(s3Assets.ArtistImg),
        audio: getAssetAudioUrl(s3Assets.ArtistAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ArtistAudio),
      },
      {
        id: 66,
        title: "Syllable",
        syllable: "Art",
        word: "Party",
        image: getAssetUrl(s3Assets.PartyImg),
        audio: getAssetAudioUrl(s3Assets.PartyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PartyAudio),
      },
    ],
  },
  {
    syllable: "Ask",
    items: [
      {
        id: 67,
        title: "Syllable",
        syllable: "Ask",
        word: "Asking",
        image: getAssetUrl(s3Assets.AskingImg),
        audio: getAssetAudioUrl(s3Assets.AskingAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AskingAudio),
      },
      {
        id: 68,
        title: "Syllable",
        syllable: "Ask",
        word: "Mask",
        image: getAssetUrl(s3Assets.MaskImage),
        audio: getAssetAudioUrl(s3Assets.MaskAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MaskAudio),
      },
    ],
  },
  {
    syllable: "Bit",
    items: [
      {
        id: 69,
        title: "Syllable",
        syllable: "Bit",
        word: "Bitter",
        image: getAssetUrl(s3Assets.BitterImg),
        audio: getAssetAudioUrl(s3Assets.BitterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BitterAudio),
      },
      {
        id: 70,
        title: "Syllable",
        syllable: "Bit",
        word: "Habit",
        image: getAssetUrl(s3Assets.HabitImg),
        audio: getAssetAudioUrl(s3Assets.HabitAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HabitAudio),
      },
    ],
  },
  {
    syllable: "Car",
    items: [
      {
        id: 71,
        title: "Syllable",
        syllable: "Car",
        word: "Carrot",
        image: getAssetUrl(s3Assets.CarrotImg),
        audio: getAssetAudioUrl(s3Assets.CarrotAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CarrotAudio),
      },
      {
        id: 72,
        title: "Syllable",
        syllable: "Car",
        word: "Scarf",
        image: getAssetUrl(s3Assets.ScarfImg),
        audio: getAssetAudioUrl(s3Assets.ScarfAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ScarfAudio),
      },
    ],
  },
  {
    syllable: "Fit",
    items: [
      {
        id: 73,
        title: "Syllable",
        syllable: "Fit",
        word: "Fitness",
        image: getAssetUrl(s3Assets.FitnessImg),
        audio: getAssetAudioUrl(s3Assets.FitnessAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FitnessAudio),
      },
      {
        id: 74,
        title: "Syllable",
        syllable: "Fit",
        word: "Profit",
        image: getAssetUrl(s3Assets.ProfitImg),
        audio: getAssetAudioUrl(s3Assets.ProfitAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ProfitAudio),
      },
    ],
  },
  {
    syllable: "Fly",
    items: [
      {
        id: 75,
        title: "Syllable",
        syllable: "Fly",
        word: "Flying",
        image: getAssetUrl(s3Assets.FlyingImg),
        audio: getAssetAudioUrl(s3Assets.FlyingAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FlyingAudio),
      },
      {
        id: 76,
        title: "Syllable",
        syllable: "Fly",
        word: "Butterfly",
        image: getAssetUrl(s3Assets.ButterflyImg),
        audio: getAssetAudioUrl(s3Assets.ButterflyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ButterflyAudio),
      },
    ],
  },
  {
    syllable: "Fun",
    items: [
      {
        id: 77,
        title: "Syllable",
        syllable: "Fun",
        word: "Funny",
        image: getAssetUrl(s3Assets.FunnyImg),
        audio: getAssetAudioUrl(s3Assets.FunnyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FunnyAudio),
      },
      {
        id: 78,
        title: "Syllable",
        syllable: "Fun",
        word: "Funnel",
        image: getAssetUrl(s3Assets.FunnelImg),
        audio: getAssetAudioUrl(s3Assets.FunnelAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FunnelAudio),
      },
    ],
  },
  {
    syllable: "Ice",
    items: [
      {
        id: 79,
        title: "Syllable",
        syllable: "Ice",
        word: "Mice",
        image: getAssetUrl(s3Assets.MiceImg),
        audio: getAssetAudioUrl(s3Assets.MiceAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MiceAudio),
      },
      {
        id: 80,
        title: "Syllable",
        syllable: "Ice",
        word: "Juice",
        image: getAssetUrl(s3Assets.JuiceImg),
        audio: getAssetAudioUrl(s3Assets.JuiceAudio),
        singleAudio: getAssetAudioUrl(s3Assets.JuiceAudio),
      },
    ],
  },
  {
    syllable: "Ink",
    items: [
      {
        id: 81,
        title: "Syllable",
        syllable: "Ink",
        word: "Pink",
        image: getAssetUrl(s3Assets.PinkImg),
        audio: getAssetAudioUrl(s3Assets.PinkAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PinkAudio),
      },
      {
        id: 82,
        title: "Syllable",
        syllable: "Ink",
        word: "Twinkle",
        image: getAssetUrl(s3Assets.TwinkleImg),
        audio: getAssetAudioUrl(s3Assets.TwinkleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TwinkleAudio),
      },
    ],
  },
  {
    syllable: "Key",
    items: [
      {
        id: 83,
        title: "Syllable",
        syllable: "Key",
        word: "Keyboard",
        image: getAssetUrl(s3Assets.KeyboardImg),
        audio: getAssetAudioUrl(s3Assets.KeyboardAudio),
        singleAudio: getAssetAudioUrl(s3Assets.KeyboardAudio),
      },
      {
        id: 84,
        title: "Syllable",
        syllable: "Key",
        word: "Donkey",
        image: getAssetUrl(s3Assets.DonkeyImg),
        audio: getAssetAudioUrl(s3Assets.DonkeyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DonkeyAudio),
      },
    ],
  },
  {
    syllable: "the",
    items: [
      {
        id: 85,
        title: "Syllable",
        syllable: "the",
        word: "thief",
        image: getAssetUrl(s3Assets.theifImg),
        audio: getAssetAudioUrl(s3Assets.theifAudio),
        singleAudio: getAssetAudioUrl(s3Assets.theifAudio),
      },
      {
        id: 86,
        title: "Syllable",
        syllable: "the",
        word: "Father",
        image: getAssetUrl(s3Assets.FatherImg),
        audio: getAssetAudioUrl(s3Assets.FatherAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FatherAudio),
      },
    ],
  },
  {
    syllable: "and",
    items: [
      {
        id: 87,
        title: "Syllable",
        syllable: "and",
        word: "Hand",
        image: getAssetUrl(s3Assets.HandImg),
        audio: getAssetAudioUrl(s3Assets.HandAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HandAudio),
      },
      {
        id: 88,
        title: "Syllable",
        syllable: "and",
        word: "Candle",
        image: getAssetUrl(s3Assets.CandleImg),
        audio: getAssetAudioUrl(s3Assets.CandleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CandleAudio),
      },
    ],
  },
  {
    syllable: "for",
    items: [
      {
        id: 89,
        title: "Syllable",
        syllable: "for",
        word: "Forest",
        image: getAssetUrl(s3Assets.ForestImg),
        audio: getAssetAudioUrl(s3Assets.ForestAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ForestAudio),
      },
      {
        id: 90,
        title: "Syllable",
        syllable: "for",
        word: "fort",
        image: getAssetUrl(s3Assets.fortImg),
        audio: getAssetAudioUrl(s3Assets.fortAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fortAudio),
      },
    ],
  },
  {
    syllable: "hat",
    items: [
      {
        id: 91,
        title: "Syllable",
        syllable: "hat",
        word: "hats",
        image: getAssetUrl(s3Assets.hatsImg),
        audio: getAssetAudioUrl(s3Assets.hatsAudio),
        singleAudio: getAssetAudioUrl(s3Assets.hatsAudio),
      },
      {
        id: 92,
        title: "Syllable",
        syllable: "hat",
        word: "Chatter",
        image: getAssetUrl(s3Assets.ChatterImg),
        audio: getAssetAudioUrl(s3Assets.ChatterAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ChatterAudio),
      },
    ],
  },
  {
    syllable: "his",
    items: [
      {
        id: 93,
        title: "Syllable",
        syllable: "his",
        word: "History",
        image: getAssetUrl(s3Assets.HistoryImg),
        audio: getAssetAudioUrl(s3Assets.HistoryAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HistoryAudio),
      },
      {
        id: 94,
        title: "Syllable",
        syllable: "his",
        word: "Whisper",
        image: getAssetUrl(s3Assets.WhisperImg),
        audio: getAssetAudioUrl(s3Assets.WhisperAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WhisperAudio),
      },
    ],
  },
  {
    syllable: "was",
    items: [
      {
        id: 95,
        title: "Syllable",
        syllable: "was",
        word: "Wasp",
        image: getAssetUrl(s3Assets.WaspImg),
        audio: getAssetAudioUrl(s3Assets.WaspAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WaspAudio),
      },
      {
        id: 96,
        title: "Syllable",
        syllable: "was",
        word: "Waste",
        image: getAssetUrl(s3Assets.WasteImg),
        audio: getAssetAudioUrl(s3Assets.WasteAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WasteAudio),
      },
    ],
  },
  {
    syllable: "one",
    items: [
      {
        id: 97,
        title: "Syllable",
        syllable: "one",
        word: "Bone",
        image: getAssetUrl(s3Assets.BoneImg),
        audio: getAssetAudioUrl(s3Assets.BoneAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BoneAudio),
      },
      {
        id: 98,
        title: "Syllable",
        syllable: "one",
        word: "money",
        image: getAssetUrl(s3Assets.moneyImg),
        audio: getAssetAudioUrl(s3Assets.moneyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.moneyAudio),
      },
    ],
  },
  {
    syllable: "our",
    items: [
      {
        id: 99,
        title: "Syllable",
        syllable: "our",
        word: "colour",
        image: getAssetUrl(s3Assets.colourImg),
        audio: getAssetAudioUrl(s3Assets.colourAudio),
        singleAudio: getAssetAudioUrl(s3Assets.colourAudio),
      },
      {
        id: 100,
        title: "Syllable",
        syllable: "our",
        word: "four",
        image: getAssetUrl(s3Assets.fourImg),
        audio: getAssetAudioUrl(s3Assets.fourAudio),
        singleAudio: getAssetAudioUrl(s3Assets.fourAudio),
      },
    ],
  },
  {
    syllable: "wit",
    items: [
      {
        id: 101,
        title: "Syllable",
        syllable: "wit",
        word: "witty",
        image: getAssetUrl(s3Assets.wittyImg),
        audio: getAssetAudioUrl(s3Assets.wittyAudio),
        singleAudio: getAssetAudioUrl(s3Assets.wittyAudio),
      },
      {
        id: 102,
        title: "Syllable",
        syllable: "wit",
        word: "Switch",
        image: getAssetUrl(s3Assets.SwitchImg),
        audio: getAssetAudioUrl(s3Assets.SwitchAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SwitchAudio),
      },
    ],
  },
  {
    syllable: "not",
    items: [
      {
        id: 103,
        title: "Syllable",
        syllable: "not",
        word: "notebook",
        image: getAssetUrl(s3Assets.notebookImg),
        audio: getAssetAudioUrl(s3Assets.notebookAudio),
        singleAudio: getAssetAudioUrl(s3Assets.notebookAudio),
      },
      {
        id: 104,
        title: "Syllable",
        syllable: "not",
        word: "note",
        image: getAssetUrl(s3Assets.noteImg),
        audio: getAssetAudioUrl(s3Assets.noteAudio),
        singleAudio: getAssetAudioUrl(s3Assets.noteAudio),
      },
    ],
  },
  {
    syllable: "Bed",
    items: [
      {
        id: 105,
        title: "Syllable",
        syllable: "Bed",
        word: "Bedroom",
        image: getAssetUrl(s3Assets.BedroomImg),
        audio: getAssetAudioUrl(s3Assets.BedroomAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BedroomAudio),
      },
      {
        id: 106,
        title: "Syllable",
        syllable: "Bed",
        word: "Bedtime",
        image: getAssetUrl(s3Assets.BedtimeImg),
        audio: getAssetAudioUrl(s3Assets.BedtimeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BedtimeAudio),
      },
    ],
  },
  {
    syllable: "hi",
    items: [
      {
        id: 107,
        title: "Syllable",
        syllable: "hi",
        word: "Hindi",
        image: getAssetUrl(s3Assets.HindiImg),
        audio: getAssetAudioUrl(s3Assets.HindiAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HindiAudio),
      },
      {
        id: 108,
        title: "Syllable",
        syllable: "hi",
        word: "child",
        image: getAssetUrl(s3Assets.childImg),
        audio: getAssetAudioUrl(s3Assets.childAudio),
        singleAudio: getAssetAudioUrl(s3Assets.childAudio),
      },
    ],
  },
  {
    letter: "E",
    items: [
      {
        id: 1,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Egg",
        image: getAssetUrl(s3Assets.eggFiveImg),
        audio: getAssetAudioUrl(s3Assets.EForEggAudio),
        singleAudio: getAssetAudioUrl(s3Assets.EForEggAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.EForEggAudio),
      },
      {
        id: 2,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFourteenImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.EForPenAudio),
      },
      {
        id: 3,
        title: "Vowel",
        letters: "Ee",
        letter: "e",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.kitePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.EForKiteAudio),
      },
    ],
  },
  {
    letter: "A",
    items: [
      {
        id: 4,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.AForAppleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.AForAppleAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.AForAppleAudio),
      },
      {
        id: 5,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.catPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.AForCatAudio),
      },
      {
        id: 6,
        title: "Vowel",
        letters: "Aa",
        letter: "a",
        word: "Pea",
        image: getAssetUrl(s3Assets.peaOneImg),
        audio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.peaPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.AForPeaAudio),
      },
    ],
  },
  {
    letter: "O",
    items: [
      {
        id: 7,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Orange",
        image: getAssetUrl(s3Assets.orangeFifteenImg),
        audio: getAssetAudioUrl(s3Assets.OForOrangeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.OForOrangeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.OForOrangeAudio),
      },
      {
        id: 8,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogSevenImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.OForDogAudio),
      },
      {
        id: 9,
        title: "Vowel",
        letters: "Oo",
        letter: "o",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.mangoPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.OForMangoAudio),
      },
    ],
  },
  {
    letter: "I",
    items: [
      {
        id: 10,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.IForIceAudio),
        singleAudio: getAssetAudioUrl(s3Assets.IForIceAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.IForIceAudio),
      },
      {
        id: 11,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Pig",
        image: getAssetUrl(s3Assets.pigNineImg),
        audio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.pigPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.IForPigAudio),
      },
      {
        id: 12,
        title: "Vowel",
        letters: "Ii",
        letter: "i",
        word: "Chilly",
        image: getAssetUrl(s3Assets.chilliImg),
        audio: getAssetAudioUrl(s3Assets.chillyAud),
        singleAudio: getAssetAudioUrl(s3Assets.chillyAud),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.IForChillyAudio),
      },
    ],
  },
  {
    letter: "U",
    items: [
      {
        id: 13,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Under",
        image: getAssetUrl(s3Assets.underImg),
        audio: getAssetAudioUrl(s3Assets.underAudio),
        singleAudio: getAssetAudioUrl(s3Assets.underAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.underAudio),
      },
      {
        id: 14,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Dust",
        image: getAssetUrl(s3Assets.DustImg),
        audio: getAssetAudioUrl(s3Assets.DustSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DustSingleAudio),
      },
      {
        id: 15,
        title: "Vowel",
        letters: "Uu",
        letter: "u",
        word: "Laddu",
        image: getAssetUrl(s3Assets.LadduTwentyOneImg),
        audio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ladduPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.UForLadduAudio),
      },
    ],
  },
  {
    letter: "T",
    items: [
      {
        id: 16,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.TForTigerAudio),
        singleAudio: getAssetAudioUrl(s3Assets.TForTigerAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.TForTigerAudio),
      },
      {
        id: 17,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Watch",
        image: getAssetUrl(s3Assets.watchTwentyImg),
        audio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.watchPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.TForWatchAudio),
      },
      {
        id: 18,
        title: "Consonant",
        letters: "Tt",
        letter: "t",
        word: "Plant",
        image: getAssetUrl(s3Assets.plantTwentyImg),
        audio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.plantPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.TForPlantAudio),
      },
    ],
  },
  {
    letter: "N",
    items: [
      {
        id: 19,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Nest",
        image: getAssetUrl(s3Assets.NestFourteenImg),
        audio: getAssetAudioUrl(s3Assets.NForNestAudio),
        singleAudio: getAssetAudioUrl(s3Assets.NForNestAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.NForNestAudio),
      },
      {
        id: 20,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Honey",
        image: getAssetUrl(s3Assets.HoneyFourteenImg),
        audio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.honeyPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.NForHoneyAudio),
      },
      {
        id: 21,
        title: "Consonant",
        letters: "Nn",
        letter: "n",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.penPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.NForPenAudio),
      },
    ],
  },
  {
    letter: "S",
    items: [
      {
        id: 22,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Sun",
        image: getAssetUrl(s3Assets.sunNineteenImg),
        audio: getAssetAudioUrl(s3Assets.SForSunAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SForSunAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.SForSunAudio),
      },
      {
        id: 23,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Horse",
        image: getAssetUrl(s3Assets.horseNineteenImg),
        audio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.horsePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.SForHorseAudio),
      },
      {
        id: 24,
        title: "Consonant",
        letters: "Ss",
        letter: "s",
        word: "Bus",
        image: getAssetUrl(s3Assets.busNineteenImg),
        audio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.busPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.SForBusAudio),
      },
    ],
  },
  {
    letter: "R",
    items: [
      {
        id: 25,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Rat",
        image: getAssetUrl(s3Assets.ratEighteenImg),
        audio: getAssetAudioUrl(s3Assets.RForRatAudio),
        singleAudio: getAssetAudioUrl(s3Assets.RForRatAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.RForRatAudio),
      },
      {
        id: 26,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Carrot",
        image: getAssetUrl(s3Assets.carrotEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.carrotPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.RForCarrotAudio),
      },
      {
        id: 27,
        title: "Consonant",
        letters: "Rr",
        letter: "r",
        word: "Car",
        image: getAssetUrl(s3Assets.carEighteenImg),
        audio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.carPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.RForCarAudio),
      },
    ],
  },
  {
    letter: "H",
    items: [
      {
        id: 28,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Hand",
        image: getAssetUrl(s3Assets.handEightImg),
        audio: getAssetAudioUrl(s3Assets.HForHandAudio),
        singleAudio: getAssetAudioUrl(s3Assets.HForHandAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.HForHandAudio),
      },
      {
        id: 29,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Teacher",
        image: getAssetUrl(s3Assets.teacherEightImg),
        audio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.teacherPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.HForTeacherAudio),
      },
      {
        id: 30,
        title: "Consonant",
        letters: "Hh",
        letter: "h",
        word: "Earth",
        image: getAssetUrl(s3Assets.earthEightImg),
        audio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.earthPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.HForEarthAudio),
      },
    ],
  },
  {
    letter: "L",
    items: [
      {
        id: 31,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Lion",
        image: getAssetUrl(s3Assets.LionTwelveImg),
        audio: getAssetAudioUrl(s3Assets.LForLionAudio),
        singleAudio: getAssetAudioUrl(s3Assets.LForLionAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.LForLionAudio),
      },
      {
        id: 32,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Balloon",
        image: getAssetUrl(s3Assets.ballTwoImg),
        audio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.balloonPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.LForBalloonAudio),
      },
      {
        id: 33,
        title: "Consonant",
        letters: "Ll",
        letter: "l",
        word: "Bell",
        image: getAssetUrl(s3Assets.bellTwelveImg),
        audio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bellPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.LForBellAudio),
      },
    ],
  },
  {
    letter: "D",
    items: [
      {
        id: 34,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.DForDogAudio),
        singleAudio: getAssetAudioUrl(s3Assets.DForDogAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.DForDogAudio),
      },
      {
        id: 35,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Lady",
        image: getAssetUrl(s3Assets.LadyImg),
        audio: getAssetAudioUrl(s3Assets.LadySingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.LadySingleAudio),
      },
      {
        id: 36,
        title: "Consonant",
        letters: "Dd",
        letter: "d",
        word: "Sad",
        image: getAssetUrl(s3Assets.SadImg),
        audio: getAssetAudioUrl(s3Assets.SadSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SadSingleAudio),
      },
    ],
  },
  {
    letter: "C",
    items: [
      {
        id: 37,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Cat",
        image: getAssetUrl(s3Assets.catOneImg),
        audio: getAssetAudioUrl(s3Assets.CForCatAudio),
        singleAudio: getAssetAudioUrl(s3Assets.CForCatAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.CForCatAudio),
      },
      {
        id: 38,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Ice",
        image: getAssetUrl(s3Assets.iceThreeImg),
        audio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.icePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.CForIceAudio),
      },
      {
        id: 39,
        title: "Consonant",
        letters: "Cc",
        letter: "c",
        word: "Garlic",
        image: getAssetUrl(s3Assets.garlicThreeImg),
        audio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.garlicPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.CForGarlicAudio),
      },
    ],
  },
  {
    letter: "M",
    items: [
      {
        id: 40,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Mango",
        image: getAssetUrl(s3Assets.mangoThirteenImg),
        audio: getAssetAudioUrl(s3Assets.MForMangoAudio),
        singleAudio: getAssetAudioUrl(s3Assets.MForMangoAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.MForMangoAudio),
      },
      {
        id: 41,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Lemon",
        image: getAssetUrl(s3Assets.lemonThirteenImg),
        audio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.lemonPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.MForLemonAudio),
      },
      {
        id: 42,
        title: "Consonant",
        letters: "Mm",
        letter: "m",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.jamPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.MForJamAudio),
      },
    ],
  },
  {
    letter: "F",
    items: [
      {
        id: 43,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Fish",
        image: getAssetUrl(s3Assets.fishSixImg),
        audio: getAssetAudioUrl(s3Assets.FForFishAudio),
        singleAudio: getAssetAudioUrl(s3Assets.FForFishAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.FForFishAudio),
      },
      {
        id: 44,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Giraffe",
        image: getAssetUrl(s3Assets.girraffeSixImg),
        audio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.giraffePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.FForGiraffeAudio),
      },
      {
        id: 45,
        title: "Consonant",
        letters: "Ff",
        letter: "f",
        word: "Leaf",
        image: getAssetUrl(s3Assets.LeafSixImg),
        audio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.leafPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.FForLeafAudio),
      },
    ],
  },
  {
    letter: "Y",
    items: [
      {
        id: 46,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Yak",
        image: getAssetUrl(s3Assets.yakTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.YForYakAudio),
        singleAudio: getAssetAudioUrl(s3Assets.YForYakAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.YForYakAudio),
      },
      {
        id: 47,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Papaya",
        image: getAssetUrl(s3Assets.papayaTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.papayaPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.YForPapayaAudio),
      },
      {
        id: 48,
        title: "Consonant",
        letters: "Yy",
        letter: "y",
        word: "Key",
        image: getAssetUrl(s3Assets.KeyTwentyFiveImg),
        audio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.keyPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.YForKeyAudio),
      },
    ],
  },
  {
    letter: "W",
    items: [
      {
        id: 49,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Wind",
        image: getAssetUrl(s3Assets.WindImg),
        audio: getAssetAudioUrl(s3Assets.WindAudio),
        singleAudio: getAssetAudioUrl(s3Assets.WindAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.WindAudio),
      },
      {
        id: 50,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Sweet",
        image: getAssetUrl(s3Assets.SweetImg),
        audio: getAssetAudioUrl(s3Assets.SweetSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.SweetSingleAudio),
      },
      {
        id: 51,
        title: "Consonant",
        letters: "Ww",
        letter: "w",
        word: "Crow",
        image: getAssetUrl(s3Assets.CrowTwentyThreeImg),
        audio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.crowPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.WForCrowAudio),
      },
    ],
  },
  {
    letter: "G",
    items: [
      {
        id: 52,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Goat",
        image: getAssetUrl(s3Assets.goatSevenImg),
        audio: getAssetAudioUrl(s3Assets.GForGoatAudio),
        singleAudio: getAssetAudioUrl(s3Assets.GForGoatAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.GForGoatAudio),
      },
      {
        id: 53,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Tiger",
        image: getAssetUrl(s3Assets.tigerSevenImg),
        audio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.tigerPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.GForTigerAudio),
      },
      {
        id: 54,
        title: "Consonant",
        letters: "Gg",
        letter: "g",
        word: "Dog",
        image: getAssetUrl(s3Assets.dogFourImg),
        audio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.dogPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.GForDogAudio),
      },
    ],
  },
  {
    letter: "P",
    items: [
      {
        id: 55,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Pen",
        image: getAssetUrl(s3Assets.penFiveImg),
        audio: getAssetAudioUrl(s3Assets.PForPenAudio),
        singleAudio: getAssetAudioUrl(s3Assets.PForPenAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.PForPenAudio),
      },
      {
        id: 56,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Apple",
        image: getAssetUrl(s3Assets.appleOneImg),
        audio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.applePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.PForAppleAudio),
      },
      {
        id: 57,
        title: "Consonant",
        letters: "Pp",
        letter: "p",
        word: "Cap",
        image: getAssetUrl(s3Assets.capSixteenImg),
        audio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.capPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.PForCapAudio),
      },
    ],
  },
  {
    letter: "B",
    items: [
      {
        id: 58,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Ball",
        image: getAssetUrl(s3Assets.ballGif),
        audio: getAssetAudioUrl(s3Assets.BForBallAudio),
        singleAudio: getAssetAudioUrl(s3Assets.BForBallAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.BForBallAudio),
      },
      {
        id: 59,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.zebraPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.BForZebraAudio),
      },
      {
        id: 60,
        title: "Consonant",
        letters: "Bb",
        letter: "b",
        word: "Cub",
        image: getAssetUrl(s3Assets.cubTwoImg),
        audio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.cubPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.BForCubAudio),
      },
    ],
  },
  {
    letter: "V",
    items: [
      {
        id: 61,
        title: "Consonant",
        letters: "Vv",
        letter: "v",
        word: "Van",
        image: getAssetUrl(s3Assets.VanTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.VForVanAudio),
        singleAudio: getAssetAudioUrl(s3Assets.VForVanAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.VForVanAudio),
      },
      {
        id: 62,
        title: "Consonant",
        letters: "Vv",
        letter: "v",
        word: "Guava",
        image: getAssetUrl(s3Assets.GuavaTwentyTwoImg),
        audio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.guavaPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.VForGuavaAudio),
      },
    ],
  },
  {
    letter: "K",
    items: [
      {
        id: 64,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Kite",
        image: getAssetUrl(s3Assets.kiteFiveImg),
        audio: getAssetAudioUrl(s3Assets.KForKiteAudio),
        singleAudio: getAssetAudioUrl(s3Assets.KForKiteAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.KForKiteAudio),
      },
      {
        id: 65,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Monkey",
        image: getAssetUrl(s3Assets.monkeyElevenImg),
        audio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.monkeyPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.KForMonkeyAudio),
      },
      {
        id: 66,
        title: "Consonant",
        letters: "Kk",
        letter: "k",
        word: "Book",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.bookPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.KForBookAudio),
      },
    ],
  },
  {
    letter: "J",
    items: [
      {
        id: 67,
        title: "Consonant",
        letters: "Jj",
        letter: "j",
        word: "Jam",
        image: getAssetUrl(s3Assets.jamTenImg),
        audio: getAssetAudioUrl(s3Assets.JForJamAudio),
        singleAudio: getAssetAudioUrl(s3Assets.JForJamAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.JForJamAudio),
      },
      {
        id: 68,
        title: "Consonant",
        letters: "Jj",
        letter: "j",
        word: "brinjal",
        image: getAssetUrl(s3Assets.brinjalTenImg),
        audio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.brinjalPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.JForBrinjalAudio),
      },
    ],
  },
  {
    letter: "X",
    items: [
      {
        id: 70,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Xray",
        image: getAssetUrl(s3Assets.xrayTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.XForXrayAudio),
        singleAudio: getAssetAudioUrl(s3Assets.XForXrayAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.XForXrayAudio),
      },
      {
        id: 71,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Textbook",
        image: getAssetUrl(s3Assets.bookElevenImg),
        audio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.textbookPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.XForTextbookAudio),
      },
      {
        id: 72,
        title: "Consonant",
        letters: "Xx",
        letter: "x",
        word: "Fox",
        image: getAssetUrl(s3Assets.foxTwentyFourImg),
        audio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.foxPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.XForFoxAudio),
      },
    ],
  },
  {
    letter: "Q",
    items: [
      {
        id: 73,
        title: "Consonant",
        letters: "Qq",
        letter: "q",
        word: "Queen",
        image: getAssetUrl(s3Assets.queenSixteenImg),
        audio: getAssetAudioUrl(s3Assets.QForQueenAudio),
        singleAudio: getAssetAudioUrl(s3Assets.QForQueenAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.QForQueenAudio),
      },
      {
        id: 74,
        title: "Consonant",
        letters: "Qq",
        letter: "q",
        word: "Equal",
        image: getAssetUrl(s3Assets.EqualImg),
        audio: getAssetAudioUrl(s3Assets.EqualSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.EqualSingleAudio),
      },
    ],
  },
  {
    letter: "Z",
    items: [
      {
        id: 76,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Zebra",
        image: getAssetUrl(s3Assets.zebraTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.ZForZebraAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ZForZebraAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ZForZebraAudio),
      },
      {
        id: 77,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Puzzle",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.puzzlePhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.puzzlePhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ZForPuzzleAudio),
      },
      {
        id: 78,
        title: "Consonant",
        letters: "Zz",
        letter: "z",
        word: "Quiz",
        image: getAssetUrl(s3Assets.PuzzleTwentySixImg),
        audio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
        singleAudio: getAssetAudioUrl(s3Assets.quizPhonemeAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ZForQuizAudio),
      },
    ],
  },
];

export const dataKn = [
  {
    letter: "ರ",
    items: [
      {
        id: 1,
        title: "Letter",
        letter: "ರ",
        word: "ರಸ",
        image: getAssetUrl(s3Assets.ರಸImg),
        audio: getAssetAudioUrl(s3Assets.ರಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಸAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ರಸAudio),
      },
      {
        id: 2,
        title: "Letter",
        letter: "ರ",
        word: "ಅರಸ",
        image: getAssetUrl(s3Assets.ಅರಸImg),
        audio: getAssetAudioUrl(s3Assets.ಅರಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅರಸAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಅರಸAudio),
      },
      {
        id: 3,
        title: "Letter",
        letter: "ರ",
        word: "ದಸರ",
        image: getAssetUrl(s3Assets.ದಸರImg),
        audio: getAssetAudioUrl(s3Assets.ದಸರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದಸರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ದಸರAudio),
      },
    ],
  },
  {
    letter: "ಗ",
    items: [
      {
        id: 4,
        title: "Letter",
        letter: "ಗ",
        word: "ಗರಿ",
        image: getAssetUrl(s3Assets.ಗರImg),
        audio: getAssetAudioUrl(s3Assets.ಗರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಗರAudio),
      },
      {
        id: 5,
        title: "Letter",
        letter: "ಗ",
        word: "ಆಗಸ",
        image: getAssetUrl(s3Assets.ಆಗಸImg),
        audio: getAssetAudioUrl(s3Assets.ಆಗಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಗಸAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಆಗಸAudio),
      },
      {
        id: 6,
        title: "Letter",
        letter: "ಗ",
        word: "ಉರಗ",
        image: getAssetUrl(s3Assets.ಉರಗImg),
        audio: getAssetAudioUrl(s3Assets.ಉರಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉರಗAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಉರಗAudio),
      },
    ],
  },
  {
    letter: "ಸ",
    items: [
      {
        id: 7,
        title: "Letter",
        letter: "ಸ",
        word: "ಸರ",
        image: getAssetUrl(s3Assets.ಸರImg),
        audio: getAssetAudioUrl(s3Assets.ಸರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಸರAudio),
      },
      {
        id: 8,
        title: "Letter",
        letter: "ಸ",
        word: "ಆಸನ",
        image: getAssetUrl(s3Assets.ಆಸನImg),
        audio: getAssetAudioUrl(s3Assets.ಆಸನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಸನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಆಸನAudio),
      },
      {
        id: 9,
        title: "Letter",
        letter: "ಸ",
        word: "ರಸ",
        image: getAssetUrl(s3Assets.ರಸ2Img),
        audio: getAssetAudioUrl(s3Assets.ರಸ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಸ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ರಸ2Audio),
      },
    ],
  },
  {
    letter: "ದ",
    items: [
      {
        id: 10,
        title: "Letter",
        letter: "ದ",
        word: "ದಸರ",
        image: getAssetUrl(s3Assets.ದಸರ2Img),
        audio: getAssetAudioUrl(s3Assets.ದಸರ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ದಸರ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ದಸರ2Audio),
      },
      {
        id: 11,
        title: "Letter",
        letter: "ದ",
        word: "ಉದಯ",
        image: getAssetUrl(s3Assets.ಉದಯImg),
        audio: getAssetAudioUrl(s3Assets.ಉದಯAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉದಯAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಉದಯAudio),
      },
      {
        id: 12,
        title: "Letter",
        letter: "ದ",
        word: "ಕದ",
        image: getAssetUrl(s3Assets.ಕದImg),
        audio: getAssetAudioUrl(s3Assets.ಕದAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕದAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕದAudio),
      },
    ],
  },
  {
    letter: "ಅ",
    items: [
      {
        id: 13,
        title: "Letter",
        letter: "ಅ",
        word: "ಅರಸ",
        image: getAssetUrl(s3Assets.ಅರಸ2Img),
        audio: getAssetAudioUrl(s3Assets.ಅರಸ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅರಸ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಅರಸ2Audio),
      },
    ],
  },
  {
    letter: "ಜ",
    items: [
      {
        id: 14,
        title: "Letter",
        letter: "ಜ",
        word: "ಜನ",
        image: getAssetUrl(s3Assets.ಜನImg),
        audio: getAssetAudioUrl(s3Assets.ಜನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಜನAudio),
      },
      {
        id: 15,
        title: "Letter",
        letter: "ಜ",
        word: "ರಜತ",
        image: getAssetUrl(s3Assets.ರಜತImg),
        audio: getAssetAudioUrl(s3Assets.ರಜತAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಜತAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ರಜತAudio),
      },
      {
        id: 16,
        title: "Letter",
        letter: "ಜ",
        word: "ಗಜ",
        image: getAssetUrl(s3Assets.ಗಜImg),
        audio: getAssetAudioUrl(s3Assets.ಗಜAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಜAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಗಜAudio),
      },
    ],
  },
  {
    letter: "ವ",
    items: [
      {
        id: 17,
        title: "Letter",
        letter: "ವ",
        word: "ವನ",
        image: getAssetUrl(s3Assets.ವನImg),
        audio: getAssetAudioUrl(s3Assets.ವನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ವನAudio),
      },
      {
        id: 18,
        title: "Letter",
        letter: "ವ",
        word: "ದವಸ",
        image: getAssetUrl(s3Assets.ದವಸImg),
        audio: getAssetAudioUrl(s3Assets.ದವಸAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದವಸAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ದವಸAudio),
      },
      {
        id: 19,
        title: "Letter",
        letter: "ವ",
        word: "ಬಸವ",
        image: getAssetUrl(s3Assets.ಬಸವImg),
        audio: getAssetAudioUrl(s3Assets.ಬಸವAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬಸವAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಬಸವAudio),
      },
    ],
  },
  {
    letter: "ಮ",
    items: [
      {
        id: 20,
        title: "Letter",
        letter: "ಮ",
        word: "ಮರ",
        image: getAssetUrl(s3Assets.ಮರImg),
        audio: getAssetAudioUrl(s3Assets.ಮರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಮರAudio),
      },
      {
        id: 21,
        title: "Letter",
        letter: "ಮ",
        word: "ಕಮಲ",
        image: getAssetUrl(s3Assets.ಕಮಲImg),
        audio: getAssetAudioUrl(s3Assets.ಕಮಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಮಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಮಲAudio),
      },
      {
        id: 22,
        title: "Letter",
        letter: "ಮ",
        word: "ಸಮ",
        image: getAssetUrl(s3Assets.ಸಮImg),
        audio: getAssetAudioUrl(s3Assets.ಸಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಮAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಸಮAudio),
      },
    ],
  },
  {
    letter: "ಬ",
    items: [
      {
        id: 23,
        title: "Letter",
        letter: "ಬ",
        word: "ಬನ",
        image: getAssetUrl(s3Assets.ಬನImg),
        audio: getAssetAudioUrl(s3Assets.ಬನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಬನAudio),
      },
      {
        id: 24,
        title: "Letter",
        letter: "ಬ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.ತಬಲImg),
        audio: getAssetAudioUrl(s3Assets.ತಬಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ತಬಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ತಬಲAudio),
      },
      {
        id: 25,
        title: "Letter",
        letter: "ಬ",
        word: "ಕಂಬ",
        image: getAssetUrl(s3Assets.ಕಬImg),
        audio: getAssetAudioUrl(s3Assets.ಕಬAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಬAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಬAudio),
      },
    ],
  },
  {
    letter: "ನ",
    items: [
      {
        id: 26,
        title: "Letter",
        letter: "ನ",
        word: "ನಗ",
        image: getAssetUrl(s3Assets.ನಗImg),
        audio: getAssetAudioUrl(s3Assets.ನಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನಗAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ನಗAudio),
      },
      {
        id: 27,
        title: "Letter",
        letter: "ನ",
        word: "ವನಜ",
        image: getAssetUrl(s3Assets.ವನಜImg),
        audio: getAssetAudioUrl(s3Assets.ವನಜAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವನಜAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ವನಜAudio),
      },
      {
        id: 28,
        title: "Letter",
        letter: "ನ",
        word: "ವಾಚನ",
        image: getAssetUrl(s3Assets.ವಚನImg),
        audio: getAssetAudioUrl(s3Assets.ವಚನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವಚನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ವಚನAudio),
      },
    ],
  },
  {
    letter: "ಪ",
    items: [
      {
        id: 29,
        title: "Letter",
        letter: "ಪ",
        word: "ಪದ",
        image: getAssetUrl(s3Assets.ಪದImg),
        audio: getAssetAudioUrl(s3Assets.ಪದAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪದAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಪದAudio),
      },
      {
        id: 30,
        title: "Letter",
        letter: "ಪ",
        word: "ಟಪಟಪ",
        image: getAssetUrl(s3Assets.ಟಪಟಪImg),
        audio: getAssetAudioUrl(s3Assets.ಟಪಟಪAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಟಪಟಪAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಟಪಟಪAudio),
      },
      {
        id: 31,
        title: "Letter",
        letter: "ಪ",
        word: "ಜಪ",
        image: getAssetUrl(s3Assets.ಜಪImg),
        audio: getAssetAudioUrl(s3Assets.ಜಪAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜಪAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಜಪAudio),
      },
    ],
  },
  {
    letter: "ಯ",
    items: [
      {
        id: 32,
        title: "Letter",
        letter: "ಯ",
        word: "ಯಮ",
        image: getAssetUrl(s3Assets.ಯಮImg),
        audio: getAssetAudioUrl(s3Assets.ಯಮAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಯಮAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಯಮAudio),
      },
      {
        id: 33,
        title: "Letter",
        letter: "ಯ",
        word: "ನಯನ",
        image: getAssetUrl(s3Assets.ನಯನ2Img),
        audio: getAssetAudioUrl(s3Assets.ನಯನ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ನಯನ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ನಯನ2Audio),
      },
      {
        id: 34,
        title: "Letter",
        letter: "ಯ",
        word: "ಜಯ",
        image: getAssetUrl(s3Assets.ಜಯImg),
        audio: getAssetAudioUrl(s3Assets.ಜಯAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜಯAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಜಯAudio),
      },
    ],
  },
  {
    letter: "ಉ",
    items: [
      {
        id: 35,
        title: "Letter",
        letter: "ಉ",
        word: "ಉದಯ",
        image: getAssetUrl(s3Assets.ಉದಯ2Img),
        audio: getAssetAudioUrl(s3Assets.ಉದಯ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉದಯ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಉದಯ2Audio),
      },
    ],
  },
  {
    letter: "ಡ",
    items: [
      {
        id: 36,
        title: "Letter",
        letter: "ಡ",
        word: "ಡಮರ",
        image: getAssetUrl(s3Assets.ಡಮರImg),
        audio: getAssetAudioUrl(s3Assets.ಡಮರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಡಮರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಡಮರAudio),
      },
      {
        id: 37,
        title: "Letter",
        letter: "ಡ",
        word: "ಕಡಗ",
        image: getAssetUrl(s3Assets.ಕಡಗImg),
        audio: getAssetAudioUrl(s3Assets.ಕಡಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಡಗAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಡಗAudio),
      },
      {
        id: 38,
        title: "Letter",
        letter: "ಡ",
        word: "ಉಡ",
        image: getAssetUrl(s3Assets.ಉಡImg),
        audio: getAssetAudioUrl(s3Assets.ಉಡAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉಡAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಉಡAudio),
      },
    ],
  },
  {
    letter: "ಟ",
    items: [
      {
        id: 39,
        title: "Letter",
        letter: "ಟ",
        word: "ಟಪಟಪ",
        image: getAssetUrl(s3Assets.ಟಪಟಪ2Img),
        audio: getAssetAudioUrl(s3Assets.ಟಪಟಪ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಟಪಟಪ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಟಪಟಪ2Audio),
      },
      {
        id: 40,
        title: "Letter",
        letter: "ಟ",
        word: "ನಾಟಕ",
        image: getAssetUrl(s3Assets.ನಟಕImg),
        audio: getAssetAudioUrl(s3Assets.ನಟಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನಟಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ನಟಕAudio),
      },
      {
        id: 41,
        title: "Letter",
        letter: "ಟ",
        word: "ಆಟ",
        image: getAssetUrl(s3Assets.ಆಟImg),
        audio: getAssetAudioUrl(s3Assets.ಆಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಟAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಆಟAudio),
      },
    ],
  },
  {
    letter: "ಚ",
    items: [
      {
        id: 42,
        title: "Letter",
        letter: "ಚ",
        word: "ಚಮಚ",
        image: getAssetUrl(s3Assets.ಚಮಚImg),
        audio: getAssetAudioUrl(s3Assets.ಚಮಚAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಚಮಚAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಚಮಚAudio),
      },
      {
        id: 43,
        title: "Letter",
        letter: "ಚ",
        word: "ಈಚಲ",
        image: getAssetUrl(s3Assets.ಈಚಲImg),
        audio: getAssetAudioUrl(s3Assets.ಈಚಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಈಚಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಈಚಲAudio),
      },
      {
        id: 44,
        title: "Letter",
        letter: "ಚ",
        word: "ಮಂಚ",
        image: getAssetUrl(s3Assets.ಮಚImg),
        audio: getAssetAudioUrl(s3Assets.ಮಚAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಮಚAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಮಚAudio),
      },
    ],
  },
  {
    letter: "ಲ",
    items: [
      {
        id: 45,
        title: "Letter",
        letter: "ಲ",
        word: "ಲವಣ",
        image: getAssetUrl(s3Assets.ಲವಣImg),
        audio: getAssetAudioUrl(s3Assets.ಲವಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲವಣAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಲವಣAudio),
      },
      {
        id: 46,
        title: "Letter",
        letter: "ಲ",
        word: "ಕಲರವ",
        image: getAssetUrl(s3Assets.ಕಲರವImg),
        audio: getAssetAudioUrl(s3Assets.ಕಲರವAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಲರವAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಲರವAudio),
      },
      {
        id: 47,
        title: "Letter",
        letter: "ಲ",
        word: "ಬಲ",
        image: getAssetUrl(s3Assets.ಬಲImg),
        audio: getAssetAudioUrl(s3Assets.ಬಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಬಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಬಲAudio),
      },
    ],
  },
  {
    letter: "ಈ",
    items: [
      {
        id: 48,
        title: "Letter",
        letter: "ಈ",
        word: "ಈಚಲ",
        image: getAssetUrl(s3Assets.ಈಚಲ2Img),
        audio: getAssetAudioUrl(s3Assets.ಈಚಲ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಈಚಲ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಈಚಲ2Audio),
      },
    ],
  },
  {
    letter: "ಊ",
    items: [
      {
        id: 49,
        title: "Letter",
        letter: "ಊ",
        word: "ಊಟ",
        image: getAssetUrl(s3Assets.ಊಟImg),
        audio: getAssetAudioUrl(s3Assets.ಊಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಊಟAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಊಟAudio),
      },
    ],
  },
  {
    letter: "ಕ",
    items: [
      {
        id: 50,
        title: "Letter",
        letter: "ಕ",
        word: "ಕದ",
        image: getAssetUrl(s3Assets.ಕದ2Img),
        audio: getAssetAudioUrl(s3Assets.ಕದ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕದ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕದ2Audio),
      },
      {
        id: 51,
        title: "Letter",
        letter: "ಕ",
        word: "ಟಕಟಕ",
        image: getAssetUrl(s3Assets.ಟಕಟಕImg),
        audio: getAssetAudioUrl(s3Assets.ಟಕಟಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಟಕಟಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಟಕಟಕAudio),
      },
      {
        id: 52,
        title: "Letter",
        letter: "ಕ",
        word: "ಪದಕ",
        image: getAssetUrl(s3Assets.ಪದಕImg),
        audio: getAssetAudioUrl(s3Assets.ಪದಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪದಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಪದಕAudio),
      },
    ],
  },
  {
    letter: "ಎ",
    items: [
      {
        id: 53,
        title: "Letter",
        letter: "ಎ",
        word: "ಎರಕ",
        image: getAssetUrl(s3Assets.ಎರಕImg),
        audio: getAssetAudioUrl(s3Assets.ಎರಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಎರಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಎರಕAudio),
      },
    ],
  },
  {
    letter: "ಏ",
    items: [
      {
        id: 54,
        title: "Letter",
        letter: "ಏ",
        word: "ಏತ",
        image: getAssetUrl(s3Assets.ಏತImg),
        audio: getAssetAudioUrl(s3Assets.ಏತAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಏತAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಏತAudio),
      },
    ],
  },
  {
    letter: "ಇ",
    items: [
      {
        id: 55,
        title: "Letter",
        letter: "ಇ",
        word: "ಇಲಿ",
        image: getAssetUrl(s3Assets.ಇಲImg),
        audio: getAssetAudioUrl(s3Assets.ಇಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಇಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಇಲAudio),
      },
    ],
  },
  {
    letter: "ಆ",
    items: [
      {
        id: 56,
        title: "Letter",
        letter: "ಆ",
        word: "ಆಲ",
        image: getAssetUrl(s3Assets.ಆಲImg),
        audio: getAssetAudioUrl(s3Assets.ಆಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಆಲAudio),
      },
    ],
  },
  {
    letter: "ತ",
    items: [
      {
        id: 57,
        title: "Letter",
        letter: "ತ",
        word: "ತಬಲ",
        image: getAssetUrl(s3Assets.ತಬಲ2Img),
        audio: getAssetAudioUrl(s3Assets.ತಬಲ2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ತಬಲ2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ತಬಲ2Audio),
      },
      {
        id: 58,
        title: "Letter",
        letter: "ತ",
        word: "ಔತಣ",
        image: getAssetUrl(s3Assets.ಔತಣImg),
        audio: getAssetAudioUrl(s3Assets.ಔತಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔತಣAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಔತಣAudio),
      },
      {
        id: 59,
        title: "Letter",
        letter: "ತ",
        word: "ಊತ",
        image: getAssetUrl(s3Assets.ಊತImg),
        audio: getAssetAudioUrl(s3Assets.ಊತAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಊತAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಊತAudio),
      },
    ],
  },
  {
    letter: "ಳ",
    items: [
      {
        id: 60,
        title: "Letter",
        letter: "ಳ",
        word: "ಜಳಕ",
        image: getAssetUrl(s3Assets.ಜಳಕImg),
        audio: getAssetAudioUrl(s3Assets.ಜಳಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜಳಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಜಳಕAudio),
      },
      {
        id: 61,
        title: "Letter",
        letter: "ಳ",
        word: "ನಳ",
        image: getAssetUrl(s3Assets.ನಳImg),
        audio: getAssetAudioUrl(s3Assets.ನಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ನಳAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ನಳAudio),
      },
    ],
  },
  {
    letter: "ಓ",
    items: [
      {
        id: 62,
        title: "Letter",
        letter: "ಓ",
        word: "ಓಟ",
        image: getAssetUrl(s3Assets.ಓಟImg),
        audio: getAssetAudioUrl(s3Assets.ಓಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಓಟAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಓಟAudio),
      },
    ],
  },
  {
    letter: "ಔ",
    items: [
      {
        id: 63,
        title: "Letter",
        letter: "ಔ",
        word: "ಔಡಲ",
        image: getAssetUrl(s3Assets.ಔಡಲImg),
        audio: getAssetAudioUrl(s3Assets.ಔಡಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಡಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಔಡಲAudio),
      },
    ],
  },
  {
    letter: "ಹ",
    items: [
      {
        id: 64,
        title: "Letter",
        letter: "ಹ",
        word: "ಹವಳ",
        image: getAssetUrl(s3Assets.ಹವಳImg),
        audio: getAssetAudioUrl(s3Assets.ಹವಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹವಳAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಹವಳAudio),
      },
      {
        id: 65,
        title: "Letter",
        letter: "ಹ",
        word: "ವಾಹನ",
        image: getAssetUrl(s3Assets.ವಹನImg),
        audio: getAssetAudioUrl(s3Assets.ವಹನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವಹನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ವಹನAudio),
      },
      {
        id: 66,
        title: "Letter",
        letter: "ಹ",
        word: "ಕಲಹ",
        image: getAssetUrl(s3Assets.ಕಲಹImg),
        audio: getAssetAudioUrl(s3Assets.ಕಲಹAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಲಹAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಲಹAudio),
      },
    ],
  },
  {
    letter: "ಶ",
    items: [
      {
        id: 67,
        title: "Letter",
        letter: "ಶ",
        word: "ಶರ",
        image: getAssetUrl(s3Assets.ಶರImg),
        audio: getAssetAudioUrl(s3Assets.ಶರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಶರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಶರAudio),
      },
      {
        id: 68,
        title: "Letter",
        letter: "ಶ",
        word: "ದಶಕ",
        image: getAssetUrl(s3Assets.ದಶಕImg),
        audio: getAssetAudioUrl(s3Assets.ದಶಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ದಶಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ದಶಕAudio),
      },
      {
        id: 69,
        title: "Letter",
        letter: "ಶ",
        word: "ಕಳಶ",
        image: getAssetUrl(s3Assets.ಕಳಶImg),
        audio: getAssetAudioUrl(s3Assets.ಕಳಶAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಳಶAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಳಶAudio),
      },
    ],
  },
  {
    letter: "ಷ",
    items: [
      {
        id: 70,
        title: "Letter",
        letter: "ಷ",
        word: "ಉಷ",
        image: getAssetUrl(s3Assets.ಉಷImg),
        audio: getAssetAudioUrl(s3Assets.ಉಷAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಉಷAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಉಷAudio),
      },
      {
        id: 71,
        title: "Letter",
        letter: "ಷ",
        word: "ಔಷಧ",
        image: getAssetUrl(s3Assets.ಔಷಧImg),
        audio: getAssetAudioUrl(s3Assets.ಔಷಧAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಔಷಧAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಔಷಧAudio),
      },
    ],
  },
  {
    letter: "ಐ",
    items: [
      {
        id: 72,
        title: "Letter",
        letter: "ಐ",
        word: "ಐದಳ",
        image: getAssetUrl(s3Assets.ಐದಳImg),
        audio: getAssetAudioUrl(s3Assets.ಐದಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಐದಳAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಐದಳAudio),
      },
    ],
  },
  {
    letter: "ಋ",
    items: [
      {
        id: 73,
        title: "Letter",
        letter: "ಋ",
        word: "ಋಷಿ",
        image: getAssetUrl(s3Assets.ಋಷImg),
        audio: getAssetAudioUrl(s3Assets.ಋಷAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಋಷAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಋಷAudio),
      },
    ],
  },
  {
    letter: "ಣ",
    items: [
      {
        id: 74,
        title: "Letter",
        letter: "ಣ",
        word: "ಹಣತೆ",
        image: getAssetUrl(s3Assets.ಹಣತImg),
        audio: getAssetAudioUrl(s3Assets.ಹಣತAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಣತAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಹಣತAudio),
      },
      {
        id: 75,
        title: "Letter",
        letter: "ಣ",
        word: "ಹಣ",
        image: getAssetUrl(s3Assets.ಹಣImg),
        audio: getAssetAudioUrl(s3Assets.ಹಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಹಣAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಹಣAudio),
      },
    ],
  },
  {
    letter: "ಛ",
    items: [
      {
        id: 76,
        title: "Letter",
        letter: "ಛ",
        word: "ಛತ್ರಿ",
        image: getAssetUrl(s3Assets.ಛತರImg),
        audio: getAssetAudioUrl(s3Assets.ಛತರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಛತರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಛತರAudio),
      },
    ],
  },
  {
    letter: "ಒ",
    items: [
      {
        id: 77,
        title: "Letter",
        letter: "ಒ",
        word: "ಒಣಮರ",
        image: getAssetUrl(s3Assets.ಒಣಮರImg),
        audio: getAssetAudioUrl(s3Assets.ಒಣಮರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಒಣಮರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಒಣಮರAudio),
      },
    ],
  },
  {
    letter: "ಧ",
    items: [
      {
        id: 78,
        title: "Letter",
        letter: "ಧ",
        word: "ಧನ",
        image: getAssetUrl(s3Assets.ಧನImg),
        audio: getAssetAudioUrl(s3Assets.ಧನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಧನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಧನAudio),
      },
      {
        id: 79,
        title: "Letter",
        letter: "ಧ",
        word: "ಸಾಧನೆ",
        image: getAssetUrl(s3Assets.ಸಧನImg),
        audio: getAssetAudioUrl(s3Assets.ಸಧನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಧನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಸಧನAudio),
      },
      {
        id: 80,
        title: "Letter",
        letter: "ಧ",
        word: "ಗಂಧ",
        image: getAssetUrl(s3Assets.ಗಧImg),
        audio: getAssetAudioUrl(s3Assets.ಗಧAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಧAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಗಧAudio),
      },
    ],
  },
  {
    letter: "ಥ",
    items: [
      {
        id: 81,
        title: "Letter",
        letter: "ಥ",
        word: "ಥಳಥಳ",
        image: getAssetUrl(s3Assets.ಥಳಥಳImg),
        audio: getAssetAudioUrl(s3Assets.ಥಳಥಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಥಳಥಳAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಥಳಥಳAudio),
      },
      {
        id: 83,
        title: "Letter",
        letter: "ಥ",
        word: "ರಥ",
        image: getAssetUrl(s3Assets.ರಥImg),
        audio: getAssetAudioUrl(s3Assets.ರಥAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ರಥAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ರಥAudio),
      },
    ],
  },
  {
    letter: "ಢ",
    items: [
      {
        id: 84,
        title: "Letter",
        letter: "ಢ",
        word: "ಢಣಢಣ",
        image: getAssetUrl(s3Assets.ಢಣಢಣImg),
        audio: getAssetAudioUrl(s3Assets.ಢಣಢಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಢಣಢಣAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಢಣಢಣAudio),
      },
      {
        id: 85,
        title: "Letter",
        letter: "ಢ",
        word: "ಗೂಢ",
        image: getAssetUrl(s3Assets.ಗಢImg),
        audio: getAssetAudioUrl(s3Assets.ಗಢAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಗಢAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಗಢAudio),
      },
    ],
  },
  {
    letter: "ಭ",
    items: [
      {
        id: 86,
        title: "Letter",
        letter: "ಭ",
        word: "ಭವನ",
        image: getAssetUrl(s3Assets.ಭವನImg),
        audio: getAssetAudioUrl(s3Assets.ಭವನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಭವನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಭವನAudio),
      },
      {
        id: 87,
        title: "Letter",
        letter: "ಭ",
        word: "ಆಭರಣ",
        image: getAssetUrl(s3Assets.ಆಭರಣImg),
        audio: getAssetAudioUrl(s3Assets.ಆಭರಣAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಆಭರಣAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಆಭರಣAudio),
      },
      {
        id: 88,
        title: "Letter",
        letter: "ಭ",
        word: "ವೃಷಭ",
        image: getAssetUrl(s3Assets.ವಷಭImg),
        audio: getAssetAudioUrl(s3Assets.ವಷಭAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ವಷಭAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ವಷಭAudio),
      },
    ],
  },
  {
    letter: "ಘ",
    items: [
      {
        id: 89,
        title: "Letter",
        letter: "ಘ",
        word: "ಘಟ",
        image: getAssetUrl(s3Assets.ಘಟImg),
        audio: getAssetAudioUrl(s3Assets.ಘಟAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಘಟAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಘಟAudio),
      },
    ],
  },
  {
    letter: "ಠ",
    items: [
      {
        id: 91,
        title: "Letter",
        letter: "ಠ",
        word: "ಠಕ್ಕ",
        image: getAssetUrl(s3Assets.ಠಕಕImg),
        audio: getAssetAudioUrl(s3Assets.ಠಕಕAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಠಕಕAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಠಕಕAudio),
      },
      {
        id: 92,
        title: "Letter",
        letter: "ಠ",
        word: "ಜಠರ",
        image: getAssetUrl(s3Assets.ಜಠರImg),
        audio: getAssetAudioUrl(s3Assets.ಜಠರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜಠರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಜಠರAudio),
      },
      {
        id: 93,
        title: "Letter",
        letter: "ಠ",
        word: "ಕಂಠ",
        image: getAssetUrl(s3Assets.ಕಠImg),
        audio: getAssetAudioUrl(s3Assets.ಕಠAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಠAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಠAudio),
      },
    ],
  },
  {
    letter: "ಫ",
    items: [
      {
        id: 94,
        title: "Letter",
        letter: "ಫ",
        word: "ಫಲ",
        image: getAssetUrl(s3Assets.ಫಲImg),
        audio: getAssetAudioUrl(s3Assets.ಫಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಫಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಫಲAudio),
      },
      {
        id: 95,
        title: "Letter",
        letter: "ಫ",
        word: "ಸಫಲ",
        image: getAssetUrl(s3Assets.ಸಫಲImg),
        audio: getAssetAudioUrl(s3Assets.ಸಫಲAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಸಫಲAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಸಫಲAudio),
      },
      {
        id: 96,
        title: "Letter",
        letter: "ಫ",
        word: "ಕಫ",
        image: getAssetUrl(s3Assets.ಕಫImg),
        audio: getAssetAudioUrl(s3Assets.ಕಫAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಫAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಫAudio),
      },
    ],
  },
  {
    letter: "ಝ",
    items: [
      {
        id: 97,
        title: "Letter",
        letter: "ಝ",
        word: "ಝರಿ",
        image: getAssetUrl(s3Assets.ಝರImg),
        audio: getAssetAudioUrl(s3Assets.ಝರAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಝರAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಝರAudio),
      },
    ],
  },
  {
    letter: "ಖ",
    items: [
      {
        id: 99,
        title: "Letter",
        letter: "ಖ",
        word: "ಖಗ",
        image: getAssetUrl(s3Assets.ಖಗImg),
        audio: getAssetAudioUrl(s3Assets.ಖಗAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಖಗAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಖಗAudio),
      },
      {
        id: 100,
        title: "Letter",
        letter: "ಖ",
        word: "ಲೇಖನ",
        image: getAssetUrl(s3Assets.ಲಖನImg),
        audio: getAssetAudioUrl(s3Assets.ಲಖನAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಲಖನAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಲಖನAudio),
      },
      {
        id: 101,
        title: "Letter",
        letter: "ಖ",
        word: "ಪಂಖ",
        image: getAssetUrl(s3Assets.ಪಖImg),
        audio: getAssetAudioUrl(s3Assets.ಪಖAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಪಖAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಪಖAudio),
      },
    ],
  },
  {
    letter: "ಅಂ",
    items: [
      {
        id: 102,
        title: "Letter",
        letter: "ಅಂ",
        word: "ಅಂಗಳ",
        image: getAssetUrl(s3Assets.ಅಗಳImg),
        audio: getAssetAudioUrl(s3Assets.ಅಗಳAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅಗಳAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಅಗಳAudio),
      },
    ],
  },
  {
    letter: "ಅಃ",
    items: [
      {
        id: 103,
        title: "Letter",
        letter: "ಅಃ",
        word: "ಅಃ",
        image: getAssetUrl(s3Assets.ಅImg),
        audio: getAssetAudioUrl(s3Assets.ಅAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಅAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಅAudio),
      },
    ],
  },
  {
    letter: "ಙ",
    items: [
      {
        id: 104,
        title: "Letter",
        letter: "ಙ",
        word: "ಙ",
        image: getAssetUrl(s3Assets.ಙImg),
        audio: getAssetAudioUrl(s3Assets.ಙAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಙAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಙAudio),
      },
    ],
  },
  {
    letter: "ಞ",
    items: [
      {
        id: 105,
        title: "Letter",
        letter: "ಞ",
        word: "ಞ",
        image: getAssetUrl(s3Assets.ಞImg),
        audio: getAssetAudioUrl(s3Assets.ಞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಞAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಞAudio),
      },
    ],
  },
  {
    letter: "ಕ್ಷ",
    items: [
      {
        id: 106,
        title: "Letter",
        letter: "ಕ್ಷ",
        word: "ಕ್ಷ",
        image: getAssetUrl(s3Assets.ಕಷImg),
        audio: getAssetAudioUrl(s3Assets.ಕಷAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಕಷAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಕಷAudio),
      },
    ],
  },
  {
    letter: "ಜ್ಞ",
    items: [
      {
        id: 107,
        title: "Letter",
        letter: "ಜ್ಞ",
        word: "ಜ್ಞ",
        image: getAssetUrl(s3Assets.ಜಞImg),
        audio: getAssetAudioUrl(s3Assets.ಜಞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ಜಞAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ಜಞAudio),
      },
    ],
  },
];

export const dataHi = [
  {
    letter: "अ",
    items: [
      {
        id: 1,
        title: "Letter",
        letter: "अ",
        word: "अनार",
        image: getAssetUrl(s3Assets.अनरImg),
        audio: getAssetAudioUrl(s3Assets.अनरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अनरAudio),
      },
    ],
  },
  {
    letter: "आ",
    items: [
      {
        id: 2,
        title: "Letter",
        letter: "आ",
        word: "आम",
        image: getAssetUrl(s3Assets.आमImg),
        audio: getAssetAudioUrl(s3Assets.आमAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आमAudio),
      },
      {
        id: 3,
        title: "Letter",
        letter: "आ",
        word: "कछुआ",
        image: getAssetUrl(s3Assets.कछआImg),
        audio: getAssetAudioUrl(s3Assets.कछआAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कछआAudio),
      },
    ],
  },
  {
    letter: "इ",
    items: [
      {
        id: 4,
        title: "Letter",
        letter: "इ",
        word: "इमली",
        image: getAssetUrl(s3Assets.इमलImg),
        audio: getAssetAudioUrl(s3Assets.इमलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.इमलAudio),
      },
      {
        id: 5,
        title: "Letter",
        letter: "इ",
        word: "साइकिल",
        image: getAssetUrl(s3Assets.सइकलImg),
        audio: getAssetAudioUrl(s3Assets.सइकलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सइकलAudio),
      },
    ],
  },
  {
    letter: "ई",
    items: [
      {
        id: 6,
        title: "Letter",
        letter: "ई",
        word: "ईख",
        image: getAssetUrl(s3Assets.ईखImg),
        audio: getAssetAudioUrl(s3Assets.ईखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ईखAudio),
      },
      {
        id: 7,
        title: "Letter",
        letter: "ई",
        word: "नई",
        image: getAssetUrl(s3Assets.नईImg),
        audio: getAssetAudioUrl(s3Assets.नईAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नईAudio),
      },
    ],
  },
  {
    letter: "उ",
    items: [
      {
        id: 8,
        title: "Letter",
        letter: "उ",
        word: "उड़",
        image: getAssetUrl(s3Assets.उडImg),
        audio: getAssetAudioUrl(s3Assets.उडAudio),
        singleAudio: getAssetAudioUrl(s3Assets.उडAudio),
      },
    ],
  },
  {
    letter: "ऊ",
    items: [
      {
        id: 9,
        title: "Letter",
        letter: "ऊ",
        word: "ऊन",
        image: getAssetUrl(s3Assets.ऊनImg),
        audio: getAssetAudioUrl(s3Assets.ऊनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऊनAudio),
      },
    ],
  },
  {
    letter: "ऋ",
    items: [
      {
        id: 10,
        title: "Letter",
        letter: "ऋ",
        word: "ऋषि",
        image: getAssetUrl(s3Assets.ऋषImg),
        audio: getAssetAudioUrl(s3Assets.ऋषAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऋषAudio),
      },
    ],
  },
  {
    letter: "ए",
    items: [
      {
        id: 11,
        title: "Letter",
        letter: "ए",
        word: "एक",
        image: getAssetUrl(s3Assets.एकImg),
        audio: getAssetAudioUrl(s3Assets.एकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.एकAudio),
      },
      {
        id: 12,
        title: "Letter",
        letter: "ए",
        word: "पढ़िए",
        image: getAssetUrl(s3Assets.पढएImg),
        audio: getAssetAudioUrl(s3Assets.पढएAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पढएAudio),
      },
    ],
  },
  {
    letter: "ऐ",
    items: [
      {
        id: 13,
        title: "Letter",
        letter: "ऐ",
        word: "ऐनक",
        image: getAssetUrl(s3Assets.ऐनकImg),
        audio: getAssetAudioUrl(s3Assets.ऐनकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऐनकAudio),
      },
    ],
  },
  {
    letter: "ओ",
    items: [
      {
        id: 14,
        title: "Letter",
        letter: "ओ",
        word: "ओखल",
        image: getAssetUrl(s3Assets.ओखलImg),
        audio: getAssetAudioUrl(s3Assets.ओखलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ओखलAudio),
      },
    ],
  },
  {
    letter: "औ",
    items: [
      {
        id: 15,
        title: "Letter",
        letter: "औ",
        word: "औरत",
        image: getAssetUrl(s3Assets.औरतImg),
        audio: getAssetAudioUrl(s3Assets.औरतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.औरतAudio),
      },
    ],
  },
  {
    letter: "अं",
    items: [
      {
        id: 16,
        title: "Letter",
        letter: "अं",
        word: "अंगूर",
        image: getAssetUrl(s3Assets.अगरImg),
        audio: getAssetAudioUrl(s3Assets.अगरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अगरAudio),
      },
    ],
  },
  {
    letter: "अः",
    items: [
      {
        id: 106,
        title: "Letter",
        letter: "अः",
        word: "नमः",
        image: getAssetUrl(s3Assets.अःImg),
        audio: getAssetAudioUrl(s3Assets.अःAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अःAudio),
      },
    ],
  },
  {
    letter: "क",
    items: [
      {
        id: 17,
        title: "Letter",
        letter: "क",
        word: "कबूतर",
        image: getAssetUrl(s3Assets.कबतरImg),
        audio: getAssetAudioUrl(s3Assets.कबतरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कबतरAudio),
      },
      {
        id: 18,
        title: "Letter",
        letter: "क",
        word: "बकरी",
        image: getAssetUrl(s3Assets.बकरImg),
        audio: getAssetAudioUrl(s3Assets.बकरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बकरAudio),
      },
      {
        id: 19,
        title: "Letter",
        letter: "क",
        word: "नमक",
        image: getAssetUrl(s3Assets.नमकImg),
        audio: getAssetAudioUrl(s3Assets.नमकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नमकAudio),
      },
    ],
  },
  {
    letter: "ख",
    items: [
      {
        id: 20,
        title: "Letter",
        letter: "ख",
        word: "खरगोश",
        image: getAssetUrl(s3Assets.खरगशImg),
        audio: getAssetAudioUrl(s3Assets.खरगशAudio),
        singleAudio: getAssetAudioUrl(s3Assets.खरगशAudio),
      },
      {
        id: 21,
        title: "Letter",
        letter: "ख",
        word: "लेखन",
        image: getAssetUrl(s3Assets.लखनImg),
        audio: getAssetAudioUrl(s3Assets.लखनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लखनAudio),
      },
      {
        id: 22,
        title: "Letter",
        letter: "ख",
        word: "भूख",
        image: getAssetUrl(s3Assets.भखImg),
        audio: getAssetAudioUrl(s3Assets.भखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भखAudio),
      },
    ],
  },
  {
    letter: "ग",
    items: [
      {
        id: 23,
        title: "Letter",
        letter: "ग",
        word: "गधा",
        image: getAssetUrl(s3Assets.गधImg),
        audio: getAssetAudioUrl(s3Assets.गधAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गधAudio),
      },
      {
        id: 24,
        title: "Letter",
        letter: "ग",
        word: "नगर",
        image: getAssetUrl(s3Assets.नगरImg),
        audio: getAssetAudioUrl(s3Assets.नगरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नगरAudio),
      },
      {
        id: 25,
        title: "Letter",
        letter: "ग",
        word: "लोग",
        image: getAssetUrl(s3Assets.लगImg),
        audio: getAssetAudioUrl(s3Assets.लगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लगAudio),
      },
    ],
  },
  {
    letter: "घ",
    items: [
      {
        id: 26,
        title: "Letter",
        letter: "घ",
        word: "घर",
        image: getAssetUrl(s3Assets.घरImg),
        audio: getAssetAudioUrl(s3Assets.घरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घरAudio),
      },
      {
        id: 27,
        title: "Letter",
        letter: "घ",
        word: "घुँघरू",
        image: getAssetUrl(s3Assets.घघरImg),
        audio: getAssetAudioUrl(s3Assets.घघरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घघरAudio),
      },
      {
        id: 28,
        title: "Letter",
        letter: "घ",
        word: "बाघ",
        image: getAssetUrl(s3Assets.बघImg),
        audio: getAssetAudioUrl(s3Assets.बघAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बघAudio),
      },
    ],
  },
  {
    letter: "ङ",
    items: [
      {
        id: 107,
        title: "Letter",
        letter: "ङ",
        word: "तरंग",
        image: getAssetUrl(s3Assets.ङImg),
        audio: getAssetAudioUrl(s3Assets.ङAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ङAudio),
      },
    ],
  },
  {
    letter: "च",
    items: [
      {
        id: 29,
        title: "Letter",
        letter: "च",
        word: "चढ़",
        image: getAssetUrl(s3Assets.चढImg),
        audio: getAssetAudioUrl(s3Assets.चढAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चढAudio),
      },
      {
        id: 30,
        title: "Letter",
        letter: "च",
        word: "खिचड़ी",
        image: getAssetUrl(s3Assets.खचडImg),
        audio: getAssetAudioUrl(s3Assets.खचडAudio),
        singleAudio: getAssetAudioUrl(s3Assets.खचडAudio),
      },
      {
        id: 31,
        title: "Letter",
        letter: "च",
        word: "पाँच",
        image: getAssetUrl(s3Assets.पचImg),
        audio: getAssetAudioUrl(s3Assets.पचAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पचAudio),
      },
    ],
  },
  {
    letter: "छ",
    items: [
      {
        id: 32,
        title: "Letter",
        letter: "छ",
        word: "छत",
        image: getAssetUrl(s3Assets.छतImg),
        audio: getAssetAudioUrl(s3Assets.छतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.छतAudio),
      },
      {
        id: 33,
        title: "Letter",
        letter: "छ",
        word: "मछली",
        image: getAssetUrl(s3Assets.मछलImg),
        audio: getAssetAudioUrl(s3Assets.मछलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मछलAudio),
      },
      {
        id: 34,
        title: "Letter",
        letter: "छ",
        word: "पूछ",
        image: getAssetUrl(s3Assets.पछImg),
        audio: getAssetAudioUrl(s3Assets.पछAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पछAudio),
      },
    ],
  },
  {
    letter: "ज",
    items: [
      {
        id: 35,
        title: "Letter",
        letter: "ज",
        word: "जग",
        image: getAssetUrl(s3Assets.जगImg),
        audio: getAssetAudioUrl(s3Assets.जगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जगAudio),
      },
      {
        id: 36,
        title: "Letter",
        letter: "ज",
        word: "गाजर",
        image: getAssetUrl(s3Assets.गजरImg),
        audio: getAssetAudioUrl(s3Assets.गजरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गजरAudio),
      },
      {
        id: 37,
        title: "Letter",
        letter: "ज",
        word: "सूरज",
        image: getAssetUrl(s3Assets.सरजImg),
        audio: getAssetAudioUrl(s3Assets.सरजAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सरजAudio),
      },
    ],
  },
  {
    letter: "झ",
    items: [
      {
        id: 38,
        title: "Letter",
        letter: "झ",
        word: "झरना",
        image: getAssetUrl(s3Assets.झरनImg),
        audio: getAssetAudioUrl(s3Assets.झरनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.झरनAudio),
      },
    ],
  },
  {
    letter: "ञ",
    items: [
      {
        id: 108,
        title: "Letter",
        letter: "ञ",
        word: "रंजन",
        image: getAssetUrl(s3Assets.ञImg),
        audio: getAssetAudioUrl(s3Assets.ञAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ञAudio),
      },
    ],
  },
  {
    letter: "ट",
    items: [
      {
        id: 39,
        title: "Letter",
        letter: "ट",
        word: "टमाटर",
        image: getAssetUrl(s3Assets.टमटरImg),
        audio: getAssetAudioUrl(s3Assets.टमटरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.टमटरAudio),
      },
      {
        id: 40,
        title: "Letter",
        letter: "ट",
        word: "मटर",
        image: getAssetUrl(s3Assets.मटरImg),
        audio: getAssetAudioUrl(s3Assets.मटरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मटरAudio),
      },
      {
        id: 41,
        title: "Letter",
        letter: "ट",
        word: "ऊँट",
        image: getAssetUrl(s3Assets.ऊटImg),
        audio: getAssetAudioUrl(s3Assets.ऊटAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ऊटAudio),
      },
    ],
  },
  {
    letter: "ठ",
    items: [
      {
        id: 42,
        title: "Letter",
        letter: "ठ",
        word: "ठठेरा",
        image: getAssetUrl(s3Assets.ठठरImg),
        audio: getAssetAudioUrl(s3Assets.ठठरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ठठरAudio),
      },
      {
        id: 43,
        title: "Letter",
        letter: "ठ",
        word: "गुठली",
        image: getAssetUrl(s3Assets.गठलImg),
        audio: getAssetAudioUrl(s3Assets.गठलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गठलAudio),
      },
      {
        id: 44,
        title: "Letter",
        letter: "ठ",
        word: "आठ",
        image: getAssetUrl(s3Assets.आठImg),
        audio: getAssetAudioUrl(s3Assets.आठAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आठAudio),
      },
    ],
  },
  {
    letter: "ड",
    items: [
      {
        id: 45,
        title: "Letter",
        letter: "ड",
        word: "डमरू",
        image: getAssetUrl(s3Assets.डमरImg),
        audio: getAssetAudioUrl(s3Assets.डमरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.डमरAudio),
      },
      {
        id: 46,
        title: "Letter",
        letter: "ड",
        word: "पेड़",
        image: getAssetUrl(s3Assets.पडImg),
        audio: getAssetAudioUrl(s3Assets.पडAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पडAudio),
      },
    ],
  },
  {
    letter: "ढ",
    items: [
      {
        id: 47,
        title: "Letter",
        letter: "ढ",
        word: "ढक्कन",
        image: getAssetUrl(s3Assets.ढक्कनImg),
        audio: getAssetAudioUrl(s3Assets.ढढक्कनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ढढक्कनAudio),
      },
      {
        id: 48,
        title: "Letter",
        letter: "ढ",
        word: "मेंढक",
        image: getAssetUrl(s3Assets.मढकImg),
        audio: getAssetAudioUrl(s3Assets.मढकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.मढकAudio),
      },
    ],
  },
  {
    letter: "ण",
    items: [
      {
        id: 49,
        title: "Letter",
        letter: "ण",
        word: "लवण",
        image: getAssetUrl(s3Assets.लवणImg),
        audio: getAssetAudioUrl(s3Assets.लवणAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लवणAudio),
      },
    ],
  },
  {
    letter: "त",
    items: [
      {
        id: 50,
        title: "Letter",
        letter: "त",
        word: "तट",
        image: getAssetUrl(s3Assets.तटImg),
        audio: getAssetAudioUrl(s3Assets.तटAudio),
        singleAudio: getAssetAudioUrl(s3Assets.तटAudio),
      },
      {
        id: 51,
        title: "Letter",
        letter: "त",
        word: "सुतली",
        image: getAssetUrl(s3Assets.सतलImg),
        audio: getAssetAudioUrl(s3Assets.सतलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सतलAudio),
      },
      {
        id: 52,
        title: "Letter",
        letter: "त",
        word: "रात",
        image: getAssetUrl(s3Assets.रतImg),
        audio: getAssetAudioUrl(s3Assets.रतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.रतAudio),
      },
    ],
  },
  {
    letter: "थ",
    items: [
      {
        id: 53,
        title: "Letter",
        letter: "थ",
        word: "थक",
        image: getAssetUrl(s3Assets.थकImg),
        audio: getAssetAudioUrl(s3Assets.थकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.थकAudio),
      },
      {
        id: 54,
        title: "Letter",
        letter: "थ",
        word: "हाथ",
        image: getAssetUrl(s3Assets.हथImg),
        audio: getAssetAudioUrl(s3Assets.हथAudio),
        singleAudio: getAssetAudioUrl(s3Assets.हथAudio),
      },
    ],
  },
  {
    letter: "द",
    items: [
      {
        id: 55,
        title: "Letter",
        letter: "द",
        word: "दरवाजा",
        image: getAssetUrl(s3Assets.दरवजImg),
        audio: getAssetAudioUrl(s3Assets.दरवजAudio),
        singleAudio: getAssetAudioUrl(s3Assets.दरवजAudio),
      },
      {
        id: 56,
        title: "Letter",
        letter: "द",
        word: "बादल",
        image: getAssetUrl(s3Assets.बदलImg),
        audio: getAssetAudioUrl(s3Assets.बदलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बदलAudio),
      },
      {
        id: 57,
        title: "Letter",
        letter: "द",
        word: "आनंद",
        image: getAssetUrl(s3Assets.आनदImg),
        audio: getAssetAudioUrl(s3Assets.आनदAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आनदAudio),
      },
    ],
  },
  {
    letter: "ध",
    items: [
      {
        id: 58,
        title: "Letter",
        letter: "ध",
        word: "धनुष",
        image: getAssetUrl(s3Assets.धनषImg),
        audio: getAssetAudioUrl(s3Assets.धनषAudio),
        singleAudio: getAssetAudioUrl(s3Assets.धनषAudio),
      },
      {
        id: 59,
        title: "Letter",
        letter: "ध",
        word: "इधर",
        image: getAssetUrl(s3Assets.इधरImg),
        audio: getAssetAudioUrl(s3Assets.इधरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.इधरAudio),
      },
      {
        id: 60,
        title: "Letter",
        letter: "ध",
        word: "दूध",
        image: getAssetUrl(s3Assets.दधImg),
        audio: getAssetAudioUrl(s3Assets.दधAudio),
        singleAudio: getAssetAudioUrl(s3Assets.दधAudio),
      },
    ],
  },
  {
    letter: "न",
    items: [
      {
        id: 61,
        title: "Letter",
        letter: "न",
        word: "नल",
        image: getAssetUrl(s3Assets.नलImg),
        audio: getAssetAudioUrl(s3Assets.नलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नलAudio),
      },
      {
        id: 62,
        title: "Letter",
        letter: "न",
        word: "जानवर",
        image: getAssetUrl(s3Assets.जनवरImg),
        audio: getAssetAudioUrl(s3Assets.जनवरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जनवरAudio),
      },
      {
        id: 63,
        title: "Letter",
        letter: "न",
        word: "बहन",
        image: getAssetUrl(s3Assets.बहनImg),
        audio: getAssetAudioUrl(s3Assets.बहनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बहनAudio),
      },
    ],
  },
  {
    letter: "प",
    items: [
      {
        id: 64,
        title: "Letter",
        letter: "प",
        word: "पतंग",
        image: getAssetUrl(s3Assets.पतगImg),
        audio: getAssetAudioUrl(s3Assets.पतगAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पतगAudio),
      },
      {
        id: 65,
        title: "Letter",
        letter: "प",
        word: "कपड़े",
        image: getAssetUrl(s3Assets.कपडImg),
        audio: getAssetAudioUrl(s3Assets.कपडAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कपडAudio),
      },
      {
        id: 66,
        title: "Letter",
        letter: "प",
        word: "साँप",
        image: getAssetUrl(s3Assets.सपImg),
        audio: getAssetAudioUrl(s3Assets.सपAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सपAudio),
      },
    ],
  },
  {
    letter: "फ",
    items: [
      {
        id: 67,
        title: "Letter",
        letter: "फ",
        word: "फल",
        image: getAssetUrl(s3Assets.फलImg),
        audio: getAssetAudioUrl(s3Assets.फलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.फलAudio),
      },
      {
        id: 68,
        title: "Letter",
        letter: "फ",
        word: "सफल",
        image: getAssetUrl(s3Assets.सफलImg),
        audio: getAssetAudioUrl(s3Assets.सफलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सफलAudio),
      },
    ],
  },
  {
    letter: "ब",
    items: [
      {
        id: 69,
        title: "Letter",
        letter: "ब",
        word: "बत्तख",
        image: getAssetUrl(s3Assets.बतखImg),
        audio: getAssetAudioUrl(s3Assets.बतखAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बतखAudio),
      },
      {
        id: 70,
        title: "Letter",
        letter: "ब",
        word: "सुबह",
        image: getAssetUrl(s3Assets.सबहImg),
        audio: getAssetAudioUrl(s3Assets.सबहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सबहAudio),
      },
      {
        id: 71,
        title: "Letter",
        letter: "ब",
        word: "सेब",
        image: getAssetUrl(s3Assets.सबImg),
        audio: getAssetAudioUrl(s3Assets.सबAudio),
        singleAudio: getAssetAudioUrl(s3Assets.सबAudio),
      },
    ],
  },
  {
    letter: "भ",
    items: [
      {
        id: 72,
        title: "Letter",
        letter: "भ",
        word: "भय",
        image: getAssetUrl(s3Assets.भयImg),
        audio: getAssetAudioUrl(s3Assets.भयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भयAudio),
      },
      {
        id: 73,
        title: "Letter",
        letter: "भ",
        word: "अभय",
        image: getAssetUrl(s3Assets.अभयImg),
        audio: getAssetAudioUrl(s3Assets.अभयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अभयAudio),
      },
      {
        id: 74,
        title: "Letter",
        letter: "भ",
        word: "नभ",
        image: getAssetUrl(s3Assets.नभImg),
        audio: getAssetAudioUrl(s3Assets.नभAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नभAudio),
      },
    ],
  },
  {
    letter: "म",
    items: [
      {
        id: 75,
        title: "Letter",
        letter: "म",
        word: "मछली",
        image: getAssetUrl(s3Assets.मछल2Img),
        audio: getAssetAudioUrl(s3Assets.मछल2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.मछल2Audio),
      },
      {
        id: 76,
        title: "Letter",
        letter: "म",
        word: "गमला",
        image: getAssetUrl(s3Assets.गमलImg),
        audio: getAssetAudioUrl(s3Assets.गमलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गमलAudio),
      },
      {
        id: 77,
        title: "Letter",
        letter: "म",
        word: "कदम",
        image: getAssetUrl(s3Assets.कदमImg),
        audio: getAssetAudioUrl(s3Assets.कदमAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कदमAudio),
      },
    ],
  },
  {
    letter: "य",
    items: [
      {
        id: 78,
        title: "Letter",
        letter: "य",
        word: "यह",
        image: getAssetUrl(s3Assets.यहImg),
        audio: getAssetAudioUrl(s3Assets.यहAudio),
        singleAudio: getAssetAudioUrl(s3Assets.यहAudio),
      },
      {
        id: 79,
        title: "Letter",
        letter: "य",
        word: "पायल",
        image: getAssetUrl(s3Assets.पयलImg),
        audio: getAssetAudioUrl(s3Assets.पयलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.पयलAudio),
      },
      {
        id: 80,
        title: "Letter",
        letter: "य",
        word: "गाय",
        image: getAssetUrl(s3Assets.गयImg),
        audio: getAssetAudioUrl(s3Assets.गयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.गयAudio),
      },
    ],
  },
  {
    letter: "र",
    items: [
      {
        id: 81,
        title: "Letter",
        letter: "र",
        word: "रथ",
        image: getAssetUrl(s3Assets.रथImg),
        audio: getAssetAudioUrl(s3Assets.रथAudio),
        singleAudio: getAssetAudioUrl(s3Assets.रथAudio),
      },
      {
        id: 82,
        title: "Letter",
        letter: "र",
        word: "भारत",
        image: getAssetUrl(s3Assets.भरतImg),
        audio: getAssetAudioUrl(s3Assets.भरतAudio),
        singleAudio: getAssetAudioUrl(s3Assets.भरतAudio),
      },
      {
        id: 83,
        title: "Letter",
        letter: "र",
        word: "चार",
        image: getAssetUrl(s3Assets.चरImg),
        audio: getAssetAudioUrl(s3Assets.चरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चरAudio),
      },
    ],
  },
  {
    letter: "ल",
    items: [
      {
        id: 84,
        title: "Letter",
        letter: "ल",
        word: "लड़का",
        image: getAssetUrl(s3Assets.लडकImg),
        audio: getAssetAudioUrl(s3Assets.लडकAudio),
        singleAudio: getAssetAudioUrl(s3Assets.लडकAudio),
      },
      {
        id: 85,
        title: "Letter",
        letter: "ल",
        word: "चलना",
        image: getAssetUrl(s3Assets.चलनImg),
        audio: getAssetAudioUrl(s3Assets.चलनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चलनAudio),
      },
      {
        id: 86,
        title: "Letter",
        letter: "ल",
        word: "बाल",
        image: getAssetUrl(s3Assets.बलImg),
        audio: getAssetAudioUrl(s3Assets.बलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बलAudio),
      },
    ],
  },
  {
    letter: "व",
    items: [
      {
        id: 87,
        title: "Letter",
        letter: "व",
        word: "वन",
        image: getAssetUrl(s3Assets.वनImg),
        audio: getAssetAudioUrl(s3Assets.वनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.वनAudio),
      },
      {
        id: 88,
        title: "Letter",
        letter: "व",
        word: "चावल",
        image: getAssetUrl(s3Assets.चवलImg),
        audio: getAssetAudioUrl(s3Assets.चवलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चवलAudio),
      },
      {
        id: 89,
        title: "Letter",
        letter: "व",
        word: "नाव",
        image: getAssetUrl(s3Assets.नवImg),
        audio: getAssetAudioUrl(s3Assets.नवAudio),
        singleAudio: getAssetAudioUrl(s3Assets.नवAudio),
      },
    ],
  },
  {
    letter: "श",
    items: [
      {
        id: 90,
        title: "Letter",
        letter: "श",
        word: "शहर",
        image: getAssetUrl(s3Assets.शहरImg),
        audio: getAssetAudioUrl(s3Assets.शहरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.शहरAudio),
      },
      {
        id: 91,
        title: "Letter",
        letter: "श",
        word: "बारिश",
        image: getAssetUrl(s3Assets.बरशImg),
        audio: getAssetAudioUrl(s3Assets.बरशAudio),
        singleAudio: getAssetAudioUrl(s3Assets.बरशAudio),
      },
    ],
  },
  {
    letter: "ष",
    items: [
      {
        id: 92,
        title: "Letter",
        letter: "ष",
        word: "षट्कोण",
        image: getAssetUrl(s3Assets.षटकणImg),
        audio: getAssetAudioUrl(s3Assets.षटकणAudio),
        singleAudio: getAssetAudioUrl(s3Assets.षटकणAudio),
      },
      {
        id: 93,
        title: "Letter",
        letter: "ष",
        word: "विषय",
        image: getAssetUrl(s3Assets.वषयImg),
        audio: getAssetAudioUrl(s3Assets.वषयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.वषयAudio),
      },
      {
        id: 94,
        title: "Letter",
        letter: "ष",
        word: "धनुष",
        image: getAssetUrl(s3Assets.धनष2Img),
        audio: getAssetAudioUrl(s3Assets.धनष2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.धनष2Audio),
      },
    ],
  },
  {
    letter: "स",
    items: [
      {
        id: 95,
        title: "Letter",
        letter: "स",
        word: "समय",
        image: getAssetUrl(s3Assets.समयImg),
        audio: getAssetAudioUrl(s3Assets.समयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.समयAudio),
      },
      {
        id: 96,
        title: "Letter",
        letter: "स",
        word: "आसमान",
        image: getAssetUrl(s3Assets.आसमनImg),
        audio: getAssetAudioUrl(s3Assets.आसमनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.आसमनAudio),
      },
      {
        id: 97,
        title: "Letter",
        letter: "स",
        word: "घास",
        image: getAssetUrl(s3Assets.घसImg),
        audio: getAssetAudioUrl(s3Assets.घसAudio),
        singleAudio: getAssetAudioUrl(s3Assets.घसAudio),
      },
    ],
  },
  {
    letter: "ह",
    items: [
      {
        id: 98,
        title: "Letter",
        letter: "ह",
        word: "हवा",
        image: getAssetUrl(s3Assets.हवImg),
        audio: getAssetAudioUrl(s3Assets.हवAudio),
        singleAudio: getAssetAudioUrl(s3Assets.हवAudio),
      },
      {
        id: 99,
        title: "Letter",
        letter: "ह",
        word: "महल",
        image: getAssetUrl(s3Assets.महलImg),
        audio: getAssetAudioUrl(s3Assets.महलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.महलAudio),
      },
      {
        id: 100,
        title: "Letter",
        letter: "ह",
        word: "सुबह",
        image: getAssetUrl(s3Assets.सबह2Img),
        audio: getAssetAudioUrl(s3Assets.सबह2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.सबह2Audio),
      },
    ],
  },
  {
    letter: "क्ष",
    items: [
      {
        id: 101,
        title: "Letter",
        letter: "क्ष",
        word: "क्षत्रिय",
        image: getAssetUrl(s3Assets.कषतरयImg),
        audio: getAssetAudioUrl(s3Assets.कषतरयAudio),
        singleAudio: getAssetAudioUrl(s3Assets.कषतरयAudio),
      },
      {
        id: 102,
        title: "Letter",
        letter: "क्ष",
        word: "अक्षर",
        image: getAssetUrl(s3Assets.अकषरImg),
        audio: getAssetAudioUrl(s3Assets.अकषरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.अकषरAudio),
      },
    ],
  },
  {
    letter: "त्र",
    items: [
      {
        id: 103,
        title: "Letter",
        letter: "त्र",
        word: "त्रिशूल",
        image: getAssetUrl(s3Assets.तरशलImg),
        audio: getAssetAudioUrl(s3Assets.तरशलAudio),
        singleAudio: getAssetAudioUrl(s3Assets.तरशलAudio),
      },
      {
        id: 104,
        title: "Letter",
        letter: "त्र",
        word: "चित्र",
        image: getAssetUrl(s3Assets.चतरImg),
        audio: getAssetAudioUrl(s3Assets.चतरAudio),
        singleAudio: getAssetAudioUrl(s3Assets.चतरAudio),
      },
    ],
  },
  {
    letter: "ज्ञ",
    items: [
      {
        id: 105,
        title: "Letter",
        letter: "ज्ञ",
        word: "ज्ञानी",
        image: getAssetUrl(s3Assets.जञनImg),
        audio: getAssetAudioUrl(s3Assets.जञनAudio),
        singleAudio: getAssetAudioUrl(s3Assets.जञनAudio),
      },
    ],
  },
];

export const dataTe = [
  {
    letter: "త",
    items: [
      {
        id: 1,
        title: "Letter",
        letter: "త",
        word: "తబల",
        image: getAssetUrl(s3Assets.తబలImg),
        audio: getAssetAudioUrl(s3Assets.తతబలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తతబలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.తతబలAudio),
      },
      {
        id: 2,
        title: "Letter",
        letter: "త",
        word: "జాతర",
        image: getAssetUrl(s3Assets.జతరImg),
        audio: getAssetAudioUrl(s3Assets.జతరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జతరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.తజాతరAudio),
      },
      {
        id: 3,
        title: "Letter",
        letter: "త",
        word: "ఈత",
        image: getAssetUrl(s3Assets.ఈతImg),
        audio: getAssetAudioUrl(s3Assets.ఈతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఈతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.తఈతAudio),
      },
    ],
  },
  {
    letter: "బ",
    items: [
      {
        id: 4,
        title: "Letter",
        letter: "బ",
        word: "బంతి",
        image: getAssetUrl(s3Assets.బతImg),
        audio: getAssetAudioUrl(s3Assets.బబంతిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బబంతిAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.బబంతిAudio),
      },
      {
        id: 5,
        title: "Letter",
        letter: "బ",
        word: "తబల",
        image: getAssetUrl(s3Assets.తబల2Img),
        audio: getAssetAudioUrl(s3Assets.తబల2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.తబల2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.బతబలAudio),
      },
      {
        id: 6,
        title: "Letter",
        letter: "బ",
        word: "లబలబ",
        image: getAssetUrl(s3Assets.లబలబImg),
        audio: getAssetAudioUrl(s3Assets.లబలబAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లబలబAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.బలబలబAudio),
      },
    ],
  },
  {
    letter: "ల",
    items: [
      {
        id: 7,
        title: "Letter",
        letter: "ల",
        word: "లత",
        image: getAssetUrl(s3Assets.లతImg),
        audio: getAssetAudioUrl(s3Assets.లలతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లలతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.లలతAudio),
      },
      {
        id: 8,
        title: "Letter",
        letter: "ల",
        word: "బలపం",
        image: getAssetUrl(s3Assets.బలపImg),
        audio: getAssetAudioUrl(s3Assets.బలపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బలపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.లబలపంAudio),
      },
      {
        id: 9,
        title: "Letter",
        letter: "ల",
        word: "వెల",
        image: getAssetUrl(s3Assets.వలImg),
        audio: getAssetAudioUrl(s3Assets.వలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.లవెలAudio),
      },
    ],
  },
  {
    letter: "క",
    items: [
      {
        id: 10,
        title: "Letter",
        letter: "క",
        word: "కంజర",
        image: getAssetUrl(s3Assets.కజరImg),
        audio: getAssetAudioUrl(s3Assets.కకంజరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కకంజరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.కకంజరAudio),
      },
      {
        id: 11,
        title: "Letter",
        letter: "క",
        word: "ఆకలి",
        image: getAssetUrl(s3Assets.ఆకలImg),
        audio: getAssetAudioUrl(s3Assets.ఆకలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఆకలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.కఆకలిAudio),
      },
      {
        id: 12,
        title: "Letter",
        letter: "క",
        word: "చిలుక",
        image: getAssetUrl(s3Assets.చలకImg),
        audio: getAssetAudioUrl(s3Assets.చలకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చలకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.కచిలుకAudio),
      },
    ],
  },
  {
    letter: "జ",
    items: [
      {
        id: 13,
        title: "Letter",
        letter: "జ",
        word: "జడ",
        image: getAssetUrl(s3Assets.జడImg),
        audio: getAssetAudioUrl(s3Assets.జజడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జజడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.జజడAudio),
      },
      {
        id: 14,
        title: "Letter",
        letter: "జ",
        word: "కంజర",
        image: getAssetUrl(s3Assets.కజర2Img),
        audio: getAssetAudioUrl(s3Assets.కజర2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.కజర2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.జకంజరAudio),
      },
      {
        id: 15,
        title: "Letter",
        letter: "జ",
        word: "జలజ",
        image: getAssetUrl(s3Assets.జలజImg),
        audio: getAssetAudioUrl(s3Assets.జజలజAudio),
        singleAudio: getAssetAudioUrl(s3Assets.జజలజAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.జజలజAudio),
      },
    ],
  },
  {
    letter: "ర",
    items: [
      {
        id: 16,
        title: "Letter",
        letter: "ర",
        word: "రవి",
        image: getAssetUrl(s3Assets.రవImg),
        audio: getAssetAudioUrl(s3Assets.రరవిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రరవిAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.రరవిAudio),
      },
      {
        id: 17,
        title: "Letter",
        letter: "ర",
        word: "గిరక",
        image: getAssetUrl(s3Assets.గరకImg),
        audio: getAssetAudioUrl(s3Assets.గరకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గరకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.రగిరకAudio),
      },
      {
        id: 18,
        title: "Letter",
        letter: "ర",
        word: "చీర",
        image: getAssetUrl(s3Assets.చరImg),
        audio: getAssetAudioUrl(s3Assets.చరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.రచీరAudio),
      },
    ],
  },
  {
    letter: "ఆ",
    items: [
      {
        id: 19,
        title: "Letter",
        letter: "ఆ",
        word: "ఆట",
        image: getAssetUrl(s3Assets.ఆటImg),
        audio: getAssetAudioUrl(s3Assets.ఆఆటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఆఆటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఆఆటAudio),
      },
    ],
  },
  {
    letter: "ట",
    items: [
      {
        id: 20,
        title: "Letter",
        letter: "ట",
        word: "టమాట",
        image: getAssetUrl(s3Assets.టమటImg),
        audio: getAssetAudioUrl(s3Assets.టటమాటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.టటమాటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.టటమాటAudio),
      },
      {
        id: 21,
        title: "Letter",
        letter: "ట",
        word: "నాటకం",
        image: getAssetUrl(s3Assets.నటకImg),
        audio: getAssetAudioUrl(s3Assets.నటకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నటకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.టనాటకంAudio),
      },
      {
        id: 22,
        title: "Letter",
        letter: "ట",
        word: "తోట",
        image: getAssetUrl(s3Assets.తటImg),
        audio: getAssetAudioUrl(s3Assets.తటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.టతోటAudio),
      },
    ],
  },
  {
    letter: "ఉ",
    items: [
      {
        id: 23,
        title: "Letter",
        letter: "ఉ",
        word: "ఉంగరం",
        image: getAssetUrl(s3Assets.ఉగరImg),
        audio: getAssetAudioUrl(s3Assets.ఉఉంగరంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉఉంగరంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఉఉంగరంAudio),
      },
    ],
  },
  {
    letter: "గ",
    items: [
      {
        id: 24,
        title: "Letter",
        letter: "గ",
        word: "గద",
        image: getAssetUrl(s3Assets.గదImg),
        audio: getAssetAudioUrl(s3Assets.గగదAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గగదAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గగదAudio),
      },
      {
        id: 25,
        title: "Letter",
        letter: "గ",
        word: "ఉంగరం",
        image: getAssetUrl(s3Assets.ఉగర2Img),
        audio: getAssetAudioUrl(s3Assets.ఉగర2Audio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉగర2Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గఉంగరంAudio),
      },
      {
        id: 26,
        title: "Letter",
        letter: "గ",
        word: "పండుగ",
        image: getAssetUrl(s3Assets.పడగImg),
        audio: getAssetAudioUrl(s3Assets.పడగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పడగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గపండుగAudio),
      },
    ],
  },
  {
    letter: "శ",
    items: [
      {
        id: 27,
        title: "Letter",
        letter: "శ",
        word: "శనగ",
        image: getAssetUrl(s3Assets.శనగImg),
        audio: getAssetAudioUrl(s3Assets.శశనగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.శశనగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.శశనగAudio),
      },
      {
        id: 28,
        title: "Letter",
        letter: "శ",
        word: "దశమి",
        image: getAssetUrl(s3Assets.దశమImg),
        audio: getAssetAudioUrl(s3Assets.దశమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దశమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.శదశమిAudio),
      },
      {
        id: 29,
        title: "Letter",
        letter: "శ",
        word: "దిశ",
        image: getAssetUrl(s3Assets.దశImg),
        audio: getAssetAudioUrl(s3Assets.దశAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దశAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.శదిశAudio),
      },
    ],
  },
  {
    letter: "అ",
    items: [
      {
        id: 30,
        title: "Letter",
        letter: "అ",
        word: "అనప",
        image: getAssetUrl(s3Assets.అనపImg),
        audio: getAssetAudioUrl(s3Assets.అఅనపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అఅనపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.అఅనపAudio),
      },
    ],
  },
  {
    letter: "ప",
    items: [
      {
        id: 31,
        title: "Letter",
        letter: "ప",
        word: "పంట",
        image: getAssetUrl(s3Assets.పటImg),
        audio: getAssetAudioUrl(s3Assets.పపంటAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పపంటAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.పపంటAudio),
      },
      {
        id: 32,
        title: "Letter",
        letter: "ప",
        word: "చేపలు",
        image: getAssetUrl(s3Assets.చపలImg),
        audio: getAssetAudioUrl(s3Assets.చపలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చపలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.పచేపలుAudio),
      },
      {
        id: 33,
        title: "Letter",
        letter: "ప",
        word: "గంప",
        image: getAssetUrl(s3Assets.గంపImg),
        audio: getAssetAudioUrl(s3Assets.గంపAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గంపAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.గంపAudio),
      },
    ],
  },
  {
    letter: "స",
    items: [
      {
        id: 34,
        title: "Letter",
        letter: "స",
        word: "సవరం",
        image: getAssetUrl(s3Assets.సవరImg),
        audio: getAssetAudioUrl(s3Assets.ససవరంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ససవరంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ససవరంAudio),
      },
      {
        id: 35,
        title: "Letter",
        letter: "స",
        word: "దసరా",
        image: getAssetUrl(s3Assets.దసరImg),
        audio: getAssetAudioUrl(s3Assets.దసరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దసరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.సదసరాAudio),
      },
      {
        id: 36,
        title: "Letter",
        letter: "స",
        word: "పనస",
        image: getAssetUrl(s3Assets.పనసImg),
        audio: getAssetAudioUrl(s3Assets.పనసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పనసAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.సపనసAudio),
      },
    ],
  },
  {
    letter: "వ",
    items: [
      {
        id: 37,
        title: "Letter",
        letter: "వ",
        word: "వల",
        image: getAssetUrl(s3Assets.వల2Img),
        audio: getAssetAudioUrl(s3Assets.వవలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వవలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వవలAudio),
      },
      {
        id: 38,
        title: "Letter",
        letter: "వ",
        word: "లవణం",
        image: getAssetUrl(s3Assets.లవణImg),
        audio: getAssetAudioUrl(s3Assets.లవణAudio),
        singleAudio: getAssetAudioUrl(s3Assets.లవణAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వలవణంAudio),
      },
      {
        id: 39,
        title: "Letter",
        letter: "వ",
        word: "పడవ",
        image: getAssetUrl(s3Assets.పడవImg),
        audio: getAssetAudioUrl(s3Assets.పడవAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పడవAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వపడవAudio),
      },
    ],
  },
  {
    letter: "ఊ",
    items: [
      {
        id: 40,
        title: "Letter",
        letter: "ఊ",
        word: "ఊయల",
        image: getAssetUrl(s3Assets.ఊయలImg),
        audio: getAssetAudioUrl(s3Assets.ఊఊయలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఊఊయలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఊఊయలAudio),
      },
    ],
  },
  {
    letter: "డ",
    items: [
      {
        id: 41,
        title: "Letter",
        letter: "డ",
        word: "డబ్బా",
        image: getAssetUrl(s3Assets.డబబImg),
        audio: getAssetAudioUrl(s3Assets.డడబ్బాAudio),
        singleAudio: getAssetAudioUrl(s3Assets.డడబ్బాAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.డడబ్బాAudio),
      },
      {
        id: 42,
        title: "Letter",
        letter: "డ",
        word: "అడవి",
        image: getAssetUrl(s3Assets.అడవImg),
        audio: getAssetAudioUrl(s3Assets.అడవAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అడవAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.డఅడవిAudio),
      },
      {
        id: 43,
        title: "Letter",
        letter: "డ",
        word: "బండ",
        image: getAssetUrl(s3Assets.బడImg),
        audio: getAssetAudioUrl(s3Assets.బడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.డబండAudio),
      },
    ],
  },
  {
    letter: "ద",
    items: [
      {
        id: 44,
        title: "Letter",
        letter: "ద",
        word: "దండ",
        image: getAssetUrl(s3Assets.దడImg),
        audio: getAssetAudioUrl(s3Assets.దదండAudio),
        singleAudio: getAssetAudioUrl(s3Assets.దదండAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.దదండAudio),
      },
      {
        id: 45,
        title: "Letter",
        letter: "ద",
        word: "ఉదయం",
        image: getAssetUrl(s3Assets.ఉదయImg),
        audio: getAssetAudioUrl(s3Assets.ఉదయAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉదయAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.దఉదయంAudio),
      },
      {
        id: 46,
        title: "Letter",
        letter: "ద",
        word: "వంద",
        image: getAssetUrl(s3Assets.వందImg),
        audio: getAssetAudioUrl(s3Assets.వందAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వందAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.వందAudio),
      },
    ],
  },
  {
    letter: "ఈ",
    items: [
      {
        id: 47,
        title: "Letter",
        letter: "ఈ",
        word: "ఈత",
        image: getAssetUrl(s3Assets.ఈత2Img),
        audio: getAssetAudioUrl(s3Assets.ఈఈతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఈఈతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఈఈతAudio),
      },
    ],
  },
  {
    letter: "మ",
    items: [
      {
        id: 48,
        title: "Letter",
        letter: "మ",
        word: "మర",
        image: getAssetUrl(s3Assets.మరImg),
        audio: getAssetAudioUrl(s3Assets.మమరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మమరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.మమరAudio),
      },
      {
        id: 49,
        title: "Letter",
        letter: "మ",
        word: "నెమలి",
        image: getAssetUrl(s3Assets.నమలImg),
        audio: getAssetAudioUrl(s3Assets.నమలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.నమలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.మనెమలిAudio),
      },
      {
        id: 50,
        title: "Letter",
        letter: "మ",
        word: "చీమ",
        image: getAssetUrl(s3Assets.చమImg),
        audio: getAssetAudioUrl(s3Assets.చమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.మచీమAudio),
      },
    ],
  },
  {
    letter: "చ",
    items: [
      {
        id: 51,
        title: "Letter",
        letter: "చ",
        word: "చరక",
        image: getAssetUrl(s3Assets.చరకImg),
        audio: getAssetAudioUrl(s3Assets.చచరకాAudio),
        singleAudio: getAssetAudioUrl(s3Assets.చచరకాAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.చచరకాAudio),
      },
      {
        id: 52,
        title: "Letter",
        letter: "చ",
        word: "రచన",
        image: getAssetUrl(s3Assets.రచనImg),
        audio: getAssetAudioUrl(s3Assets.రచనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రచనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.చరచనAudio),
      },
      {
        id: 53,
        title: "Letter",
        letter: "చ",
        word: "కిచకిచ",
        image: getAssetUrl(s3Assets.కచకచImg),
        audio: getAssetAudioUrl(s3Assets.కచకచAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కచకచAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.చకిచకిచAudio),
      },
    ],
  },
  {
    letter: "ఒ",
    items: [
      {
        id: 54,
        title: "Letter",
        letter: "ఒ",
        word: "ఒక",
        image: getAssetUrl(s3Assets.ఒకImg),
        audio: getAssetAudioUrl(s3Assets.ఒఒకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఒఒకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఒఒకAudio),
      },
    ],
  },
  {
    letter: "ఓ",
    items: [
      {
        id: 55,
        title: "Letter",
        letter: "ఓ",
        word: "ఓడ",
        image: getAssetUrl(s3Assets.ఓడImg),
        audio: getAssetAudioUrl(s3Assets.ఓఓడAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఓఓడAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఓఓడAudio),
      },
    ],
  },
  {
    letter: "ఔ",
    items: [
      {
        id: 56,
        title: "Letter",
        letter: "ఔ",
        word: "ఔటు",
        image: getAssetUrl(s3Assets.ఔటImg),
        audio: getAssetAudioUrl(s3Assets.ఔఔటుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఔఔటుAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఔఔటుAudio),
      },
    ],
  },
  {
    letter: "య",
    items: [
      {
        id: 57,
        title: "Letter",
        letter: "య",
        word: "యమ",
        image: getAssetUrl(s3Assets.యమImg),
        audio: getAssetAudioUrl(s3Assets.యయమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.యయమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.యయమAudio),
      },
      {
        id: 58,
        title: "Letter",
        letter: "య",
        word: "కాయలు",
        image: getAssetUrl(s3Assets.కయలImg),
        audio: getAssetAudioUrl(s3Assets.కయలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కయలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.యకాయలుAudio),
      },
      {
        id: 59,
        title: "Letter",
        letter: "య",
        word: "వంకాయ",
        image: getAssetUrl(s3Assets.వకయImg),
        audio: getAssetAudioUrl(s3Assets.వకయAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వకయAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.యవంకాయAudio),
      },
    ],
  },
  {
    letter: "ఇ",
    items: [
      {
        id: 60,
        title: "Letter",
        letter: "ఇ",
        word: "ఇటుక",
        image: getAssetUrl(s3Assets.ఇటకImg),
        audio: getAssetAudioUrl(s3Assets.ఇఇటుకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఇఇటుకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఇఇటుకAudio),
      },
    ],
  },
  {
    letter: "ఎ",
    items: [
      {
        id: 61,
        title: "Letter",
        letter: "ఎ",
        word: "ఎలుక",
        image: getAssetUrl(s3Assets.ఎలకImg),
        audio: getAssetAudioUrl(s3Assets.ఎఎలుకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఎఎలుకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఎఎలుకAudio),
      },
    ],
  },
  {
    letter: "ఏ",
    items: [
      {
        id: 62,
        title: "Letter",
        letter: "ఏ",
        word: "ఏనుగు",
        image: getAssetUrl(s3Assets.ఏనగImg),
        audio: getAssetAudioUrl(s3Assets.ఏఏనుగుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఏఏనుగుAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఏఏనుగుAudio),
      },
    ],
  },
  {
    letter: "ఐ",
    items: [
      {
        id: 63,
        title: "Letter",
        letter: "ఐ",
        word: "ఐదు",
        image: getAssetUrl(s3Assets.ఐదImg),
        audio: getAssetAudioUrl(s3Assets.ఐఐదుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఐఐదుAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఐఐదుAudio),
      },
    ],
  },
  {
    letter: "ణ",
    items: [
      {
        id: 64,
        title: "Letter",
        letter: "ణ",
        word: "గణపతి",
        image: getAssetUrl(s3Assets.గణపతImg),
        audio: getAssetAudioUrl(s3Assets.గణపతAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గణపతAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ణగణపతిAudio),
      },
      {
        id: 65,
        title: "Letter",
        letter: "ణ",
        word: "వీణ",
        image: getAssetUrl(s3Assets.వణImg),
        audio: getAssetAudioUrl(s3Assets.వీణSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వీణSingleAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ణవీణAudio),
      },
    ],
  },
  {
    letter: "ళ",
    items: [
      {
        id: 66,
        title: "Letter",
        letter: "ళ",
        word: "తాళం",
        image: getAssetUrl(s3Assets.తళImg),
        audio: getAssetAudioUrl(s3Assets.తాళంSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.తాళంSingleAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ళతాళంAudio),
      },
      {
        id: 67,
        title: "Letter",
        letter: "ళ",
        word: "కళ",
        image: getAssetUrl(s3Assets.కళImg),
        audio: getAssetAudioUrl(s3Assets.కళAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కళAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ళకళAudio),
      },
    ],
  },
  {
    letter: "హ",
    items: [
      {
        id: 68,
        title: "Letter",
        letter: "హ",
        word: "హంస",
        image: getAssetUrl(s3Assets.హసImg),
        audio: getAssetAudioUrl(s3Assets.హహంసAudio),
        singleAudio: getAssetAudioUrl(s3Assets.హహంసAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.హహంసAudio),
      },
      {
        id: 69,
        title: "Letter",
        letter: "హ",
        word: "వాహనం",
        image: getAssetUrl(s3Assets.వహనImg),
        audio: getAssetAudioUrl(s3Assets.వహనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వహనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.హవాహనంAudio),
      },
      {
        id: 70,
        title: "Letter",
        letter: "హ",
        word: "గుహ",
        image: getAssetUrl(s3Assets.గహImg),
        audio: getAssetAudioUrl(s3Assets.గహAudio),
        singleAudio: getAssetAudioUrl(s3Assets.గహAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.హగుహAudio),
      },
    ],
  },
  {
    letter: "ఖ",
    items: [
      {
        id: 71,
        title: "Letter",
        letter: "ఖ",
        word: "ఖగం",
        image: getAssetUrl(s3Assets.ఖగImg),
        audio: getAssetAudioUrl(s3Assets.ఖఖగంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఖఖగంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఖఖగంAudio),
      },
      {
        id: 72,
        title: "Letter",
        letter: "ఖ",
        word: "ముఖము",
        image: getAssetUrl(s3Assets.మఖమImg),
        audio: getAssetAudioUrl(s3Assets.మఖమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మఖమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఖముఖముAudio),
      },
      {
        id: 73,
        title: "Letter",
        letter: "ఖ",
        word: "శంఖం",
        image: getAssetUrl(s3Assets.శఖImg),
        audio: getAssetAudioUrl(s3Assets.శఖAudio),
        singleAudio: getAssetAudioUrl(s3Assets.శఖAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఖశంఖంAudio),
      },
    ],
  },
  {
    letter: "ఛ",
    items: [
      {
        id: 74,
        title: "Letter",
        letter: "ఛ",
        word: "ఛత్రము",
        image: getAssetUrl(s3Assets.ఛతరమImg),
        audio: getAssetAudioUrl(s3Assets.ఛఛత్రముAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఛఛత్రముAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఛఛత్రముAudio),
      },
      {
        id: 75,
        title: "Letter",
        letter: "ఛ",
        word: "పింఛం",
        image: getAssetUrl(s3Assets.పఛImg),
        audio: getAssetAudioUrl(s3Assets.పఛAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పఛAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఛపింఛంAudio),
      },
    ],
  },
  {
    letter: "ఠ",
    items: [
      {
        id: 76,
        title: "Letter",
        letter: "ఠ",
        word: "పాఠశాల",
        image: getAssetUrl(s3Assets.పఠశలImg),
        audio: getAssetAudioUrl(s3Assets.పఠశలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పఠశలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఠపాఠశాలAudio),
      },
      {
        id: 77,
        title: "Letter",
        letter: "ఠ",
        word: "పాఠం",
        image: getAssetUrl(s3Assets.పఠImg),
        audio: getAssetAudioUrl(s3Assets.పాఠంSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పాఠంSingleAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఠపాఠంAudio),
      },
    ],
  },
  {
    letter: "ఢ",
    items: [
      {
        id: 78,
        title: "Letter",
        letter: "ఢ",
        word: "ఢమఢమ",
        image: getAssetUrl(s3Assets.ఢమఢమImg),
        audio: getAssetAudioUrl(s3Assets.ఢఢమఢమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఢఢమఢమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఢఢమఢమAudio),
      },
    ],
  },
  {
    letter: "ఘ",
    items: [
      {
        id: 79,
        title: "Letter",
        letter: "ఘ",
        word: "ఘటం",
        image: getAssetUrl(s3Assets.ఘటImg),
        audio: getAssetAudioUrl(s3Assets.ఘఘటంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఘఘటంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఘఘటంAudio),
      },
      {
        id: 80,
        title: "Letter",
        letter: "ఘ",
        word: "సంఘటన",
        image: getAssetUrl(s3Assets.సఘటనImg),
        audio: getAssetAudioUrl(s3Assets.సఘటనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సఘటనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఘసంఘటనAudio),
      },
      {
        id: 81,
        title: "Letter",
        letter: "ఘ",
        word: "మేఘం",
        image: getAssetUrl(s3Assets.మఘImg),
        audio: getAssetAudioUrl(s3Assets.మఘAudio),
        singleAudio: getAssetAudioUrl(s3Assets.మఘAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఘమేఘంAudio),
      },
    ],
  },
  {
    letter: "ఝ",
    items: [
      {
        id: 82,
        title: "Letter",
        letter: "ఝ",
        word: "ఝషం",
        image: getAssetUrl(s3Assets.ఝషImg),
        audio: getAssetAudioUrl(s3Assets.ఝఝషంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఝఝషంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఝఝషంAudio),
      },
    ],
  },
  {
    letter: "ఋ",
    items: [
      {
        id: 83,
        title: "Letter",
        letter: "ఋ",
        word: "ఋషి",
        image: getAssetUrl(s3Assets.ఋషImg),
        audio: getAssetAudioUrl(s3Assets.ఋఋషిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఋఋషిAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఋఋషిAudio),
      },
    ],
  },
  {
    letter: "ష",
    items: [
      {
        id: 84,
        title: "Letter",
        letter: "ష",
        word: "షరా",
        image: getAssetUrl(s3Assets.షరImg),
        audio: getAssetAudioUrl(s3Assets.షషరాAudio),
        singleAudio: getAssetAudioUrl(s3Assets.షషరాAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.షషరాAudio),
      },
      {
        id: 85,
        title: "Letter",
        letter: "ష",
        word: "విషము",
        image: getAssetUrl(s3Assets.వషమImg),
        audio: getAssetAudioUrl(s3Assets.వషమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వషమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.షవిషముAudio),
      },
      {
        id: 86,
        title: "Letter",
        letter: "ష",
        word: "ఉష",
        image: getAssetUrl(s3Assets.ఉషImg),
        audio: getAssetAudioUrl(s3Assets.ఉషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఉషAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.షఉషAudio),
      },
    ],
  },
  {
    letter: "థ",
    items: [
      {
        id: 87,
        title: "Letter",
        letter: "థ",
        word: "థర్మోస్",
        image: getAssetUrl(s3Assets.థరమసImg),
        audio: getAssetAudioUrl(s3Assets.థథర్మోస్Audio),
        singleAudio: getAssetAudioUrl(s3Assets.థథర్మోస్Audio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.థథర్మోస్Audio),
      },
      {
        id: 88,
        title: "Letter",
        letter: "థ",
        word: "రథము",
        image: getAssetUrl(s3Assets.రథమImg),
        audio: getAssetAudioUrl(s3Assets.రథమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.రథమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.థరథముAudio),
      },
      {
        id: 89,
        title: "Letter",
        letter: "థ",
        word: "కథ",
        image: getAssetUrl(s3Assets.కథImg),
        audio: getAssetAudioUrl(s3Assets.కథAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కథAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.థకథAudio),
      },
    ],
  },
  {
    letter: "ధ",
    items: [
      {
        id: 90,
        title: "Letter",
        letter: "ధ",
        word: "ధనం",
        image: getAssetUrl(s3Assets.ధనImg),
        audio: getAssetAudioUrl(s3Assets.ధధనంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ధధనంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ధధనంAudio),
      },
      {
        id: 91,
        title: "Letter",
        letter: "ధ",
        word: "క్రోధము",
        image: getAssetUrl(s3Assets.కరధమImg),
        audio: getAssetAudioUrl(s3Assets.కరధమAudio),
        singleAudio: getAssetAudioUrl(s3Assets.కరధమAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ధక్రోధముAudio),
      },
      {
        id: 92,
        title: "Letter",
        letter: "ధ",
        word: "బాధ",
        image: getAssetUrl(s3Assets.బధImg),
        audio: getAssetAudioUrl(s3Assets.బధAudio),
        singleAudio: getAssetAudioUrl(s3Assets.బధAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ధబాధAudio),
      },
    ],
  },
  {
    letter: "ఫ",
    items: [
      {
        id: 93,
        title: "Letter",
        letter: "ఫ",
        word: "ఫలము",
        image: getAssetUrl(s3Assets.ఫలమImg),
        audio: getAssetAudioUrl(s3Assets.ఫఫలముAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఫఫలముAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఫఫలముAudio),
      },
      {
        id: 95,
        title: "Letter",
        letter: "ఫ",
        word: "సీతాఫలం",
        image: getAssetUrl(s3Assets.సతఫలImg),
        audio: getAssetAudioUrl(s3Assets.సతఫలAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సతఫలAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఫసీతాఫలంAudio),
      },
    ],
  },
  {
    letter: "భ",
    items: [
      {
        id: 96,
        title: "Letter",
        letter: "భ",
        word: "భజన",
        image: getAssetUrl(s3Assets.భజనImg),
        audio: getAssetAudioUrl(s3Assets.భభజనAudio),
        singleAudio: getAssetAudioUrl(s3Assets.భభజనAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.భభజనAudio),
      },
      {
        id: 97,
        title: "Letter",
        letter: "భ",
        word: "సభ",
        image: getAssetUrl(s3Assets.సభImg),
        audio: getAssetAudioUrl(s3Assets.సభAudio),
        singleAudio: getAssetAudioUrl(s3Assets.సభAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.భసభAudio),
      },
    ],
  },
  {
    letter: "క్ష",
    items: [
      {
        id: 98,
        title: "Letter",
        letter: "క్ష",
        word: "క్షత్రియుడు",
        image: getAssetUrl(s3Assets.కషతరయడImg),
        audio: getAssetAudioUrl(s3Assets.క్షక్షత్రియుడుAudio),
        singleAudio: getAssetAudioUrl(s3Assets.క్షక్షత్రియుడుAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.క్షక్షత్రియుడుAudio),
      },
      {
        id: 99,
        title: "Letter",
        letter: "క్ష",
        word: "అక్షరం",
        image: getAssetUrl(s3Assets.అకషరImg),
        audio: getAssetAudioUrl(s3Assets.అకషరAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అకషరAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.క్షఅక్షరంAudio),
      },
      {
        id: 100,
        title: "Letter",
        letter: "క్ష",
        word: "పరీక్ష",
        image: getAssetUrl(s3Assets.పరకషImg),
        audio: getAssetAudioUrl(s3Assets.పరకషAudio),
        singleAudio: getAssetAudioUrl(s3Assets.పరకషAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.క్షపరీక్షAudio),
      },
    ],
  },
  {
    letter: "అం",
    items: [
      {
        id: 101,
        title: "Letter",
        letter: "అం",
        word: "అంగడి",
        image: getAssetUrl(s3Assets.అగడImg),
        audio: getAssetAudioUrl(s3Assets.అంఅంగడిAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అంఅంగడిAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.అంఅంగడిAudio),
      },
    ],
  },
  {
    letter: "ఙ",
    items: [
      {
        id: 102,
        title: "Letter",
        letter: "ఙ",
        word: "ఙ",
        image: getAssetUrl(s3Assets.ఙImg),
        audio: getAssetAudioUrl(s3Assets.ఙఙAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఙఙAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఙఙAudio),
      },
    ],
  },
  {
    letter: "ఞ",
    items: [
      {
        id: 103,
        title: "Letter",
        letter: "ఞ",
        word: "ఞ",
        image: getAssetUrl(s3Assets.ఞImg),
        audio: getAssetAudioUrl(s3Assets.ఞఞAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఞఞAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఞఞAudio),
      },
    ],
  },
  {
    letter: "అః",
    items: [
      {
        id: 104,
        title: "Letter",
        letter: "అః",
        word: "అః",
        image: getAssetUrl(s3Assets.అImg),
        audio: getAssetAudioUrl(s3Assets.అఃఅఃAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అఃఅఃAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.అఃఅఃAudio),
      },
    ],
  },
  {
    letter: "ఱ",
    items: [
      {
        id: 105,
        title: "Letter",
        letter: "ఱ",
        word: "ఱంపం",
        image: getAssetUrl(s3Assets.ఱపImg),
        audio: getAssetAudioUrl(s3Assets.ఱఱంపంAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ఱఱంపంAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ఱఱంపంAudio),
      },
    ],
  },
  {
    letter: "న",
    items: [
      {
        id: 106,
        title: "Letter",
        letter: "న",
        word: "నగ",
        image: getAssetUrl(s3Assets.నగImg),
        audio: getAssetAudioUrl(s3Assets.ననగAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ననగAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ననగAudio),
      },
      {
        id: 107,
        title: "Letter",
        letter: "న",
        word: "అనప",
        image: getAssetUrl(s3Assets.అనపImg),
        audio: getAssetAudioUrl(s3Assets.అనపSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.అనపSingleAudio),
      },
      {
        id: 108,
        title: "Letter",
        letter: "న",
        word: "వాన",
        image: getAssetUrl(s3Assets.వానImg),
        audio: getAssetAudioUrl(s3Assets.వానSingleAudio),
        singleAudio: getAssetAudioUrl(s3Assets.వానSingleAudio),
      },
    ],
  },
  {
    letter: "ౠ",
    items: [
      {
        id: 109,
        title: "Letter",
        letter: "ౠ",
        word: "ౠక",
        image: getAssetUrl(s3Assets.ౠకImg),
        audio: getAssetAudioUrl(s3Assets.ౠౠకAudio),
        singleAudio: getAssetAudioUrl(s3Assets.ౠౠకAudio),
        alaphabetChartAudio: getAssetAudioUrl(s3Assets.ౠౠకAudio),
      },
    ],
  },
];

const LetterTrain = ({
  isAlphabetDemoActive,
  setVoiceText,
  setRecordedAudio,
  setVoiceAnimate,
  storyLine,
  type,
  handleNext,
  background,
  parentWords = "",
  //enableNext,
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
  handleBack, // This might be going to homepage
  //setEnableNext,
  loading,
  setOpenMessageDialog,
  audio,
  currentImg,
  vocabCount,
  wordCount,
  customLetters, // Array of letters to filter (e.g., ["a", "m", "s", "t"])
  confidentLetters, // Optional: Letters user is confident with (appear less frequently)
  //isNextButtonCalled,
  //setIsNextButtonCalled,
}) => {
  steps = 1;
  let lang = getLocalData("lang");
  // Normalize Kannada language codes: both "kn" and "ka" should work
  if (lang === "ka") {
    lang = "kn"; // Normalize to "kn" for consistency, but getFontFamily handles both
  }
  // Debug: Log language and font family
  console.log(
    "LetterTrain - Language:",
    lang,
    "Font Family:",
    getFontFamily(lang)
  );
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  let data;

  const letterss = dataTe.flatMap((obj) =>
    obj.items.map((item) => item.letter)
  );

  const chunkSize = 5;
  const result = [];

  for (let i = 0; i < letterss.length; i += chunkSize) {
    result.push(letterss.slice(i, i + chunkSize));
  }

  console.log("===============================", result);

  if (lang === "en") {
    data = dataEn;
  } else if (lang === "hi") {
    data = dataHi;
  } else if (lang === "te") {
    data = dataTe;
  } else if (lang === "kn" || lang === "ka") {
    data = dataKn;
  } else {
    data = dataEn; // fallback (English)
  }

  // Filter data based on customLetters if provided
  if (
    customLetters &&
    Array.isArray(customLetters) &&
    customLetters.length > 0
  ) {
    // Normalize customLetters to uppercase for comparison
    const normalizedCustomLetters = customLetters
      .map((letter) =>
        letter && typeof letter === "string" ? letter.toUpperCase() : ""
      )
      .filter(Boolean);
    data = data.filter((letterObj) => {
      // Check if the letter or syllable (uppercase) matches any of the custom letters
      const letterToCheck = letterObj.letter || letterObj.syllable;
      if (!letterToCheck || typeof letterToCheck !== "string") {
        return false;
      }
      return normalizedCustomLetters.includes(letterToCheck.toUpperCase());
    });
  }

  const generatePlaylist = (data, confidentLettersList = []) => {
    const playlist = [];

    // Normalize confident letters to uppercase for comparison
    const normalizedConfident = confidentLettersList
      .map((letter) =>
        letter && typeof letter === "string" ? letter.toUpperCase() : ""
      )
      .filter(Boolean);

    for (let i = 0; i < data.length; i += 5) {
      const block = data.slice(i, i + 5);

      block.forEach((letterObj) => {
        if (letterObj.items && Array.isArray(letterObj.items)) {
          const letterKey = (
            letterObj.letter ||
            letterObj.syllable ||
            ""
          ).toUpperCase();
          const isConfident = normalizedConfident.includes(letterKey);

          // For confident letters: show only first item (reduced frequency)
          // For non-confident letters: show all items (full practice)
          const itemsToShow = isConfident
            ? letterObj.items.slice(0, 1) // Only first item for confident letters
            : letterObj.items; // All items for non-confident letters

          itemsToShow.forEach((item) => {
            playlist.push({
              type: "UI1",
              item,
              letter: letterObj.letter || letterObj.syllable || "",
            });
          });
        }
      });

      block.forEach((letterObj) => {
        // Check if items exists, is an array, and has length > 0
        if (
          letterObj.items &&
          Array.isArray(letterObj.items) &&
          letterObj.items.length > 0
        ) {
          const firstItem = letterObj.items[0];
          playlist.push({
            type: "UI2",
            item: firstItem,
            letter: letterObj.letter || letterObj.syllable || "",
          });
        }
      });
    }

    return playlist;
  };

  const playlist = generatePlaylist(data, confidentLetters || []);
  console.log("LetterTrain playlist generated:", {
    playlistLength: playlist.length,
    customLetters,
    confidentLetters,
    confidentLettersCount: confidentLetters?.length || 0,
    playlistItems: playlist.map((item, idx) => ({
      index: idx,
      type: item.type,
      letter: item.letter,
      word: item.item?.word,
    })),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const batchIndex = Math.floor(currentIndex / 10);
  const stepInBatch = Math.floor((currentIndex % 10) / 5);
  const itemIndex = batchIndex * 5 + (currentIndex % 5);
  const item = playlist[currentIndex]?.item;
  const prevItem = itemIndex > 0 ? data[itemIndex - 1] : null;
  const blockStart = Math.floor(itemIndex / 5) * 5;
  const currentLetter = item?.letter || "";
  const [letters, setLetters] = useState([]);
  const COLORS = ["#8BC34A", "#9C27B0", "#E91E63", "#03A9F4", "#FF9800"];
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [recAudio, setRecAudio] = useState(null);
  const [isNextButtonCalled, setIsNextButtonCalled] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const current = playlist[currentIndex];
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const audioRef = useRef(null);

  const currentAudio =
    playlist[currentIndex]?.type === "UI2"
      ? null
      : playlist[currentIndex]?.item?.audio || null;

  const singleAudio = playlist[currentIndex]?.item?.singleAudio || null;

  const playAudio = (src) => {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audioRef.current = audio;

    // audio.onended = () => {
    //   // Audio ended
    // };

    audio.play().catch((err) => {
      console.log("Audio play error:", err);
    });
  };

  useEffect(() => {
    if (currentAudio && !isAlphabetDemoActive) {
      playAudio(currentAudio);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentIndex, isAlphabetDemoActive]);

  // const playAudio = (src) => {
  //   if (!src) return;

  //   if (audioRef.current) {
  //     audioRef.current.pause();
  //     audioRef.current.currentTime = 0;
  //   }

  //   const audio = new Audio(src);
  //   audioRef.current = audio;

  //   audio.play().catch((err) => {
  //     console.log("Audio play error:", err);
  //   });
  // };

  // useEffect(() => {
  //   if (!currentAudio) return;

  //   // 🔹 Special case: index 0 (only once, delayed)
  //   if (currentIndex === 0) {
  //     if (localStorage.getItem("alphabetdemo") === "true") return;

  //     // Set immediately
  //     setLocalData("alphabetdemo", "true");
  //     window.dispatchEvent(new Event("alphabetDemoComplete"));

  //     const timeoutId = setTimeout(() => {
  //       playAudio(currentAudio);
  //     }, 6000);

  //     return () => {
  //       clearTimeout(timeoutId);
  //       if (audioRef.current) {
  //         audioRef.current.pause();
  //         audioRef.current = null;
  //       }
  //     };
  //   }

  //   // 🔹 Normal case: index 1 → 20 (play immediately)
  //   playAudio(currentAudio);

  //   return () => {
  //     if (audioRef.current) {
  //       audioRef.current.pause();
  //       audioRef.current = null;
  //     }
  //   };
  // }, [currentIndex]);

  const currentUI = useMemo(() => {
    return playlist[currentIndex]?.type;
  }, [currentIndex, playlist]);

  const handleNextWord = () => {
    const currentLetter =
      playlist[currentIndex]?.item?.letter ||
      playlist[currentIndex]?.item?.syllable ||
      "";

    if (currentLetter && current.type === "UI1") {
      setLetters((prev) =>
        prev.includes(currentLetter) ? prev : [...prev, currentLetter]
      );
    }

    console.log("LetterTrain handleNextWord:", {
      currentIndex,
      playlistLength: playlist.length,
      isLastItem: currentIndex >= playlist.length - 1,
      customLetters,
      hasHandleNext: !!handleNext,
    });

    // Check if we've reached the end of the playlist
    if (currentIndex < playlist.length - 1) {
      // Move to next item in playlist
      setCurrentIndex((i) => i + 1);
    } else {
      // Reached end of playlist - complete the LetterTrain step
      console.log(
        "LetterTrain completed - all customLetters done. Calling handleNext."
      );
      // If handleNext prop is provided (e.g., from F1), use it instead of default navigation
      if (handleNext && typeof handleNext === "function") {
        handleNext();
      } else {
        // Default R0 behavior
        setLocalData("rStepZero", 1);
        if (process.env.REACT_APP_IS_APP_IFRAME === "true") {
          navigate("/");
        } else {
          navigate("/discover-start");
        }
        console.log("finished r0");
      }
      // Don't continue - exit here
      return;
    }
    setRecAudio(null);
    setIsNextButtonCalled(true);
    setEnableNext(false);
  };

  const handlePreviousWord = () => {
    if (currentIndex > 0) {
      const currentLetter = playlist[currentIndex]?.item?.letter || "";
      if (currentLetter && current.type === "UI1") {
        setLetters((prev) => prev.filter((letter) => letter !== currentLetter));
      }

      setCurrentIndex((i) => i - 1);
      setRecAudio(null);
      setIsNextButtonCalled(false);
      setEnableNext(false);
    }
  };

  const handleBackNavigation = () => {
    if (currentIndex > 0) {
      handlePreviousWord();
    } else {
      if (handleBack) {
        handleBack();
      } else {
        navigate(-1);
      }
    }
  };

  const handleRetry = () => {
    console.log("audio playing!");
    playAudio(currentAudio);
  };

  const updateStoredData = (audio, isCorrect) => {};

  const handleRecordingComplete = (base64Data) => {
    if (base64Data) {
      setIsRecordingComplete(true);
      setRecAudio(base64Data);
    } else {
      setIsRecordingComplete(false);
      setRecAudio(null);
    }
  };

  const handleStartRecording = () => {
    setRecAudio(null);
  };

  const handleStopRecording = () => {
    setRecAudio(true);
    setLetters([]);
  };

  const navy = "#1c2752";
  const red = "#C93128";
  const pink = "#ea4c89";
  const orange = "#f28b1d";
  const blue = "#f28b1d";

  const flowNames = [...new Set(data.map((item) => item.id))];

  const renderUI = () => {
    const cycleIndex = Math.floor(currentIndex / 20);
    const positionInCycle = currentIndex % 20;

    const current = playlist[currentIndex];
    if (!current) return null;

    //console.log('ui?', currentIndex, block, isUI1, letters);

    const totalLetters = data && Array.isArray(data) ? data.length : 0;
    const completedLetters =
      letters && Array.isArray(letters) ? letters.length : 0;

    // Calculate total items in playlist
    const totalItemsInPlaylist =
      playlist && Array.isArray(playlist) ? playlist.length : 0;

    const completionPercentage =
      totalLetters > 0
        ? Math.round((completedLetters / totalLetters) * 100)
        : 0;
    const UI1 = () => {
      //console.log("ui1", item, current);

      const renderHighlightedWord = (word, targetLetter) => {
        if (!word || !targetLetter) return word;
        if (lang !== "en") {
          const graphemes = splitGraphemes(word);
          let graphemeIndex = graphemes.findIndex((g) => g === targetLetter);
          if (graphemeIndex === -1) {
            graphemeIndex = graphemes.findIndex((g) =>
              g.includes(targetLetter)
            );
          }
          if (graphemeIndex === -1) {
            return word;
          }
          const before = graphemes.slice(0, graphemeIndex).join("");
          const letter = graphemes[graphemeIndex];
          const after = graphemes.slice(graphemeIndex + 1).join("");
          return (
            <>
              {before}
              <span style={{ color: "#FF0000", fontWeight: "bold" }}>
                {letter}
              </span>
              {after}
            </>
          );
        }

        const lowerWord = word.toLowerCase();
        const lowerTarget = targetLetter.toLowerCase();

        const letterIndex = lowerWord.indexOf(lowerTarget);

        if (letterIndex === -1) {
          return word;
        }

        const before = word.substring(0, letterIndex);
        const letter = word.substring(
          letterIndex,
          letterIndex + targetLetter.length
        );
        const after = word.substring(letterIndex + targetLetter.length);

        return (
          <>
            {before}
            <span style={{ color: "#FF0000", fontWeight: "bold" }}>
              {letter}
            </span>
            {after}
          </>
        );
      };

      let TOTAL_ITEMS = 0;

      // Use actual playlist length if customLetters is provided, otherwise use hardcoded values
      if (
        customLetters &&
        Array.isArray(customLetters) &&
        customLetters.length > 0 &&
        playlist &&
        Array.isArray(playlist)
      ) {
        TOTAL_ITEMS = playlist.length;
      } else {
        if (lang === "en") {
          TOTAL_ITEMS = 101;
        } else if (lang === "hi") {
          TOTAL_ITEMS = 151;
        } else if (lang === "te") {
          TOTAL_ITEMS = 146;
        } else if (lang === "kn" || lang === "ka") {
          TOTAL_ITEMS = 142;
        } else {
          TOTAL_ITEMS = 100; // fallback default
        }
      }

      // FIXED: Use currentIndex + 1 instead of item?.id
      const currentItemNumber = currentIndex + 1;
      const completionPercentage = Math.round(
        (currentItemNumber / TOTAL_ITEMS) * 100
      );

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            height: { xs: "auto", sm: "60vh" },
            minHeight: { xs: "50vh", sm: "60vh" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: { xs: "95%", sm: "min(95%, 1024px)" },
              borderRadius: 2,
              backgroundImage:
                "repeating-linear-gradient(0deg, #ffffff 0px, #ffffff 44px, #e6e9ef 46px)",
              backgroundColor: "#fff",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: { xs: 2, sm: 3, md: 4 },
              minHeight: { xs: "45vh", sm: "50vh", md: "50vh" },
            }}
          >
            {/* Progress container - right side */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 10 },
                right: { xs: 10, sm: 20 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "80px", sm: "100px", md: "120px" },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "2px solid #1CB0F6",
                  borderRadius: "50%",
                  padding: { xs: "4px 8px", sm: "5px 10px", md: "6px 12px" },
                  fontFamily: getFontFamily(lang),
                  fontWeight: 700,
                  fontSize: { xs: "11px", sm: "12px", md: "14px" },
                  color: "#000",
                  position: "relative",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  marginBottom: "-8px",
                }}
              >
                {currentItemNumber}/{TOTAL_ITEMS}
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: { xs: "14px", sm: "16px", md: "18px" },
                  backgroundColor: "#E3F2FD",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  zIndex: 1,
                  border: "2px solid #BBDEFB",
                }}
              >
                <Box
                  sx={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    backgroundColor: "#1CB0F6",
                    borderRadius: "20px",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>

            {/* Title container - left side */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 12, sm: 14, md: 16 },
                left: { xs: 8, sm: 12, md: 16 },
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: { xs: "16px", sm: "20px", md: "24px" },
                padding: { xs: "8px 12px", sm: "10px 14px", md: "14px 18px" },
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "2px solid #FF9800",
                zIndex: 10,
                backdropFilter: "blur(5px)",
                minWidth: { xs: "100px", sm: "120px", md: "140px" },
              }}
            >
              <Typography
                sx={{
                  fontFamily: getFontFamily(lang),
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "16px", md: "20px" },
                  color: "#FF9800",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                position: "relative",
                mb: 0,
                mt: 0.5,
              }}
            >
              <img
                src={trainImg}
                alt="train"
                style={{
                  width: "100%",
                  maxWidth: isMobile ? "280px" : isTablet ? "380px" : "480px",
                  maxHeight: isMobile ? "50px" : isTablet ? "60px" : "70px",
                  objectFit: "contain",
                  marginTop: "2px",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: "-11%",
                  left: "68%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 0.6,
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <AnimatePresence>
                  {letters?.map((ch, i) => (
                    <motion.div
                      key={ch + i}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 1.0, ease: "easeOut" }}
                    >
                      <Box
                        sx={{
                          minWidth: { xs: 40, sm: 50, md: 60 },
                          minHeight: { xs: 40, sm: 50, md: 60 },
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          background: COLORS[i % COLORS.length],
                          boxShadow: 2,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: getFontFamily(lang),
                            color: "#FFFFFF",
                            fontSize:
                              lang === "te"
                                ? isMobile
                                  ? "24px"
                                  : isTablet
                                  ? "28px"
                                  : "32px"
                                : isMobile
                                ? "20px"
                                : isTablet
                                ? "24px"
                                : "28px",
                          }}
                        >
                          {ch}
                        </span>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>

            <Box
              sx={{
                width: { xs: "90%", sm: "80%", md: "75%" },
                maxWidth: { xs: 280, sm: 340, md: 380 },
                height: "auto",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #1CB0F6",
                borderRadius: { xs: "10px", sm: "12px", md: "14px" },
                backgroundColor: "#F1FAFE",
                mb: 0.5,
                padding: { xs: "3px", sm: "3.5px", md: "4px" },
                marginTop: 1,
              }}
            >
              <Typography
                component="div"
                className={
                  lang === "kn" || lang === "ka" ? "kannada-font-override" : ""
                }
                sx={{
                  color: red,
                  fontWeight: 500,
                  fontSize: { xs: 50, md: 75 },
                  lineHeight: 1,
                  fontFamily: getFontFamily(lang),
                  flex: 1,
                  textAlign: "center",
                  p: 0.2,
                }}
              >
                {item.letters &&
                Array.isArray(item.letters) &&
                item.letters.length > 1 ? (
                  <>
                    <span style={{ color: "#C93128" }}>{item.letters[0]}</span>
                    <span style={{ color: "#1c2752" }}>{item.letters[1]}</span>
                    {item.letters.slice(2)}
                  </>
                ) : (
                  <span style={{ color: "red" }}>
                    {item.letters || item.letter || item.syllable || ""}
                  </span>
                )}
              </Typography>

              <Box
                sx={{
                  width: "1px",
                  backgroundColor: "#1CB0F6",
                  alignSelf: "stretch",
                }}
              />

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0.2,
                }}
              >
                <ZoomableImage
                  src={item.image}
                  alt={item.word}
                  imageStyle={{
                    width: isMobile ? "60px" : "85px",
                    height: isMobile ? "60px" : "85px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                mt: 3,
              }}
            >
              <span
                style={{
                  color: "#333F61",
                  fontWeight: lang === "te" ? 400 : 700,
                  fontSize: lang === "te" ? "56px" : "50px",
                  lineHeight: "1",
                  letterSpacing: "2%",
                  fontFamily: getFontFamily(lang),
                }}
                className={
                  lang === "kn" || lang === "ka" ? "kannada-font-override" : ""
                }
              >
                {renderHighlightedWord(item.word, item.syllable || item.letter)}
              </span>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                zIndex: 10,
                justifyContent: "center",
                alignItems: "flex-end",
                mb: 1,
                mt: 1,
              }}
            >
              <IconButton
                onClick={handleBackNavigation}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "#1CB0F6",
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(28,176,246,0.35)",
                  "&:hover": { bgcolor: "#1AA3E3" },
                  transform: "translateY(-4px)",
                }}
              >
                <ArrowLeft size={22} />
              </IconButton>

              <IconButton
                onClick={handleRetry}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: pink,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(234,76,137,0.35)",
                  "&:hover": { bgcolor: pink },
                  transform: "translateY(-1px)",
                }}
              >
                <RotateCcw size={22} />
              </IconButton>

              {/* ➡️ Next button */}
              <IconButton
                onClick={handleNextWord}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: orange,
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 6px 14px rgba(242,139,29,0.35)",
                  "&:hover": { bgcolor: orange },
                }}
              >
                <ArrowRight size={22} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      );
    };
    const UI2 = () => {
      //console.log("ui2");

      let TOTAL_ITEMS = 0;
      // Use actual playlist length if customLetters is provided, otherwise use hardcoded values
      if (
        customLetters &&
        Array.isArray(customLetters) &&
        customLetters.length > 0
      ) {
        TOTAL_ITEMS = playlist.length;
      } else {
        if (lang === "en") TOTAL_ITEMS = 101;
        else if (lang === "kn" || lang === "ka") TOTAL_ITEMS = 142;
        else if (lang === "hi") TOTAL_ITEMS = 151;
        else if (lang === "te") TOTAL_ITEMS = 146;
        else TOTAL_ITEMS = 100; // fallback
      }
      const currentItemNumber = currentIndex + 1;
      const completionPercentage = Math.round(
        (currentItemNumber / TOTAL_ITEMS) * 100
      );

      const renderHighlightedWord = (word, targetLetter) => {
        if (!word || !targetLetter) return word;

        if (lang !== "en") {
          const graphemes = splitGraphemes(word);
          let graphemeIndex = graphemes.findIndex((g) => g === targetLetter);
          if (graphemeIndex === -1) {
            graphemeIndex = graphemes.findIndex((g) =>
              g.includes(targetLetter)
            );
          }
          if (graphemeIndex === -1) {
            return word;
          }
          const before = graphemes.slice(0, graphemeIndex).join("");
          const letter = graphemes[graphemeIndex];
          const after = graphemes.slice(graphemeIndex + 1).join("");
          return (
            <>
              {before}
              <span style={{ color: "#FF0000", fontWeight: "bold" }}>
                {letter}
              </span>
              {after}
            </>
          );
        }

        const lowerWord = word.toLowerCase();
        const lowerTarget = targetLetter.toLowerCase();

        const letterIndex = lowerWord.indexOf(lowerTarget);

        if (letterIndex === -1) {
          return word;
        }

        const before = word.substring(0, letterIndex);
        const letter = word.substring(
          letterIndex,
          letterIndex + targetLetter.length
        );
        const after = word.substring(letterIndex + targetLetter.length);

        return (
          <>
            {before}
            <span style={{ color: "#FF0000", fontWeight: "bold" }}>
              {letter}
            </span>
            {after}
          </>
        );
      };

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            height: "70vh",
          }}
        >
          <Box
            sx={{
              position: "relative",
              mx: "auto",
              width: "min(100%, 1024px)",
              borderRadius: 2,
              backgroundColor: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 0",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "120px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "2px solid #1CB0F6",
                  borderRadius: "50%",
                  padding: "6px 12px",
                  fontFamily: getFontFamily(lang),
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#000",
                  position: "relative",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  marginBottom: "-8px",
                }}
              >
                {currentItemNumber}/{TOTAL_ITEMS}
              </Box>

              <Box
                sx={{
                  width: "100%",
                  height: "18px",
                  backgroundColor: "#E3F2FD",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  zIndex: 1,
                  border: "2px solid #BBDEFB",
                }}
              >
                <Box
                  sx={{
                    width: `${completionPercentage}%`,
                    height: "100%",
                    backgroundColor: "#1CB0F6",
                    borderRadius: "20px",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: recAudio ? "#1CB0F60F" : "#fff",
                border: recAudio ? "2px solid #58CC02" : "none",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px 40px",
                marginBottom: "40px",
                maxWidth: "75%",
                height: "140px",
                width: "350px",
                minWidth: "350px",
                flexShrink: 0,
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    color: "#333F61",
                    fontWeight: 700,
                    fontSize: "50px",
                    lineHeight: "1",
                    letterSpacing: "2%",
                    fontFamily: getFontFamily(lang),
                  }}
                  className={
                    lang === "kn" || lang === "ka"
                      ? "kannada-font-override"
                      : ""
                  }
                >
                  {renderHighlightedWord(
                    item.word,
                    item.syllable || item.letter
                  )}
                </span>
              </Box>

              {recAudio && (
                <Box
                  sx={{
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
                    width: "100%",
                  }}
                >
                  <img
                    src={Assets.graph}
                    alt="graph"
                    style={{
                      height: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box
              sx={{
                width: "100%",
                maxWidth: "380px",
                height: "110px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "0px",
                padding: "10px 10px",
              }}
            >
              <VoiceAnalyser
                key={`voice-analyser-${currentIndex}`}
                pageName={"wordsorimage"}
                setVoiceText={setVoiceText}
                updateStoredData={updateStoredData}
                setRecordedAudio={setRecordedAudio}
                setVoiceAnimate={setVoiceAnimate}
                storyLine={storyLine}
                dontShowListen={type === "image" || isDiscover}
                originalText={`R0-${item?.letter}`}
                handleNext={handleNextWord}
                enableNext={enableNext}
                isShowCase={isShowCase || isDiscover}
                handleRecordingComplete={handleRecordingComplete}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                audioLink={singleAudio}
                noOffline={true}
                isNextButtonCalled={isNextButtonCalled}
                setIsNextButtonCalled={setIsNextButtonCalled}
                setEnableNext={setEnableNext}
                {...{
                  contentId,
                  contentType,
                  currentLine: currentStep - 1,
                  playTeacherAudio,
                  callUpdateLearner,
                  setOpenMessageDialog,
                }}
              />
            </Box>
          </Box>
        </Box>
      );
    };
    if (current.type === "UI1") {
      return UI1(current.item);
    } else {
      return UI2(current.item);
    }
  };

  return (
    <MainLayout
      background={background}
      handleNext={handleNext}
      enableNext={enableNext}
      showTimer={showTimer}
      points={points}
      pageName={"m14"}
      parentWords={parentWords}
      flowNames={flowNames}
      handleBack={handleBackNavigation}
      {...{
        steps,
        currentStep,
        level,
        progressData,
        showProgress,
        playTeacherAudio,
        handleBack: handleBackNavigation,
        disableScreen,
        loading,
        vocabCount,
        wordCount,
      }}
    >
      <Box
        sx={{
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
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
                videoId="gfl-lcNz1QE"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>
        )}
        {isAlphabetDemoActive ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="40vh"
          >
            <CircularProgress size={60} thickness={4.5} />
          </Box>
        ) : (
          renderUI()
        )}
      </Box>
    </MainLayout>
  );
};

export default LetterTrain;
