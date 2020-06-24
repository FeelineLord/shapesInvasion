import AbstractModel from './AbstractModel';

export default class ImitationModel extends AbstractModel {
  state;
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    super(canvas, width, height);

    this.state = {
      area: 0
    }
  }

  public init = (callback: (model: ImitationModel) => void): void => {
    let result: number[] = [];

    this.drawCloud(0, 0, this.canvasWidth, this.canvasHeight, '#6115d4');

    for (let i = 0; i < this.canvasWidth; i++) {
      const x = this.getRandomInt(0, this.canvasWidth);
      const y = this.getRandomInt(0, this.canvasHeight);
      const imageData = this.ctx.getImageData(x, y, 1, 1);
      const hex = this.rgbToHex(imageData.data[0], imageData.data[1], imageData.data[2]);

      hex === '#6115d4' ? result.push(1) : result.push(0);
    }

    result = result.sort();
    const falseAmount = result.indexOf(1) - 1;
    const percent = Math.floor(100 / this.canvasWidth * falseAmount);

    const area = (this.canvasWidth * this.canvasHeight) * (1 - percent / 100);

    this.setState({
      area
    }, () => {
      callback(this);
    });
  };
}
