## Leaflet Plugin Template

This repository showcases one of many ways of writing a [Leaflet](https://www.leafletjs.com)-plugin, with a modern approach of using a bundler ([rollup]()).
The setup should be considered a work-in-progress as it's only the first building block for creating a new plugin from scratch, and is not going to be a 'one-solution-fits-all' type of solution.

### What it does
With the help of [rollup](), it bundles the `src/index.js` file together with any dependencies used inside into a [UMD]() compatible format, which should be usable in most environments (node/browser). A minified version is also output along the bundle.
Most settings are the default ones and should be improved upon.

An `index.html` file is also included to show the basic use-case for the very barebone version included inside `src/index.js`.

### Important notes
A lot of variables are currently hardcoded, such as the filenames output by rollup. These can be found inside the `package.json` as follows:
```json
{
  "main": "dist/leaflet-plugin-template.cjs.js",
  "module": "dist/leaflet-plugin-template.esm.js",
  "browser": "dist/leaflet-plugin-template.umd.js",
  "minified": "dist/leaflet-plugin-template.min.js"
}
```
Currently, the setup only outputs the minified and the browser versions, but rollup supports both .esm and .cjs output as well.

Another thing hardcoded is the UMD moduleName, which is set inside `rollup.config.js`. This has to match the Leaflet-plugin name (and namespace).

### Want to know more?
A blog post will follow that explains what happens in more detail.

### Feedback
Any feedback is happily taken, either as issues or pull requests!

### TODO:
* Showcase tests (and typical ways of testing Leaflet plugins)
