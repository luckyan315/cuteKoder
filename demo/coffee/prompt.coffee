# /**
#  * Prompt util func 
#  * Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com)
#  * 
#  */

stdin = process.openStdin()
stdin.setEncoding 'utf8'

inputCallback = null
stdin.on 'data', (input) -> inputCallback input
promptForTile1 = ->
  console.log "Please enter coordinates for 
  the first tile"
  inputCallback = (input) ->
    promptForTile2() if strToCoordinates input

promptForTile2 = ->
  console.log 'Please enter coordinates for 
  the second tile'
  inputCallback = (input) ->
    if strToCoordinates input
      console.log 'Swapping tiles ...done!'
      promptForTile1()


Grid_Size = 5
inRange = (x, y) ->
  0 <= x < Grid_Size and 0 <= y < Grid_Size

isInteger = (num) -> num is Math.round(num)

strToCoordinates = (input) ->
  halves = input.split(',')
  if halves.length is 2
    x = parseFloat halves[0]
    y = parseFloat halves[1]
    if !isInteger(x) or !isInteger(y) or !inRange(x) or !inRange(y)
      console.log 'Each coordinates must be a integer'
    else if not inRange x - 1, y - 1
      console.log 'Each coordinates must be between 1 and #{Grid_Size}.'
    else
      {x, y}
  else
    console.log 'Input must be of follow the format ... \'x, y\''

# First coffee app 
console.log 'Welcome to game!'
promptForTile1()





