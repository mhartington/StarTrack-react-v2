import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRange,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonToolbar,
  RangeCustomEvent,
} from '@ionic/react';
import './player-modal.component.css';
import { usePlayer, usePlayerState } from '../../context/player';
import { LazyImg } from '../lazy-img/lazy-img.component';
import {
  ellipsisHorizontal,
  list,
  pause,
  play,
  playBack,
  playForward,
  volumeHigh,
  volumeOff,
} from 'ionicons/icons';
import { PlaybackStates } from '../../@types/player';
import { useEffect, useState } from 'react';
import { BackgroundGlow } from '../background-glow/background-glow.component';
import useLocalStorageState from 'use-local-storage-state';
import { QueueList } from '../queue-list/queue-list.component';

function pad2(num: any) {
  if (num <= 99) {
    num = ('0' + num).slice(-2);
  }
  return num;
}
function durationFromMsHelper(ms: number) {
  let x: number = ms / 1000;
  const seconds: number = pad2(Math.floor(x % 60));
  x /= 60;
  const minutes: number = pad2(Math.floor(x % 60));
  x /= 60;
  const hours: number = Math.floor(x % 24);
  const newHours = hours ? pad2(hours) + ':' : '';
  return newHours + minutes + ':' + seconds;
}

const formatMsToSec = (val: number) => durationFromMsHelper(val * 1000);

export function PlayerModal() {
  const { state } = usePlayerState();
  const { seekToTime, togglePlay, skipToNext, skipToPrevious, setVol } =
    usePlayer();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(state.playbackTime);
  const [volumeLevel, setVolumeLevel] = useState(state.volume);
  const [isActive, setIsActive] = useLocalStorageState(
    'star-track:queue-active',
    { defaultValue: false },
  );

  function toggleActive() {
    if ((document as any)?.startViewTransition) {
      (document as any).startViewTransition(() => {
        setIsActive(!isActive);
      });
    }
  }

  useEffect(() => {
    if (isScrubbing === false) {
      setPlaybackTime(state.playbackTime);
    }
  }, [state.playbackTime]);

  useEffect(() => {
    if (isScrubbing === false) {
      setVolumeLevel(state.volume);
    }
  }, [state.volume]);

  function pauseSeeking(e: RangeCustomEvent) {
    e.stopPropagation();
    setIsScrubbing(true);
  }
  function seekTo(e: RangeCustomEvent) {
    e.stopPropagation();
    setIsScrubbing(false);
    seekToTime(e.detail.value as number);
  }

  function setVolume(e: RangeCustomEvent) {
    e.stopPropagation();
    setIsScrubbing(false);
    setVol(e.detail.value);
  }
  return (
    <>
      <IonHeader class="ion-no-border">
        <IonToolbar class="transparent"></IonToolbar>
      </IonHeader>
      <IonContent scrollX={false} scrollY={false}>
        <div className={`modal-wrapper ${isActive ? 'queue-active' : null}`}>
          <div className="track-player">
            <div className="song-info">
              <IonThumbnail>
                <LazyImg
                  className={`${state.playbackState === PlaybackStates.PAUSED || state.playbackState === PlaybackStates.NONE || state.playbackState === PlaybackStates.STOPPED ? 'paused' : '' }`}
                  width={500}
                  src={state.nowPlaying.attributes?.artwork?.url}
                  alt="The album artwork cover"
                />
              </IonThumbnail>

              <IonLabel>
                <div className="text-wrapper">
                  <h3>
                    <IonText color="white">
                      {state.nowPlaying.attributes?.name ?? 'Not Playing'}
                    </IonText>
                  </h3>
                  <p>
                    <IonText color="white">
                      {state.nowPlaying.attributes?.artistName}
                    </IonText>
                  </p>
                </div>
                {state.nowPlaying.attributes?.name ? (
                  <IonButtons>
                    <IonButton shape="round">
                      <IonIcon
                        slot="icon-only"
                        src={ellipsisHorizontal}
                      ></IonIcon>
                    </IonButton>
                  </IonButtons>
                ) : null}
              </IonLabel>
            </div>
            <QueueList>
                <p></p>
            </QueueList>
            <div className="controls-wrapper">
              <IonRange
                step={1}
                min={0}
                max={state.playbackDuration}
                value={playbackTime}
                onIonInput={(e) => setPlaybackTime(e.detail.value as number)}
                onIonKnobMoveStart={(e) => pauseSeeking(e)}
                onIonKnobMoveEnd={(e) => seekTo(e)}
                disabled={
                  state.playbackDuration === 0 ||
                  state.playbackState === PlaybackStates.NONE ||
                  state.playbackState === PlaybackStates.LOADING ||
                  state.playbackState === PlaybackStates.ENDED ||
                  state.playbackState === PlaybackStates.WAITING ||
                  state.playbackState === PlaybackStates.STALLED
                }
                aria-label="main track player"
                color="white"
              >
                <IonLabel className="duration-label" slot="start">
                  {formatMsToSec(playbackTime)}
                </IonLabel>
                <IonLabel className="duration-label" slot="end">
                  -{formatMsToSec(state.playbackDuration - playbackTime)}
                </IonLabel>
              </IonRange>

              <IonButtons className="song-actions">
                <IonButton
                  shape="round"
                  color="white"
                  fill="clear"
                  className="prev-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    skipToPrevious();
                  }}
                >
                  <IonIcon icon={playBack} slot="icon-only" color="white" />
                </IonButton>
                <IonButton
                  shape="round"
                  color="white"
                  fill="clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                >
                  {state.playbackState === PlaybackStates.LOADING ? (
                    <IonSpinner color="white" />
                  ) : state.playbackState === PlaybackStates.PLAYING ? (
                    <IonIcon icon={pause} slot="icon-only" color="white" />
                  ) : (
                    <IonIcon icon={play} slot="icon-only" color="white" />
                  )}
                </IonButton>
                <IonButton
                  shape="round"
                  color="white"
                  fill="clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    skipToNext();
                  }}
                >
                  <IonIcon icon={playForward} slot="icon-only" color="white" />
                </IonButton>
              </IonButtons>

              <IonRange
                color="white"
                aria-label="player volume control"
                step={0.01}
                min={0}
                max={1}
                onIonKnobMoveStart={(e) => pauseSeeking(e)}
                onIonKnobMoveEnd={(e) => setVolume(e)}
                onIonInput={(e) => setVolume(e)}
                value={volumeLevel}
              >
                <IonIcon color="white" slot="start" icon={volumeOff} />
                <IonIcon color="white" slot="end" icon={volumeHigh} />
              </IonRange>
            </div>
          </div>
        </div>
      </IonContent>
      <IonFooter class="ion-no-border">
        <IonToolbar class="transparent">
          <IonButtons slot="end">
            <IonButton color="white" onClick={toggleActive}>
              <IonIcon slot="icon-only" icon={list} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
      <BackgroundGlow src={state.nowPlaying.attributes?.artwork?.url!} />
    </>
  );
}
