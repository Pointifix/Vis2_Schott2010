import {GUI} from './libs/dat.gui.module.js';

import {VolumeManager} from "./VolumeManager.js";
import * as SHARED from "./Shared.js";

class GUIManager {
    gui;
    volumeManager;
    blurValue;
    update;

    constructor() {
        if (GUIManager.exists) {
            return GUIManager.instance;
        }
        GUIManager.instance = this;
        GUIManager.exists = true;

        this.volumeManager = new VolumeManager(null, null, null);
        this.focplaneposValue = 120;
        this.blurValue = 0.5;

        this.gui = new GUI();

        let volumeParams = {
            volume: 'teapot',
            Focal_Plane_Distance: this.focplaneposValue,
            Blur: this.blurValue
        };

        this.gui.add(
            volumeParams,
            'volume',
            ['stent', 'skull', 'aneurism', 'teapot']
        ).onChange((this.updateVolume).bind(this));

        this.gui.add(volumeParams, 'Focal_Plane_Distance', 0, 512, 1).onChange((this.updateFocPlanePos).bind(this));
        this.gui.add(volumeParams, 'Blur', 0, 1, 0.01).onChange((this.updateBlur).bind(this));

        this.updateVolume(volumeParams.volume);

        return this;
    }

    updateVolume(value) {
        this.volumeManager.loadNRRDFile("./misc/models/nrrd/" + value + ".nrrd", value, this);
        this.update = true;
    }

    updateBlur(value) {
       this.blurValue = value;
       this.update = true;
    }

    updateFocPlanePos(value) {
        window.focal_plane_distance = value;
        this.update = true;
    }


}

export {GUIManager};
