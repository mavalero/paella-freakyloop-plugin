import { ButtonPlugin } from 'paella-core';

import { freakyloopCanvas } from 'paella-freakyloop-plugin/src/plugins/com.freakyloop.paella.freakyloopPlugin';

import WebRTCOnButton from '../icons/WebRTCOn.svg';

export default class flInButtonPlugin extends ButtonPlugin {
    getAriaLabel() {
        return "freakyloop WebRTC On";
    }

    getDescription() {
        return this.getAriaLabel();
    }

	async getDictionaries() {
		return {
			es: {
				"freakyloop WebRTC On": "Start WebRTC session."
			}
		}
	}

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }
        console.log("WebRTCPlugin On button is enabled ...");
        this.target = this.config.target;
        this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas;
        return this._canvas instanceof freakyloopCanvas;
    }

    async load() {
        this.icon = WebRTCOnButton;
    }

    async action() {
        this._canvas.WebRTCOn();
    }
}
