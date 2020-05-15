import * as THREE from '../../build/three.module.js';

class ProxyGeometry {
    proxyGeometry;
    box;
    corners;
    lines;

    valuesx = [0,2,4,6];
    valuesy = [0,1,4,5];
    valuesz = [0,1,2,3];

    constructor(box) {
        this.box = box;

        this.corner
        this.box.getAttribute("position").array.forEach(element => {

        });

        console.log(this.corners);

        this.lines = [
            new THREE.Line3(this.corners[7], this.corners[4]),
            new THREE.Line3(this.corners[4], this.corners[1]),
            new THREE.Line3(this.corners[1], this.corners[0]),
            new THREE.Line3(this.corners[1], this.corners[5]),
            new THREE.Line3(this.corners[7], this.corners[5]),
            new THREE.Line3(this.corners[5], this.corners[2]),
            new THREE.Line3(this.corners[2], this.corners[0]),
            new THREE.Line3(this.corners[6], this.corners[2]),
            new THREE.Line3(this.corners[7], this.corners[6]),
            new THREE.Line3(this.corners[6], this.corners[3]),
            new THREE.Line3(this.corners[3], this.corners[0]),
            new THREE.Line3(this.corners[3], this.corners[4])
        ];

        console.log(this.lines);
    }


    intersect(a, b, normal){
        let la = THREE.Vector4.dot(THREE.Vector4(a,1), normal);
        let lb = THREE.Vector4.dot(THREE.Vector4(b,1), normal);

        let t = la / (la - lb);
        let interpol = THREE.Vector3(a * (1.0 - t) + b * t);

        return interpol;

    }

    calcPolygon(normal, cube, index){

        let vertices = THREE.Vector3();

        for (let i = 0; i < edgeIndex[index].size(); i++) {
            let edgeIndex = this.edgesOrder[index][i];
            if(cube.edges[edgeIndex].a, cube.edges[edgeIndex].b, normal){
                vertices.push(intersect(cube.edges[edgeIndex].a, cube.edges[edgeIndex].b, normal));
            }
        }


    }

    getProxyGeometry(camera, samples, volume) {
        this.proxyGeometry = [new THREE.Geometry(), samples];
        // var m = new THREE.Matrix4();
        // m.getInverse(modelMatrix);

        let maxZ = Number.MAX_VALUE;
        let minZ = Number.MAX_VALUE;
        let index = -1;

        for (let i = 0; i < this.corners.length; i++) {
            let tmp = this.corners[i].z;
            maxZ = Math.max(tmp, maxZ);
            if (tmp < minZ) {
                minZ = tmp;
                index = i;
            }
        }

        let sliceDistance = Math.abs((maxZ-minZ)/samples);

        let originPlane = new THREE.Plane(camera.direction, 0);
        var alignedPlane = new THREE.Plane(camera.direction, originPlane.distanceToPoint(camera.position));
        var diameter = this.corners[0].length();

        var cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        for (let i = 0; i < samples; i++) {
            var plane = new THREE.Plane(cameraDirection, diameter - i * ((2 * diameter) / (samples - 1)));

          //  this.proxyGeometry[i] = plane;
               this.proxyGeometry[i] = new THREE.Geometry();

               //https://www.npmjs.com/package/threejs-slice-geometry

            for(let j = 0; j < this.edgesOrder[i].size(); j++){
                var edgeIndex = edgeOrder[i][j];
                var intersection = new THREE.Vector3();
                var result = plane.intersectLine(lines[edgeIndex], intersection);
                if(result === undefined ){
              //      console.log("No hit");
                }else{
                //    console.log("WE GOT A HIT");
                    this.proxyGeometry[i].vertices.push( intersection );
                }

            }


            /*   lines.forEach(element => {
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
*/
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
