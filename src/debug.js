import { Paella } from 'paella-core';
import getfreakyloopPluginContext from './index';

const initParams = {
    customPluginContext: [
        getfreakyloopPluginContext()
    ]
};

const paella = new Paella('player-container', initParams);

paella.loadManifest()
    .then(() => console.log("done"))
    .catch(e => console.error(e));
