ffmpeg -i RedBull.mp4 -c:v libx264  -preset ultrafast -crf 23 -movflags +faststart -c:a copy ./Player/RedBull.mp4 
