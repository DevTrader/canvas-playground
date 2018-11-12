import canvasState from './utility/canvasState';

/**
 * Objective: 
 *   1-Refactor script.js into stateful canvas pattern.
 *   2-Get selection and anchors working properly
 *   3-Initiate react structure (or utility functions)
 */

const targetCanvas = document.getElementById("canvas")

const myCanvas = new canvasState.initSmartContainerCanvas(targetCanvas, 1500, 900)

console.log('active')
// const test = new canvasState.Test('DATA');

myCanvas.addShape(new canvasState.rectShape(530,700,240,160, 'green'))
myCanvas.addShape(new canvasState.rectShape(240,40,60,50));
myCanvas.addShape(new canvasState.rectShape(880,150,160,130, 'rgba(127, 255, 212, .5)'));
myCanvas.addShape(new canvasState.rectShape(280,10,13,400, 'red'));


console.log('[STAGE]', stage)
