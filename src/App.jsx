/* eslint-disable react/prop-types */
import React from 'react'
import './App.css'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'


var MenuButton = videojs.getComponent("MenuButton");
var MenuItem = videojs.getComponent("MenuItem");
const Button = videojs.getComponent('Button')

// New syntax
class CustomMenuButton extends Button {

    /**
     * Creates an instance of this class.
     *
     * @param { import('./player').default } player
     *        The `Player` that this class should be attached to.
     *
     * @param {Object} [options]
     *        The key/value store of player options.
     */
    constructor(player, options) {
      super(player, options);
      // this.setIcon('fullscreen-enter');
      this.on(player, 'fullscreenchange', (e) => this.handleFullscreenChange(e));
  
      if (document[player.fsApi_.fullscreenEnabled] === false) {
        this.disable();
      }
    }
  
    /**
     * Builds the default DOM `className`.
     *
     * @return {string}
     *         The DOM `className` for this object.
     */
    buildCSSClass() {
      return `vjs-fullscreen-control ${super.buildCSSClass()}`;
    }
  
    /**
     * Handles fullscreenchange on the player and change control text accordingly.
     *
     * @param {Event} [event]
     *        The {@link Player#fullscreenchange} event that caused this function to be
     *        called.
     *
     * @listens Player#fullscreenchange
     */
    handleFullscreenChange(event) {
      if (this.player_.isFullscreen()) {
        this.controlText('Exit Fullscreen');
        // this.setIcon('fullscreen-exit');
      } else {
        this.controlText('Fullscreen');
        // this.setIcon('fullscreen-enter');
      }
    }
  
    /**
     * This gets called when an `FullscreenToggle` is "clicked". See
     * {@link ClickableComponent} for more detailed information on what a click can be.
     *
     * @param {Event} [event]
     *        The `keydown`, `tap`, or `click` event that caused this function to be
     *        called.
     *
     * @listens tap
     * @listens click
     */
    handleClick(event) {
      console.log('ae porra', event)
      const player = document.getElementById('watermark')
      const playerIsfullScreen = player.getAttributeNode('isfullscreen')
     console.log(playerIsfullScreen)
      if (!playerIsfullScreen || !playerIsfullScreen.isFullscreen()) {
        player.requestFullscreen();
        player.setAttribute('isfullscreen')
      } else {
        player.exitFullscreen();
      }
    }
  
  }


export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const waterMarkRef = React.useRef(null);
  
  const {options, onReady} = props

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        // videojs.log('player is ready');
        onReady && onReady(player);
      });

      const Button = videojs.getComponent('Button')
     
      
      const myButton = new Button(player, {
        clickHandler: function(event) {
          videojs.log('clicado bottao')
          console.log('event click', event)
          waterMarkRef.current.requestFullscreen()
        }
      })
      myButton.controlText('Fullscreen')
      myButton.addClass('vjs-visible-text')
      // myButton.setIcon('play')

  
      player.getChild('ControlBar').addChild(myButton)


   // Register as a component, so it can be added
videojs.registerComponent("CustomMenuButton", CustomMenuButton);

// Use `addChild` to add an instance of the new component, with options
player.controlBar.addChild("CustomMenuButton", {
  controlText: "My Awesome Menu", //It shows a text when the menu is hovered
  title: "My menu",
  myItems: [{ name: "Hello" }, { name: "World" }],
});


    // You could update an existing player in the `else` block here
    // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [onReady, options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (   
    <>
      <div className="watermark" ref={waterMarkRef} id='watermark' >  
      <div data-vjs-player style={{ height: '18.75rem',width:'37.5rem' }}>
        <div ref={videoRef} />
      </div>
        <p style={{ position: 'absolute' }}>watermark</p>
      </div> 
    </>
  );
}




const App = () => {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4'
    }]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
}

export default App