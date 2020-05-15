import * as THREE from '../../build/three.module.js';

//https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-39-volume-rendering-techniques
class ProxyGeometry {
    proxyGeometry;
    box;
    corners;
    lines;
    intersections;

    constructor(box) {
        this.intersections = [];
        this.box = box;

        let min = box.min;
        let max = box.max;

        let minx = Math.min(min.x, max.x);
        let miny = Math.min(min.y, max.y);
        let minz = Math.min(min.z, max.z);

        let maxx = Math.max(min.x, max.x);
        let maxy = Math.max(min.y, max.y);
        let maxz = Math.max(min.z, max.z);

        this.corners = [
            new THREE.Vector3(minx, miny, minz),
            new THREE.Vector3(maxx, miny, minz),
            new THREE.Vector3(minx, maxy, minz),
            new THREE.Vector3(maxx, maxy, minz),
            new THREE.Vector3(minx, miny, maxz),
            new THREE.Vector3(maxx, miny, maxz),
            new THREE.Vector3(minx, maxy, maxz),
            new THREE.Vector3(maxx, maxy, maxz),
        ];

        this.lines = [
            new THREE.Line3(this.corners[0], this.corners[1]),
            new THREE.Line3(this.corners[2], this.corners[3]),
            new THREE.Line3(this.corners[4], this.corners[5]),
            new THREE.Line3(this.corners[6], this.corners[7]),

            new THREE.Line3(this.corners[0], this.corners[2]),
            new THREE.Line3(this.corners[1], this.corners[3]),
            new THREE.Line3(this.corners[4], this.corners[6]),
            new THREE.Line3(this.corners[5], this.corners[7]),

            new THREE.Line3(this.corners[0], this.corners[4]),
            new THREE.Line3(this.corners[1], this.corners[5]),
            new THREE.Line3(this.corners[2], this.corners[6]),
            new THREE.Line3(this.corners[3], this.corners[7])
        ];
    }

    /**
     * Returns the intersection point of a plane/line intersection
     * @param plane
     * @param line
     * @param vertices
     */
    calcIntersection(plane, line, vertices) {
        let intersection = new THREE.Vector3();
        let result = plane.intersectLine(line, intersection);
        if (result !== undefined) vertices.push(intersection);
    }

    /**
     * Calculates the proxy geometries created by intersection view aligned slices with the volume bounding box
     * @param camera
     * @param backToFront
     * @returns {Array}
     */
    getProxyGeometries(camera, backToFront) {
        this.intersections = [];
        let intersectionVertices;
        let geometries = [];

        let cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        let viewPlane = new THREE.Plane();
        viewPlane.setFromNormalAndCoplanarPoint(cameraDirection, camera.position);

        let plane = new THREE.Plane(cameraDirection, viewPlane.constant);

        do {
            plane.constant--;
            intersectionVertices = [];

            this.lines.forEach(line => {
                this.calcIntersection(plane, line, intersectionVertices);
            });

            if (intersectionVertices.length) {
                this.sortPolygonEdges(intersectionVertices);

                let geometry = new THREE.Geometry();

                geometry.vertices = intersectionVertices;

                for (let face = 0; face < intersectionVertices.length - 1; face++) {
                    geometry.faces.push(new THREE.Face3(intersectionVertices.length - 1, face, (face + 1) % (intersectionVertices.length - 1)));
                }
                geometries.push(geometry);
            }
        } while (intersectionVertices.length || geometries.length == 0);

        return geometries;
    }

    /**
     * Calculates the centroid of intersectionVertices, sorts the intersection Vertices according in ascending order of the angle
     * to the centroid, and adds the centroid at the end of intersectionVertices
     * @param intersectionVertices
     */
    sortPolygonEdges(intersectionVertices) {
        let centroid = new THREE.Vector3(0, 0, 0);

        for (let i = 0; i < intersectionVertices.length; i++) {
            centroid.add(intersectionVertices[i]);
        }
        centroid.divideScalar(intersectionVertices.length);

        let angles = [];
        for (let i = 0; i < intersectionVertices.length; i++) {
            angles[i] = Math.atan2((intersectionVertices[i].y - centroid.y), (intersectionVertices[i].x - centroid.x));
        }

        intersectionVertices.sort(function (a, b) {
            return angles[intersectionVertices.indexOf(a)] - angles[intersectionVertices.indexOf(b)];
        });

        intersectionVertices.push(centroid);
    }
}

export {ProxyGeometry};
