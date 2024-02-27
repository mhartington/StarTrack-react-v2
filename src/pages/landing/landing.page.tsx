import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { musicalNotes } from 'ionicons/icons'
export function LandingPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className='transparent'>
          <IonTitle>Star Track</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding ion-text-center'>
        <h3>
          Welcome to Star Track
          <IonIcon icon={musicalNotes} color='primary'></IonIcon>
        </h3>
        <p>Star Track is a simple way to interact with Apple Music.</p>
        <IonButton routerLink='/browse'>Get Started</IonButton>
      </IonContent>
    </IonPage>
  );
}
