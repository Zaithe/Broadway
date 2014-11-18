ffmpeg -i tree.mp4 -c:v libx264  -preset ultrafast -crf 23 -movflags +faststart -c:a copy tree2.mp4 
