import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import treeTest from './tree_test.webp';
import Icon from "./tree";
import tree from './christmas-tree.svg';
import hoverText from './text/xmas_title.png';
import background from './Background.png';
import ornamentJoe from './ornaments/joe_ornament.png';
import ornamentScott from './ornaments/Jedi Order - Scott.png';
import ornamentIldar from './ornaments/Grumpy Cat - Ildar.png';
import ornamentKelly from './ornaments/Nutcracker - Kelly.png';
import ornamentBellCat from './ornaments/BellCat Ornament.png';
import ornamentMorgan from './ornaments/Seashell - Morgan.png';
import ornamentBritney from './ornaments/Twiggy - Brit.png';
import ornamentJim from './ornaments/Jolly Cowboy - Jim.png';
import ornamentTess from './ornaments/Snowman - Tess.png';
import ornamentJenny from './ornaments/Dnd Character - Jenny.png';
import ornamentTenacra from './ornaments/Tenacra Ornament.png';
import orangeBulb1 from './ornaments/Orange 1.png';
import orangeBulb2 from './ornaments/Orange 2.png';
import orangeBulb3 from './ornaments/Orange 3.png';
import orangeBulb4 from './ornaments/Orange 4.png';
import blueBulb1 from './ornaments/Teal 1.png';
import blueBulb2 from './ornaments/Teal 2.png';
import blueBulb3 from './ornaments/Teal 3.png';
import blueBulb4 from './ornaments/Teal 4.png';

import joeImg from './team/joe.png';
import britneyImg from './team/britney.png';
import morganImg from './team/morgan.png';
import jimImg from './team/jim.png';
import scottImg from './team/scott.png';
import tessImg from './team/tess.png';
import kellyImg from './team/kelly.png';
import jennyImg from './team/jenny.png';
import ildarImg from './team/ildar.png';

import { Stage, Layer, Image, Rect, Group, Text, Circle, Path } from 'react-konva';
import { Html } from 'react-konva-utils';
import useImage from "use-image";
import { Spring, animated } from "@react-spring/konva";
import SnowStorm from 'react-snowstorm';

const ORNAMENTS = [
  {
    posX: 1220,
    posY: 880,
    image: ornamentJoe,
    playlist: "4aPr8paZw1xUmsnWgkvM61",
    personImg: joeImg
  },
  {
    posX: 1445,
    posY: 870,
    image: ornamentScott,
    playlist: "28ysLWZ02mA8ipcWM3epnC",
    personImg: scottImg
  },
  {
    posX: 1730,
    posY: 850,
    image: ornamentIldar,
    playlist: "2PBu6rnmIdXXQlx1V8W5Dh",
    personImg: ildarImg
  },
  {
    posX: 1640,
    posY: 630,
    image: ornamentKelly,
    playlist: "0omo8jbNqxTr9SUsQ4EBhK",
    personImg: kellyImg
  },
  {
    posX: 1430,
    posY: 700,
    image: ornamentBellCat,
    playlist: "72U1a2yiPvUm94xWxcmfIl",
    personImg: ornamentBellCat
  },
  {
    posX: 1250,
    posY: 655,
    image: ornamentMorgan,
    playlist: "2zHI6YFqqGrbJJnjny50Ld",
    personImg: morganImg
  },
  {
    posX: 1410,
    posY: 475,
    image: ornamentBritney,
    playlist: "0U4aBRL4HlPXqm3L8cxzWj",
    personImg: britneyImg
  },
  {
    posX: 1615,
    posY: 406,
    image: ornamentJim,
    playlist: "10QiDTp5Sp4vatFzrZ8ldq",
    personImg: jimImg
  },
  {
    posX: 1220,
    posY: 400,
    image: ornamentTess,
    playlist: "4A5Y4VFfy92mqWNBHZbYZL",
    personImg: tessImg
  },
  {
    posX: 1380,
    posY: 210,
    image: ornamentJenny,
    playlist: "0aUFbInasmjOsgJBzGowD4",
    personImg: jennyImg
  },
  {
    posX: 1510,
    posY: 230,
    image: ornamentTenacra,
    playlist: "72U1a2yiPvUm94xWxcmfIl",
    personImg: ornamentTenacra
  }
];

const BULBS = [
  {
    posX: 1380,
    posY: 40,
    image: orangeBulb3,
    glowColor: "#fb6a1a"
  },
  {
    posX: 1290,
    posY: 430,
    image: blueBulb2,
    glowColor: '#498186'
  },
  {
    posX: 1440,
    posY: 390,
    image: orangeBulb1,
    glowColor: "#fb6a1a"
  },
  {
    posX: 1500,
    posY: 600,
    image: blueBulb3,
    glowColor: '#498186'
  },
  {
    posX: 1040,
    posY: 860,
    image: orangeBulb2,
    glowColor: "#fb6a1a"
  },
  {
    posX: 1280,
    posY: 815,
    image: blueBulb1,
    glowColor: '#498186'
  },
  {
    posX: 1557,
    posY: 880,
    image: orangeBulb4,
    glowColor: "#fb6a1a"
  },
  {
    posX: 1630,
    posY: 975,
    image: blueBulb4,
    glowColor: '#498186'
  },
];

// hackery 
const TREE_WIDTH = 1920;
const TREE_HEIGHT = 1080;

const TreeImage = React.forwardRef((props, ref) => {
  const [image, status] = useImage(background);
  const w = TREE_WIDTH; //* props.scale;
  const h = TREE_HEIGHT; //* props.scale;
  const tw = props.canvasWidth / w;
  const th = props.canvasHeight / h;
  return <Image ref={ref} image={image} onClick={props.onClick} scaleX={tw} scaleY={th}/>;
});


const OrnamentComp = React.forwardRef((props, ref) => {
  const [groupPos, setGroupPos] = useState({ x: props.posX, y: props.posY, isDragging: false });
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ornamentImage, status] = useImage(props.image);
  const groupRef = useRef(null);
  let ornamentOffX = 0;
  const jingleAnim = (shape) => {
      if (!playing) {
        setPlaying(true);
        shape.to({
          rotation: 30,
          duration: 0.1,
          onFinish: () => {
            shape.to({
              rotation: -30,
              onFinish: () => {
                shape.to({
                  rotation: 0
                });
                setPlaying(false);
              }
            });
          }
        });
      }
  };

  if (ornamentImage) {
    ornamentOffX = ornamentImage.width / 2;
  }

  return (
    <Group
      draggable
      ref={groupRef}
      onDragStart={(e) => setGroupPos({ isDragging: true, ...groupPos })}
      onDragEnd={(e) => {
        setGroupPos({
          isDragging: false,
          x: e.target.x(),
          y: e.target.y()
        });
      }}
      x={groupPos.x}
      y={groupPos.y}
    >
      <Image
        image={ornamentImage}
        {...props.imageProps}
        offsetX={ornamentOffX}
        onClick={() => props.onClick(props.playlist, props.personImg)}
        onMouseEnter={(e) => {
          jingleAnim(e.target);
        }}
        onTap={(e) => {
          jingleAnim(e.target);
          setSpotifyOpen(true);
        }}
      />
    </Group>
  );
});

const Bulb = (props) => {
  const { scale } = props;
  const [bulbImg, status] = useImage(props.image);
  const bulbRef = React.createRef(null);
  const glowAnim = (shape) => {
    shape.to({
      shadowOpacity: 1,
      onFinish: () => {
        shape.to({
          shadowOpacity: 0
        });
      }
    });
  };

  useEffect(() => {
    if (props.glow) {
      glowAnim(bulbRef.current);
    }
  }, [props.glow]);
  
  return(
    <Image
      ref={bulbRef}
      image={bulbImg}
      x={props.posX}
      y={props.posY}
      shadowEnabled
      shadowColor={props.glowColor}
      shadowBlur={20}
      shadowOpacity={0}
      listening={false}
      scaleX={scale}
      scaleY={scale}
    />
  );
};

const Bulbs = (props) => {
  const { scale } = props;
  const [glowIdx, setGlowIdx] = useState(0);
  useEffect(() => {
    const idx = setInterval(() => {
      const selectIdx = Math.floor(Math.random() * props.bulbs.length);
      setGlowIdx(selectIdx);
    }, 5000);
    return () => clearInterval(idx);
  }, []);

  return props.bulbs.map((bulbProps, idx) => {
    return <Bulb key={idx} {...bulbProps} glow={idx === glowIdx ? true : undefined} />;
  });
}

const SpotifyPopup = (props) => {
  const [flag, setFlag] = useState(false);
  return (
    <Spring
      native
      from={{ scaleX: 0, scaleY: 0, offsetX: -30 }}
      to={{
        scaleX: props.open ? 1 : 0,
        scaleY: props.open ? 1 : 0,
      }}
    >
      {(p) => (
        <animated.Group {...p}>
          <Html>
            <iframe style={{ borderRadius: '12px' }} src={props.playlist} width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </Html>
        </animated.Group>
      )}
    </Spring>
  );
};

export default function WebPlayer(props){
  const stageWidth = 1920;
  const stageHeight = 1080;
  const [windowSize, setWindowSize] = useState({ width: 640, height: 360, scale: 0 });
  const [playState, setPlayerState] = useState({ id: '72U1a2yiPvUm94xWxcmfIl', img: null });
  const [hoverTextImg] = useImage(hoverText)
  let scale = Math.min(windowSize.width / stageWidth, windowSize.height / stageHeight);

  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const checkSize = () => {
      const { offsetWidth, offsetHeight } = containerRef.current;
      let scale = Math.min(offsetWidth / stageWidth, offsetHeight / stageHeight);
      setWindowSize({
        width: offsetWidth,
        height: offsetHeight,
        scale
      });
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const openPlaylist = (playlist, img) => {
    setPlayerState({ id: playlist, img: img });
  };

  return (<div className="wrapper" style={{ display: 'flex', flexDirection:'column', justifyContent: 'center', justifyContent: 'space-evenly', alignItems: 'center', height: '100%', width: '100%', background: '#00a7b5' }}>
      <div ref={containerRef} className="cardWrapper" style={{ display: 'flex', flexDirection: 'column' }}>
        <Stage  width={windowSize.width} height={windowSize.height} scale={{ x: scale, y: scale }}>
          <Layer ref={backgroundRef}>
            <TreeImage
              ref={imgRef}
              canvasWidth={stageWidth}
              canvasHeight={stageHeight}
              //scale={scale}
            />
            {ORNAMENTS.map((props) => {
              return <OrnamentComp {...props} onClick={openPlaylist} />;
            })}
            <Bulbs bulbs={BULBS} scale={windowSize.scale} />
          </Layer>
          <Layer listening={false}>
            <Image
              image={hoverTextImg}
              scale={windowSize.scale}
              x={25}
              y={900}
              rotation={-30}
            />
          </Layer>
          <Layer listening={false}>
            <SnowStorm followMouse={false} excludeMobile={false} vMaxY={2} vMaxX={2} />
          </Layer>
      </Stage>
    </div>
    <div className="player" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {playState.img && <img src={playState.img} style={{ maxWidth: 200, maxHeight: 200 }}/>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <iframe style={{ borderRadius: '12px' }} src={`https://open.spotify.com/embed/playlist/${playState.id}`} width="100%" height="125" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
          {playState.img && <a
            className="full-playlist"
            href="https://open.spotify.com/playlist/72U1a2yiPvUm94xWxcmfIl?si=35348d798dca4d68"
          >Checkout the full holiday mix here!</a>}
        </div>
    </div>
  </div>
  );
}
