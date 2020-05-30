import {GUI} from './libs/dat.gui.module.js';

import {VolumeManager} from "./VolumeManager.js";

class GUIManager {
    gui;
    volumeManager;
    update;

    constructor() {
        if (GUIManager.exists) {
            return GUIManager.instance;
        }
        GUIManager.instance = this;
        GUIManager.exists = true;

        this.volumeManager = new VolumeManager(null, null, null);
        this.focus = 120;
        this.blur = 0.5;
        this.threshold = 0.15;
        this.transfer = 'gray';

        this.gui = new GUI();

        let volumeParams = {
            Volume: 'Skull',
            Transfer: this.transfer,
            Focus: this.focus,
            Blur: this.blur,
            Threshold: this.threshold
        };

        this.gui.add(
            volumeParams,
            'Volume',
            ['Aneurism',
             'BostonTeapot',
             'Engine',
             'Skull',
             'Stent',
             'Lobster']
        ).onChange((this.updateVolume).bind(this));

        this.gui.add(
            volumeParams,
            'Transfer',
            ['gray', 'viridis']
        ).onChange((this.updateTransfer).bind(this));

        this.gui.add(volumeParams, 'Focus', 0, 512, 1).onChange((this.updateFocus).bind(this));
        this.gui.add(volumeParams, 'Blur', 0, 1, 0.01).onChange((this.updateBlur).bind(this));
        this.gui.add(volumeParams, 'Threshold', 0, 1, 0.01).onChange((this.updateThreshold).bind(this));

        this.updateVolume(volumeParams.Volume);

        return this;
    }

    updateVolume(value) {
        this.volumeManager.loadNRRDFile("./misc/models/nrrd/" + value + ".nrrd", value, this);
        this.update = true;
    }

    updateTransfer(value) {
        this.transfer = value;
        this.update = true;
    }

    updateBlur(value) {
       this.blur = value;
       this.update = true;
    }

    updateFocus(value) {
        window.focal_plane_distance = value;
        this.update = true;
    }

    updateMaxFocus(maxValue) {
        this.gui.__controllers.forEach(controller => {
            if (controller.property === "Focus") {
                controller.max(maxValue);
                controller.setValue(maxValue / 2);
                controller.updateDisplay();
            }
        });
    }

    updateThreshold(value) {
        this.threshold = value;
        this.update = true;
    }
}

export {GUIManager};
