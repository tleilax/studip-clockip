(function ($) {

	if (typeof STUDIP !== 'object') {
		throw 'No Stud.IP environment';
	}

	if (!$ || !$.fn || !$.fn.jquery || ($.fn.jquery < '1.4.3')) {
		throw 'Invalid jQuery version, required version is 1.4.3';
	}

	var Clock = {

		element: null,
		format: 'H:i:s',
		offset: 0,

		initialize: function (id) {
			var metadata = $(id).data() || {};

			Clock.element = $(id);
			Clock.format = metadata.format || Clock.format;
			Clock.adjust(metadata.timestamp);
			
			setInterval(Clock.display, 100);
		},
		adjust: function (timestamp) {
			Clock.offset = timestamp ? timestamp - (new Date()).getTime() : 0;
		},
		display: function () {
			var now = (new Date()).getTime() + Clock.offset;
			Clock.element.text(Clock.date(now));
		},

		// Quick port of PHP's date() function to JS, FAR from complete
		days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
		mapping: {d: 'getDate', H: 'getHours', i: 'getMinutes', s: 'getSeconds'},
		date: function (timestamp) {
			if (typeof timestamp !== 'object') {
				timestamp = new Date(timestamp);
			}

			return Clock.format.replace(/[dHilmsY]/g, function (token) {
				if (Clock.mapping[token]) {
					return pad(timestamp[Clock.mapping[token]]());
				}
				switch (token) {
					case 'l': return Clock.days[timestamp.getDay()].toLocaleString();
					case 'm': return pad(timestamp.getMonth() + 1);
					case 'Y': return (timestamp.getYear() % 100) + 2000;
					default: return token;
				}
			});
		}

	};

	// Pads a given string to a length of 2
	function pad(what) {
		return ('0' + what).slice(-2);
	}

	$(document).ready(function () {
		// Uni Augsburg: move clock to infobox
		if ($('.clockip').is('.uni-augsburg')) {
			var infobox_clock = $('&nbsp;<b>Aktuelle Serverzeit:</b><br>');
			$('.clockip').addClass('sidebar').appendTo(infobox_clock);
			$('.infoboxrahmen').append(infobox_clock);
		}

		Clock.initialize('.clockip');
	});

	// Make clock object globally accessible
	STUDIP.CLOCK = Clock;

    // Enable periodic updates
    STUDIP.jsupdate_enable = true;
    
}(window.jQuery));

