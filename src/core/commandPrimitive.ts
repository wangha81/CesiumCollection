// @ts-nocheck
/**
 * References:
 * https://cesium.com/blog/2019/04/29/gpu-powered-wind/
 * https://zhuanlan.zhihu.com/p/453880906
 * https://www.cnblogs.com/onsummer/p/drawcommand-in-cesium.html
 */
import * as Cesium from "cesium";
export class CustomPrimitive {
  show: boolean
  constructor(modelMatrix) {
    this.modelMatrix = modelMatrix || Cesium.Matrix4.IDENTITY.clone();
    this.drawCommand = null;
    this.show = true
  }

  /**
   * Create DrawCommand
   * @param {Cesium.Context} context
   */
  createCommand(context: Cesium.Context) {
    const modelMatrix = this.modelMatrix;

    const box = new Cesium.BoxGeometry({
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
      maximum: new Cesium.Cartesian3(250000.0, 250000.0, 250000.0),
      minimum: new Cesium.Cartesian3(-250000.0, -250000.0, -250000.0),
    });
    const geometry = Cesium.BoxGeometry.createGeometry(box);

    const attributeLocations =
      Cesium.GeometryPipeline.createAttributeLocations(geometry);

    const va = Cesium.VertexArray.fromGeometry({
      context: context,
      geometry: geometry,
      attributeLocations: attributeLocations,
    });

    const vs = `
      attribute vec3 position;
      void main(){
          gl_Position = czm_projection  * czm_modelView * vec4( position , 1. );
      }
      `;
    const fs = `
      uniform vec3 color;
      void main(){
          gl_FragColor=vec4( color , 1. );
      }
      `;
    const shaderProgram = Cesium.ShaderProgram.fromCache({
      context: context,
      vertexShaderSource: vs,
      fragmentShaderSource: fs,
      attributeLocations: attributeLocations,
    });

    const uniformMap = {
      color() {
        return Cesium.Color.CYAN;
      },
    };

    const renderState = Cesium.RenderState.fromCache({
      cull: {
        enabled: true,
        face: Cesium.CullFace.BACK,
      },
      depthTest: {
        enabled: true,
      },
    });

    this.drawCommand = new Cesium.DrawCommand({
      modelMatrix: modelMatrix,
      vertexArray: va,
      shaderProgram: shaderProgram,
      uniformMap: uniformMap,
      renderState: renderState,
      pass: Cesium.Pass.OPAQUE,
    });
  }

  /**
   * Implement Primiteve interface for each frame to invoke
   * @param {Cesium.FrameState} frameState
   */
  update(frameState: Cesium.FrameState) {
    if (!this.show) return;
    if (!this.drawCommand) {
      this.createCommand(frameState.context);
    }
    frameState.commandList.push(this.drawCommand);
  }
}
