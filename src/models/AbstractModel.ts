import ImitationModel from "./ImitationModel";

export default class AbstractModel {
  readonly canvas: HTMLCanvasElement;
  readonly _ctx: CanvasRenderingContext2D;
  readonly _canvasWidth: number;
  readonly _canvasHeight: number;
  private imitationModel: ImitationModel | undefined;
  _state;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    this.canvas = canvas;
    this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this._canvasWidth = width;
    this._canvasHeight = height;
  }

  get state(): any {
    return this._state;
  }

  set state(state) {
    this._state = state;
  }

  get ctx(): CanvasRenderingContext2D {
    return this._ctx
  }

  get canvasWidth(): number {
    return this._canvasWidth
  }

  get canvasHeight(): number {
    return this._canvasHeight
  }

  protected setState = (newValues, callback?: () => void): void => {
    const newState = {...this.state};

    for (const key in newValues) {
      if (
        newValues.hasOwnProperty(key)
      ) {
        newState[key] = newValues[key]
      }
    }

    this.state = {...newState};

    if (
      typeof callback !== 'undefined'
    ) {
      callback();
    }
  };

  protected getRandomInt = (min: number, max: number): number => {
    return Math.floor(min + Math.random() * (max + 1 - min));
  };

  protected getRandomColor = (): string => {
    return '#' + (Math.random().toString(16) + '000000').substring(2,8);
  };

  protected getShapeArea = (shape): number => {
    switch(true) {
      case shape.type === 'triangle':
        return (shape.width * shape.height) / 2

      case shape.type === 'rectangle':
        return shape.height ? shape.width * shape.height : shape.width * shape.width

      case shape.type === 'pentagon':
        const distanceBetweenPoints = shape.width / (2 * Math.cos(Math.PI / 5));
        const outerArea = (distanceBetweenPoints * distanceBetweenPoints)
          * 5
          / 4
          * ( Math.cos(Math.PI / 5) / Math.sin(Math.PI / 5) );
        const outerTriangleArea = (distanceBetweenPoints * distanceBetweenPoints) / 4 * Math.tan(Math.PI / 5);
        return outerArea - outerTriangleArea * 5

      case shape.type === 'hexagon':
        const side = shape.width / (2 * Math.cos(Math.PI / 6));
        const katetX = (shape.width - side) / 2;
        const katetY = shape.height / 2;
        const outerRectArea = shape.width * shape.height;
        return outerRectArea - ((katetX * katetY) / 2) * 4

      case shape.type === 'circle' || shape.type === 'ellipse':
        return (shape.width * shape.height) * Math.PI / 4

      case shape.type === 'cloud':
        if (
          typeof this.imitationModel !== 'undefined'
        ) {
          return this.imitationModel.state.area;
        } else {
          return 0;
        }

      default:
        return 0
    }
  };

  protected rgbToHex = (r, g, b): string => {
    let r2 = r.toString(16);
    let g2 = g.toString(16);
    let b2 = b.toString(16);

    if (
      r2.length === 1
    ) {
      r2 = "0" + r;
    }
    if (
      g2.length === 1
    ) {
      g2 = "0" + g;
    }
    if (
      b2.length === 1
    ) {
      b2 = "0" + b;
    }

    return "#" + r2 + g2 + b2;
  };

  protected randomRgb = (a?: number): string => {
    const max = 255;

    const expression = (): number => {
      return Math.round(Math.random() * max);
    };

    return `rgb${a ? 'a' : ''}(${expression()}, ${expression()}, ${expression()}${a ? ', ' + a: ''})`;
  };

  protected makeCloudElement = (x, y, rx, ry, color) => {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  };

  protected drawCloud = (cx, cy, width, height, color) => {
    const smallRx = width / 5;
    const smallRy = height / 5;

    const bigRx = width / 2.5;
    const bigRy = height / 2;

    this.makeCloudElement(cx + smallRx, cy + height / 2 - smallRy, smallRx, smallRy, color);
    this.makeCloudElement(cx + smallRx, cy + height / 2 + smallRy, smallRx, smallRy, color);

    this.makeCloudElement(cx + width / 2, cy + height / 2, bigRx, bigRy, color)

    this.makeCloudElement(cx + width - smallRx, cy + height / 2 - smallRy, smallRx, smallRy, color);
    this.makeCloudElement(cx + width - smallRx, cy + height / 2 + smallRy, smallRx, smallRy, color);
  };

  protected getImitationData = (model): void => {
    this.imitationModel = model;
  };
}
