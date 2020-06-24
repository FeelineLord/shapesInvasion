import '@styles/styles.scss';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import App from '@models/App';

const startGame = (width, height, size) => {
  const root = document.querySelector('#root') as HTMLElement;
  const gravity = document.createElement('canvas') as HTMLCanvasElement;
  const app = new App(gravity, width, height, size);

  gravity.width = width;
  gravity.height = height;
  gravity.className = 'gravity';
  gravity.id = 'gravity';

  root.append(gravity);

  app.init();
}

window.addEventListener('load', () => {
  startGame(640, 360, 5);
});
