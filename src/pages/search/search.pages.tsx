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
    albums: data.results.albums?.data ?? null,
    songs: data.results.songs?.data ?? null,
    playlists: data.results.playlists?.data ?? null,
  };

  /* const songsToFetch = ogData.songs.map((song) => song.id); */
  /* const { data: newSongs } = await this.fetchSongs(songsToFetch); */
  /* ogData.songs = newSongs.data; */
  return ogData;
}

function SearchResultsList({
  filterTerm,
  results,
}: {
  filterTerm: string;
  results: SearchResuls;
}) {
  function playSong(e: any) {
    console.log(e);
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
            >
            <IonThumbnail slot="start">
              <LazyImg src={song.attributes?.artwork?.url} width={80} ></LazyImg>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] =
    useState<SearchResuls>(searchResultsInit);

  const [segmentFilter, setSegmentFilter] = useState('songs');

  const { mk } = useMusickit();
  const handleSearch = useDebouncedCallback(async (value = '') => {
    if (value) {
      const data = await searchAsync(mk, value);
      setSearchResults(data);
    } else {
      setSearchResults(searchResultsInit);
    }
    setSearchTerm(value);
  }, 500);
  return (
    <IonPage className="search-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle></IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonInput={(e) => handleSearch(e.detail.value)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment
          scrollable
          value={segmentFilter}
          onIonChange={(e) => setSegmentFilter(e.detail.value as string)}
        >
          {searchResults.songs.length ? (
            <IonSegmentButton value="songs"> Songs </IonSegmentButton>
          ) : null}
          {searchResults.albums.length ? (
            <IonSegmentButton value="albums"> Albums </IonSegmentButton>
          ) : null}
          {searchResults.playlists.length ? (
            <IonSegmentButton value="playlists"> Playlists </IonSegmentButton>
          ) : null}
        </IonSegment>
        <SearchResultsList filterTerm={segmentFilter} results={searchResults} />
        {/* <pre>{JSON.stringify(searchResults, null, 2)}</pre> */}
      </IonContent>
    </IonPage>
  );
}
