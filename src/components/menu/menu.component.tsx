import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import {
  albumsOutline,
  chevronForward,
  gridOutline,
  logIn,
  logOut,
  musicalNote,
  search,
  timeOutline,
} from 'ionicons/icons';
import { useMusickit } from '../../context/musickit';
import { useEffect, useState } from 'react';
import './menu.component.css';
export function Menu() {
  const location = useLocation();
  const { mk, mkEvents } = useMusickit();
  const [isLoggedIn, setIsLoggedIn] = useState(mk.isAuthorized);
  const [selectedStatus, setSelectedStatus] = useState('library');

  async function login() {
    await mk.authorize();
  }

  async function logout() {
    await mk.unauthorize();
  }
  const handleStatusChange = () => setIsLoggedIn(mk.isAuthorized);
  useEffect(() => {
    mk.addEventListener(
      mkEvents.authorizationStatusDidChange,
      handleStatusChange,
    );

    return () => {
      mk.removeEventListener(
        mkEvents.authorizationStatusDidChange,
        handleStatusChange,
      );
    };
  }, []);
  return (
    <IonMenu contentId="main" type="overlay">
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Music</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Music</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList lines="none">
          <IonItemGroup>
            <IonMenuToggle autoHide={false}>
              <IonItem
                routerLink="/browse"
                routerDirection="root"
                className={location.pathname === '/browse' ? 'selected' : ''}
                detail={false}
              >
                <IonIcon
                  color="primary"
                  slot="start"
                  src={gridOutline}
                ></IonIcon>
                Browse
              </IonItem>
            </IonMenuToggle>
            <IonMenuToggle autoHide={false}>
              <IonItem
                routerLink="/search"
                routerDirection="root"
                className={location.pathname === '/search' ? 'selected' : ''}
                detail={false}
              >
                <IonIcon color="primary" slot="start" src={search}></IonIcon>
                Search
              </IonItem>
            </IonMenuToggle>
          </IonItemGroup>
          {isLoggedIn ? (
            <>
              <IonAccordionGroup
                multiple={true}
                value={selectedStatus}
                onIonChange={(e) => setSelectedStatus(e.detail.value)}
              >
                <IonAccordion value="library" toggleIcon={chevronForward}>
                  <IonItem slot="header">
                    <IonLabel>
                      <h1>Library</h1>
                    </IonLabel>
                  </IonItem>
                  <IonList slot="content">
                    <IonMenuToggle autoHide={false}>
                      <IonItem
                        routerLink="/search"
                        routerDirection="root"
                        detail={false}
                      >
                        <IonIcon
                          color="primary"
                          slot="start"
                          src={timeOutline}
                        ></IonIcon>
                        Recently Added
                      </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                      <IonItem routerDirection="root" detail={false}>
                        <IonIcon
                          color="primary"
                          slot="start"
                          src={albumsOutline}
                        ></IonIcon>
                        Album
                      </IonItem>
                    </IonMenuToggle>
                    <IonMenuToggle autoHide={false}>
                      <IonItem
                        routerLink="/search"
                        routerDirection="root"
                        detail={false}
                      >
                        <IonIcon
                          color="primary"
                          slot="start"
                          src={musicalNote}
                        ></IonIcon>
                        Songs
                      </IonItem>
                    </IonMenuToggle>
                  </IonList>
                </IonAccordion>
              </IonAccordionGroup>

              <IonMenuToggle autoHide={false}>
                <IonItem
                  onClick={logout}
                  lines="none"
                  button={true}
                  detail={false}
                >
                  <IonIcon src={logOut} slot="start" color="primary"></IonIcon>
                  Log Out
                </IonItem>
              </IonMenuToggle>
            </>
          ) : (
            <IonMenuToggle autoHide={false}>
              <IonItem
                onClick={login}
                lines="none"
                button={true}
                detail={false}
              >
                <IonIcon src={logIn} slot="start" color="primary"></IonIcon>
                Log In
              </IonItem>
            </IonMenuToggle>
          )}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
