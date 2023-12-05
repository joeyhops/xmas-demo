import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import treeTest from './tree_test.webp';
import Icon from "./tree";
import tree from './christmas-tree.svg';
import ornamentJoe from './ornament_joe.png';
import { Stage, Layer, Image, Rect, Group, Text, Circle, Path } from 'react-konva';
import { Html } from 'react-konva-utils';
import useImage from "use-image";
import { Spring, animated } from "@react-spring/konva";
import SnowStorm from 'react-snowstorm';

// hackery 
const TREE_WIDTH = 430;
const TREE_HEIGHT = 430;

const TreeImage = React.forwardRef((props, ref) => {
  const [imageProps, setImageProps] = useState({});
  const [image, status] = useImage(tree);
  const hRatio = props.canvasWidth / TREE_WIDTH;
  const vRatio = props.canvasHeight / TREE_HEIGHT
  const scale = Math.min(props.canvasWidth / TREE_WIDTH, props.canvasHeight / TREE_HEIGHT);
  const w = TREE_WIDTH; //* props.scale;
  const h = TREE_HEIGHT; //* props.scale;
  const offY = (h - props.canvasHeight) / 2;
  const offX = (w - props.canvasWidth) / 2;
  const offsetX = -props.canvasWidth / 2 + w / 2;
  const offsetY = -props.canvasHeight / 2 + h / 2;
  //console.log(scale, offsetX, offsetY);
  return <Image ref={ref} image={image} offsetX={offX} offsetY={offY}  />
  //return <Image ref={ref} image={image} offsetX={offsetX} offsetY={offsetY} onClick={props.onClick} />;
});

const OrnamentJoe = React.forwardRef((props, ref) => {
  const [ornament] = useImage(ornamentJoe);
  let offX = 0;
  if (ornament) {
    offX = 56 / 2;
  }
  return <Image ref={ref} image={ornament} {...props} offsetX={offX} />
});

const OrnamentWrapper = (props) => {
  const [groupPos, setGroupPos] = useState({ x: 350, y: 280, isDragging: false });
  const [shapePos, setShapePos] = useState({ x: 0, y: 0, isDragging: false });
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const rectRef = useRef(null);
  const groupRef = useRef(null);

  const openAnim = (shape) => {
    console.log(shape);
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
  };
  // useEffect(() => {
  //   //setShapePos({ ...shapePos, x: rectRef.current.x(), y: rectRef.current.y() });
  //   if (props.bgTransform && Object.keys(props.bgTransform).length > 0) {
  //     const transformed = props.bgTransform.point({ x: 235, y: 397 });
  //     console.log(transformed);
  //     setShapePos({ x: transformed.x, y: transformed.y, ...shapePos });
  //   }
  // }, []);
  // useEffect(() => {
  //   const {x, y} = groupPos;
  //   const sX = x / props.scale || 0;
  //   const sY = y / props.scale || 0;
  //   console.log(x, y, sX, sY, props.scale);
  //   setGroupPos({ x: sX, y: sY });
  // }, [props.scale]);
  return (
        <Group
          draggable
          ref={groupRef}
          onDragStart={() => {
              setGroupPos({ isDragging: true, ...groupPos });
            }}
          // onDragMove={(e) => {
          //   setGroupPos({ isDragging: true, x: e.target.x(), y: e.target.y() });
          // }}
          onDragEnd={(e) => {
            setGroupPos({
              isDragging: false,
              x: e.target.x(),
              y: e.target.y()
            });
            if (props.setPosText !== null) {
              props.setPosText({ x: e.target.x(), y: e.target.y() });
            }
          }}
          x={groupPos.x}
          y={groupPos.y}
        >
          <OrnamentJoe
            width={56}
            height={80}
            // x={props.clickPos.x}
            // y={props.clickPos.y}
            // offsetX={shapePos.offX}
            // offsetY={shapePos.offY}
            onMouseEnter={(e) => {
              if (!playing) {
                openAnim(e.target);
              }
            }}
            onClick={() => {
              setSpotifyOpen(!spotifyOpen);
            }}
            onTap={(e) => {
              openAnim(e.target);
              setSpotifyOpen(!spotifyOpen);
            }}
            onDragStart={() => {
              setShapePos({ isDragging: true, ...shapePos });
            }}
            onDragMove={(e) => {
              setShapePos({ isDragging: true, x: e.target.x(), y: e.target.y() });
            }}
            onDragEnd={(e) => {
              setShapePos({
                isDragging: false,
                x: e.target.x(),
                y: e.target.y()
              });
          }}
            //draggable
          />
          <Ornament open={spotifyOpen} groupX={groupPos.x} groupY={groupPos.y} />
          {/* <Html divProps={{
            style: {
              visibility: "hidden",
              position: 'absolute',
              top: dragState.x+152,
              left: dragState.y
            }
          }}>
            <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/75lDyECrTKDz9LIkYvsbzZ?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </Html> */}
        </Group>
  );
};

const Ornament = (props) => {
  const [flag, setFlag] = useState(false);
  return (
    <Spring
      native
      from={{ scaleX: 0, scaleY: 0, offsetX: -20 }}
      to={{
        //x: props.groupX,
        scaleX: props.open ? 1 : 0,
        scaleY: props.open ? 1 : 0,
        // width: props.open ? '100%': '0%',
        // height: props.open ? 152 : 0
      }}
    >
      {(p) => (
        <animated.Group {...p}>
          <Html>
            <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/30OoBXRO3KkKOBODhcsu9k" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          </Html>
        </animated.Group>
      )}
    </Spring>
  );
};

export default function WebPlayer(props){
  const stageWidth = 800;
  const stageHeight = 600;
  const [windowSize, setWindowSize] = useState({ width: stageWidth, height: stageHeight, scale: 0 });
  let scale = Math.min(windowSize.width / stageWidth, windowSize.height / stageHeight);
  let sWidth = stageWidth;
  let sHeight = stageHeight;
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const imgRef = useRef(null);

  let stagePosX = (stageWidth * scale) * 0.5;
  let stagePosY = (stageHeight * scale) * 0.5;
  const [player, setPlayer] = useState();
  const [posText, setPosText] = useState({ x: 0, y: 0 });
  const [backgroundTransform, setBackgroundTransform] = useState({});
  const [clickPos, setPos] = useState({});

  const pulseShape = (shape) => {
    shape.to({
      scaleX: 1.5,
      scaleY: 1.5,
      onFinish: () => {
        shape.to({
          scaleX: 1,
          scaleY: 1
        });
      }
    });
  };

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

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = "https://sdk.scdn.co/spotify-player.js";
  //   script.async = true;

  //   document.body.appendChild(script);

  //   //@ts-ignore
  //   window.onSpotifyWebPlaybackSDKReady = () => {
  //     //@ts-ignore
  //     const player = new window.Spotify.Player({
  //       name: 'Web Playback SDK',
  //       getOAuthToken: (cb) => { cb(props.token); },
  //       volume: 0.5
  //     });

  //     setPlayer(player);

  //     player.addListener('ready', ({ device_id }) => {
  //       console.log('Ready with device ID', device_id);
  //     });
  //     player.addListener('not_ready', ({ device_id }) => {
  //       console.log('Device ID Offline', device_id);
  //     });

  //     player.connect();
  //   };
  // }, []);
  // useEffect(() => {
  //   async function getPlaylists() {
  //     const { token } = props;
  //     const playListUrl = `https://api.spotify.com/v1/me/playlists`;
  //     const req = {
  //       method: 'get',
  //       headers: {
  //         'Authorization': 'Bearer ' + token
  //       }
  //     };
  //     const res = await axios.get(playListUrl, req);
  //     console.log(res);
  //   }
  //   getPlaylists();
  //   //pulseShape(rectRef.current);
  // }, []);
  useEffect(() => {
    if (imgRef.current) {
      const transform = imgRef.current.getAbsoluteTransform().copy();
      setBackgroundTransform(transform.invert());
    }
  }, [imgRef]);
  return (<div className="wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
      <div ref={containerRef} className="cardWrapper" style={{ width: '50%' }}>
        <Stage  width={windowSize.width} height={windowSize.height} scale={{ x: scale, y: scale }}>
        <Layer ref={backgroundRef}>
          {/* <Path
            data={tree}
            /> */}
          <TreeImage
            ref={imgRef}
            canvasWidth={windowSize.width / scale}
            canvasHeight={windowSize.height / scale}
            onClick={(e) => {
              const transform = e.target.getAbsoluteTransform().copy();
              transform.invert();
              let pos = e.target.getStage().getPointerPosition();
              console.log(transform.point(pos));
              setPos(transform.point(pos));
            }}
            scale={scale}
          />
          <OrnamentWrapper setPosText={(obj) => setPosText(obj)} bgTransform={backgroundTransform} clickPos={clickPos} scale={windowSize.scale} />
        </Layer>
        <Layer>
          <Text text={`X: ${posText.x} Y: ${posText.y}`} />
          
        </Layer>
        <Layer>
          <SnowStorm snowColor={'#00a7b5'} followMouse={false} excludeMobile={false} />
        </Layer>
      </Stage>
    </div>
  </div>
  );
  // return (<div>
  //   <img src={treeTest} />
  //   <iframe style={{ borderRadius: '12px' }} src="https://open.spotify.com/embed/playlist/75lDyECrTKDz9LIkYvsbzZ?utm_source=generator&theme=0" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  // </div>);
}