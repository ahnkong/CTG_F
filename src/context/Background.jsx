import React from "react";
import "styles/Background.css"; // 기본 스타일만 관리


import Default from "assets/background/blur_ver91.png"
import Coin from "assets/image/CoinFlip.gif"
import White from "assets/background/background_white.png"
import Sheep from "assets/background/background_sheep.png"
import Default_blur from "assets/background/background_blur10.png"
import Sparkle from "assets/background/background_sparkle.gif"
import { orange } from "@mui/material/colors";
const Background = ({ type = "default", children }) => {
  const inlineStyles = {
    default: {
      backgroundImage: `url(${Default})`,
      backgroundSize: "cover", // ✅ 필요하면 "contain"으로 테스트
      minHeight: "100vh", // ✅ 내부 요소에 맞춰 높이 자동 조정
    },
    default_blur: {
      backgroundImage: `url(${Default_blur})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    gray: {
      backgroundColor: "#F5F5F5",
      minHeight: "100vh",
    },
    coin: {
      backgroundImage: `url(${Coin})`,
      backgroundSize: "cover",
      minHeight: "100vh",
    },
    white: {
      backgroundImage: `url(${White})`,
      // backgroundColor : "#FAFAF8",
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
    }
  };

  return (
    <div className="background" style={inlineStyles[type]}>
      {children}
    </div>
  );
};

export default Background;
