import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Menu from './components/Menu';

import '@ionic/react/css/ionic.bundle.css';
import './theme/variables.css';

import { LandingPage } from './pages/landing/landing.page';
import { BrowsePage } from './pages/browse/browse.page';
import { AlbumPage } from './pages/album/album.page';
import { PlaylistPage } from './pages/playlist/playlist.page';
import { TrackPlayer } from './components/track-player/track-player.component';
import { SearchPage } from './pages/search/search.pages';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main" when="(min-width: 850px)">
          <Menu />
          <div className="route-wrapper" id="main">
            <IonRouterOutlet>
              <Route path="/" exact={true}>
                <LandingPage />
              </Route>
              <Route path="/browse" exact={true}>
                <BrowsePage />
              </Route>
              <Route path="/us/album/:id" exact={true}>
                <AlbumPage />
              </Route>
              <Route path="/us/playlist/:id" exact={true}>
                <PlaylistPage />
              </Route>
              <Route path="/search" exact={true}>
                <SearchPage/>
              </Route>
            </IonRouterOutlet>
            <TrackPlayer />
          </div>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
