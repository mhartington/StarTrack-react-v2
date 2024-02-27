import {
  IonButton,
  IonButtons,
  IonContent,
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
  pause,
  play,
  playBack,
  playForward,
  volumeHigh,
  volumeOff,
} from 'ionicons/icons';
import { PlaybackStates } from '../../@types/player';
import { useEffect, useState } from 'react';

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
  const [playbackTime, setPlaybackTime] = useState(0);
  useEffect(() => {
    if (isScrubbing === false) {
      setPlaybackTime(state.playbackTime);
    }
  }, [state.playbackTime]);
  function pauseSeeking(e: RangeCustomEvent) {
    e.stopPropagation();
    setIsScrubbing(true);
  }
  function seekTo(e: RangeCustomEvent) {
    e.stopPropagation();
    setIsScrubbing(false);
    seekToTime(e.detail.value as number);
  }
  return (
    <>
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <IonContent scrollX={false} scrollY={false}>
        <div className="modal-wrapper">
          <div className="track-player">
            <div className="song-info">
              <IonThumbnail>
                <LazyImg
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
                  color="primary"
                  fill="clear"
                  className="prev-button"
                  onClick={skipToPrevious}
                >
                  <IonIcon icon={playBack} slot="icon-only" />
                </IonButton>
                <IonButton
                  shape="round"
                  color="primary"
                  fill="clear"
                  onClick={togglePlay}
                >
                  {state.playbackState === PlaybackStates.LOADING ? (
                    <IonSpinner />
                  ) : state.playbackState === PlaybackStates.PLAYING ? (
                    <IonIcon icon={pause} slot="icon-only" />
                  ) : (
                    <IonIcon icon={play} slot="icon-only" />
                  )}
                </IonButton>
                <IonButton
                  shape="round"
                  color="primary"
                  fill="clear"
                  onClick={skipToNext}
                >
                  <IonIcon icon={playForward} slot="icon-only" />
                </IonButton>
              </IonButtons>

              <IonRange
                color="white"
                aria-label="player volume control"
                step={0.01}
                min={0}
                max={1}
                onIonInput={(e) => setVol(e.detail.value as number)}
                value={state.volume}
              >
                <IonIcon color="white" slot="start" icon={volumeOff} />
                <IonIcon color="white" slot="end" icon={volumeHigh} />
              </IonRange>
            </div>
          </div>
        </div>
      </IonContent>
    </>
  );
}
