import { ButtonPlugin } from 'paella-core';

import { freakyloopCanvas } from 'paella-freakyloop-plugin/src/plugins/com.freakyloop.paella.freakyloopPlugin';

import WebRTCOffButton from '../icons/WebRTCOff.svg';

export default class flOutButtonPlugin extends ButtonPlugin {
    getAriaLabel() {
        return "freakyloop WebRTC Off";
    }

    getDescription() {
        return this.getAriaLabel();
    }

	async getDictionaries() {
		return {
			es: {
				"freakyloop WebRTC Off": "End WebRTC session."
			}
		}
	}

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }
        console.log("WebRTCPlugin Off button is enabled ...");
        this.target = this.config.target;
        this._canvas = this.player.videoContainer.streamProvider.streams[this.target].canvas;
        return this._canvas instanceof freakyloopCanvas;
    }

    async load() {
        this.icon = WebRTCOffButton;
    }

    async action() {
        this._canvas.WebRTCOn();
    }
}
