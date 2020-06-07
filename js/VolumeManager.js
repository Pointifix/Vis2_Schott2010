import * as THREE from "../build/three.module.js";

import {NRRDLoader} from './loaders/NRRDLoader.js';
import {ProxyGeometryGenerator} from "./ProxyGeometryGenerator.js";

/**
 * @author David Ammer
 * @author Simon Pointner
 * @description Manages the volume
 */
class VolumeManager {
    NRRDLoader;
    volume;

    currentFileName;

    texture;

    controls;
    camera;

    volumeShaderMaterial;
    proxyGeometryGenerator;

    boundingBox;

    constructor(camera, controls, volumeShaderMaterial) {
        if (VolumeManager.exists) {
            return VolumeManager.instance;
        }

        this.camera = camera;
        this.controls = controls;
        this.volumeShaderMaterial = volumeShaderMaterial;

        this.proxyGeometryGenerator = new ProxyGeometryGenerator();

        VolumeManager.instance = this;
        VolumeManager.exists = true;

        this.NRRDLoader = new NRRDLoader();
        this.boundingBox = new THREE.Box3(new THREE.Vector3(0), new THREE.Vector3(0));
        this.boundingBox.makeEmpty();

        return this;
    }

    /**
     * @param {String} filePath - path of the nrrd-file
     * @param {String} file - filename
     * @param {GUIManager} guiManager - Manages the gui
     * @description Load new 3D-Volume
     */
    loadNRRDFile(filePath, file, guiManager) {
        this.currentFileName = file;

        let callBackFunction = (function(volume) {
            this.updateVolume(volume,guiManager);
        }).bind(this);

        this.NRRDLoader.load(filePath, callBackFunction);
    }

    /**
     * @param {Object} volume - the volume file from nrrd file
     * @param {GUIManager} guiManager - manages the gui
     * @description update the volume
     */
    updateVolume(volume,guiManager) {
        this.volume = volume;

        console.log(this.volume);

        this.texture = new THREE.DataTexture3D(this.volume.data, this.volume.xLength, this.volume.yLength, this.volume.zLength);
        this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;

        if (this.volume.header["encoding"] === "raw") {
            this.texture.format = THREE.RedFormat;
        } else if (this.volume.header["encoding"] === "gzip") {
            this.texture.format = THREE.RedFormat;
            this.texture.type = THREE.FloatType;
        }

        this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
        this.texture.unpackAlignment = 1;

        this.controls.zoom0 = 2;
        this.controls.reset();
        this.controls.target.set(0, 0, 0);

        let diagonal = new THREE.Vector3(this.volume.xLength, this.volume.yLength, this.volume.zLength).length();

        this.camera.position.set(0, 0, diagonal);
        this.camera.prevZoom = Number.MAX_VALUE;

        let maxFocus = diagonal * window.sliceDistance;
        guiManager.updateMaxFocus(maxFocus);

        this.volumeShaderMaterial.uniforms["u_volume"].value = this.texture;
        this.volumeShaderMaterial.uniforms["u_size"].value.set(this.volume.xLength, this.volume.yLength, this.volume.zLength);
        this.volumeShaderMaterial.uniforms["u_matrix"].value = this.volume.matrix;

        this.volumeShaderMaterial.needsUpdate = true;

        this.boundingBox.min.set(-this.volume.xLength / 2, -this.volume.yLength / 2, -this.volume.zLength / 2);
        this.boundingBox.max.set(this.volume.xLength / 2, this.volume.yLength / 2, this.volume.zLength / 2);


        this.proxyGeometryGenerator.setBoundingBox(this.boundingBox);

        this.controls.update();

    };
}

export {VolumeManager};
