import {
  IonButtons,
  IonContent,
  IonHeader,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { SongItem } from '../../components/song-item/song-item.component';
import { useEffect, useState } from 'react';
import { useMusickit } from '../../context/musickit';
import './browse.page.css';
import { AlbumPreviewItem } from '../../components/album-preview-items/album-preview-items.component';
import { LazyImg } from '../../components/lazy-img/lazy-img.component';
import { Album } from '../../@types/album';
import { Playlist } from '../../@types/playlist';
import { Song } from '../../@types/song';
import { usePlayer, usePlayerState } from '../../context/player';

type BrowsePageState = {
  albums: Album[];
  playlists: Playlist[];
  songs: Song[];
};
function LoadingTemplate() {
  return (
    <>
      <IonList>
        <IonListHeader>
          <h2>Top Albums</h2>
        </IonListHeader>
        <div className="album-grid">
          {[...new Array(20).keys()].map(() => (
            <AlbumPreviewItem key={crypto.randomUUID()}>
              <LazyImg width={200}></LazyImg>
            </AlbumPreviewItem>
          ))}
        </div>
      </IonList>
      <IonList>
        <IonListHeader>
          <h2>Top Playlists</h2>
        </IonListHeader>
        <div className="album-grid">
          {[...new Array(20).keys()].map(() => (
            <AlbumPreviewItem key={crypto.randomUUID()}>
              <LazyImg width={200}></LazyImg>
            </AlbumPreviewItem>
          ))}
        </div>
      </IonList>
      <IonList>
        <IonListHeader>
          <h2>Top Songs</h2>
        </IonListHeader>
        <div className="song-grid">
          {[...new Array(20).keys()].map(() => (
            <SongItem key={crypto.randomUUID()}>
              <IonThumbnail slot="start">
                <LazyImg width={200}></LazyImg>
              </IonThumbnail>
            </SongItem>
          ))}
        </div>
      </IonList>
    </>
  );
}
export function BrowsePage() {
  const [charts, setCharts] = useState<BrowsePageState | null>(null);
  const { mk } = useMusickit();
  const {playCollection} = usePlayer();

  useEffect(() => {
    const getCharts = async () => {
      const searchTypes = ['songs', 'albums', 'playlists'];
      try {
        const { data } = await mk.api.music(
          `v1/catalog/${mk.storefrontId}/charts`,
          {
            types: searchTypes,
            limit: 32,
            'art[url]': 'f',
            'format[resources]': 'map',
          },
        );
        const results: {
          albums: Album[];
          songs: Song[];
          playlists: Playlist[];
        } = {
          albums: Object.values(data.resources.albums),
          songs: Object.values(data.resources.songs),
          playlists: Object.values(data.resources.playlists),
        };
        setCharts(results);
      } catch (e) {
        console.log(e);
      }
    };
    getCharts();
  }, []);
  function playSongs(startWith: number){
    const songs = charts?.songs!;
    const songsToPlay = songs.map((song) => song.id) as string[];
    playCollection({songs: songsToPlay, startWith})
  }
  return (
    <IonPage className="browse-page">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton color="primary" />
          </IonButtons>
          <IonTitle>Browse</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        fullscreen={true}
        className="ion-padding-top ion-padding-bottom"
      >
        <IonHeader collapse="condense">
          <IonToolbar className="transparent">
            <IonTitle size="large">Browse</IonTitle>
          </IonToolbar>
        </IonHeader>
        {charts ? (
          <>
            <IonList>
              <IonListHeader>
                <h2>Top Albums</h2>
              </IonListHeader>
              <div className="album-grid">
                {charts.albums.map((album) => (
                  <AlbumPreviewItem
                    collection={album}
                    key={album.id}
                    href={`/us/album/${album.id}`}
                  >
                    <LazyImg
                      width={200}
                      src={album.attributes.artwork.url}
                      alt="Album Artwork"
                      bgColor={album.attributes.artwork.bgColor}
                    />
                  </AlbumPreviewItem>
                ))}
              </div>
            </IonList>

            <IonList>
              <IonListHeader>
                <h2>Top Playlists</h2>
              </IonListHeader>
              <div className="album-grid">
                {charts.playlists.map((playlist) => (
                  <AlbumPreviewItem
                    collection={playlist}
                    key={playlist.id}
                    href={`/us/playlist/${playlist.id}`}
                  >
                    <LazyImg
                      width={200}
                      src={playlist.attributes.artwork.url}
                      alt="Playlist Artwork"
                      bgColor={playlist.attributes.artwork.bgColor}
                    />
                  </AlbumPreviewItem>
                ))}
              </div>
            </IonList>

            <IonList>
              <IonListHeader>
                <h2>Top Songs</h2>
              </IonListHeader>
              <div className="song-grid">
                {charts.songs.map((song, idx) => (
                  <SongItem
                    song={song}
                    key={song.id}
                    artistName={song.attributes?.artistName}
                    songName={song.attributes?.name}
                    onClick={() => playSongs(idx)}
                  >
                    <IonThumbnail slot="start">
                      <LazyImg
                        width={200}
                        src={song.attributes?.artwork?.url}
                        alt="Album Artwork"
                        bgColor={song.attributes?.artwork?.bgColor}
                      />
                    </IonThumbnail>
                  </SongItem>
                ))}
              </div>
            </IonList>
          </>
        ) : (
          <LoadingTemplate />
        )}
      </IonContent>
    </IonPage>
  );
}
