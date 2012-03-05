<?php
/**
 * ClockIP.class.php
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 *
 * @author      Jan-Hendrik Willms <tleilax+studip@gmail.com>
 * @license     http://www.gnu.org/licenses/gpl-2.0.html GPL version 2
 * @version     1.2
 */

if ($GLOBALS['SOFTWARE_VERSION'] >= '2.2') {
    @include_once 'lib/classes/UpdateInformation.class.php';
}

class ClockIP extends StudipPlugin implements SystemPlugin
{
    const FORMAT = 'l, d.m.Y H:i:s';

    function __construct()
    {
        parent::__construct();

        // Stud.IP 2.2: Periodically adjust clock
        if (class_exists('UpdateInformation') && mt_rand(0, 10) == 0 && UpdateInformation::isCollecting()) {
            UpdateInformation::setInformation('CLOCK.adjust', floor(microtime(true) * 1000));
            return;
        }

        $additional_classes = '';
    // Local changes:
        // Uni Oldenburg
        if (strpos($GLOBALS['STUDIP_INSTALLATION_ID'], 'uni-ol') !== false) {
            if (!PageLayout::isHeaderEnabled()) {
                return;
            }
            $additional_classes .= ' uni-oldenburg';
        };
        // Uni Augsburg - only display on details page
        // TODO still working? INSTALLATION_ID?
        if (strpos($GLOBALS['ABSOLUTE_URI_STUDIP'], 'augsburg') !== false) {
            if (basename($_SERVER['SCRIPT_FILENAME']) !== 'details.php') {
                return;
            }
            $additional_classes .= ' uni-augsburg';
        };

        // Generate time output, special case "l" for localized output
        $format = self::FORMAT;
        if (strpos($format, 'l') !== false) {
            # ugly but since the plugin provides no translation itself, it should do the trick
            $days = array_map('_', words('Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag'));

            $format = str_replace('l', '\\'.implode('\\', str_split($days[date('w')])), $format);
        }
        $timestamp = date($format);

        // Add clock to page
        $html = sprintf('<div class="clockip%s" data-format="%s" data-timestamp="%u">%s</div>',
            $additional_classes,
            self::FORMAT,
            floor(microtime(true) * 1000),
            $timestamp
        );
        PageLayout::addBodyElements($html);

        // Add version to STUDIP javascript object
        $js = sprintf('STUDIP = STUDIP || {}; STUDIP.VERSION = "%s";', $GLOBALS['SOFTWARE_VERSION']);
        PageLayout::addHeadElement('script', array('type' => 'text/javascript'), $js);

        // Add css and js to page
        PageLayout::addScript($this->getPluginURL() . '/clock.js');
        PageLayout::addStylesheet($this->getPluginURL() . '/clock.css');
    }
}
