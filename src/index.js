export default function getfreakyloopPluginContext() {
    return require.context("./plugins", true, /\.js/)
}
