## GPM Popularity

This project is born from a need i have and i don't plan to release this for public usage. Feel free to fork & PR.
Here is the installation process (as mainly described in [Chrome Extension Skeleton](https://github.com/salsita/chrome-extension-skeleton) ) 

## Purpose of the project

Google Play Music: All Access is a streaming service from Google, intended to work as Spotify, Deezer etc.. As far as I'm writing, Google have not implemented popularity statistics of tracks in search/album/artist songs etc... This extension fetch informations from the scrobbler Last.fm to display (ugly for now) listen count by track.

### Installation:

    git clone git@github.com:clementlamoureux/gpm-popularity.git
    
    # in case you don't have Grunt yet:
    sudo npm install -g grunt-cli

### Build instructions:

    cd chrome-extension-skeleton
    npm install
    grunt

### Chrome extension testing : 

Enable Chrome extension development, and import dev folder of the project.

This repo is based on chrome extension skeleton available here : 
https://github.com/salsita/chrome-extension-skeleton