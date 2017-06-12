var api_key = "19eb0377-6eee-470d-a011-a6adbe3a11fc "
var d_name = "BOLT10734941"

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


function setup(cno,x,y,size){
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
              alert("hello1");
              //digitalWrite(0, HIGH); 
              //setInterval(digitalWrite(0, LOW),5000) 
              break;
          case "canvas2":
              alert("hello2")
              //setDebug(False); 
              //digitalWrite(0, HIGH); 
              //setInterval(digitalWrite(0, LOW),5000) 
              break;
      }    
    }
    
});
  return ctx;
}

function degtorad(degree) {
  var factor = Math.PI/180;
  return degree*factor;
}

function renderGauge (cno,axisText,btnText,size,reading,x=0,y=0) {
  
  var ctx = setup(cno,x,y,size);
  
  if(typeof reading == "undefined"){
    reading = 0;
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
  var percentage = reading / 1024 * 100;
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

function AnalogRead(pin) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        //document.getElementById(element_id).innerHTML = xmlhttp.responseText;
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            alert(xmlhttp.responseText);
            //document.getElementById("javascript_response").innerHTML = "Javascript Response : "+xmlhttp.responseText;
            var obj = JSON.parse(xmlhttp.responseText);
            if(obj.success == "1") {
              return obj.value;
            }
            else {
              return 512;
            }
        }
    };
    xmlhttp.open("GET","http://beta.boltiot.com/remote/"+api_key+"/analogRead?pin="+pin+"&deviceName="+d_name,true);
    xmlhttp.send();
}

setInterval(renderGauge(1,"Moisture","POUR WATER",500,moisture_level = AnalogRead("A0")),500);
setInterval(renderGauge(2,"Luminosity","SHINE LIGHT",500,moisture_level = AnalogRead("A0")),500);


