(function($, STUDIP) {
  var Clock, date, pad;
  if (!($ && $.fn && $.fn.jquery && $.fn.jquery >= '1.4.3')) {
    throw 'Invalid jQuery version, required version is 1.4.3';
  }
  if (typeof STUDIP !== 'object') throw 'No Stud.IP environment';
  date = function(timestamp, format) {
    var days, mapping;
    if (format == null) format = 'H:i:s';
    if (typeof timestamp !== 'object') timestamp = new Date(timestamp);
    days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    mapping = {
      d: 'getDate',
      H: 'getHours',
      i: 'getMinutes',
      s: 'getSeconds'
    };
    return format.replace(/[dHilmsY]/g, function(token) {
      var method;
      method = mapping[token];
      if (typeof method !== 'undefined') return pad(timestamp[method]());
      switch (token) {
        case 'l':
          return days[timestamp.getDay()].toLocaleString();
        case 'm':
          return pad(timestamp.getMonth() + 1);
        case 'Y':
          return (timestamp.getYear() % 100) + 2000;
        default:
          return token;
      }
    });
  };
  pad = function(what) {
    return ('0' + what).slice(-2);
  };
  Clock = function(element, offset, format) {
    var adjust, display, interval, metadata, _ref,
      _this = this;
    if (element == null) element = '.clockip';
    if (offset == null) offset = 0;
    if (format == null) format = 'H:i:s';
    adjust = function(timestamp) {
      return offset = timestamp ? timestamp - (new Date()).getTime() : 0;
    };
    display = function() {
      var now;
      now = (new Date()).getTime();
      return element.text(date(now + offset, format));
    };
    this.start = function() {
      var interval;
      _this.stop();
      return interval = setInterval(display, 100);
    };
    this.stop = function() {
      var interval;
      if (interval !== null) clearInterval(interval);
      return interval = null;
    };
    this.element = element = $(element);
    interval = null;
    metadata = (_ref = element.data()) != null ? _ref : {};
    if (typeof metadata.format !== 'undefined') format = metadata.format;
    if (typeof metadata.timestamp !== 'undefined') {
      return adjust(metadata.timestamp);
    }
  };
  return $(function() {
    var clock, infobox_clock;
    clock = new Clock;
    if (clock.element.hasClass('uni-augsburg')) {
      infobox_clock = $("<b>Aktuelle Serverzeit:</b><br>");
      clock.element.addClass('sidebar');
      clock.element.appendTo(infobox_clock);
      $('.infoboxrahmen').append(infobox_clock);
    }
    return clock.start();
  });
})(jQuery, STUDIP);