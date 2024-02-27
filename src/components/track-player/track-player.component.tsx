import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonLabel,
  IonNote,
  IonRange,
  IonSpinner,
  IonThumbnail,
  IonToolbar,
  RangeCustomEvent, 
  useIonModal,
} from '@ionic/react';
import { LazyImg } from '../lazy-img/lazy-img.component';
import { pause, play, playBack, playForward } from 'ionicons/icons';

import './track-player.component.css';

import { PlaybackStates } from '../../@types/player';
import { usePlayer, usePlayerState } from '../../context/player';
import { useEffect, useState } from 'react';
import { PlayerModal } from '../player-modal/player-modal.component';

export function TrackPlayer() {
  const { state } = usePlayerState();

  const { togglePlay, seekToTime, skipToNext, skipToPrevious } = usePlayer();
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [present] = useIonModal(PlayerModal);

  function showModal(e: any) {
    present({canDismiss: true, cssClass: 'full-modal'});
  }

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
    <div className="floating-bar" onClick={showModal}>
      <IonFooter className="mh-footer" translucent={true}>
        <IonToolbar className="track-wrapper " color="light">
          <div className="track-player">
            <div className="song-info">
              <IonThumbnail>
                <LazyImg
                  src={state.nowPlaying.attributes?.artwork?.url}
                  alt="The album art work cover"
                />
              </IonThumbnail>
              <IonLabel>
                <p>{state.nowPlaying.attributes?.name}</p>
                {state.nowPlaying.attributes?.artistName ? (
                  <IonNote className="artist-name">
                    {state.nowPlaying.attributes?.artistName}
                  </IonNote>
                ) : null}
              </IonLabel>
            </div>
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
            />
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
          </div>
        </IonToolbar>
      </IonFooter>
    </div>
  );
}
