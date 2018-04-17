window.addEventListener('load', function() {
  var myInput = document.querySelector('.maskedInput');

  vanillaTextMask.maskInput({
    inputElement: myInput,
    mask: createRutMask(),
  });
});
