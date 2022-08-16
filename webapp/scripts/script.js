var playButton = document.getElementById('playbutton')
const finalColumn = document.querySelector('[data-final-column]')
const computerScoreSpan = document.querySelector('[data-computer-score]')
const yourScoreSpan = document.querySelector('[data-your-score]')
const SELECTIONS = [
  {
    name: 'rock',
    emoji: '✊',
    beats: 'scissors'
  },
  {
    name: 'paper',
    emoji: '✋',
    beats: 'rock'
  },
  {
    name: 'scissors',
    emoji: '✌️',
    beats: 'paper'
  }
]

// Play button that will take photo and call the model evaluation function to determine what choice was made 
// based on captured image, then sent to makeSelection to be compared to computer choice and update scores
playButton.addEventListener('click', e => {
  takepicture() //from the webcam class
  var playerChoice = callPredict()
  makeSelection(playerChoice)
})

//calls funtion to evaluate/predict player choice from captured image, returns object from array of RPS choices
async function callPredict()
{
  const playerChoicePredictionIndex = await predict()
  const playerChoice = SELECTIONS[playerChoicePredictionIndex] 
  return playerChoice
}

//loads model
async function loadModel() {
  return tf.loadGraphModel('/models/model.json');
}

//processes image to tensor expected by model input
function preprocess(imgData)
{
 return tf.tidy(()=>{
  //convert the image data to a tensor 
  let imageTensor = tf.browser.fromPixels(imgData, numChannels= 3)
  //resize to 224 x 224
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]).toFloat()
  // Normalize the image 
  const offset = tf.scalar(255.0)
  const normalized = resized.div(offset)
  //Add a dimension to get a batch shape 
  const batched = normalized.expandDims(0)
  return batched
 })}

 //calls to load model, process captured image for model input, and pass image tensor
 //to evaluate player move. Returns index of most likely move where 
 //rock==0, paper==1, scissors==2
 async function predict() {
  const model = await loadModel()
  const image = document.getElementById("photo")
  const imageTensor = preprocess(image)
  let result = model.execute(imageTensor)

  //remove dimention of tensor
  result = tf.squeeze(result)
  //convert from tensor to array and find index of max value
  const values = result.dataSync()
  const arr = Array.from(values)
  //find highest percentage of choices
  const max = Math.max(...arr)
  //find index of highest percentage
  const index = arr.indexOf(max)
  return index
}


//Calls for computer move choice (random), determine winner, add result to move history, and update scores
async function makeSelection(selection) {
  const computerSelection = randomSelection()
  //await stops script until promise is resolved from the model
  const yourWinner = isWinner(await selection, computerSelection)
  const computerWinner = isWinner(computerSelection, await selection)

  addSelectionResult(computerSelection, computerWinner)
  addSelectionResult(await selection, yourWinner)

  if (yourWinner) incrementScore(yourScoreSpan)
  if (computerWinner) incrementScore(computerScoreSpan)
}

//Increment score
function incrementScore(scoreSpan) {
  scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1
}

//Add result to move history columns
function addSelectionResult(selection, winner) {
  const div = document.createElement('div')
  div.innerText = selection.emoji
  div.classList.add('result-selection')
  if (winner) div.classList.add('winner')
  finalColumn.after(div)
}

//Determine if selection wins over opponent choice
function isWinner(selection, opponentSelection) {
  return selection.beats === opponentSelection.name
}

//Used to determine computer move choice, random [0..2]
function randomSelection() {
  const randomIndex = Math.floor(Math.random() * SELECTIONS.length)
  return SELECTIONS[randomIndex]
}
