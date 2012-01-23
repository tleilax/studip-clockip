( ($, STUDIP) ->
    throw 'Invalid jQuery version, required version is 1.4.3' unless $ and $.fn and $.fn.jquery and $.fn.jquery >= '1.4.3'
    throw 'No Stud.IP environment' unless typeof STUDIP is 'object'

    # enable periodic synchronisation with server timestamp
    # STUDIP.jsupdate_enable = true

    # Quick port of PHP's date() function to JS, FAR from complete
    date = (timestamp, format = 'H:i:s') ->
        timestamp = new Date(timestamp) unless typeof timestamp is 'object'

        days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
        mapping =
            d: 'getDate'
            H: 'getHours'
            i: 'getMinutes'
            s: 'getSeconds'

        format.replace /[dHilmsY]/g, (token) ->
            method = mapping[token]
            return pad timestamp[method]() unless typeof method is 'undefined'

            switch token
              when 'l' then return days[timestamp.getDay()].toLocaleString()
              when 'm' then return pad(timestamp.getMonth() + 1)
              when 'Y' then return (timestamp.getYear() % 100) + 2000
              else return token

    # simple pad function
    pad = (what) -> ('0' + what).slice -2

    # define clock pseudo-class
    Clock = (element = '.clockip', offset = 0, format = 'H:i:s') ->
        adjust = (timestamp) ->
            offset = if timestamp then timestamp - (new Date()).getTime() else 0
        display = ->
            now = (new Date()).getTime()
            element.text date(now + offset, format)
        @start = ->
            @stop()
            interval = setInterval(display, 100)
        @stop = ->
            clearInterval(interval) unless interval is null
            interval = null

        @element = element = $(element)
        interval = null

        metadata = element.data() ? {}
        format = metadata.format unless typeof metadata.format is 'undefined'
        adjust(metadata.timestamp) unless typeof metadata.timestamp is 'undefined'

    # initialize upon domready
    $ ->
        clock = new Clock
        if clock.element.hasClass 'uni-augsburg'
            infobox_clock = $ """
                              <b>Aktuelle Serverzeit:</b><br>
                              """
            clock.element.addClass 'sidebar'
            clock.element.appendTo infobox_clock
            $('.infoboxrahmen').append infobox_clock

        clock.start()

)(jQuery, STUDIP)
