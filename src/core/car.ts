import * as Cesium from "cesium";
//import {  getDefaultEntityCollection } from "..//map";


//var entity = getDefaultEntityCollection()
//entity.add({
 // position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
 //   model : {
 //       uri : 'node_modules/Apps/SampleData/models/GroundVehicle/GroundVehicle.glb'
 //   }
 // })
  //viewer.trackedEntity = entity; // 追踪

  export class car extends Cesium.Entity  {
    constructor() {
      const add: Cesium.Entity.ConstructorOptions  = {
        position : Cesium.Cartesian3.fromDegrees(0, 0),
        point:{
          pixelSize : 5,
        
          color : Cesium.Color.RED,
          outlineColor : Cesium.Color.WHITE,
          outlineWidth : 2
        }
      
        // model : {
        //     uri : 'node_modules/SampleData/models/GroundVehicle/GroundVehicle.glb'
        //  },
        
        };
         super(add);
      }   
    }
   
  



