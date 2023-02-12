import * as Cesium from "cesium";
import { Primitive } from "cesium";

const MaterialType = "PulsePoint";

type Center = {
  lng: number
  lat: number
}

class PulsePointGeometry extends Cesium.EllipseGeometry {
  constructor(center: Center) {
    const { lat, lng } = center;
    const options = {
      center: Cesium.Cartesian3.fromDegrees(lng, lat),
      semiMinorAxis: 150000.0,
      semiMajorAxis: 150000.0,

    }
    super(options);
  }
}

class PulsePointGeometryInstance extends Cesium.GeometryInstance {
  constructor(center: Center) {
    const options = {
      geometry: new PulsePointGeometry(center)
    }
    super(options);
  }
}

class DiffusionMaterial extends Cesium.Material {
  constructor() {
    super({
      fabric: {
        type: MaterialType,
        uniforms: {
          color: Cesium.Color.fromCssColorString("#8FB0A9"),
        },
        source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          czm_material material = czm_getDefaultMaterial(materialInput);
          material.diffuse = 1.0 * color.rgb;
          material.specular = 0.8;
          vec2 st = materialInput.st;
          float dis = distance(st, vec2(0.5, 0.5));
          // float per = fract(time); // "time" is build-in variable in uniforms of cesium base material types
          float per = fract(czm_frameNumber/50.0);
          if(dis > per * 0.5)
          {
            material.alpha = 0.0;
            discard;
          }
          else
          {
            material.alpha = color.a  * dis / per / 1.0;
          }
          return material;
        }`,
      },
      translucent: function (_material) {
        return true;
      },
    });
  }
}

class Appearance extends Cesium.MaterialAppearance {
  constructor() {
    super({
      material: new DiffusionMaterial(),
      vertexShaderSource: `
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
      }`,
      fragmentShaderSource: `
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
      }`,
    });
  }
  isTranslucent(): boolean {
    return true;
  }
}

export class Point extends Primitive {
  constructor(coords: {lat: number, lng: number}) {
    const { lat, lng } = coords;
    const center = { lng, lat };
    const options = {
      geometryInstances: new PulsePointGeometryInstance(center),
      appearance: new Appearance(),
      releaseGeometryInstances: false,
      compressVertices: false,
      show: true,
      allowPicking: false,
    };
    super(options);
  }
}