import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useMusickit } from '../../context/musickit';
import { AlbumHeader } from '../../components/album-header/album-header.component';
import { SongItem } from '../../components/song-item/song-item.component';
import { Playlist } from '../../@types/playlist';
import { LazyImg } from '../../components/lazy-img/lazy-img.component';
import { usePlayer } from '../../context/player';
function LoadingTemplate() {
  return (
    <>
      <AlbumHeader collection={null!} playCollection={() => {}} />
      <hr />
      <IonList>
        {[...new Array(20).keys()].map(() => (
          <SongItem key={crypto.randomUUID()}></SongItem>
        ))}
      </IonList>
    </>
  );
}
export function PlaylistPage() {
  const [collection, setCollection] = useState<Playlist>();
  const { id } = useParams<{ id: string }>();
  const { mk } = useMusickit();
  const {playCollection} = usePlayer();

  async function playSong(startWith: number, shuffle = false) {
    playCollection({shuffle, playlist: collection!.id, startWith})
  }

  useEffect(() => {
    const fetchAlbum = async (id: string) => {
      const {
        data: { data: res },
      }: { data: { data: [Playlist] } } = await mk.api.music(
        `v1/catalog/${mk.storefrontId}/playlists/${id}`,
        { 'art[url]': 'f' },
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
              disabled={!song.attributes?.releaseDate}
              songName={song.attributes?.name}
              artistName={song.attributes?.artistName}
              onClick={() => playSong(idx)}
            >
              <IonThumbnail slot="start">
                <LazyImg src={song.attributes?.artwork?.url} width={80} />
              </IonThumbnail>
            </SongItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
