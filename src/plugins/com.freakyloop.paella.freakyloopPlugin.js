import { CanvasPlugin, Canvas, createElementWithHtmlText } from 'paella-core';
import { utils } from 'paella-core';
import "../styles/freakyloop.css";

import infoIcon from '../icons/info-yellow.svg';

export class freakyloopCanvas extends Canvas {
    constructor(player, videoContainer, config) {
        super('div', player, videoContainer);
        this.config = config;
        this._WebRTCSession = false;
        this._session = utils.getUrlParameter("session");
        this._text = "Session:";
        this._showButtons = this.config.showButtons!==undefined ? this.config.showButtons : true;
    }

    async loadCanvas(player) {
        console.log("Loading WebRTC canvas...");
        this._videoPlayer = player;

        player.element.style.width = "100%";
        player.element.style.height = "100%";
        player.element.style.position = "absolute";
        player.element.style.top = "0";
        player.element.style.left = "0";

        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";
        this.element.addEventListener("click", evt => {
            console.log("Click listener");
            //evt.stopPropagation();
            //evt.preventDefault();
        });

        this._infoMessage = createElementWithHtmlText(`
            <div id="sessionMsg" class="fl-message">${this._text}</div>
        `, this.element);
        this._infoMessage.style.display = "none";

        // Zoom buttons
        if (this._showButtons) {
            const flButtonsContainer = createElementWithHtmlText(`
                <div class="fl-buttons"></div>
            `, this.element);
            const infoBtn = createElementWithHtmlText(`<button>${ infoIcon }</button>`, flButtonsContainer);
            infoBtn.addEventListener("click", evt => {
                evt.stopPropagation();
                this.info();
            });
        }
    }

    showMessage() {
        this._infoMessage.innerHTML = `Message: ${ this._text }, SessionID: ${ this._session }`;
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
        }
        this._infoMessage.style.display = "flex";
        this._hideTimeout = setTimeout(() => {
            this.hideMessage();
        }, 2000);
    }

    hideMessage() {
        this._infoMessage.style.display = "none";
        this._hideTimeout = null;
    }

    info() {
        console.log("info button pressed")
        
        if (this.WebRTCSession==true) {
            this._text = "The session has started.";
        }else{
            this._text ="The session is closed.";
        }
        console.log(this._text);
        this.showMessage(this._text);
    }


    WebRTCOn() {
        const zoom = this.currentZoom * 1.1;

        this.WebRTCSession = true;
        console.log("WebRTCPlugin Session On.");

        if (zoom<this._maxZoom) {
            this.currentZoom = zoom;
            this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
        }
    }

    WebRTCOff() {
        const zoom = this.currentZoom * 0.9;

        this.WebRTCSession = false;
        console.log("WebRTCPlugin Session Off.");

        if (zoom>=1) {
            this.currentZoom = zoom;
            this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
        }
    }
}

export default class freakyloopCanvasPlugin extends CanvasPlugin {
    get canvasType() { return "video"; }

    isCompatible(stream) {
        if (!Array.isArray(stream.canvas) || stream.canvas.length === 0) {
            // By default, the default canvas is HTML video canvas
            console.log("canvas not found.");
            return true;
        }
        
        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer) {
        console.log("freakyloopCanvas instance.");
        return new freakyloopCanvas(this.player, videoContainer, this.config);
    }
}
