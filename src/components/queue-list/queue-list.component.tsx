import { IonText } from '@ionic/react';
import { SongItem } from '../song-item/song-item.component';
import './queue-list.component.css';
import { usePlayerState } from '../../context/player';
export function QueueList({ children }: { children: JSX.Element }) {
  const { state } = usePlayerState();
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
          ></SongItem>
        ))}
      </div>
    </div>
  );
}
