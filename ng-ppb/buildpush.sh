#!/bin/bash
ng build --prod --bh /ppb/
rsync -rzP --delete --delete-delay dist/ pi:/var/www/html/ppb/
