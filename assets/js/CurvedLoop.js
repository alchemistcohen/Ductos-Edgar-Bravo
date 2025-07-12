function createCurvedLoop({
  target,
  text = "",
  speed = 2,
  curveAmount = 400
}) {
  const container = document.querySelector(target);
  if (!container) return;

  // Crear estructura SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 1440 120");
  svg.style.width = "100%";

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const pathId = `curve-${Math.random().toString(36).substr(2, 9)}`;
  path.setAttribute("id", pathId);
  path.setAttribute("d", `M-100,40 Q500,${40 + curveAmount} 1540,40`);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "transparent");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.appendChild(path);

  const textMeasure = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textMeasure.setAttribute("xml:space", "preserve");
  textMeasure.setAttribute("visibility", "hidden");
  textMeasure.setAttribute("opacity", "0");
  textMeasure.textContent = text;

  const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textEl.setAttribute("font-weight", "bold");
  
  const textPath = document.createElementNS("http://www.w3.org/2000/svg", "textPath");
  textPath.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${pathId}`);
  textEl.appendChild(textPath);

  svg.appendChild(defs);
  svg.appendChild(textMeasure);
  svg.appendChild(textEl);
  container.appendChild(svg);

  setTimeout(() => {
    const bbox = textMeasure.getBBox();
    const spacing = bbox.width;
    const pathLength = path.getTotalLength();
    const repeats = spacing ? Math.ceil(pathLength / spacing) + 2 : 0;

    const tspans = [];
    for (let i = 0; i < repeats; i++) {
      const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
      tspan.setAttribute("x", (i * spacing).toString());
      tspan.textContent = text + " "; // espacio no rompible
      textPath.appendChild(tspan);
      tspans.push(tspan);
    }

    let offset = 0;
    function animate() {
      offset -= speed;
      if (offset <= -spacing) {
        offset += spacing; // en vez de salto duro, se recicla
      }

      tspans.forEach((tspan, idx) => {
        const x = idx * spacing + offset;
        tspan.setAttribute("x", x.toString());
      });

      requestAnimationFrame(animate);
    }
    animate();
  }, 50);
}
