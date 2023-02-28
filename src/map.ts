import {
  buildModuleUrl,
  CesiumWidget,
  Color,
  Rectangle,
  TileMapServiceImageryProvider,
} from "cesium";
import { CustomWidget } from "./widget";
let _WIDGET: CustomWidget;

export const create = async (container: HTMLElement): Promise<CesiumWidget> => {
  const imageryProvider = new TileMapServiceImageryProvider({
    url: buildModuleUrl("Assets/Textures/NaturalEarthII"),
  });
  const widget = new CustomWidget(container, {
    imageryProvider,
    creditContainer: document.createElement("div"),
  });
  const { scene, camera } = widget;
  // post default config
  scene.globe.baseColor = Color.GREY;
  scene.globe.showGroundAtmosphere = false;
  scene.globe.enableLighting = false;
  scene.globe.depthTestAgainstTerrain = true;
  camera.setView({
    destination: Rectangle.fromDegrees(-30, -30, 30, 30),
  });
  _WIDGET = widget;
  return widget;
};

export const getWidget = (): CustomWidget => {
  if (!_WIDGET) throw "CesiumWidget not init";
  return _WIDGET;
};
