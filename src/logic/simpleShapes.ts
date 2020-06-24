// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shapeTypes from '@logic/shapeTypes';

export interface ShapeDotsInterface {
  x: number,
  y: number
}

export const getShapeDots = (
  type: string,
  cx: number,
  cy: number,
  width: number,
  height: number
): ShapeDotsInterface[] => {
  let distanceBetweenPoints;
  let xDistance;
  let yDistance;
  let side;

  switch(type) {
    case 'triangle':
      return [
        {
          x: cx + width / 2,
          y: cy
        },
        {
          x: cx + width,
          y: cy + height
        },
        {
          x: cx,
          y: cy + height
        },
        {
          x: cx + width / 2,
          y: cy
        }
      ];

    case 'rectangle':
      return [
        {
          x: cx,
          y: cy
        },
        {
          x: cx + width,
          y: cy
        },
        {
          x: cx + width,
          y: cy + height
        },
        {
          x: cx,
          y: cy + height
        },
        {
          x: cx,
          y: cy
        }
      ];

    case 'pentagon':
      distanceBetweenPoints = width / (2 * Math.cos(Math.PI / 5))
      xDistance = (width - distanceBetweenPoints) / 2;
      yDistance = Math.sqrt((distanceBetweenPoints * distanceBetweenPoints) - (width / 2) * (width / 2));
      return [
        {
          x: cx + width / 2,
          y: cy
        },
        {
          x: cx + (width - xDistance),
          y: cy + height
        },
        {
          x: cx,
          y: cy + yDistance
        },
        {
          x: cx + width,
          y: cy + yDistance
        },
        {
          x: cx + xDistance,
          y: cy + height
        },
        {
          x: cx + width / 2,
          y: cy
        }
      ];

    case 'hexagon':
      side = width / (2 * Math.cos(Math.PI / 6));
      distanceBetweenPoints = (width - side) / 2;
      return [
        {
          x: cx + distanceBetweenPoints,
          y: cy
        },
        {
          x: cx + (width - distanceBetweenPoints),
          y: cy
        },
        {
          x: cx + width,
          y: cy + height / 2
        },
        {
          x: cx + (width - distanceBetweenPoints),
          y: cy + height
        },
        {
          x: cx + distanceBetweenPoints,
          y: cy + height
        },
        {
          x: cx,
          y: cy + height / 2
        },
        {
          x: cx + distanceBetweenPoints,
          y: cy
        }
      ];

    default:
      return [];
  }
};
