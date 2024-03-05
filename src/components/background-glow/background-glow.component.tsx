import './background-glow.component.css';
import { formatArtwork } from '../lazy-img/lazy-img.component';
import { useRef } from 'react';

import {
  Application,
  Assets,
  Container,
  Graphics,
  Point,
  Sprite,
} from 'pixi.js';
import { useLayoutEffect } from 'react';
import { TwistFilter } from '@pixi/filter-twist';
import { AdjustmentFilter } from '@pixi/filter-adjustment';
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';

async function createApp(root: HTMLCanvasElement | undefined, src: string) {
  const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    view: root,
    powerPreference: 'low-power',
    backgroundAlpha: 0,
    resizeTo: window,
  });

  const graphics = new Graphics();
  graphics.beginFill('#5a5960');
  graphics.drawRect(0, 0, app.renderer.width, app.renderer.height);
  graphics.endFill();

  app.ticker.maxFPS = 15;

  const container = new Container();
  app.stage.addChild(container);
  initAnimation(app, container);
  await updateArtwork(app, container, src);
  return { container, app };
}

function addSpritesToContainer(
  largeCenter: Sprite,
  largeOffset: Sprite,
  mediumCenter: Sprite,
  smallCenter: Sprite,
  app: Application,
  container: Container,
) {
  largeCenter.anchor.set(0.5, 0.5);
  largeCenter.position.set(app.screen.width / 2, app.screen.height / 2);
  largeCenter.width = app.screen.width * 1.25;
  largeCenter.height = largeCenter.width;

  largeOffset.anchor.set(0.5, 0.5);
  largeOffset.position.set(app.screen.width / 2.5, app.screen.height / 2.5);
  largeOffset.width = app.screen.width * 0.8;
  largeOffset.height = largeOffset.width;

  mediumCenter.anchor.set(0.5, 0.5);
  mediumCenter.position.set(app.screen.width / 2, app.screen.height / 2);
  mediumCenter.width = app.screen.width * 0.5;
  mediumCenter.height = mediumCenter.width;

  smallCenter.anchor.set(0.5, 0.5);
  smallCenter.position.set(app.screen.width / 2, app.screen.height / 2);
  smallCenter.width = app.screen.width * 0.25;
  smallCenter.height = smallCenter.width;

  container.addChild(largeCenter, largeOffset, mediumCenter, smallCenter);
}

async function updateArtwork(
  app: Application,
  container: Container,
  img: string,
) {
  if (app) {
    const incomingTexture = await Assets.load(img);
    const incomingImgArray: Sprite[] = [];

    for (let h = 0; h < 4; h++) {
      const newImg = new Sprite(incomingTexture);
      newImg.alpha = 0;
      incomingImgArray.push(newImg);
    }

    if (container.children.length > 4) {
      container.removeChildren(4);
    }
    addSpritesToContainer(
      incomingImgArray[0],
      incomingImgArray[1],
      incomingImgArray[2],
      incomingImgArray[3],
      app,
      container,
    );

    const currentContainerCopy = container.children.slice(0, 4);
    let opacityDelta = 1;

    const currentRotationValArray = currentContainerCopy.map((h) => h.rotation);
    const rotationSpeed = 0.4;
    const opacitySpeed = app.ticker.deltaMS / 33.33333;

    app.ticker.add(() => {
      opacityDelta -= 0.02 * opacitySpeed;
      opacityDelta < 0 && container.removeChild(...currentContainerCopy);
      currentContainerCopy.forEach((a) => (a.alpha = opacityDelta));
      incomingImgArray.forEach((a) => (a.alpha = 1 - opacityDelta));
      //
      // this.reduceMotionQuery.matches
      //   ? ((currentRotationValArray[0] += 0.001 * rotationSpeed),
      //     (currentRotationValArray[1] += 0.001 * rotationSpeed),
      //     (currentRotationValArray[2] += 0.001 * rotationSpeed),
      //     (currentRotationValArray[3] += 0.001 * rotationSpeed))
      //   :
      currentRotationValArray[0] += 0.003 * rotationSpeed;
      currentRotationValArray[1] -= 0.008 * rotationSpeed;
      currentRotationValArray[2] -= 0.006 * rotationSpeed;
      currentRotationValArray[3] += 0.004 * rotationSpeed;

      incomingImgArray[0] &&
        (incomingImgArray[0].rotation = currentRotationValArray[0]);
      incomingImgArray[1] &&
        (incomingImgArray[1].rotation = currentRotationValArray[1]);

      incomingImgArray[2] &&
        ((incomingImgArray[2].rotation = -currentRotationValArray[2]),
        (incomingImgArray[2].x =
          app.screen.width / 2 +
          (app.screen.width / 4) * Math.cos(currentRotationValArray[2] * 0.75)),
        (incomingImgArray[2].y =
          app.screen.height / 2 +
          (app.screen.width / 4) *
            Math.sin(currentRotationValArray[2] * 0.75)));

      incomingImgArray[3] &&
        ((incomingImgArray[3].rotation = -currentRotationValArray[3]),
        (incomingImgArray[3].x =
          app.screen.width / 2 +
          (app.screen.width / 2) * 0.1 +
          (app.screen.width / 4) * Math.cos(currentRotationValArray[3] * 0.75)),
        (incomingImgArray[3].y =
          app.screen.height / 2 +
          (app.screen.width / 2) * 0.1 +
          (app.screen.width / 4) *
            Math.sin(currentRotationValArray[3] * 0.75)));
    });
  }
}

function initAnimation(app: Application, container: Container) {
  const t = new Sprite();
  const s = new Sprite();
  const i = new Sprite();
  const r = new Sprite();
  addSpritesToContainer(t, s, i, r, app, container);

  const n = new KawaseBlurFilter(5, 1);
  const o = new KawaseBlurFilter(10, 1);
  const h = new KawaseBlurFilter(20, 2);
  const a = new KawaseBlurFilter(40, 2);
  const l = new KawaseBlurFilter(80, 2);

  const twistingFilter = new TwistFilter({
    angle: -3.25,
    radius: 900,
    offset: new Point(
      Math.round(app.screen.width / 2),
      Math.round(app.screen.height / 2),
    ),
  });
  const saturationFilter = new AdjustmentFilter({
    saturation: 2.75,
    brightness: 0.7,
    contrast: 1.9
  });

  container.filters = [twistingFilter, n, o, h, a, l, saturationFilter];

  const colorOverlayContainer = new Container();
  colorOverlayContainer.width = app.screen.width;
  colorOverlayContainer.height = app.screen.height;

  const colorOverlay = new Graphics();
  colorOverlay.beginFill(0, 0.5);
  colorOverlay.drawRect(0, 0, app.screen.width, app.screen.height);
  colorOverlay.endFill();

  colorOverlayContainer.addChild(colorOverlay);

  app.stage.addChild(colorOverlayContainer);

  const f = new Sprite();
  f.width = app.screen.width;
  f.height = app.screen.height;

  const _ = new Graphics();
  _.beginFill(16777215, 0.05);
  _.drawRect(0, 0, app.screen.width, app.screen.height);
  _.endFill();

  colorOverlayContainer.addChild(_);
  app.stage.addChild(f);
}

export function BackgroundGlow({ src }: { src: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const app = useRef<Application>();
  const container = useRef<Container>();

  useLayoutEffect(() => {
    (async () => {
      const createResults = await createApp(
        canvas.current!,
        formatArtwork(src, 600),
      );
      app.current = createResults.app;
      container.current = createResults.container;
    })();
    return () => {
      app.current?.destroy(true, {
        children: true,
      });
    };
  }, []);

  useLayoutEffect(() => {
    (async () => {
      if (container.current && app.current) {
        await updateArtwork(
          app.current,
          container.current,
          formatArtwork(src, 600),
        );
      }
    })();
  }, [src]);

  return (
    <div className="glow-wrapper">
      <canvas ref={canvas}></canvas>
    </div>
  );
}
