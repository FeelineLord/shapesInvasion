import AbstractModel from './AbstractModel';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Shape from '@models/Shape';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShapeTypes from '@logic/shapeTypes';
import shapeTypes from "../logic/shapeTypes";

export default class App extends AbstractModel {
  _state: any;
  readonly size: number

  constructor(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    size: number
  ) {
    super(canvas, width, height);

    this.size = size;
    this.state = {
      shapes: {
        triangle: [],
        rectangle: [],
        pentagon: [],
        hexagon: [],
        circle: [],
        ellipse: [],
        cloud: []
      },
      gravity: 2,
      intensity: 10
    };
  }

  private setEvents = (): void => {
    const buttonEvents = {
      spawnDecr: document.querySelector('#spawnDecr'),
      spawnIncr: document.querySelector('#spawnIncr'),
      gravityDecr: document.querySelector('#gravityDecr'),
      gravityIncr: document.querySelector('#gravityIncr')
    };

    const modify = (param: string, positive: boolean) => {
      let prev = this.state[param];

      if (
        positive &&
        prev >= 100
      ) {
        return;
      } else if (
        !positive &&
        prev <= 1
      ) {
        return;
      }

      this.setState({
        [param]: positive ? prev + 1 : prev - 1
      }, () => {
        this.updateUi();
      });
    };

    const handleChange = (event): void => {
      switch (event.target.id) {
        case 'spawnDecr':
          modify('intensity', false);
          break;

        case 'spawnIncr':
          modify('intensity', true);
          break;

        case 'gravityDecr':
          modify('gravity', false);
          break;

        case 'gravityIncr':
          modify('gravity', true);
          break;
      }
    };

    const handleClick = (event): void => {
      const x = (event.pageX - event.target.offsetLeft) / (event.target.offsetWidth / event.target.width);
      const y = (event.pageY - event.target.offsetTop) / (event.target.offsetHeight / event.target.height);

      const imageData = this.ctx.getImageData(x, y, 1, 1);

      if (
        imageData.data[0] === 0 &&
        imageData.data[1] === 0 &&
        imageData.data[2] === 0
      ) {
        this.makeShape(x - this.size * 2.5, y - this.size * 2.5);
      } else {
        this.shapesRepainting(x, y);
      }
    }

    for (const ev in buttonEvents) {
      buttonEvents[ev].addEventListener('click', handleChange);
    }

    this.canvas.addEventListener('mousedown', handleClick);
  }

  public init = (): void => {
    this.setEvents();
    this.shapesInterval();
    this.render();
  };

  private makeShape = (x?: number, y?: number): void => {
    const {
      shapes
    } = this.state;

    const shapeIndex = this.getRandomInt(0, 6);
    let width = 0;
    let height = 0;

    if (
      shapeIndex === 0 ||
      shapeIndex > 1
      && shapeIndex < 5
    ) {
      width = this.size * 5;
      height = this.size * 5;
    } else {
      width = this.size * 10;
      height = this.size * 5;
    }


    const newShapes = {...shapes};

    const shape = new Shape(
      this.canvas,
      this.canvasWidth,
      this.canvasHeight,
      x ? x : this.getRandomInt(0, this.canvasWidth - width),
      y ? y : -this.getRandomInt(height, this.canvasHeight),
      shapeIndex,
      shapeTypes[shapeIndex],
      width,
      height,
      shapeIndex === 6 || shapeIndex === 2 ? this.randomRgb() : this.randomRgb(0.4)
    );

    newShapes[shapeTypes[shapeIndex]].push(shape);

    this.setState({
      shapes: {...newShapes}
    }, () => {
      this.updateUi();
    });
  };

  private shapesInterval = (): void => {
    this.makeShape();

    setInterval(() => {
      for (let i = 0; i < this.state.intensity; i++) {
        this.makeShape()
      }
    }, 1000);
  }

  private renderShapes = (): void => {
    const {
      shapes
    } = this.state;

    for (const type in shapes) {
      for (const s of shapes[type]) {
        if (
          s.state.initialized
        ) {
          s.render(this.removeShape, this.state.gravity, this.updateUi);
        } else {
          s.init(this.removeShape, this.state.gravity, this.updateUi);
        }
      }
    }
  };

  private removeShape = (id, type): void => {
    const {
      shapes
    } = this.state;

    const newShapes = {...shapes};

    let newTypeThree = [];

    newTypeThree = newShapes[type].filter(s => s.state.id !== id);
    newShapes[type] = newTypeThree;

    this.setState({
      shapes: newShapes
    }, () => {
      this.updateUi();
    });
  };

  private shapesRepainting = (x, y) => {
    const {
      shapes
    } = this.state;

    let targetShape: Shape;

    for (const type in shapes) {
      targetShape = shapes[type].find(s => {
        return s.state.cx <= x &&
          s.state.cx + s.state.width >= x &&
          s.state.cy <= y &&
          s.state.cy + s.state.height >= y
      });

      if (
        targetShape
      ) {
        break;
      }
    }

    if (
      !targetShape
    ) {
      this.makeShape(x, y)
    } else {
      let newShapes = {...shapes}

      const currentArr = newShapes[targetShape.state.type]
        .map(s => {
          s.state.color = targetShape.state.color
          return s
        })
        .filter(s => s.state.id !== targetShape.state.id);

      newShapes[targetShape.state.type] = [...currentArr];

      this.setState({
        shapes: {...newShapes}
      });
    }
  };

  private updateUi = (): void => {
    const shapesAmount = document.querySelector('#shapesAmount') as HTMLElement;
    const surfaceArea = document.querySelector('#surfaceArea') as HTMLElement;

    let amount = 0;
    let area = 0;

    for (const type in this.state.shapes) {
      for (const s of this.state.shapes[type]) {
        if (
          s.state.visible
        ) {
          area += s.state.area;
          amount += 1;
        }
      }
    }

    shapesAmount.textContent = '' + amount;
    surfaceArea.textContent = '' + Math.trunc(area);

    const spawn = document.querySelector('#spawnValue') as HTMLElement;
    const gravity = document.querySelector('#gravityValue') as HTMLElement;

    spawn.textContent = this.state.intensity;
    gravity.textContent = this.state.gravity;
  };

  private render = (): void => {
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.renderShapes();
      this.render();
    });
  };
}
