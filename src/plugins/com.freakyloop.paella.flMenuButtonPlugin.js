import { MenuButtonPlugin } from 'paella-core';

import { freakyloopCanvas } from 'paella-freakyloop-plugin/src/plugins/com.freakyloop.paella.freakyloopPlugin';

import flButton from '../icons/loop-arrow.svg'
import flOnButton from '../icons/WebRTCOn.svg';
import flOffButton from '../icons/WebRTCOff.svg';

export default class flMenuButtonPlugin extends MenuButtonPlugin {
    getAriaLabel() {
        return "Show WebRTC options";
    }

    getDescription() {
        return this.getAriaLabel();
    }

	async getDictionaries() {
		return {
			es: {
				"Show WebRTC options": "Show WebRTC options"
			}
		}
	}

    async isEnabled() {
        if (!(await super.isEnabled())) {
            console.log("freakyloop Menu disabled ...");
            return false;
        }
        console.log("freakyloop Menu enabled ...");
        this._target = this.config.target || "presenter";
        this._canvas = this.player.videoContainer.streamProvider.streams[this._target].canvas;
        return this._canvas instanceof freakyloopCanvas;
    }

    async load() {
        this.icon = flButton;
        console.log("freakyloop Menu loaded ...");
    }

    async getMenu() {
        return [
            {
                id: "on",
                title: "Start",
                icon: flOnButton
            },
            {
                id: "off",
                title: "Stop",
                icon: flOffButton
            }
        ]
    }

    get buttonType() {
        return "button"
    }

    get showTitles() {
        return true;
    }

    itemSelected(itemData) {
        switch (itemData.id) {
        case "on":
            this._canvas.WebRTCOn();
            break;
        case "off":
            this._canvas.WebRTCOff();
            break;
        }
    }
}
