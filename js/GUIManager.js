import {GUI} from './libs/dat.gui.module.js';

import {VolumeManager} from "./VolumeManager.js";

class GUIManager {
    gui;
    volumeManager;

    constructor() {
        if (GUIManager.exists) {
            return GUIManager.instance;
        }
        GUIManager.instance = this;
        GUIManager.exists = true;

        this.volumeManager = new VolumeManager(null, null, null);

        this.gui = new GUI();

        let volumeParams = {
            volume: 'teapot'
        };

        this.gui.add(
            volumeParams,
            'volume',
            ['stent', 'skull', 'aneurism', 'teapot']
        ).onChange((this.updateVolume).bind(this));

        this.updateVolume(volumeParams.volume);

        return this;
    }

    updateVolume(value) {
        this.volumeManager.loadNRRDFile("./misc/models/nrrd/" + value + ".nrrd", value);
    }
}

export {GUIManager};
