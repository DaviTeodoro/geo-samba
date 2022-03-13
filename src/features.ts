import * as turf from '@turf/helpers';
import lineToPolygon from '@turf/line-to-polygon';

export function Polygon(polygon?: Feature): Feature {
  const polygonFeature = polygon || {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [] },
  };

  return Object.freeze({
    prototype: Polygon,
    ...polygonFeature,
    updateCoord,
    removeCoord,
    addCoord,
    unwrap,
    undo,
  });
}

export function LineString(lineString?: Feature): Feature {
  const lineStringFeature = lineString || {
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: [] },
  };

  return Object.freeze({
    prototype: LineString,
    ...lineStringFeature,
    addCoord,
    removeCoord,
    updateCoord,
    unwrap,
    undo,
  });
}

function updateCoord(this: Feature, index: number, coord: turf.Coord): Feature {
  const {
    geometry: { coordinates },
  } = this;
  return this.prototype({
    ...this,
    geometry: {
      ...this.geometry,
      coordinates: coordinates.map((_: any, i: number) =>
        i === index ? coord : _
      ),
    },
  });
}

function removeCoord(this: Feature, index: number): Feature {
  const {
    geometry: { coordinates },
  } = this;
  return this.prototype({
    ...this,
    geometry: {
      ...this.geometry,
      coordinates: coordinates.filter((_: any, i: number) => i !== index),
    },
  });
}

function addCoord(this: Feature, coord: turf.Coord): Feature {
  const {
    geometry: { coordinates },
  } = this;
  return this.prototype({
    ...this,
    geometry: { ...this.geometry, coordinates: [...coordinates, coord] },
  });
}

function unwrap(this: Feature) {
  const { geometry } = this;

  if (this.prototype === Polygon) {
    return lineToPolygon(turf.lineString(geometry.coordinates));
  } else if (this.prototype === LineString) {
    return turf.lineString(geometry.coordinates);
  }

  return this.prototype({ ...this });
}

function undo(this: Feature): Feature {
  const { history } = this;
  const newHistory = history.slice(0, history.length - 1);
  return this.prototype({ ...this, history: newHistory });
}

console.log(
  JSON.stringify(
    LineString()
      .addCoord([13, 13])
      .addCoord([42, 42])
      .addCoord([22, 10])
      .updateCoord(1, [14, 13])
      .unwrap()
  )
);

export declare type Geometry = {
  type:
    | 'Point'
    | 'LineString'
    | 'Polygon'
    | 'MultiPoint'
    | 'MultiLineString'
    | 'MultiPolygon';
  coordinates: turf.Position[];
};

export declare type Feature = {
  type: string;
  geometry: Geometry;
  properties?: any;
  prototype: Function;
  addCoord: Function;
  updateCoord: Function;
  removeCoord: Function;
  unwrap: Function;
  history?: any;
};
