class Test {
	constructor(data) {
		console.log(data);
		this.data = data;

		this.test = this.test.bind(this);
	}
	test() {
		alert(this.data);
	}
}




export default {
	initSmartContainerCanvas: class CanvasState {
		constructor(canvas, width, height) {
			//Setup
			this.canvas = canvas;
			this.canvas.width = width;
			this.canvas.height = height;
			this.ctx = canvas.getContext("2d");

			//State
			this.valid = false;
			this.shapes = [];
			this.dragging = false;
			this.selection = null;
			this.dragoffx = 0;
			this.dragoffy = 0;

			//Backup of self reference
			const self = this;

			//binding (no class properties on parcel)
			this.getMouse = this.getMouse.bind(this);
			this.draw = this.draw.bind(this);
			this.addShape = this.addShape.bind(this);
			this.clear = this.clear.bind(this);

			//Prevents user from accidentally selecting ("highlighting") elements with mouse.
			this.canvas.addEventListener("selectstart", function(e) {
				e.preventDefault();
			});

			this.canvas.addEventListener(
				"mousedown",
				function(e) {
					//lost reference of this example

					//gets mouse position
					const mouse = self.getMouse(e);
					const mx = mouse.x;
					const my = mouse.y;
					const shapes = self.shapes;

					const l = shapes.length;

					//Loop through created elements (shapes) and check if they are in the mouse position.
					for (let i = l - 1; i >= 0; i--) {
						console.log("[SCREENER]", shapes[i].x + shapes[i].w >= mx);
						//If the mouse pos is within the element x position + its width AND element y position + its height, it is selected, prioritizes the one on "top" (last added element)
						if (shapes[i].x <= mx && shapes[i].x + shapes[i].w >= mx && shapes[i].y <= my && shapes[i].y + shapes[i].h >= my) {
							//Set state accordingly
							const mySel = shapes[i];
							console.log("[SELECTED]", mySel);

							/**TO-DO:
							 * Draw anchors (is a new class) at edge (points) locations
							 * Give anchors awareness of being clicked
							 * 
							 */


							// alert(JSON.stringify(mySel))
							//Create smooth dragging
							self.dragoffx = mx - mySel.x;
							self.dragoffy = my - mySel.y;
							self.dragging = true;
							self.selection = mySel;
							self.valid = false;
							return;
						}
					}

					//Deselect old selected object;
					if (self.selection) {
						self.selection = null;
						self.valid = false;
					}
				},
				true
			);

			this.canvas.addEventListener(
				"mousemove",
				function(e) {
					if (self.dragging) {
						const mouse = self.getMouse(e);
						//Drag elementfrom where it was clicked;
						console.log("[DRAGGING]", self.dragoffx);
						self.selection.x = mouse.x - self.dragoffx;
						self.selection.y = mouse.y - self.dragoffy;
						self.valid = false;
					}
				},
				true
			);

			this.canvas.addEventListener(
				"mouseup",
				function(e) {
					self.dragging = false;
				},
				true
			);

			//Selection options and draw frequency (30ms)
			//SELECTION OPTIONS ARE NOT ADDED YET
			this.selectionColor = "#CC0000";
			this.selectionWidth = 2;
			this.interval = 17;
			setInterval(this.draw, this.interval);
		}

		draw() {
			// if our state is invalid, redraw and validate!
			if (!this.valid) {
				const ctx = this.canvas.getContext("2d");
				const shapes = this.shapes;
				this.clear();

				// draw all shapes
				const l = shapes.length;
				for (var i = 0; i < l; i++) {
					const shape = shapes[i];
					// We can skip the drawing of elements that have moved off the screen:
					if (shape.x > this.width || shape.y > this.height || shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
					shapes[i].draw(ctx);
				}

				// draw selection
				// right now this is just a stroke along the edge of the selected Shape
				if (this.selection != null) {
					ctx.strokeStyle = this.selectionColor;
					ctx.lineWidth = this.selectionWidth;
					const mySel = this.selection;
					ctx.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
				}

				// ** Add stuff you want drawn on top all the time here **

				this.valid = true;
			}
		}

		getMouse(e) {
			var element = this.canvas,
				offsetX = 0,
				offsetY = 0,
				mx,
				my;

			// Compute the total offset
			if (element.offsetParent !== undefined) {
				do {
					offsetX += element.offsetLeft;
					offsetY += element.offsetTop;
				} while ((element = element.offsetParent));
			}

			// Add padding and border style widths to offset
			// Also add the offsets in case there's a position:fixed bar
			// offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
			// offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

			mx = e.pageX - offsetX;
			my = e.pageY - offsetY;
			console.log("[MOUSE STUFF]", { x: mx, y: my });
			// We return a simple javascript object (a hash) with x and y defined
			return { x: mx, y: my };
		}

		addShape(shape) {
			this.shapes.push(shape);
			console.log(this.shapes);
		}

		//this avoids ghosting, but it needs to change.
		//it needs to clear the "old frames"
		clear() {
			const ctx = this.canvas.getContext("2d");
			//When should this be cleared?
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
			// this.canvas.width = window.innerWidth;
			// this.canvas.height = window.innerHeight;
		}
	},
	rectShape: class Shape{
		constructor(x, y, w, h, fill){
		  this.x = x || 0;
		  this.y = y || 0;
		  this.w = w || 0;
		  this.h = h || 0;
		  this.fill = fill || '#000';

		  this.draw = this.draw.bind(this)
		}
		draw(ctx){
		  ctx.fillStyle = this.fill;
		  ctx.fillRect(this.x, this.y, this.w, this.h)
		}
	  }
};
