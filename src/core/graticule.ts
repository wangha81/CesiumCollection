/**
 * Copyright DigitalArsenal.io, Inc. 2021
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at:
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Forked from:
 * https://github.com/leforthomas/cesium-addons
 *
 */
/**
 * Author: Alien
 */
import {
  Math as CMath,
  Rectangle,
  Camera,
  Ellipsoid,
  PolylineCollection,
  LabelCollection,
  Cartesian2,
  Cartesian3,
  Cartographic,
  Label,
  Material,
  Color,
  LabelStyle,
  HorizontalOrigin,
  VerticalOrigin,
  Event,
  CesiumWidget
} from 'cesium';

const { toRadians } = CMath;
const { MAX_VALUE, fromCartographicArray } = Rectangle;
const mins = [0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0].map(toRadians);

interface IGraticule {
  viewer: CesiumWidget;
}

interface CLabel extends Label {
  isLat: boolean;
}

interface IMakeLabels {
  lng: number;
  lat: number;
  text: string;
  isLat: boolean;
  color?: string;
  meridians?: boolean;
}

const gridPrecision = (dDeg: number) => {
  if (dDeg < 0.01) return 3;
  if (dDeg < 0.1) return 2;
  if (dDeg < 1) return 1;
  return 0;
};

//TODO BLACK OUTLINE TEXT
const convertDEGToDMS = (deg: number, isLat: boolean) => {
  var absolute = Math.abs(deg);

  var degrees = Math.floor(absolute);
  var minutesNotTruncated = Math.round((absolute - degrees) * 600) / 10;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

  let minSec = '';
  if (minutes || seconds !== '0.00') minSec += minutes + "'";
  if (seconds !== '0.00') minSec += seconds + '"';

  return `${degrees}°${minSec}${isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W'}`;
};

export default class Graticule implements IGraticule {
  viewer: CesiumWidget;
  labels: LabelCollection;
  polylines: PolylineCollection;
  camera: Camera;
  canvas: HTMLCanvasElement;
  private gridCount: number = 25;
  private currentExtent: Rectangle;
  private removeEvent?: Event.RemoveCallback;
  constructor({ viewer }: IGraticule) {
    this.viewer = viewer;
    const { scene, camera, canvas } = viewer;
    this.labels = new LabelCollection();
    this.polylines = new PolylineCollection();
    this.camera = camera;
    this.canvas = canvas;
    this.currentExtent = this.ExtentView;
    scene.primitives.add(this.labels);
    scene.primitives.add(this.polylines);
  }
  private get ellipsoid(): Ellipsoid {
    return this.viewer.scene.globe.ellipsoid;
  }
  private get ExtentView() {
    const { canvas, ellipsoid, camera } = this;
    let mWidth = Math.max(canvas.clientWidth, canvas.clientHeight);
    let minWidth = Math.min(canvas.clientWidth, canvas.clientHeight);
    this.gridCount = (mWidth / 1000) * 25;

    const _corners = [
      new Cartesian2(0, 0),
      new Cartesian2(mWidth, 0),
      new Cartesian2(0, mWidth),
      new Cartesian2(mWidth, mWidth),
    ];
    const corners = _corners.map((_c) => {
      return camera.pickEllipsoid(_c, ellipsoid);
    });
    if (corners.some((v) => v === undefined)) {
      this.gridCount = (minWidth / 1000) * 25;
      return MAX_VALUE;
    }
    return fromCartographicArray(ellipsoid.cartesianArrayToCartographicArray(corners as Cartesian3[]));
  }
  private get screenCenterPosition() {
    const { canvas, camera } = this;
    let center = new Cartesian2(Math.round(canvas.clientWidth / 2), Math.round(canvas.clientHeight / 2));
    var cartesian = camera.pickEllipsoid(center);

    if (!cartesian) cartesian = Cartesian3.fromDegrees(0, 0, 0);
    return cartesian;
  }
  private updateLabelPositions() {
    const { labels, ellipsoid } = this;
    const center = Cartographic.fromCartesian(this.screenCenterPosition);
    for (let i = 0; i < labels.length; ++i) {
      const b: CLabel = labels.get(i) as CLabel;
      const carto = Cartographic.fromCartesian(b.position);
      if (b.isLat) carto.longitude = center.longitude;
      else carto.latitude = center.latitude;
      b.position = ellipsoid.cartographicToCartesian(carto);
    }
  }
  private makeLabel({ lng, lat, text, isLat, color = 'white', meridians = false }: IMakeLabels) {
    const { ellipsoid, labels } = this;
    if (meridians) {
      if (text === '0°N') text = 'Equator';
      if (text === '0°E') text = 'Prime Meridian';
      if (text === '180°E') text = 'Antimeridian';
    }
    let center = Cartographic.fromCartesian(this.screenCenterPosition);
    const carto = new Cartographic(lng, lat);
    if (isLat) carto.longitude = center.longitude;
    else carto.latitude = center.latitude;
    const position = ellipsoid.cartographicToCartesian(carto);
    const label = labels.add({
      position,
      text,
      font: `bold 1rem Arial`,
      fillColor: color,
      outlineColor: Color.BLACK,
      outlineWidth: 4,
      style: LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cartesian2(isLat ? 0 : 4, isLat ? -6 : 0),
      eyeOffset: Cartesian3.ZERO,
      horizontalOrigin: isLat ? HorizontalOrigin.CENTER : HorizontalOrigin.CENTER,
      verticalOrigin: isLat ? VerticalOrigin.BOTTOM : VerticalOrigin.TOP,
      scale: 1,
    }) as CLabel;
    label.isLat = isLat;
  }
  private drawGrid(extent: Rectangle) {
    if (!extent) extent = this.ExtentView;
    extent = Object.assign({}, extent);
    const { gridCount, polylines, labels, ellipsoid } = this;
    let wrapLng = undefined;
    if (extent.east < extent.west) {
      wrapLng = MAX_VALUE.east + Math.abs(-MAX_VALUE.east - extent.east);
    }

    polylines.removeAll();
    labels.removeAll();

    let dLat = mins[0],
      dLng = mins[0],
      index;
    // get the nearest to the calculated value
    for (index = 0; index < mins.length && dLat < (extent.north - extent.south) / gridCount; index++) {
      dLat = mins[index];
    }
    for (
      index = 0;
      index < mins.length && dLng < ((wrapLng === undefined ? extent.east : wrapLng) - extent.west) / gridCount;
      index++
    ) {
      dLng = mins[index];
    }

    // round iteration limits to the computed grid interval
    let minLng = (extent.west < 0 ? Math.ceil(extent.west / dLng) : Math.floor(extent.west / dLng)) * dLng;
    let minLat = (extent.south < 0 ? Math.ceil(extent.south / dLat) : Math.floor(extent.south / dLat)) * dLat;
    let maxLng = (extent.east < 0 ? Math.ceil(extent.east / dLat) : Math.floor(extent.east / dLat)) * dLat;
    let maxLat = (extent.north < 0 ? Math.ceil(extent.north / dLng) : Math.floor(extent.north / dLng)) * dLng;

    // extend to make sure we cover for non refresh of tiles
    minLng = Math.max(minLng - 2 * dLng, -Math.PI);
    maxLng = Math.min(maxLng + 2 * dLng, Math.PI);
    minLat = Math.max(minLat - 2 * dLat, -Math.PI / 2);
    maxLat = Math.min(maxLat + 2 * dLng, Math.PI / 2);

    let lat,
      lng,
      granularity = toRadians(1);

    const lineGraphicsObj = (positions: Cartesian3[], color: Color) => {
      return {
        positions,
        width: 0.5,
        material: Material.fromType('Color', {
          color: color,
        }),
      };
    };

    // labels positions
    const latitudeText = minLat + Math.floor((maxLat - minLat) / dLat / 2) * dLat;
    let tLng = wrapLng === undefined ? maxLng : wrapLng;
    let countLng = 0;
    for (let _lng = minLng; _lng < tLng; _lng += dLng) {
      if (maxLng > MAX_VALUE.east) {
        lng = extent.east - (_lng - MAX_VALUE.east);
      } else {
        lng = _lng;
      }
      // draw meridian
      const path = [];
      for (lat = minLat; lat < maxLat; lat += granularity) {
        path.push(new Cartographic(lng, lat));
      }
      path.push(new Cartographic(lng, maxLat));

      const degLng = CMath.toDegrees(lng);
      const text = convertDEGToDMS(parseFloat(degLng.toFixed(gridPrecision(dLng))), false);
      const color = text === '0°E' || text === '180°E' ? Color.YELLOW : Color.WHITE.withAlpha(0.5);
      if (text !== '180°W') {
        polylines.add(lineGraphicsObj(ellipsoid.cartographicArrayToCartesianArray(path), color));
        if (countLng % 2) {
          this.makeLabel({
            lat: latitudeText,
            lng,
            text,
            isLat: false,
          });
        }
        countLng++;
      }
    }

    // lats
    const longitudeText = minLng + Math.floor((tLng - minLng) / dLng / 2) * dLng;

    let countLat = 0;
    for (lat = minLat; lat < maxLat; lat += dLat) {
      // draw parallels
      const path = [];
      for (lng = minLng; lng < tLng; lng += granularity) {
        path.push(new Cartographic(lng, lat));
      }
      path.push(new Cartographic(maxLng, lat));
      var degLat = CMath.toDegrees(lat);
      let text = convertDEGToDMS(parseFloat(degLat.toFixed(gridPrecision(dLat))), true);
      let color = text === '0°N' ? Color.YELLOW : Color.WHITE.withAlpha(0.5);
      polylines.add(lineGraphicsObj(ellipsoid.cartographicArrayToCartesianArray(path), color));
      if (countLat % 2) {
        this.makeLabel({
          lng: longitudeText,
          lat,
          text,
          isLat: true,
        });
      }
      countLat++;
    }
  }
  private render() {
    this.updateLabelPositions();
    const extent = this.ExtentView;
    let shouldRefresh = true;
    const { currentExtent, labels } = this;
    if (currentExtent) {
      let w = Math.abs(extent.west - currentExtent.west),
        s = Math.abs(extent.south - currentExtent.south),
        e = Math.abs(extent.east - currentExtent.east),
        n = Math.abs(extent.north - currentExtent.north);
      let m = 0.001;
      if (w < m && s < m && e < m && n < m) shouldRefresh = false;
    }
    if (!shouldRefresh && labels.length) return;
    this.currentExtent = extent;
    this.drawGrid(extent);
  }
  public on() {
    const _graticle = this;
    this.render();
    this.removeEvent = this.viewer.clock.onTick.addEventListener(() => {
      _graticle.render();
    });
  }
  public off() {
    const { polylines, labels } = this;
    polylines.removeAll();
    labels.removeAll();
    this.removeEvent!();
  }
}
