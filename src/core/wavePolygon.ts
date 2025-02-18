import { Cartesian3, Color, GeometryInstance, GroundPrimitive, Material, MaterialAppearance, PolygonGeometry, PolygonHierarchy } from "cesium";

const TYPE = "PolygonWavePlus";
const SOURCE = `
uniform vec4 color;
uniform float amplitude; // Amplitude of the wave
uniform float wavelength; // Wavelength of the wave
uniform float speed; // Speed of the wave
uniform float plusAmplitude; // Amplitude of the plus effect
uniform float plusSpeed; // Speed of the plus effect

czm_material czm_getMaterial(czm_materialInput materialInput) {
  czm_material material = czm_getDefaultMaterial(materialInput);

  // Create a wave effect using sine function
  float time = float(czm_frameNumber) / 60.0; // Time in seconds
  float wave = sin(materialInput.st.s * 2.0 * 3.14159 / wavelength - time * speed) * amplitude;

  // Create the pulsating "plus" effect, with a stronger effect in the center (st = (0.5, 0.5))
  float distToCenter = distance(materialInput.st, vec2(0.5, 0.5)); // Calculate distance from the center
  float plusEffect = sin(time * plusSpeed - distToCenter * 20.0) * plusAmplitude;

  // Apply wave effect to the y-coordinate (height) of the surface
  material.diffuse = color.rgb;

  // Combine wave and plus effects for transparency (alpha)
  float alpha = 0.5 + 0.5 * sin(time); // Pulsating alpha based on time
  material.alpha = alpha * (1.0 + wave + plusEffect); // Combine wave and plus effects for alpha

  return material;
}
`;

class WavePlusMaterial extends Material {
  constructor() {
    super({
      fabric: {
        type: TYPE,
        uniforms: {
          color: Color.CYAN, // Wave color (can be changed)
          amplitude: 0.0,    // Amplitude of the wave effect
          wavelength: 0.0,    // Wavelength of the wave
          speed: 3.0,         // Speed of the wave
          plusAmplitude: 1, // Amplitude of the plus effect
          plusSpeed: 5.0,     // Speed of the plus effect
        },
        source: SOURCE,
      },
      translucent: function (_material: Material) {
        return true; // Make sure material is translucent
      },
    });
  }
}

class Appearance extends MaterialAppearance {
  constructor() {
    super({
      material: new WavePlusMaterial(),
    });
    console.log(this.vertexShaderSource);
  }
  isTranslucent(): boolean {
    return true; // Always return true for translucency
  }
}

class PolygonGeometryInstance extends GeometryInstance {
  constructor(positions: Cartesian3[]) {
    super({
      geometry: new PolygonGeometry({
        polygonHierarchy: new PolygonHierarchy(positions),
      }),
    });
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
    });
  }
}
