import {GUI} from './libs/dat.gui.module.js';

import {VolumeManager} from "./VolumeManager.js";

class GUIManager {
    gui;
    volumeManager;
    focplaneposValue;
    blurValue;

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
            focplanepos: this.focplaneposValue,
            Blur: this.blurValue
        };

        this.gui.add(
            volumeParams,
            'volume',
            ['stent', 'skull', 'aneurism', 'teapot']
        ).onChange((this.updateVolume).bind(this));

        this.gui.add(volumeParams, 'focplanepos', 0, 200, 1).onChange((this.updateFocPlanePos).bind(this));
        this.gui.add(volumeParams, 'Blur', 0, 1, 0.01).onChange((this.updateBlur).bind(this));

        this.updateVolume(volumeParams.volume);

        return this;
    }

    updateVolume(value) {
        this.volumeManager.loadNRRDFile("./misc/models/nrrd/" + value + ".nrrd", value);
    }

    updateBlur(value) {
       this.blurValue = value;
    }

    updateFocPlanePos(value) {
        this.focplaneposValue = value;
    }


}

export {GUIManager};
