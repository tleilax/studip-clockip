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

@include_once 'lib/classes/UpdateInformation.class.php';

class ClockIP extends StudipPlugin implements SystemPlugin {

	const FORMAT = 'l, d.m.Y H:i:s';

	public function __construct() {
		parent::__construct();
		
		// Stud.IP 2.2: Periodically adjust clock
		if (UpdateInformation::isCollecting()) {
			UpdateInformation::setInformation('CLOCK.adjust', floor(microtime(true) * 1000));
			return;
		}
		
		$additional_classes = '';
	// Local changes: 
		// Uni Oldenburg
		if (strpos($GLOBALS['ABSOLUTE_URI_STUDIP'], 'oldenburg') !== false) {
			$additional_classes .= ' uni-oldenburg';
		};
		// Uni Augsburg - only display on details page
		if (strpos($GLOBALS['ABSOLUTE_URI_STUDIP'], 'augsburg') !== false) {
			$additional_classes .= ' uni-augsburg';
			if (basename($_SERVER['SCRIPT_FILENAME']) !== 'details.php') {
				return;
			}
		};
		
		// Generate time output, special case "l" for localized output
		if (strpos(self::FORMAT, 'l') !== false) {
			$days = array(
			    _('Sonntag'), _('Montag'), _('Dienstag'), _('Mittwoch'),
			    _('Donnerstag'), _('Freitag'), _('Samstag')
			);

			$format = str_replace('l', '\\'.implode('\\', str_split($days[date('w')])), self::FORMAT);
			$timestamp = date($format);
		} else {
			$timestamp = date(self::FORMAT);
		}
		
		// Add clock to page
		$html = sprintf('<div class="clockip%s" data-format="%s" data-timestamp="%u">%s</div>',
			$additional_classes,
			self::FORMAT,
			floor(microtime(true) * 1000),
			$timestamp
		);
		PageLayout::addBodyElements($html);

		// Add css and js to page
		PageLayout::addScript($this->getPluginURL().'/clock.js');
		PageLayout::addStylesheet($this->getPluginURL().'/clock.css');
	}
}
