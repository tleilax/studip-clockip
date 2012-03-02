( ($, STUDIP) ->
    throw 'No Stud.IP environment' unless typeof STUDIP is 'object' and typeof $ is 'function'
    throw 'Invalid jQuery version, required version is 1.4.3' unless $.fn? and $.fn.jquery? and $.fn.jquery >= '1.4.3'

    # enable periodic synchronisation with server timestamp, requires Stud.IP 2.2
    # STUDIP.jsupdate_enable = (STUDIP.VERSION >= '2.2')

    # simple pad function
    pad = (what, length = 2) -> ('0000' + what).slice -length

    # Quick port of PHP's date() function to JS, far from complete
    date = (format = 'H:i:s', timestamp = null) ->
        timestamp = new Date(timestamp) unless typeof timestamp is 'object'

        days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
        mapping =
            d: 'getDate'
            H: 'getHours'
            i: 'getMinutes'
            s: 'getSeconds'

        format.replace /[dHilmsY]/g, (token) ->
            method = mapping[token]

            switch token
                when 'l' then days[timestamp.getDay()].toLocaleString()
                when 'm' then pad(timestamp.getMonth() + 1)
                when 'Y' then (timestamp.getYear() % 100) + 2000
                else
                    if method? then pad timestamp[method]() else token

    class Clock
        constructor: (element = '.clockip', @offset = 0, @format = 'H:i:s') ->
            @element = $(element)
            @interval = null

            metadata = @element.data() ? {}
            @format = metadata.format if metadata.format?
            @adjust(metadata.timestamp) if metadata.timestamp?
        adjust: (timestamp) =>
            @offset = if timestamp then timestamp - (new Date()).getTime() else 0
        display: =>
            now = (new Date()).getTime()
            time = date(@format, now + @offset)

            if time isnt @last
                @element.text time
                @last = time
        start: =>
            @stop()
            @interval = setInterval(@display, 100)
        stop: =>
            clearInterval(interval) if @interval?
            @interval = null
            @last = null

    # initialize upon domready
    $ ->
        clock = new Clock
        if clock.element.hasClass('uni-augsburg')
            infobox_clock = $ """
                              <b>Aktuelle Serverzeit:</b><br>
                              """
            clock.element
                 .addClass('sidebar')
                 .appendTo(infobox_clock)
            infobox_clock.appendTo('.infoboxrahmen')

        _(clock.start).defer()

        STUDIP.CLOCK = clock

)(jQuery, STUDIP)
