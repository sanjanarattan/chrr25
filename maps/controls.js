const mapType = document.getElementById("mapType")
const filterSelect = document.getElementById("filterSelect")
const infoType = document.getElementById("infoType")

mapType.addEventListener('change', function() {
    if (this.checked) {
        drawCounties()
        colorCounties(filterSelect.value)
    } else {
        drawStates()
        colorStates(filterSelect.value)
    }
});

filterSelect.addEventListener('change', function() {
    if (mapType.checked) {
        drawCounties()
        colorCounties(filterSelect.value)
    } else {
        drawStates()
        colorStates(filterSelect.value)
    }

});