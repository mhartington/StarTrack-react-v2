import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { PlaybackStates, PlayerState, QueueOpts } from '../@types/player';
import { Song, SongAttributes } from '../@types/song';
import { useMusickit } from './musickit';

const nowPlayingAttrs: Partial<SongAttributes> = {
  name: '',
  artistName: '',
  albumName: '',
  artwork: { url: '/assets/imgs/default.svg' },
};
const nowPlayingInit: Partial<Song> = {
  attributes: nowPlayingAttrs,
};
const initialState: PlayerState = {
  bitrate: 256,
  playbackState: PlaybackStates.NONE,
  queue: [],
  upNext: [],
  queuePosition: 0,
  repeatMode: 0,
  shuffleMode: 0,
  infiniteLoadTimeout: null,
  playbackDuration: 0,
  playbackTime: 0,
  playbackTimeRemaining: 0,
  nowPlaying: nowPlayingInit,
  volume: 1,
};

type PlayerContextType = {
  state: PlayerState;
  dispatch: React.Dispatch<{ type: string; payload: any }>;
};

const PlayerContext = createContext<PlayerContextType>({
  state: initialState,
  dispatch: () => {},
});

export function PlayerStateProvider({ children }: { children: JSX.Element }) {
  const { mk, mkEvents } = useMusickit();

  const reducer = (
    state = initialState,
    action: { type: string; payload?: any },
  ): PlayerState => {
    switch (action.type) {
      case 'mediaPlaybackError':
        return { ...state, nowPlaying: nowPlayingInit, queue: [] };

      case 'playbackTimeDidChange':
        return {
          ...state,
          playbackTime: action.payload.currentPlaybackTime,
          playbackTimeRemaining: action.payload.currentPlaybackTimeRemaining,
        };

      case 'playbackDurationDidChange':
        return { ...state, playbackDuration: action.payload.duration };

      case 'playbackStateDidChange':
        return { ...state, playbackState: action.payload.state };

      case 'nowPlayingItemDidChange':
        if (action.payload.item) {
          return { ...state, nowPlaying: action.payload.item, playbackTime: 0 };
        }

      case 'queueItemsDidChange':
        return {
          ...state,
          queue: mk.queue.items,
          upNext: mk.queue.unplayedUserItems.slice(1),
        };

      case 'queuePositionDidChange':
        return {
          ...state,
          queuePosition: action.payload.position + 1,
          upNext: mk.queue.unplayedUserItems.slice(1),
        };

      case 'shuffleModeDidChange':
        return { ...state, shuffleMode: action.payload };

      case 'repeatModeDidChange':
        return { ...state, repeatMode: action.payload };
      default:
        return state;
    }
  };
  useEffect(() => {
    const bindingFunctions: Record<string, (e: any) => void> = {};

    for (let [_, eventName] of Object.entries<string>(mkEvents)) {
      const handler = (e: any) => dispatch({ type: eventName, payload: e });
      bindingFunctions[eventName] = handler;
      mk.addEventListener(eventName, handler);
    }
    return () => {
      for (const [eventName, func] of Object.entries(bindingFunctions)) {
        mk.removeEventListener(eventName, func);
        delete bindingFunctions[eventName];
      }
    };
  }, []);

  let [state, dispatch] = useReducer(reducer, initialState);
  let value = { state, dispatch };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayerState() {
  const { state } = useContext(PlayerContext);
  return { state };
}

// Player actions
export function usePlayer() {
  const { mk } = useMusickit();
  const [volume, setVolume] = useState(mk.volume);
  useEffect(() => {
      mk.volume = volume
  }, [volume])
  async function playCollection(opts: QueueOpts) {
    await mk.setQueue(opts);
    toggleShuffle(opts.shuffle || false);
    await play();
  }
  async function play() {
    await mk.play();
  }
  async function pause() {
    await mk.pause();
  }
  async function stop() {
    await mk.stop();
  }
  async function togglePlay() {
    mk.playbackState === PlaybackStates.PAUSED ? await play() : await pause();
  }
  function toggleShuffle(shouldShuffle: boolean): void {
    mk.shuffle = shouldShuffle;
  }
  async function skipToNext() {
    await stop();
    const repeatMode = mk.repeatMode;
    if (repeatMode === 1) {
      return await seekToTime(0);
    }
    return await mk.skipToNextItem();
  }
  async function skipToPrevious() {
    await stop();
    const repeatMode = mk.repeatMode;
    if (repeatMode === 1) {
      return await seekToTime(0);
    }
    return await mk.skipToPreviousItem();
  }
  async function seekToTime(time: number) {
    console.log(typeof time);
    await mk.seekToTime(time);
  }

  function setVol(vol: number){
    setVolume(vol)
  }

  

  /* async function skipTo(song: Song) { */
  /*   const index = this.queue().indexOf(song); */
  /*   await this.stop(); */
  /*   await this.mkInstance.changeToMediaAtIndex(index); */
  /* } */

  return {
    playCollection,
    togglePlay,
    toggleShuffle,
    skipToNext,
    skipToPrevious,
    seekToTime,
    setVol
  };
}
