import AbstractModel from './AbstractModel';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {getShapeDots, ShapeDotsInterface} from '@logic/simpleShapes';
import ImitationModel from "./ImitationModel";

import { v4 as uuidv4 } from 'uuid';

interface ShapeInterface {
  visible?: boolean
  id?: string
  initialized: boolean
  cx: number
  cy: number
  width: number
  height: number
  typeIndex: number
  type: string
  color: string
  area?: number
  dots?: ShapeDotsInterface[]
}

export default class Shape extends AbstractModel {
  _state: ShapeInterface;

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    cx: number,
    cy: number,
    typeIndex: number,
    type: string,
    shapeWidth: number,
    shapeHeight: number,
    color: string
  ) {
    super(canvas, width, height);

    this._state = {
      visible: false,
      id: uuidv4(),
      initialized: false,
      cx,
      cy,
      width: shapeWidth,
      height: shapeHeight,
      typeIndex,
      type,
      color: color,
      area: 0
    };
  }

  public init = (callback, gravity, updateUi): void => {
    const {
      cx,
      cy,
      width,
      height,
      typeIndex,
      type,
      color
    } = this.state;

    const shape: ShapeInterface = {
      initialized: true,
      cx,
      cy,
      width,
      height,
      type,
      typeIndex,
      color
    };

    if (
      typeIndex < 4
    ) {
      shape.dots = getShapeDots(type, cx, cy, width, height)
    } else if (
      typeIndex === 6
    ) {
      this.startImitation(this.state.width, this.state.height);
    }

    shape.area = this.getShapeArea(shape);

    if (
      typeIndex === 6
    ) {
      this.endImitation();
    }

    this.setState({
      ...shape
    });

    this.render(callback, gravity, updateUi);
  };

  private drawSimpleShape = (): void => {
    this.ctx.beginPath();

    this.state.dots.forEach((s, i) => {
      if (
        i === 0
      ) {
        this.ctx.moveTo(s.x, s.y)
      } else {
        this.ctx.lineTo(s.x, s.y)
      }
    });
    this.ctx.fillStyle = this.state.color;
    this.ctx.fill();
    this.ctx.closePath();
  };

  private drawEllipseShape = (): void => {
    const {
      cx,
      cy,
      width,
      height
    } = this.state;

    this.ctx.beginPath();
    this.ctx.ellipse(cx + width / 2, cy + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = this.state.color;
    this.ctx.fill();
    this.ctx.closePath();
  };

  private update = (removeCallback: (id: string, type: string) => void, gravity: number, updateUiCallback: () => void): void => {
    const {
      id,
      cx,
      cy,
      type,
      typeIndex,
      width,
      height
    } = this.state;

    let newDots: ShapeDotsInterface[] = [];

    if (
      typeIndex < 4
    ) {
      newDots = getShapeDots(type, cx, cy + gravity, width, height);
    }

    if (
      newDots.length
    ) {
      this.setState({
        cy: cy + gravity,
        dots: [...newDots]
      });
    } else {
      this.setState({
        cy: cy + gravity
      });
    }

    if (
      this.canvasHeight < cy
    ) {
      removeCallback(id, type);
    } else if (
      cy + height > 0
    ) {
      this.setState({
        visible: true
      }, () => {
        updateUiCallback();
      });
    }
  }

  private drawRandom = (): void => {
    const {
      cx,
      cy,
      width,
      height,
      color
    } = this.state;

    this.drawCloud(cx, cy, width, height, color);
  };

  protected startImitation = (width, height): void => {
    const imitationCanvas: HTMLCanvasElement = document.createElement('canvas');
    const field = document.querySelector('#imitationField') as HTMLElement;
    imitationCanvas.className = 'imitation';
    imitationCanvas.width = width;
    imitationCanvas.height = height;
    field.style.width = width + 'px';
    field.style.height = height + 'px';
    field.append(imitationCanvas);

    const imitationModel = new ImitationModel(
      imitationCanvas,
      width,
      height
    );

    imitationModel.init(this.getImitationData);
  };

  protected endImitation = (): void => {
    const imitationCanvas = document.querySelector('.imitation') as HTMLCanvasElement;
    imitationCanvas.remove();
  };

  public render = (removeCallback, gravity, updateUi): void => {
    const {
      typeIndex
    } = this.state;

    switch(true) {
      case typeIndex < 4:
        this.drawSimpleShape();
        break;

      case typeIndex >= 4 && typeIndex < 6:
        this.drawEllipseShape();
        break;

      case typeIndex === 6:
        this.drawRandom();
        break;
    }

    this.update(removeCallback, gravity, updateUi);
  };
}
