var canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       function(callback) {
          window.setTimeout(callback, 1000 / 60);
       };
  })();

var angle = 0;

var config = {
    particleNumber: canvas.width/15,
    maxParticleSize: 3,
    colorVariation: 50
  };
  
  // Colors
  var colorPalette = {
      bg: {r:12,g:9,b:29},
      //bg: {r:12,g:21,b:46},
      matter: [
        {r:255,g:63,b:142}, // violet red
        {r:4,g:194,b:201}, // robin's egg blue
        {r:252,g:178,b:96}, // rajah
        {r:46,g:86,b:193} // cerulean blue
      ]
  };
  
  var particles = [],
      centerX = canvas.width / 2,
      centerY = canvas.height / 2,
      drawBg,
  
  drawBg = function (ctx, color) {
      ctx.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
      ctx.fillRect(0,0,canvas.width,canvas.height);
  };
  
  // Particle Constructor
  var Particle = function (x, y) {
      // X Coordinate
      this.x = x || Math.round(Math.random() * canvas.width);
      // Y Coordinate
      this.y = y || Math.round(Math.random() * canvas.height);
      // Radius of the particles
      this.r = Math.ceil(Math.random() * config.maxParticleSize + Math.random());
      // Color of the particles
      this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)],true );
  };
  
  // Provides some nice color variation
  // Accepts an rgba object
  // returns a modified rgba object or a rgba string if true is passed in for argument 2
  var colorVariation = function (color, returnString) {
      var r,g,b,a;
      r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.r);
      g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.g);
      b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.b);
      a = Math.random() /* + .2 */;
      if (returnString) {
          return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      } else {
          return {r,g,b,a};
      }
  };

  // Changing radius of particles
  var updateParticleModel = function (p, x, y) {
        if (p.r<18) {
            p.r += Math.abs(Math.sin(angle));
            angle = Math.PI / 128; 
        } else {
            particles.splice(p,1);
            particles.push(new Particle(x, y));
        }
        
        return p;
      //p.r<17? p.r += Math.abs(Math.sin(angle)):p.r = Math.ceil(Math.random() * config.maxParticleSize);
      //angle = Math.PI / 80;
      //return p;
  };
  
  // Drawing particles
  var drawParticle = function (x, y, r, c) {
      ctx.beginPath();
      ctx.strokeStyle = c;
      ctx.fillStyle = c;
      ctx.arc(x, y, r, 0, 2*Math.PI, false);
      if (r>10) {
      ctx.stroke();
      } else {
          ctx.fill();
      }
      ctx.closePath();
  };
  
  
  var initParticles = function (numParticles, x, y) {
    //r = Math.ceil(Math.random() * 20 + Math.random());
      for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle(x, y));
      }
      particles.forEach((p) => {
        p.r = Math.ceil(Math.random() * 11 + Math.random())
          drawParticle(p.x, p.y, p.r, p.c);
      });
  };
  
  
  // Frame function
  var frame = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawBg(ctx, colorPalette.bg);

    particles.map((p) => {
      return updateParticleModel(p);
    }); 

    particles.forEach((p) => {
        drawParticle(p.x, p.y, p.r, p.c);
    });

    window.requestAnimFrame(frame);
  };
  
  // Click listener
  document.body.addEventListener("mousemove", function (event) {
      var x = event.clientX,
          y = event.clientY;
    particles.forEach ((p) => {
        if(p.x>x-70 && p.x<x+70 && p.y>y-70 && p.y<y+70) {
        p.c = 'rgba(175,238,238)';
    }
    })
  });



 function cleanUp () {
    particles = [];
    initParticles(canvas.width/15);
 }  

  frame();
  
  initParticles(canvas.width/15);

  //Resize listener
  window.addEventListener("resize", cleanUp);




