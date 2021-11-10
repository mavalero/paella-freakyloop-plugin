import { CanvasPlugin, Canvas, createElementWithHtmlText } from 'paella-core';

import "../styles/freakyloop.css";

import WebRTCOnIcon from '../icons/WebRTCOn.svg';
import WebRTCOffIcon from '../icons/WebRTCOff.svg';

function setZoom(container, playerElement, newZoom) {
    const containerSize = {
        w: container.offsetWidth,
        h: container.offsetHeight
    };
    const containerCenter = {
        left: containerSize.w / 2,
        top: containerSize.h / 2 
    }
    
    playerElement.style.width = `${newZoom * 100}%`;
    playerElement.style.height = `${newZoom * 100}%`;

    const playerSize = {
        left: playerElement.offsetLeft,
        top: playerElement.offsetTop,
        w: playerElement.offsetWidth,
        h: playerElement.offsetHeight
    };
    const playerCenter = {
        left: playerSize.w / 2,
        top: playerSize.h / 2
    };
    const offset = {
        left: playerCenter.left - containerCenter.left,
        top: playerCenter.top - containerCenter.top
    };
    
    playerElement.style.left = `-${offset.left}px`;
    playerElement.style.top = `-${offset.top}px`;

    return offset;
}

function movePlayer(player, currentPosition, offset) {
    const newPosition = {
        left: currentPosition.left + offset.left,
        top: currentPosition.top + offset.top
    }
    const parent = player.parentElement;
    
    player.style.top = `-${newPosition.top}px`;

    const top = (player.offsetHeight + player.offsetTop) - parent.offsetHeight;
    if (top<0) {
        newPosition.top = currentPosition.top;
    }

    player.style.left = `-${newPosition.left}px`;
    const left = (player.offsetWidth + player.offsetLeft) - parent.offsetWidth;
    if (left<0) {
        newPosition.left = currentPosition.left;
    }

    return newPosition;
}

export class freakyloopCanvas extends Canvas {
    constructor(player, videoContainer, config) {
        super('div', player, videoContainer);
        this.config = config;
        this._maxZoom = this.config.maxZoom || 4;
        this._WebRTCSession = false;
        this._showButtons = this.config.showButtons!==undefined ? this.config.showButtons : true;
    }

    async loadCanvas(player) {


        console.log("Loading WebRTC canvas...");
        this.currentZoom = 1;
        this._videoPlayer = player;

        player.element.style.width = "100%";
        player.element.style.height = "100%";
        player.element.style.position = "absolute";
        player.element.style.top = "0";
        player.element.style.left = "0";

        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";

        this.element.addEventListener("mousewheel", evt => {
            if (!evt.altKey) {
                this.showAltKeyMessage();
                return;
            }
            this.hideAltKeyMessage();
            const newZoom = this.currentZoom + evt.deltaY * 0.01;
            if (newZoom>1 && newZoom<=this._maxZoom) {
                this.currentZoom = newZoom;
                this._playerCenter = setZoom(this.element, this._videoPlayer.element, this.currentZoom);
            }
            evt.preventDefault();
        });

        let drag = false;
        let preventClick = false;
        let dragPosition = null;
        const beginDrag = () => drag = true;
        const endDrag = () => drag = false;
        const cancelClick = evt => {
            if (preventClick) {
                evt.stopPropagation();
                evt.preventDefault();
            }
        }
        this.element.addEventListener("mousedown", beginDrag);
        this.element.addEventListener("mouseleave", endDrag);
        this.element.addEventListener("mouseup", endDrag);
        this.element.addEventListener("click", cancelClick);
        this.element.addEventListener("mouseup", cancelClick);

        this.element.addEventListener("mousemove", evt => {
            if (drag && this._playerCenter) {
                if (dragPosition === null) {
                    dragPosition = { left: evt.clientX, top: evt.clientY };
                }
                preventClick = true;
                const offset = { 
                    left: dragPosition.left - evt.clientX, 
                    top: dragPosition.top - evt.clientY
                };
                this._playerCenter = movePlayer(this._videoPlayer.element, this._playerCenter, offset);
                dragPosition = { left: evt.clientX, top: evt.clientY };
            }
            else {
                preventClick = false;
                dragPosition = null;
            }
        });

        // "press alt" message
        const message = {
            es: "Manten pulsado ALT para hacer zoom"
        }[navigator.language] || "Preset ALT to zoom";

        this._zoomMessage = createElementWithHtmlText(`
            <div class="fl-message">${message}</div>
        `, this.element);
        this._zoomMessage.style.display = "none";

        // Zoom buttons
        if (this._showButtons) {
            const flButtonsContainer = createElementWithHtmlText(`
                <div class="fl-buttons"></div>
            `, this.element);
            const WebRTCOnBtn = createElementWithHtmlText(`<button>${ WebRTCOnIcon }</button>`, flButtonsContainer);
            const WebRTCOffBtn = createElementWithHtmlText(`<button>${ WebRTCOffIcon }</button>`, flButtonsContainer);
            WebRTCOnBtn.addEventListener("click", evt => {
                evt.stopPropagation();
                this.WebRTCOn();
            });
            WebRTCOffBtn.addEventListener("click", evt => {
                evt.stopPropagation();
                this.WebRTCOff();
            });
        }
    }

    showAltKeyMessage() {
        if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
        }
        this._zoomMessage.style.display = "";
        this._hideTimeout = setTimeout(() => {
            this.hideAltKeyMessage();
        }, 2000);
    }

    hideAltKeyMessage() {
        this._zoomMessage.style.display = "none";
        this._hideTimeout = null;
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

        this.WebRTCSession = true;
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
            return true;
        }
        
        return super.isCompatible(stream);
    }

    getCanvasInstance(videoContainer) {
        console.log("freakyloopCanvas instance.");
        return new freakyloopCanvas(this.player, videoContainer, this.config);
    }
}
