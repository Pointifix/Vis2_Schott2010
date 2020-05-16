import * as THREE from '../build/three.module.js';

const MAX_SLICES_COUNT = 256;

//https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-39-volume-rendering-techniques
class ProxyGeometryGenerator {
    box;
    corners;
    edges;

    vertices = new Array(MAX_SLICES_COUNT);
    indices = new Array(MAX_SLICES_COUNT);
    drawRange = new Array(MAX_SLICES_COUNT);

    geometries = new Array(MAX_SLICES_COUNT);

    constructor() {
        if (ProxyGeometryGenerator.exists) {
            return ProxyGeometryGenerator.instance;
        }
        ProxyGeometryGenerator.instance = this;
        ProxyGeometryGenerator.exists = true;

        for (let i = 0; i < MAX_SLICES_COUNT; i++) {
            this.vertices[i] = new Array(6 * 3).fill(0);
            this.indices[i] = new Array(5 * 3).fill(0);
        }
        this.drawRange.fill(0);
        this.geometries.fill(new THREE.BufferGeometry());

        console.log(this.vertices);

        return this;
    }

    /**
     * Updates the bounding box
     * @param box
     */
    setBoundingBox(box) {
        this.box = box;

        let min = box.min;
        let max = box.max;

        let minX = Math.min(min.x, max.x);
        let minY = Math.min(min.y, max.y);
        let minZ = Math.min(min.z, max.z);

        let maxX = Math.max(min.x, max.x);
        let maxY = Math.max(min.y, max.y);
        let maxZ = Math.max(min.z, max.z);

        this.corners = [
            new THREE.Vector3(minX, minY, minZ),
            new THREE.Vector3(maxX, minY, minZ),
            new THREE.Vector3(minX, maxY, minZ),
            new THREE.Vector3(maxX, maxY, minZ),
            new THREE.Vector3(minX, minY, maxZ),
            new THREE.Vector3(maxX, minY, maxZ),
            new THREE.Vector3(minX, maxY, maxZ),
            new THREE.Vector3(maxX, maxY, maxZ),
        ];

        this.edges = [
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
     * @returns {boolean}
     */
    calcIntersection(plane, line, vertices) {
        let intersection = new THREE.Vector3();
        if (plane.intersectLine(line, intersection) === undefined) return false;
        vertices.push(intersection);
        return true;
    }

    /**
     * Calculates the proxy geometries created by intersection view aligned slices with the volume bounding box
     * @param camera
     * @returns {Array}
     */
    updateProxyGeometries(camera) {
        let intersectionVertices = [];
        let geometries = [];

        let cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        let viewPlane = new THREE.Plane();
        viewPlane.setFromNormalAndCoplanarPoint(cameraDirection, camera.position);

        let plane = new THREE.Plane(cameraDirection, viewPlane.constant);

        let sliceIndex = 0;

        do {
            plane.constant--;
            intersectionVertices = [];

            this.edges.forEach(line => {
                this.calcIntersection(plane, line, intersectionVertices);
            });

            if (intersectionVertices.length) {
                this.sortPolygonEdges(intersectionVertices);

                for (let i = 0; i < intersectionVertices.length; i++) {
                    this.vertices[sliceIndex][i * 3] = intersectionVertices[i].x;
                    this.vertices[sliceIndex][i * 3 + 1] = intersectionVertices[i].y;
                    this.vertices[sliceIndex][i * 3 + 2] = intersectionVertices[i].z;
                }

                let geometry = new THREE.Geometry();

                geometry.vertices = intersectionVertices;

                for (let face = 0; face < intersectionVertices.length - 1; face++) {
                    this.indices[sliceIndex][face * 3] = intersectionVertices.length - 1;
                    this.indices[sliceIndex][face * 3 + 1] = face;
                    this.indices[sliceIndex][face * 3 + 2] = (face + 1) % (intersectionVertices.length - 1);

                    geometry.faces.push(new THREE.Face3(intersectionVertices.length - 1, face, (face + 1) % (intersectionVertices.length - 1)));
                }
                geometries.push(geometry);

                sliceIndex++;
            }
        } while ((intersectionVertices.length || geometries.length == 0) && sliceIndex < 256);
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

export {ProxyGeometryGenerator};
