import * as THREE from '../../build/three.module.js';

class ProxyGeometry {
    proxyGeometry;

    constructor() {

    }




    intersect(a, b, normal){
        var la = THREE.Vector4.dot(THREE.Vector4(a,1), normal);
        var lb = THREE.Vector4.dot(THREE.Vector4(b,1), normal);

        var t = la / (la - lb);
        var interpol = THREE.Vector3(a * (1.0 - t) + b * t);

        return interpol;

    }

    calcEdgeOrder(){

        var edgeOrder = [];

        edgeOrder[0] = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]; // top
        edgeOrder[1] = [ 1, 11, 9, 0, 3, 4, 8, 5, 2, 6, 7, 10 ]; // top
        edgeOrder[2] = [ 7, 8, 0, 9, 6, 10, 11, 2, 5, 3, 1, 4 ]; // bottom
        edgeOrder[3] = [ 10, 2, 3, 6, 9, 7, 5, 8, 11, 0, 4, 1 ]; // top
        edgeOrder[4] = [ 11, 10, 6, 9, 0, 8, 7, 4, 1, 3, 5, 2 ]; // top
        edgeOrder[5] = [ 5, 7, 9, 6, 3, 2, 10, 1, 4, 0, 11, 8 ]; // bottom
        edgeOrder[6] = [ 7, 6, 2, 5, 8, 4, 3, 0, 9, 11, 1, 10 ]; // bottom
        edgeOrder[7] = [ 4, 5, 6, 3, 0, 1, 2, 11, 8, 9, 10, 7 ]; // bottom

        return edgeOrder;
    }

    calcPolygon(normal, cube, index){

        var vertices = THREE.Vector3();
        var edgeOrder = this.calcEdgeOrder();

        for (let i = 0; i < edgeIndex[index].size(); i++) {
            var edgeIndex = edgeOrder[index][i];
        }


    }

    getProxyGeometry(camera, samples, minZ, maxZ, volume) {
        this.proxyGeometry = [new THREE.Geometry(), samples];
        // var m = new THREE.Matrix4();
        // m.getInverse(modelMatrix);

        var sliceDistance = Math.abs((maxZ-minZ)/samples);

        var corners = [
            new THREE.Vector3(volume.xLength / 2.0, volume.yLength / 2.0, volume.zLength / 2.0),
            new THREE.Vector3(-volume.xLength / 2.0, volume.yLength / 2.0, volume.zLength / 2.0),
            new THREE.Vector3(volume.xLength / 2.0, -volume.yLength / 2.0, volume.zLength / 2.0),
            new THREE.Vector3(volume.xLength / 2.0, volume.yLength / 2.0, -volume.zLength / 2.0),
            new THREE.Vector3(-volume.xLength / 2.0, volume.yLength / 2.0, -volume.zLength / 2.0),
            new THREE.Vector3(-volume.xLength / 2.0, -volume.yLength / 2.0, volume.zLength / 2.0),
            new THREE.Vector3(volume.xLength / 2.0, -volume.yLength / 2.0, -volume.zLength / 2.0),
            new THREE.Vector3(-volume.xLength / 2.0, -volume.yLength / 2.0, -volume.zLength / 2.0)
        ];

        var lines = [
            new THREE.Line3(corners[7], corners[4]),
            new THREE.Line3(corners[4], corners[1]),
            new THREE.Line3(corners[1], corners[0]),
            new THREE.Line3(corners[1], corners[5]),
            new THREE.Line3(corners[7], corners[5]),
            new THREE.Line3(corners[5], corners[2]),
            new THREE.Line3(corners[2], corners[0]),
            new THREE.Line3(corners[6], corners[2]),
            new THREE.Line3(corners[7], corners[6]),
            new THREE.Line3(corners[6], corners[3]),
            new THREE.Line3(corners[3], corners[0]),
            new THREE.Line3(corners[3], corners[4])
        ];

        var originPlane = new THREE.Plane(camera.direction, 0);
        var alignedPlane = new THREE.Plane(camera.direction, originPlane.distanceToPoint(camera.position));
        var diameter = corners[0].length();

        var cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        console.log(cameraDirection);

        for (let i = 0; i < samples; i++) {
            var plane = new THREE.Plane(cameraDirection, diameter - i * ((2 * diameter) / (samples - 1)));

            this.proxyGeometry[i] = new THREE.Geometry();

            //https://www.npmjs.com/package/threejs-slice-geometry

            lines.forEach(element => {
                var intersection = new THREE.Vector3();
                var result = plane.intersectLine(element, intersection);
             //   console.log("INTERSECT: ",result);
                if(result === undefined ){
                 //   console.log("No hit");
                }else{
                 //   console.log("WE GOT A HIT");
                    this.proxyGeometry[i].vertices.push( intersection );
                }
            })

       //     this.proxyGeometry[i].faces.push( new THREE.Face3( i*3, i*3 + 1, i*3 + 2 ) );



       //     this.proxyGeometry[i] = alignedPlane;
        }

        this.proxyGeometry.forEach(element => {
         //   console.log(element);
        })


        return this.proxyGeometry;
    }
}

export { ProxyGeometry };
