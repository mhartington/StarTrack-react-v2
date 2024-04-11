import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonNote,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Album } from '../../@types/album';
import { Playlist } from '../../@types/playlist';
import { LazyImg } from '../lazy-img/lazy-img.component';
import './album-header.component.css';
import { play, shuffle } from 'ionicons/icons';
import { useState } from 'react';

function formatDate(dateAsString: string) {
  const date = new Date(dateAsString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date);
}
function howLongAgo(dateAsString: string){

}

function LoadingTemplate() {
  return (
    <>
      <h3>
        <IonSkeletonText animated style={{ width: '80%' }} />
      </h3>
      <p className="genre-names">
        <IonSkeletonText animated style={{ width: '70%' }} />
      </p>
      <p className="editorial-notes">
        <IonSkeletonText animated style={{ width: '60%' }} />
      </p>
    </>
  );
}

export function AlbumHeader({
  collection,
  playCollection,
}: {
  collection: Album | Playlist;
  playCollection: (shouldSuffle: boolean) => void;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="album-header">
      <div className="album-artwork">
        <LazyImg
          src={collection?.attributes?.artwork?.url}
          width={350}
        ></LazyImg>
      </div>
      <div className="album-detail">
        {collection ? (
          <>
            <h3>{collection?.attributes?.name}</h3>
            <h3 className="name">
              <IonText color="primary">
                {collection.type === 'albums' ? collection.attributes.artistName : null}
                {collection.type === 'playlists' ? collection.attributes.curatorName : null}
              </IonText>
            </h3>
            <p className="genre-names">
              {collection.type === 'albums' ? (
                <IonNote>
                  {' '}
                  {collection.attributes.genreNames[0]} •{' '}
                  {formatDate(collection.attributes.releaseDate)}{' '}
                </IonNote>
              ) : null}

              {/* {collection.type === 'playlists' ? <IonNote>{collection.attributes.lastModifiedDate}</IonNote> : null} */}
            </p>
            <p className="editorial-notes" onClick={() => setShowModal(true)}>
              {collection.type === 'playlists' ? ( <IonNote>{collection.attributes.description.standard}</IonNote>) : null}
              {collection.type === 'albums' ? (
                <IonNote>
                  {collection.attributes.editorialNotes?.standard}
                </IonNote>
              ) : null}
            </p>

            <IonModal isOpen={showModal} className="editorial-modal">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>{collection.attributes.name}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton
                      color="primary"
                      fill="clear"
                      onClick={() => setShowModal(false)}
                    >
                      Done
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                {collection.type === 'playlists' ? (
                  <IonNote>
                    {collection.attributes.description.standard}
                  </IonNote>
                ) : null}
                {collection.type === 'albums' ? (
                  <IonNote>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: collection.attributes.editorialNotes?.standard,
                      }}
                    ></p>
                  </IonNote>
                ) : null}
              </IonContent>
            </IonModal>
          </>
        ) : (
          <LoadingTemplate />
        )}

        <IonButtons>
          <IonButton onClick={() => playCollection(false)} color="light" fill="solid">
            <IonIcon color="primary" slot="start" icon={play}></IonIcon>
            <IonText color="primary">Play</IonText>
          </IonButton>
          <IonButton
            onClick={() => playCollection(true)}
            color="light"
            fill="solid"
          >
            <IonIcon color="primary" icon={shuffle} slot="start"></IonIcon>
            <IonText color="primary">Shuffle</IonText>
          </IonButton>
        </IonButtons>
      </div>
    </div>
  );
}
