// @ts-nocheck
import {
  Color,
  Event,
  JulianDate,
  MaterialProperty,
  defined,
  Viewer,
  Entity,
  Cartesian3,
} from "cesium";
import utils from "./utils";
import * as Cesium from "cesium";

interface IProperty {
  color?: Color;
  speed?: number;
  percent?: number;
  gradient?: number;
}

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

export class LineFlowMaterialProperty implements MaterialProperty {
  _definitionChanged: Event<(...args: any[]) => void>;
  private _color: undefined;
  private _speed: undefined;
  private _percent: undefined;
  private _gradient: undefined;
  constructor({ color, speed, percent, gradient }: IProperty) {
    this._definitionChanged = new Event();
    this._color = undefined;
    this._speed = undefined;
    this._percent = undefined;
    this._gradient = undefined;
    this.color = color;
    this.speed = speed;
    this.percent = percent;
    this.gradient = gradient;
  }
  getValue(time: JulianDate, result: any) {
    defined(result) || (result = {});
    Object.assign(result, {
      color: utils.getValueOrClonedDefault(this._color, time, Color.RED, result.color),
      speed: utils.getValueOrDefault(this._speed, time, 5.0, result.speed),
      percent: utils.getValueOrDefault(this._percent, time, 0.1, result.percent),
      gradient: utils.getValueOrDefault(this._gradient, time, 0.01, result.gradient),
    });
    return result;
  }
  equals(other?: LineFlowMaterialProperty): boolean {
    return (
      this === other ||
      (other instanceof LineFlowMaterialProperty &&
        utils.equals(this._color, other!._color) &&
        utils.equals(this._speed, other!._speed) &&
        utils.equals(this._percent, other!._percent) &&
        utils.equals(this._gradient, other!._gradient))
    );
  }
  getType(_: JulianDate) {
    return TYPE;
  }
  get isConstant() {
    return (
      utils.isConstant(this._color) &&
      utils.isConstant(this._speed) &&
      utils.isConstant(this._percent) &&
      utils.isConstant(this._gradient)
    );
  }
  get definitionChanged() {
    return this._definitionChanged;
  }
}

Object.defineProperties(LineFlowMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor("color"),
  speed: Cesium.createPropertyDescriptor("speed"),
  percent: Cesium.createPropertyDescriptor("percent"),
  gradient: Cesium.createPropertyDescriptor("gradient"),
});

Cesium.Material._materialCache.addMaterial(TYPE, {
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
  translucent: !0,
});

export class Line extends Entity {
  constructor(positions: number[]) {
    const opt: Entity.ConstructorOptions = {
      polyline: {
        positions: Cartesian3.fromDegreesArray(positions),
        width: 10,
        material: new LineFlowMaterialProperty({
          color: Color.GOLD,
          speed: 10,
        }),
        clampToGround: true
      }
    }
    super(opt);
  }
}

const test = (widget: Viewer) => {
  const line: Entity.ConstructorOptions = {
    polyline: {
      positions: Cartesian3.fromDegreesArray([121, 0, 121, 25]),
      width: 3,
      material: new LineFlowMaterialProperty({
        color: Color.GOLD,
        speed: 3,
      }),
    },
  };
  widget.entities.add(line);
};

export default {
  test,
};
