import { createContext, useContext, useEffect, useState } from 'react';

const MusickitContext = createContext<{ mk: any; mkEvents: any }>({
  mk: null,
  mkEvents: null,
});

export const useMusickit = () => {
  const { mk, mkEvents } = useContext(MusickitContext);
  return { mk, mkEvents };
};

export const MusickitProvider = ({
  token,
  children,
}: {
  token: any;
  children: JSX.Element;
}) => {
  const [mk, setMk] = useState(null);
  const [mkEvents, setMkEvents] = useState(null);

  useEffect(() => {
    (async () => {
      await (window as any).MusicKit.configure({
        developerToken: token,
        bitrate: (window as any).MusicKit.PlaybackBitrate.HIGH,
        app: {
          name: 'Star Track',
          build: '1.0',
          declarativeMarkup: false,
          debug: false,
          storefrontId: 'us',
          suppressErrorDialog: true,
          icon: 'https://startrack-ng.web.app/assets/icons/icon-mask.png',
        },
      }).then(() => {
        setMk((window as any).MusicKit.getInstance());
        setMkEvents((window as any).MusicKit.Events);
      });
    })();
  }, []);

  return (
    <>
      {mk ? (
        <MusickitContext.Provider value={{ mk, mkEvents }}>
          {children}
        </MusickitContext.Provider>
      ) : null}
    </>
  );
};
