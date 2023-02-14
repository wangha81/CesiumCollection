import {
  buildModuleUrl,
  CesiumWidget,
  Color,
  Rectangle,
  TileMapServiceImageryProvider,
  DataSourceDisplay,
  DataSourceCollection,
  EntityCollection
} from "cesium";
let _WIDGET: CesiumWidget;
let _DataSourceDisplay: DataSourceDisplay;

export const create = async (container: HTMLElement): Promise<CesiumWidget> => {
  const imageryProvider = new TileMapServiceImageryProvider({
    url: buildModuleUrl("Assets/Textures/NaturalEarthII"),
  });
  const widget = new CesiumWidget(container, {
    imageryProvider,
    creditContainer: document.createElement("div"),
  });
  const {scene, camera, clock} = widget;
  // post default config
  scene.globe.baseColor = Color.GREY;
  scene.globe.showGroundAtmosphere = false;
  scene.globe.enableLighting = false;
  scene.globe.depthTestAgainstTerrain = true;
  camera.setView({
    destination: Rectangle.fromDegrees(-30, -30, 30, 30),
  });

  // Datasources for entities
  const dataSourceCollection = new DataSourceCollection();
  const dataSourceDisplay = new DataSourceDisplay({
    scene: scene,
    dataSourceCollection: dataSourceCollection
  });

  _WIDGET = widget;
  _DataSourceDisplay = dataSourceDisplay;
  clock.onTick.addEventListener(() => {
    dataSourceDisplay.update(clock.currentTime);
  });
  return widget;
};

export const getWidget = (): CesiumWidget => {
  if (!_WIDGET) throw "CesiumWidget not init";
  return _WIDGET;
};

export const getDefaultEntityCollection = (name?: string): EntityCollection => {
  if (!_DataSourceDisplay) throw "DataSourceDisplay not init";
  return _DataSourceDisplay.defaultDataSource.entities;
};