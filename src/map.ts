import {
  buildModuleUrl,
  CesiumWidget,
  Color,
  TileMapServiceImageryProvider,
} from "cesium";
let WIDGET: CesiumWidget;

export const create = async (container: HTMLElement): Promise<CesiumWidget> => {
  const imageryProvider = new TileMapServiceImageryProvider({
    url: buildModuleUrl("Assets/Textures/NaturalEarthII"),
  });
  const widget = new CesiumWidget(container, {
    imageryProvider,
    creditContainer: document.createElement("div"),
  });
  // post default config
  widget.scene.globe.baseColor = Color.GREY;
  widget.scene.globe.showGroundAtmosphere = false;
  widget.scene.globe.enableLighting = false;
  WIDGET = widget;
  return widget;
};

export const getWidget = () => {
  if (!WIDGET) throw "CesiumWidget not init";
  return WIDGET;
};
