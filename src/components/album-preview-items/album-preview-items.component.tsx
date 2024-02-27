import {
  IonCard,
  IonLabel,
  IonNote,
  IonSkeletonText,
  useIonRouter,
} from '@ionic/react';

import './album-preview-items.component.css';
function LoadingTemplate() {
  return (
    <>
      <IonSkeletonText animated style={{ width: '88%', height: '16px' }} />
      <IonSkeletonText animated style={{ width: '70%', height: '14px' }} />
    </>
  );
}
export function AlbumPreviewItem({
  collection,
  index,
  href,
  children,
}: {
  collection?: any;
  index?: number;
  href?: string;
  children?: JSX.Element;
}) {
  const router = useIonRouter();

  const handleNav = () => {
    if (href) {
      router.push(href);
    } else {
      return;
    }
  };
  return (
    <a className='album-preview-item' onClick={handleNav}>
      <IonCard>{children}</IonCard>
      <IonLabel>
        {collection ? (
          <>
            <h3>
              {index != null ? (
                <span className='index'>{index + 1}</span>
              ) : null}
              <span>{collection.attributes.name}</span>
              {collection.attributes.contentRating === 'explicit' ? (
                <span className='rating'>E</span>
              ) : null}
            </h3>

            <IonNote>
              {collection.type === 'albums' ? (
                <p>{collection.attributes.artistName}</p>
              ) : null}
              {collection.type === 'playlists' ? (
                <p>{collection.attributes.curatorName}</p>
              ) : null}
            </IonNote>
          </>
        ) : (
          <LoadingTemplate />
        )}
      </IonLabel>
    </a>
  );
}
