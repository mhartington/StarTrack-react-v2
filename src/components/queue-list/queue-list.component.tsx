import { IonText, IonThumbnail } from '@ionic/react';
import { Song } from '../../@types/song';
import { usePlayer, usePlayerState } from '../../context/player';
import { SongItem } from '../song-item/song-item.component';

import './queue-list.component.css';
import { LazyImg } from '../lazy-img/lazy-img.component';

export function QueueList({ children }: { children: JSX.Element }) {
  const { state } = usePlayerState();
  const { skipTo } = usePlayer();
  async function playAt(song: Song) {
    await skipTo(song);
  }
  return (
    <div className="queue-list">
      <div className="queue-header">
        <h3>
          <IonText color="white">Playing Next</IonText>
        </h3>
        {children}
      </div>
      <div className="queue-scroller">
        {state.upNext.map((song) => (
          <SongItem
            key={song.id}
            song={song}
            artistName={song.attributes?.artistName}
            songName={song.attributes?.name}
            onClick={() => playAt(song)}
          >
              <IonThumbnail slot="start">
                <LazyImg src={song.attributes?.artwork?.url} width={80} />
              </IonThumbnail>
          </SongItem>
        ))}
      </div>
    </div>
  );
}
