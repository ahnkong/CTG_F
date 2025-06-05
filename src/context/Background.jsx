import React from "react";
import "styles/Background.css"; // 기본 스타일만 관리


import Default from "assets/background/blur_ver91.png"
import Coin from "assets/image/CoinFlip.gif"
import White from "assets/background/background_white.png"
import Sheep from "assets/background/background_sheep.png"
import Default_blur from "assets/background/background_blur10.png"
import Sparkle from "assets/background/background_sparkle.gif"
import Grass from "assets/background/background_grass.png"
import blur_green from "assets/background/background_blur_green.png"
import Tree from "assets/background/background_tree.png"




import { orange } from "@mui/material/colors";
const Background = ({ type = "default", children }) => {
  const inlineStyles = {
    white: {
      backgroundColor : "white",
      minHeight: "100vh",
    },
    gray: {
      backgroundColor: "#F5F5F5",
      minHeight: "100dvh",
    },
    coin: {
      backgroundImage: `url(${Coin})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    sheep: {
      backgroundImage: `url(${Sheep})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    sparkle: {
      backgroundImage: `url(${Sparkle})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    orange : {
      backgroundColor: "#ffa07a",
      minHeight: "100vh",
    },
    grass: {
      backgroundImage: `url(${Grass})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    blur_green: {
      backgroundImage: `url(${blur_green})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    
  };

  return (
    <div className="background" style={inlineStyles[type]}>
      {children}
    </div>
  );
};

export default Background;
