import {
  CesiumWidget,
  Clock,
  ContextOptions,
  DataSourceCollection,
  DataSourceDisplay,
  Globe,
  ImageryProvider,
  JulianDate,
  MapMode2D,
  MapProjection,
  SceneMode,
  ShadowMode,
  SkyAtmosphere,
  SkyBox,
  TerrainProvider,
} from "cesium";

interface ConstructorOption {
  clock?: Clock;
  imageryProvider?: ImageryProvider | false;
  terrainProvider?: TerrainProvider;
  skyBox?: SkyBox | false;
  skyAtmosphere?: SkyAtmosphere | false;
  sceneMode?: SceneMode;
  scene3DOnly?: boolean;
  orderIndependentTranslucency?: boolean;
  mapProjection?: MapProjection;
  globe?: Globe | false;
  useDefaultRenderLoop?: boolean;
  useBrowserRecommendedResolution?: boolean;
  targetFrameRate?: number;
  showRenderLoopErrors?: boolean;
  contextOptions?: ContextOptions;
  creditContainer?: Element | string;
  creditViewport?: Element | string;
  shadows?: boolean;
  terrainShadows?: ShadowMode;
  mapMode2D?: MapMode2D;
  blurActiveElementOnCanvasFocus?: boolean;
  requestRenderMode?: boolean;
  maximumRenderTimeChange?: number;
  msaaSamples?: number;
}

export class CustomWidget extends CesiumWidget {
  defaultDataSourceDisplay: DataSourceDisplay;
  constructor(container: Element | string, options?: ConstructorOption) {
    super(container, options);
    const { scene } = this;

    // Datasources for entities
    const dataSourceCollection = new DataSourceCollection();
    const dataSourceDisplay = new DataSourceDisplay({
      scene: scene,
      dataSourceCollection: dataSourceCollection,
    });
    this.defaultDataSourceDisplay = dataSourceDisplay;
  }
  get entities() {
    return this.defaultDataSourceDisplay.defaultDataSource.entities;
  }

  updateDefaultDisplay(time: JulianDate = JulianDate.now()): Promise<void> {
    return new Promise((res) => {
      const intl = setInterval(() => {
        this.defaultDataSourceDisplay.update(time);
        clearTimeout(intl);
        res();
      }, 100);
    });
  }
}
