var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function($, STUDIP) {
  var Clock, date, pad;
  if (!(typeof STUDIP === 'object' && typeof $ === 'function')) {
    throw 'No Stud.IP environment';
  }
  if (!(($.fn != null) && ($.fn.jquery != null) && $.fn.jquery >= '1.4.3')) {
    throw 'Invalid jQuery version, required version is 1.4.3';
  }
  pad = function(what, length) {
    if (length == null) length = 2;
    return ('0000' + what).slice(-length);
  };
  date = function(format, timestamp) {
    var days, mapping;
    if (format == null) format = 'H:i:s';
    if (timestamp == null) timestamp = null;
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
      switch (token) {
        case 'l':
          return days[timestamp.getDay()].toLocaleString();
        case 'm':
          return pad(timestamp.getMonth() + 1);
        case 'Y':
          return (timestamp.getYear() % 100) + 2000;
        default:
          if (method != null) {
            return pad(timestamp[method]());
          } else {
            return token;
          }
      }
    });
  };
  Clock = (function() {

    function Clock(element, offset, format) {
      var metadata, _ref;
      if (element == null) element = '.clockip';
      this.offset = offset != null ? offset : 0;
      this.format = format != null ? format : 'H:i:s';
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
      this.display = __bind(this.display, this);
      this.adjust = __bind(this.adjust, this);
      this.element = $(element);
      this.interval = null;
      metadata = (_ref = this.element.data()) != null ? _ref : {};
      if (metadata.format != null) this.format = metadata.format;
      if (metadata.timestamp != null) this.adjust(metadata.timestamp);
    }

    Clock.prototype.adjust = function(timestamp) {
      return this.offset = timestamp ? timestamp - (new Date()).getTime() : 0;
    };

    Clock.prototype.display = function() {
      var now, time;
      now = (new Date()).getTime();
      time = date(this.format, now + this.offset);
      return this.element.text(time);
    };

    Clock.prototype.start = function() {
      this.stop();
      return this.interval = setInterval(this.display, 100);
    };

    Clock.prototype.stop = function() {
      if (this.interval != null) clearInterval(interval);
      return this.interval = null;
    };

    return Clock;

  })();
  return $(function() {
    var clock, infobox_clock;
    clock = new Clock;
    if (clock.element.hasClass('uni-augsburg')) {
      infobox_clock = $("<b>Aktuelle Serverzeit:</b><br>");
      clock.element.addClass('sidebar').appendTo(infobox_clock);
      infobox_clock.appendTo('.infoboxrahmen');
    }
    _(clock.start).defer();
    return STUDIP.CLOCK = clock;
  });
})(jQuery, STUDIP);