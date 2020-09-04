(function () {
  var active = false;
  var doc = document.documentElement;
  var element = document.querySelector('.surprise');
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  var devicePixelRatio = window.devicePixelRatio || 1;
  var widthPx = 3000
  var heightPx = 50
  canvas.style.width = widthPx + "px";
  canvas.style.height = heightPx + "px";
  canvas.width = widthPx * devicePixelRatio;
  canvas.height = heightPx * devicePixelRatio;
  element.appendChild(canvas)
  var heights = []

  var color = "#353277";
  var stepWidth = 20

  function scale(value) {
    return value * devicePixelRatio;
  }
  function x(value) {
    return scale(value);
  }
  function y(value) {
    return scale(value)
  }

  function seed(random) {
    noise.seed(random)
    heights = Array(1000).fill(null).map((_, idx) => {
      // return 0.5 + 0.5 * Math.random()
      var perlinLowFx = noise.perlin2(idx / 10, 0.5) / 2 + 0.5;
      var perlinHighFx = noise.perlin2(idx / 3, 0.5) / 2 + 0.5;
      // var perlinSum = (perlinLowFx + perlinHighFx) / 2;
      var perlinSum = perlinLowFx
      return perlinSum
    })
  }

  function draw(extent = 1) {
    // Clear canvas
    ctx.fillStyle = '#fff'
    ctx.fillRect(x(0), y(0), x(widthPx), y(heightPx))

    var foregroundBaselineY = 10;
    var backgroundBaselineY = foregroundBaselineY + 10;
    var variableHeight = heightPx - backgroundBaselineY
    console.log(variableHeight)

    // Draw background
    ctx.save();
    ctx.beginPath()
    ctx.moveTo(x(0), y(0));
    let currentX = 0;
    heights.forEach(height => {
      var currentY = backgroundBaselineY + height * variableHeight * extent
      ctx.lineTo(x(currentX), y(currentY));
      currentX = currentX + stepWidth;
      ctx.lineTo(x(currentX), y(currentY));
      ctx.lineTo(x(currentX), y(backgroundBaselineY));
    })
    ctx.lineTo(x(currentX), y(0));
    ctx.closePath()
    ctx.fillStyle = '#c4c2e6';
    ctx.fill()
    ctx.restore();

    // Draw foreground
    ctx.save();
    ctx.beginPath()
    ctx.moveTo(x(0), y(0));
    currentX = 0;
    heights.forEach(height => {
      var currentY = foregroundBaselineY + (height * variableHeight * extent);
      ctx.lineTo(x(currentX), y(currentY));
      currentX = currentX + stepWidth;
      ctx.lineTo(x(currentX), y(currentY));
      ctx.lineTo(x(currentX), y(foregroundBaselineY));
    })
    ctx.lineTo(x(currentX), y(0));
    ctx.closePath()
    ctx.fillStyle = '#353277';
    ctx.fill()
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
