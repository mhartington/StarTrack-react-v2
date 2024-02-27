import {
  IonItem,
  IonText,
  IonLabel,
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonNote,
} from '@ionic/react';
import { ellipsisHorizontal } from 'ionicons/icons';
import './song-item.component.css';
function LoadingTemplate() {
  return (
    <IonLabel>
      <IonSkeletonText animated style={{ width: '88%', maxWidth: '300px' }} />
      <IonSkeletonText animated style={{ width: '70%', maxWidth: '250px' }} />
      <IonSkeletonText animated style={{ width: '60%', maxWidth: '200px' }} />
    </IonLabel>
  );
}

export function SongItem({
  song,
  index,
  disabled,
  songName,
  artistName,
  onClick,
  children,
}: {
  onClick?: React.MouseEventHandler<HTMLIonItemElement>;
  song?: any;
  index?: number;
  disabled?: boolean;
  songName?: string;
  artistName?: string;
  children?: JSX.Element;
}) {
  return (
    <IonItem
      button={true}
      detail={false}
      disabled={disabled}
      className="song-item"
      onClick={onClick}
    >
      {children}
      {index ? (
        <IonText color="medium" slot="start">
          <p className="index">{index}</p>
        </IonText>
      ) : null}

      {song ? (
        <>
          <IonLabel className="ion-text-nowrap">
            <h3>{songName}</h3>
            <IonNote>
              <p>{artistName}</p>
            </IonNote>
          </IonLabel>
          {song.attributes.contentRating === 'explicit' ? (
            <div className="rating">E</div>
          ) : null}
          <IonButton slot="end" fill="clear" color="dark">
            <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
          </IonButton>
        </>
      ) : (
        <LoadingTemplate />
      )}
    </IonItem>
  );
}
