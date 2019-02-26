(function() {
  const puckBtn = document.getElementById('my-button');
  const gradeFont = $('#grade .sample');
  const readingArr = [];
  const transitionDurationSlider = document.querySelector('#grade-transition-duration');
  const kf = new KalmanFilter();
  var connection;

  function axisSlidersToSamples(sliders, samples) {
    var inputs = document.querySelectorAll(sliders);
    var outputs = document.querySelectorAll(samples);

    function doAxes() {
      var i, l, axes = {}, ffs = [];
      for (i=0, l=inputs.length; i<l; i++) {
        axes[inputs[i].name] = inputs[i].value;
      }
      for (i in axes) {
        if (i.length === 4) {
          ffs.push('"' + i + '" ' + axes[i]);
        }
      }
      ffs = ffs.join(', ') || 'normal';

      for (i=0, l=outputs.length; i<l; i++) {
        outputs[i].style.fontVariationSettings = ffs;
      }
    }

    var i, l;
    for (i=0, l=inputs.length; i<l; i++) {
      inputs[i].addEventListener('input', doAxes);
      inputs[i].addEventListener('change', doAxes);
    }
  }

  document.querySelectorAll('.typeface:not(.loaded)').forEach(function(li) {
    console.log(li)
    axisSlidersToSamples('#' + li.id + ' input', '#' + li.id + ' .sample');
    li.className += ' loaded';
  });

  transitionDurationSlider.addEventListener('change', function() {
    console.log(document.querySelector('#grade .sample').style);
    document.querySelector('#grade .sample').style.trasitionDuration = transitionDurationSlider.value;
  })
  puckBtn.addEventListener("click", function() {
    if (connection) {
      connection.close();
      connection = undefined;
    }

    Puck.connect(function(c) {
      if (!c) {
        alert("Couldn't connect!");
        return;
      }
      connection = c;

      connection.on("data", function(d) {
        d = parseInt(d);

        if (!isNaN(d)) {
          let filteredData = Math.abs(kf.filter(d));
          let lastData = readingArr[readingArr.length - 1] || 0;
          let diff = Math.round(Math.abs(filteredData - lastData));
          let threashold = 3;
          let rangePercentage = Math.abs(((filteredData - 170) / 45) -1);
          let fontWeight = (150 - 80) * rangePercentage + 80; // min weight 80, max 150
          let fontWidth = (110 - 90) * rangePercentage + 90; // min width 90, max 110

          if (diff > threashold) {
            readingArr.push(filteredData);
            gradeFont.css('font-variation-settings', '"wght" ' + fontWeight + ', "wdth" ' + fontWidth);
          }

          // console.log('font width', fontWidth, 'font weight', fontWeight, rangePercentage);
          // console.log(kf.filter(d), d);
          // console.table({filteredData, lastData, diff});
        }
      });

      // First, reset Puck.js
      connection.write("reset();\n", function() {
        // Wait for it to reset itself
        setTimeout(function() {
          // Now tell it to write data on the current light level to Bluetooth
          // 10 times a second. Also ensure that when disconnected, Puck.js
          // resets so the setInterval doesn't keep draining battery.
          connection.write(`
            setInterval(function(){
              NRF.setRSSIHandler(function(rssi){
                Bluetooth.println(rssi);
              },1000);
            });\n`,
          function() { console.log("Ready..."); });
        }, 1000);
      });
    });
  });

})();
