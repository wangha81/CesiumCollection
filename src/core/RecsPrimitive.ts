import {
  Color, ColorGeometryInstanceAttribute, GeometryInstance,
  PerInstanceColorAppearance, Primitive, Rectangle, RectangleGeometry,
  Math as CMath
} from "cesium";

type Offset = {
  lon: number
  lat: number
  unit: number
}

class LabRectangle extends RectangleGeometry {
  constructor({ lat, lon, unit }: Offset) {
    super({
      rectangle: Rectangle.fromDegrees(lon, lat, lon + unit, lat + unit),
      vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
      granularity: CMath.RADIANS_PER_DEGREE
    });
  }
}

class LabInstance extends GeometryInstance {
  constructor(lon: number, lat: number, unit: number) {
    super({
      geometry: new LabRectangle({ lat, lon, unit }),
      attributes: {
        color: ColorGeometryInstanceAttribute.fromColor(
          Color.fromRandom({ alpha: 0.5 })
        ),
      },
    })
  }
}

const genIntances = (): GeometryInstance[] => {
  const instances: GeometryInstance[] = []
  const unit = 1.0
  for (let lon = -180.0; lon < 180.0; lon += unit) {
    for (let lat = -85.0; lat < 85.0; lat += unit) {
      instances.push(
        new LabInstance(lon, lat, unit)
      );
    }
  }
  return instances
}

export class LabPrimitive extends Primitive {
  constructor() {
    const options = {
      geometryInstances: genIntances(),
      appearance: new PerInstanceColorAppearance(),
    }
    super(options)
  }
}