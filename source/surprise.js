(function () {
  var active = false;
  var doc = document.documentElement;
  var element = document.querySelector('.surprise');
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  var devicePixelRatio = window.devicePixelRatio || 1;
  var widthPx = 3000
  var heightPx = 100
  var cells = []
  var color = "#22204d";
  var stepWidth = 10
  var countX = Math.floor(widthPx / stepWidth)
  var countY = Math.floor(heightPx / stepWidth)
  var colorScale = d3.scaleLinear().domain([0, 1]).range(['#fff', color])

  canvas.style.width = widthPx + "px";
  canvas.style.height = heightPx + "px";
  canvas.style.display = "block";
  canvas.width = widthPx * devicePixelRatio;
  canvas.height = heightPx * devicePixelRatio;
  element.appendChild(canvas)

  function scale(value) {
    return value * devicePixelRatio;
  }
  function x(value) {
    return scale(value);
  }
  function y(value) {
    return scale(value)
  }
  function distance2d(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  function seed(random) {
    noise.seed(random)
    var points = []
    Array(countX).fill(null).forEach(() => {
      return Array(countY).fill(null).forEach(() => {
        // var x = idxX * stepWidth + Math.random() * 0.5 * stepWidth
        // var y = idxY * stepWidth + Math.random() * 0.5 * stepWidth
        var x = Math.random() * widthPx;
        var y = Math.random() * heightPx;
        if (points.every(p => distance2d(x, y, p.x, p.y) > stepWidth * 0.6)) {
          points.push({ x: x, y: y })
        }
      })
    })
    var delaunay = d3.Delaunay.from(points.map(h => ([h.x, h.y])))
    var voronoi = delaunay.voronoi([0, 0, widthPx, heightPx])
    cells = points.map((point, idx) => {
      var threshold = noise.perlin2(point.x / 500, 0.5) * 0.2 + 0.7
      var position = 1 - point.y / heightPx
      var rand = noise.perlin2(point.x / 100, point.y / 100) * 0.5 + 0.5
      var wetAbove = 1 - Math.pow(1 - position, 2)
      let wetBelow = 1 - Math.pow(((threshold - position) * heightPx) / ((1 - threshold) * heightPx), 1.5)
      wetBelow = wetBelow > 0.1 ? wetBelow : 0
      var height = position > threshold ? wetAbove + (1 - wetAbove) * rand : wetBelow * rand

      return {
        x: point.x,
        y: point.y,
        height: height,
        polygon: voronoi.cellPolygon(idx)
      }
    })
  }

  function draw() {
    // Clear canvas
    ctx.fillStyle = '#fff'
    ctx.fillRect(x(0), y(0), x(widthPx), y(heightPx))

    // Draw cells
    ctx.save();
    cells.forEach((cell) => {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x(cell.polygon[0][0]), y(cell.polygon[0][1]))
      cell.polygon.forEach((point) => {
        ctx.lineTo(x(point[0]), y(point[1]))
      })
      ctx.closePath()
      ctx.fillStyle = colorScale(cell.height)
      ctx.strokeStyle = colorScale(cell.height)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    })
    ctx.restore();
  }

  function onscroll(event) {
    var scrollY = window.scrollY;

    if (scrollY < 0 && !active) {
      doc.style['background'] = color;
      active = true;
    } else if (scrollY > 0 && active) {
      doc.style['background'] = "none";
      active = false;
    }
  }

  window.addEventListener('scroll', onscroll, { passive: true });
  seed(Math.random())
  draw();
})();
