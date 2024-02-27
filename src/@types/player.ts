import { Song } from "./song";

export enum PlaybackStates {
  NONE,
  LOADING,
  PLAYING,
  PAUSED,
  STOPPED,
  ENDED,
  SEEKING,
  NULL,
  WAITING,
  STALLED,
  COMPLETED,
}

export enum RepeatMode {
  NONE,
  ONE,
  ALL,
}

export type QueueOpts = {
  url?: string;
  shuffle?: boolean | false;
  startPosition?: number;
  startWith?: number;
  albums?: Array<string>;
  songs?: Array<string>;
  playlists?: Array<string>;
  album?: string;
  song?: string;
  playlist?: string;
};

export type PlayerState ={ 
  bitrate: number,
  playbackState: number,
  queue: Song[],
  upNext: Song[],
  queuePosition: number,
  repeatMode: 0 | 1 | 2,
  shuffleMode: 0 | 1,
  infiniteLoadTimeout: null,
  playbackDuration: number,
  playbackTime: number,
  playbackTimeRemaining: number,
  nowPlaying: Partial<Song>,
  volume: number,
}
