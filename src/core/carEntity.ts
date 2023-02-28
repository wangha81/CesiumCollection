import { Cartesian3, Entity } from "cesium";

//var entity = getDefaultEntityCollection()
//entity.add({
 // position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
 //   model : {
 //       uri : 'node_modules/Apps/SampleData/models/GroundVehicle/GroundVehicle.glb'
 //   }
 // })
  //viewer.trackedEntity = entity; // 追踪

  export class Car extends Entity  {
    constructor() {
      const add: Entity.ConstructorOptions  = {
        position : Cartesian3.fromDegrees(0, 0),
        // point:{
        //   pixelSize : 5,
        
        //   color : Color.RED,
        //   outlineColor : Color.WHITE,
        //   outlineWidth : 2
        // }
      
        model : {
            uri : new URL ('../assets/ToyCar.glb',import .meta.url).href,
            scale: 10000000,
         },
        
        };
         super(add);
      }   
    }
   
  



