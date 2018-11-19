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
})();
