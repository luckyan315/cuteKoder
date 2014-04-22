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






