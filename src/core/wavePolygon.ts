import { Cartesian3, Color, GeometryInstance, GroundPrimitive, Material, MaterialAppearance, PolygonGeometry, PolygonHierarchy } from "cesium";

const TYPE = "PolygonWave";
const SOURCE = `
uniform vec4 color;
uniform float amplitude; // Amplitude of the wave
uniform float wavelength; // Wavelength of the wave
uniform float speed; // Speed of the wave

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);

  // Create a wave effect using sine function
  float time = float(czm_frameNumber) / 60.0; // Time in seconds
  float wave = sin(materialInput.st.s * 2.0 * 3.14159 / wavelength - time * speed) * amplitude;

  // Apply wave effect to the y-coordinate (height) of the surface
  material.diffuse = color.rgb;
  
  // Modify the alpha (opacity) based on wave height (alpha decreases with wave)
  float alpha = 0.5 + 0.5 * sin(float(czm_frameNumber) / 60.0); // Pulsating effect
  material.alpha = alpha * (1.0 + wave); // Combine pulsating with wave effect for alpha

  return material;
}
`

class WaveMaterial extends Material {
  constructor() {
    super({
      fabric: {
        type: TYPE,
        uniforms: {
          color: Color.CYAN,  // Wave color, you can change it to any color you like
          amplitude: 3,    // Amplitude of the wave effect
          wavelength: 0.3,    // Wavelength (controls the spread of the wave)
          speed: 3,         // Speed of the wave
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
      material: new WaveMaterial(),
    })
    console.log(this.vertexShaderSource)
  }
  isTranslucent(): boolean {
    return true;
  }
}

class PolygonGeometryInstance extends GeometryInstance {
  constructor(positions: Cartesian3[]) {
    super({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(positions)
      })
    })
  }
}

export class Polygon extends GroundPrimitive {
  constructor({ positions }: { positions: number[] }) {
    const _positions = Cartesian3.fromDegreesArray(positions);
    super({
      geometryInstances: new PolygonGeometryInstance(_positions),
      appearance: new Appearance(),
      show: true,
      allowPicking: false,
      releaseGeometryInstances: false,
    })
  }
}
