// @ts-nocheck
import {
  Color,
  Material,
  MaterialAppearance,
  Cartesian3,
  GroundPolylineGeometry,
  GroundPolylinePrimitive
} from "cesium";
import * as Cesium from "cesium";

const TYPE = "PolylineFlow";
const SOURCE = `
uniform vec4 color;
uniform float speed;
uniform float percent;
uniform float gradient;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float t =fract(czm_frameNumber * speed / 1000.0);
  t *= (1.0 + percent);
  float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
  alpha += gradient;
  material.diffuse = color.rgb;
  material.alpha = alpha;
  return material;
}
`;

class LineFlowMaterial extends Material {
  constructor() {
    super({
      fabric: {
        type: TYPE,
        uniforms: {
          color: Color.CYAN,
          speed: 10.0,
          percent: 0.1,
          gradient: 0.01,
        },
        source: SOURCE,
      },
      translucent: function (_material: Material) {
        return true;
      },
    })
  }
}

class Appearance extends MaterialAppearance {
  constructor() {
    super({
      material: new LineFlowMaterial(),
    })
  }
  isTranslucent(): boolean {
    return true;
  }
}

class LineGeometryInstance extends Cesium.GeometryInstance {
  constructor(positions: Cartesian3[]) {
    super({
      geometry: new GroundPolylineGeometry({
        width: 3.0,
        positions,
      })
    })
  }
}

export class Line extends GroundPolylinePrimitive {
  constructor({positions}: {positions: number[]}) {
    const _positions = Cartesian3.fromDegreesArray(positions);
    super({
      geometryInstances: new LineGeometryInstance(_positions),
      appearance: new Appearance(),
      show: true,
      allowPicking: false,
      releaseGeometryInstances: false,
    })
  }
}