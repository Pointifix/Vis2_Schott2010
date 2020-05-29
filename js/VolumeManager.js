import * as THREE from "../build/three.module.js";

import {NRRDLoader} from './loaders/NRRDLoader.js';
import {ProxyGeometryGenerator} from "./ProxyGeometryGenerator.js";

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

    loadNRRDFile(filePath, file, guiManager) {
        this.currentFileName = file;

        let callBackFunction = (function(volume) {
            this.updateVolume(volume,guiManager);
        }).bind(this);

        this.NRRDLoader.load(filePath, callBackFunction);
    }

    updateVolume(volume,guiManager) {
        this.volume = volume;

        this.texture = new THREE.DataTexture3D(this.volume.data, this.volume.xLength, this.volume.yLength, this.volume.zLength);
        this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;

        // TODO Fix that files need special treatments
        if (this.currentFileName == "stent") {
            this.texture.format = THREE.RedFormat;
            this.texture.type = THREE.FloatType;
        } else {
            this.texture.format = THREE.RedFormat;
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

        this.volumeShaderMaterial.needsUpdate = true;

        this.boundingBox.min.set(-this.volume.xLength / 2, -this.volume.yLength / 2, -this.volume.zLength / 2);
        this.boundingBox.max.set(this.volume.xLength / 2, this.volume.yLength / 2, this.volume.zLength / 2);


        this.proxyGeometryGenerator.setBoundingBox(this.boundingBox);

        this.controls.update();

    };
}

export {VolumeManager};
