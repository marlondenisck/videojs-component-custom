import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const App = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [watermarkPositions, setWatermarkPositions] = useState([]);
  

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    }],
    disablePictureInPicture: true,
    enableSmoothSeeking: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
      pictureInPictureToggle: false,
      volumePanel: {
        inline: false,
      },
      skipButtons: {
        forward: 10,
        backward: 10
      }
    },
    playsinline: true,
    spatialNavigation: {
      enabled: true,
      horizontalSeek: true
    },
    preferFullWindow: true,
  };

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = videoRef.current;
      playerRef.current = videojs(videoElement, videoJsOptions, () => {
        console.log('Player is ready');
      });
    }
  }, [videoRef, playerRef, videoJsOptions]);


  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = videoRef.current;
      playerRef.current = videojs(videoElement, videoJsOptions, () => {
        console.log('Player is ready');
      });
    }
  }, [videoRef, playerRef, videoJsOptions]);

  useEffect(() => {
    const updateWatermarkPositions = () => {
      const positions = [];
      const numWatermarks = 4; // Quantidade de marcas d'água
      for (let i = 0; i < numWatermarks; i++) {
        const top = Math.random() * 90; // Posição aleatória no eixo Y
        const left = Math.random() * 90; // Posição aleatória no eixo X
        positions.push({ top, left });
      }
      setWatermarkPositions(positions);
    };

    updateWatermarkPositions(); // Atualiza as posições inicialmente

    const intervalId = setInterval(updateWatermarkPositions, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(intervalId); // Limpa o intervalo quando o componente é desmontado
  }, []);

  const renderWatermarks = () => {
    return watermarkPositions.map((position, i) => (
      <div key={i} style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        zIndex: 1,
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.2)',
        background: 'transparent',
        padding: '5px',
        transform: 'rotate(-45deg)'
      }}>
        Minha Marca D'Água
      </div>
    ));
  };

  return (
    <div data-vjs-player style={{ position: 'relative' }}> 
       {renderWatermarks()}
      <video ref={videoRef} className="video-js vjs-big-play-centered" controls preload="auto" />
    </div>
  );
};

export default App;
