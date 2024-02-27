import { createRoot } from 'react-dom/client';
import App from './App';
import { MusickitProvider } from './context/musickit';
import { PlayerStateProvider } from './context/player';

const token = import.meta.env.VITE_MUSICKIT_TOKEN;
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(


    <MusickitProvider token={token}>
      <PlayerStateProvider>
    <App />
    </PlayerStateProvider>
  </MusickitProvider>
  );
