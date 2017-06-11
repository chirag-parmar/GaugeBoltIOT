CanvasRenderingContext2D.prototype.roundRect = 
 
function(x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
  if (stroke) {
    this.stroke();
  }
  if (fill) {
    this.fill();
  }        
}

//creating a canvas element for the html page
var canvas = document.createElement('canvas');
canvas.id = "CursorLayer";

//get the body element and append canvas to it.
var body = document.getElementsByTagName("body")[0];
document.body.style.backgroundColor = "#346473";
while (body.firstChild) {
    body.removeChild(body.firstChild);
}
body.appendChild(canvas);

//get the context variable
var ctx = canvas.getContext('2d');

ctx.canvas.addEventListener("mouseclick", function(event){
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  
  
})

function degtorad(degree) {
  var factor = Math.PI/180;
  return degree*factor;
}

function renderGauge (x,y,axisText,btnText,size) {
  canvas.width = 1*size;
  canvas.height = 1*size;
  //set background color 
  ctx.fillStyle = '#346473';
  ctx.fillRect(x,y,1*size,1*size);
  
  //outline of the gauge
  ctx.beginPath();
  ctx.strokeStyle = '#9bd546';
  ctx.lineWidth = 1;
  ctx.arc(x+(0.5*size),y+(0.5*size),(0.4*size),degtorad(150),degtorad(30));
  ctx.stroke();
  
  //progress bar
  ctx.beginPath();
  ctx.lineWidth = 0.06*size;
  ctx.arc(x+(0.5*size),y+(0.5*size),(0.37*size),degtorad(150),degtorad(270)); //instead of 270 the reading of sensor
  ctx.stroke();
  
  //percentage label
  var percentage = 69;
  var percentText = percentage.toString() + "%";
  ctx.font= (0.144*size).toString() + "px Nexa Light";
  ctx.fillStyle = "#FFFFFF"
  ctx.fillText(percentText,x+(0.36*size),y+(0.6*size));
  
  //axis label
  ctx.font= (0.12*size).toString() + "px Nexa Light";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(axisText,x+(0.27*size),y+(0.45*size));
  
  
  //button
  ctx.lineWidth = 1;
  ctx.fillStyle = "#9bd546";
  ctx.roundRect(x+(0.15*size),y+(0.8*size),(0.7*size),(0.14*size),(0.02*size),1)
  
  //button text
  ctx.font= (0.096*size).toString() + "px Nexa Light";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(btnText,x+(0.18*size),y+(0.9*size));
  
  
}

renderGauge(0,0,"Moisture","POUR WATER",500);
