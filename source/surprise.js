(function () {
  var active = false;
  var doc = document.documentElement;
  var element = document.querySelector('.surprise');
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var devicePixelRatio = window.devicePixelRatio || 1;
  var widthPx = 3000
  var heightPx = 500
  canvas.style.width = widthPx + "px";
  canvas.style.height = heightPx + "px";
  canvas.width = widthPx * devicePixelRatio;
  canvas.height = heightPx * devicePixelRatio;
  element.appendChild(canvas)
  var heights = []

  var color = "#353277";
  var stepWidth = 10

  function scale(value) {
    return value * devicePixelRatio;
  }
  function x(value) {
    return scale(value);
  }
  function y(value) {
    return scale(value)
  }

  var countX = Math.floor(widthPx / stepWidth)
  var countY = Math.floor(heightPx / stepWidth)

  function seed(random) {
    noise.seed(random)
    heights = Array(countX).fill(null).map((_, idxX) => {
      return Array(countY).fill(null).map((_, idxY) => {
        var wetAbove = (idxY / countY)
        var wetBelow = (idxY + 3) / countY;
        var threshold = (idxY + (countY / 100)) / countY;
        // console.log(idxY, threshold)

        // var rand = Math.random();
        var rand = noise.perlin2(idxX / 20, idxY / 3) * 0.1 + Math.random() * 0.9;


        return rand > threshold ? (1 - wetAbove) + wetAbove * rand : (1 - wetBelow) * rand

        return Math.min(1, (1 - wet) + (1 - wet) * Math.random())
        var perlinLowFx = noise.perlin2(idxX / 10, idxY / 10) / 2 + 0.5;
        var perlinHighFx = noise.perlin2(idxX / 3, idxY / 3) / 2 + 0.5;
        var perlinSum = (perlinLowFx + perlinHighFx) / 2;
        // var perlinSum = perlinLowFx
        return perlinSum
      })
    })
  }

  function draw(extent = 1) {
    // Clear canvas
    ctx.fillStyle = '#fff'
    ctx.fillRect(x(0), y(0), x(widthPx), y(heightPx))

    // Draw pixels
    ctx.save();
    heights.forEach((heights, idxX) => {
      heights.forEach((height, idxY) => {
        ctx.fillStyle = '#353277';
        ctx.globalAlpha = height
        ctx.fillRect(x(idxX * stepWidth), y(idxY * stepWidth), scale(stepWidth), scale(stepWidth))
      })
    })
    ctx.restore();
  }

  function clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
  }

  var minExtent = 0.5
  function onscroll(event) {
    var scrollY = window.scrollY;

    if (scrollY < 0) {
      if (!active) {
        doc.style['background'] = color;
        // element.textContent = "hello!";
        active = true;
      }
      // var margin = clamp(-90, 0, -90 - scrollY);
      // element.style['margin-top'] = margin + "px";
      var extent = minExtent + clamp(0, 1 - minExtent, -scrollY / 50)
      draw(extent)
    } else if (scrollY > 0 && active) {
      doc.style['background'] = "none";
      active = false;
      draw(minExtent)
    }
  }
  window.addEventListener('scroll', onscroll, { passive: true });
  seed(Math.random())
  draw(minExtent);
})();
