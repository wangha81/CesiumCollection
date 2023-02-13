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

const _VS = `
attribute vec3 position3DHigh;
attribute vec3 position3DLow;
attribute vec3 normal;
attribute vec2 st;
attribute float batchId;

varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;

void main()
{
    vec4 p = czm_computePosition();

    v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
    v_normalEC = czm_normal * normal;                         // normal in eye coordinates
    v_st = st;

    gl_Position = czm_modelViewProjectionRelativeToEye * p;
}
`

const _FG = `
#define FACE_FORWARD

uniform vec4 color_0;
uniform float speed_1;
uniform float percent_2;
uniform float gradient_3;

czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  float t =fract(czm_frameNumber * speed_1 / 1000.0);
  t *= (1.0 + percent_2);
  float alpha = smoothstep(t- percent_2, t, st.s) * step(-t, -st.s);
  alpha += gradient_3;
  material.diffuse = color_0.rgb;
  material.alpha = alpha;
  return material;
}


varying vec3 v_positionEC;
varying vec3 v_normalEC;
varying vec2 v_st;

void main()
{
    vec3 positionToEyeEC = -v_positionEC;

    vec3 normalEC = normalize(v_normalEC);
#ifdef FACE_FORWARD
    normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
#endif

    czm_materialInput materialInput;
    materialInput.normalEC = normalEC;
    materialInput.positionToEyeEC = positionToEyeEC;
    materialInput.st = v_st;
    czm_material material = czm_getMaterial(materialInput);

#ifdef FLAT
    gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);
#else
    gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
#endif
}
`

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
    console.log(this.vertexShaderSource)
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
