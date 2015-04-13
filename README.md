logger-js
=========

A simple Logging utility for Javascript as used on webpages to print messages to the embedded browser console.

Installation
============

Download to web viewable directly and reference the script in your html file.

<script src="${install-directory}/logger.js></script>

Usage
=============
<script>
	var logger = new Logger('path to be logged', options);
	
	/*
	 * Use to print string messages
	 */
	logger.log('message');
	
	/*
	 * Use to print objects to the console
	 */
	var object = {attr:'value'};
	logger.log(object);
</script>