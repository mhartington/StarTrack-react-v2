import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonContent,
  IonSegmentButton,
  IonSegment,
  IonThumbnail,
  IonSpinner,
} from '@ionic/react';
import { useState } from 'react';

import { useDebouncedCallback } from 'use-debounce';
import { useMusickit } from '../../context/musickit';
import { Album } from '../../@types/album';
import { Song } from '../../@types/song';
import { Playlist } from '../../@types/playlist';

import './search.page.css';
import { SongItem } from '../../components/song-item/song-item.component';
import { LazyImg } from '../../components/lazy-img/lazy-img.component';
import { usePlayer } from '../../context/player';

type SearchResuls = {
  albums: Album[];
  songs: Song[];
  playlists: Playlist[];
};

const searchResultsInit = {
  albums: [],
  songs: [],
  playlists: [],
};

async function searchAsync(mk: any, term: string) {
  const types = ['songs', 'albums', 'playlists'];
  const { data } = await mk.api.music(`v1/catalog/${mk.storefrontId}/search`, {
    term,
    types,
    limit: 25,
    'art[url]': 'f',
  });
  const ogData: SearchResuls = {
    albums: data.results.albums?.data ?? [],
    songs: data.results.songs?.data ?? [],
    playlists: data.results.playlists?.data ?? [],
  };
  return ogData;
}

function SearchResultsList({
  filterTerm,
  results,
}: {
  filterTerm: string;
  results: SearchResuls;
}) {
  const { playCollection } = usePlayer();
  async function playSong(e: Song) {
    await playCollection({ song: e.id });
  }
  return (
    <>
      {filterTerm === 'songs'
        ? results.songs.map((song) => (
            <SongItem
              song={song}
              songName={song.attributes?.name}
              artistName={song.attributes?.artistName}
              key={song.id}
              onClick={() => playSong(song)}
            >
              <IonThumbnail slot="start">
                <LazyImg
                  src={song.attributes?.artwork?.url}
                  width={80}
                ></LazyImg>
              </IonThumbnail>
            </SongItem>
          ))
        : null}

      {filterTerm === 'albums'
        ? results.albums.map((album) => (
            <SongItem
              song={album}
              songName={album.attributes.name}
              artistName={album.attributes?.artistName}
              routerLink={`/us/album/` + album.id}
              key={album.id}
            >
              <IonThumbnail slot="start">
                <LazyImg
                  src={album.attributes?.artwork?.url}
                  width={80}
                ></LazyImg>
              </IonThumbnail>
            </SongItem>
          ))
        : null}

      {filterTerm === 'playlists'
        ? results.playlists.map((playlist) => (
            <SongItem
              song={playlist}
              songName={playlist.attributes.name}
              artistName={playlist.attributes?.curatorName}
              routerLink={`/us/playlist/` + playlist.id}
              onClick={() => {}}
              key={playlist.id}
            >
              <IonThumbnail slot="start">
                <LazyImg
                  src={playlist.attributes?.artwork?.url}
                  width={80}
                ></LazyImg>
              </IonThumbnail>
            </SongItem>
          ))
        : null}
    </>
  );
}

export function SearchPage() {
  const [state, setState] = useState<{
    searchResults: SearchResuls;
    searchTerm: string;
    segmentFilter: string;
    isLoading: boolean;
  }>({
    searchResults: searchResultsInit,
    searchTerm: '',
    segmentFilter: 'songs',
    isLoading: false,
  });

  const { mk } = useMusickit();
  const handleSearch = useDebouncedCallback(async (value = '') => {
    setState((prev) => ({ ...prev, isLoading: true, searchTerm: value }));
    if (value) {
      const data = await searchAsync(mk, value);
      setState((prev) => ({ ...prev, searchResults: data, isLoading: false }));
    } else {
      setState((prev) => ({ ...prev, searchResults: searchResultsInit, isLoading: false, }));
    }
  }, 500);

  return (
    <IonPage className="search-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={state.searchTerm}
            onIonInput={(e) => handleSearch(e.detail.value)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment
          scrollable
          value={state.segmentFilter}
          onIonChange={(e) =>
            setState({ ...state, segmentFilter: e.detail.value as string })
          }
        >
          {state.searchResults.songs.length ? (
            <IonSegmentButton value="songs"> Songs </IonSegmentButton>
          ) : null}
          {state.searchResults.albums.length ? (
            <IonSegmentButton value="albums"> Albums </IonSegmentButton>
          ) : null}
          {state.searchResults.playlists.length ? (
            <IonSegmentButton value="playlists"> Playlists </IonSegmentButton>
          ) : null}
        </IonSegment>
        {state.isLoading ? (
          <Loading />
        ) : (
          <SearchResultsList
            filterTerm={state.segmentFilter}
            results={state.searchResults}
          />
        )}
      </IonContent>
    </IonPage>
  );
}

function Loading() {
  return (
    <div className="ion-text-center ion-padding">
      <IonSpinner />
    </div>
  );
}
