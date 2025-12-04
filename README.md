# RA Overlay

## Introduction

This set of pages serves as an overlay for OBS. It fetches information
and achievement completion progress for the configured game from 
RetroAchievements. 

More information on RetroAchievements can be found at
https://retroachievements.org/ and their API is documented at 
https://api-docs.retroachievements.org/.

## Setup

Download the repository to a convenient location. Then, some
configuration files need to be updated. 

* config.json - update the username and game ID number
* apikey.json - (not included in repository) create a JSON object 
containing a property apiKey, set the value to your user account's API 
key from your RetroAchivements profile
* Possibly break apart the scrolling checkerboard background from the 
data on top. This way, the background and be behind the game source
and the game information can be on top of it

Host the repository on a local web server (Python's built-in http-server
module works fine for this). Load the index.html page in OBS as a web
source, and you're good to go. 

## Plans

Currently, the overlay only grabs the game data once. Eventually, it 
should periodically check for updates. 

The scrolling direction, checkerboard size, and colors of the background
 are hard-coded. These should be configurable via config.json.

