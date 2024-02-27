import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Album } from '../../@types/album';
import { useMusickit } from '../../context/musickit';
import { AlbumHeader } from '../../components/album-header/album-header.component';
import { SongItem } from '../../components/song-item/song-item.component';
import { usePlayer, usePlayerState } from '../../context/player';
function LoadingTemplate() {
  return (
    <>
      <AlbumHeader collection={null!} />
      <hr />
      <IonList>
        {[...new Array(20).keys()].map(() => (
          <SongItem key={crypto.randomUUID()}></SongItem>
        ))}
      </IonList>
    </>
  );
}
export function AlbumPage() {
  const [collection, setCollection] = useState<Album>();
  const { id } = useParams<{ id: string }>();
  const { mk } = useMusickit();
  const {playCollection} = usePlayer();

  async function playSong(startWith: number, shuffle = false) {
    playCollection({shuffle, album: collection!.id, startWith})
  }

  useEffect(() => {
    const fetchAlbum = async (id: string) => {
      const {
        data: { data: res },
      }: { data: { data: [Album] } } = await mk.api.music(
        `v1/catalog/${mk.storefrontId}/albums/${id}`,
        { 'art[url]': 'f', 'include[albums]': 'tracks' },
      );
      setCollection(res[0]);
    };
    fetchAlbum(id);
  }, [id]);
  return (
    <IonPage className="album-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/browse"></IonBackButton>
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {collection ? <></> : <LoadingTemplate />}
        <AlbumHeader
          collection={collection!}
          playCollection={(shuffle) => playSong(0, shuffle)}
        />
        <hr />

        <IonList>
          {collection?.relationships.tracks.data.map((song, idx) => (
            <SongItem
              key={song.id}
              song={song}
              index={song.attributes?.trackNumber}
              disabled={!song.attributes?.releaseDate}
              songName={song.attributes?.name}
              onClick={() => playSong(idx)}
            ></SongItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
