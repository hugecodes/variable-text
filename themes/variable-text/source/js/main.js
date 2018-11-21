(function() {
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

  const puckBtn = document.getElementById('my-button');
  const gradeFont = $('#grade .sample');

  // // Called when we get a line of data - updates the light color
  // function onLine(v) {
  //   console.log("Received: "+JSON.stringify(v));
  // }
  var connection;

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
        let fontWeight = Math.round(((Math.abs(d) - 30) / 55) * 70 + 80);
        let fontWidth = Math.round(((Math.abs(d) - 30) / 55) * 30 + 90);

        if (!isNaN(fontWeight) || !isNaN(fontWidth)) {
          gradeFont.css('font-variation-settings', '"wght" ' + fontWeight + ', "wdth" ' + fontWidth);
          console.log('font weight: ' + fontWeight, 'font width ' + fontWidth);
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
              },1500);
            });\n`,
          function() { console.log("Ready..."); });
        }, 1500);
      });
    });
  });

})();
