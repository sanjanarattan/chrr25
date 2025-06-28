const mapType = document.getElementById("mapType");

mapType.addEventListener('change', function() {
  if (this.checked) {
    drawCounties()
  } else {
    drawStates()
  }
});