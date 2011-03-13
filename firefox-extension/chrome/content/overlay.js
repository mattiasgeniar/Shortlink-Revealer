var ShortlinkRevealer = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("ShortlinkRevealer-strings");
  },
};

window.addEventListener("load", function () { ShortlinkRevealer.onLoad(); }, false);