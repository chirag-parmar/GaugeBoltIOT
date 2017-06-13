//window.onload = setInterval(AnalogRead('A0','Moisture'),2000)

var api_key = "19eb0377-6eee-470d-a011-a6adbe3a11fc"
var d_name = "BOLT10779429"

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

var xmlhttp = new XMLHttpRequest();

//get the body element and set background color
var body = document.getElementsByTagName("body")[0];
document.body.style.backgroundColor = "#346473";
while (body.firstChild) {
    body.removeChild(body.firstChild);
}

function setup(cno,size,x=0,y=0){
  

//creating a canvas element for the html page
  var canvas = document.createElement('canvas');
  canvas.id = "canvas" + cno.toString();
  canvas.width = size;
  canvas.height = size;
  canvas.style.left = x.toString() + "px"
  canvas.style.top = x.toString() + "px"
  
  body.appendChild(canvas);

  //get the context variable
  var ctx = canvas.getContext('2d');

  ctx.canvas.addEventListener("click", function(e) {  // use event argument

    var rect = canvas.getBoundingClientRect();  // get element's abs. position
    var x = e.clientX - rect.left;              // get mouse x and adjust for el.
    var y = e.clientY - rect.top; 
    var size = canvas.width;
    x = x/size;
    y = y/size;
  
    if (x>0.15 && x<0.85 && y>0.8 && y<0.94){
      switch(canvas.id){
          case "canvas1": 
              console.log("recorded button1 press")
              DigitalWrite("0", "HIGH"); 
              setTimeout(function() {
                DigitalWrite("0", "LOW");},5000); 
              break;
          case "canvas2":
              console.log("recorded button2 press")
              DigitalWrite("1", "HIGH"); 
              setTimeout(function() {
                DigitalWrite("1", "LOW");},5000); 
              break;
      }    
    }
    
});
}

function degtorad(degree) {
  var factor = Math.PI/180;
  return degree*factor;
}

function renderGauge (cno,axisText,btnText,size,reading,x=0,y=0) {

  var canvas = document.getElementById("canvas" + cno.toString())
  var ctx = canvas.getContext('2d');

  if(typeof reading == "undefined"){
    reading = 0;
  }
  else{
    
  }
  
  //set background color 
  ctx.fillStyle = '#346473';
  ctx.fillRect(x,y,1*size,1*size);
  
  //outline of the gauge
  ctx.beginPath();
  ctx.strokeStyle = '#9bd546';
  ctx.lineWidth = 1;
  ctx.arc(x+(0.5*size),y+(0.5*size),(0.4*size),degtorad(145),degtorad(35));
  ctx.stroke();
  
  //progress bar
  ctx.beginPath();
  ctx.lineWidth = 0.06*size;
  ctx.arc(x+(0.5*size),y+(0.5*size),(0.37*size),degtorad(145),degtorad(145 + reading*0.244140625)); //instead of 270 the reading of sensor
  ctx.stroke();
  
  //percentage label
  var percentage = Math.round(reading / 1024 * 100);
  var percentText = percentage.toString() + "%";
  ctx.font= (0.144*size).toString() + "px Nexa Light";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign="center";
  ctx.fillText(percentText,x+(0.5*size),y+(0.6*size));
  
  //axis label
  ctx.font= (0.12*size).toString() + "px Nexa Light";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign="center";
  ctx.fillText(axisText,x+(0.5*size),y+(0.45*size));

  
  
  //button
  ctx.lineWidth = 1;
  ctx.fillStyle = "#9bd546";
  ctx.roundRect(x+(0.15*size),y+(0.8*size),(0.7*size),(0.14*size),(0.02*size),1);
  
  //button text
  ctx.font= (0.096*size).toString() + "px Nexa Light";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign="center";
  ctx.fillText(btnText,x+(0.5*size),y+(0.9*size));
  
  
}

function AnalogRead(pin, sensortype) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        console.log(xmlhttp.status)
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var obj = JSON.parse(xmlhttp.responseText);
          console.log(obj.success);
          if(obj.success == "1") {
            if (sensortype == "Moisture"){
              renderGauge(1,sensortype,"POUR WATER",500,parseInt(obj.value));
            }
            else if(sensortype == "Luminosity"){
              renderGauge(2,sensortype,"SHINE LIGHT",500,parseInt(obj.value));
            }
          }
          else{
          renderGauge(1,"Moisture","POUR WATER",500,0);
          renderGauge(2,"Luminosity","SHINE LIGHT",500,0);
          }
        }
    };
    xmlhttp.open("GET","http://beta.boltiot.com/remote/"+api_key+"/analogRead?pin="+pin+"&deviceName="+d_name,true);
    xmlhttp.send();
}

function DigitalWrite(pin,state) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        console.log(xmlhttp.responseText.length)
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var obj = JSON.parse(xmlhttp.responseText);
            if(obj.success == "1") {
              console.log("GPIO state change succesfull") 
            }
          }
        
    };
    xmlhttp.open("GET","http://beta.boltiot.com/remote/" + api_key + "/digitalWrite?pin=" + pin + "&state=" + state + "&deviceName=" + d_name,true);
    xmlhttp.send();
}

function onloadWindow(){
  setup(1,500);
  setup(2,500);
  renderGauge(1,'Moisture',"POUR WATER",500,0);
  renderGauge(2,'Luminosity',"SHINE LIGHT",500,0);
  setInterval(function(){ 
      AnalogRead('A0','Moisture');
      AnalogRead('A0','Luminosity');
  }, 1000);
}

