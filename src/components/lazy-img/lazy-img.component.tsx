import { useState } from 'react';

export const formatArtwork = (url: string, dim: number) =>
  url.replace(/\{w\}|\{h\}/g, dim.toString()).replace(/\{f\}/, 'webp'); //.replace('.jpg', '.webp');
import './lazy-img.component.css';
export function LazyImg({
  src = '',
  alt = '',
  width = 200,
  bgColor = 'var(--ion-color-step-150)',
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const onImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <div
      className='lazy-img'
      style={{ '--background': `${bgColor.includes('var') ? bgColor : "#" + bgColor}` } as React.CSSProperties}
    >
      <img
        role='presentation'
        loading='lazy'
        src={formatArtwork(src, width)}
        alt={alt}
        className={`lazy-img ${isLoaded ? 'loaded' : null}`}
        onLoad={onImageLoad}
        decoding='async'
      />
    </div>
  );
}
