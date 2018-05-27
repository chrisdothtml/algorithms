const LETTERS = (letters => {
  return (' ' + letters + letters.toUpperCase()).split('')
})('abcdefghijklmnopqrstuvwxyz')

function randInt (min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min
}

function randBool () {
  return Boolean(randInt(0, 1))
}

function randLetter () {
  return LETTERS[randInt(0, LETTERS.length - 1)]
}

function calculateFitness (goal, subject) {
  const sequenceWeight = goal.length
  let extraWeight = 0
  let lastIndexMatched = false
  let result = goal.split('').filter((_, i) => {
    const matches = subject[i] === goal[i]

    if (matches && lastIndexMatched) extraWeight += sequenceWeight
    lastIndexMatched = matches
    return matches
  }).length

  return result + extraWeight
}

function mutate (subject, probability) {
  return subject
    .split('')
    .map(letter => {
      if (Math.random() < probability) {
        return randLetter()
      } else {
        return letter
      }
    })
    .join('')
}

function reproduce (mom, dad) {
  const median = Math.floor(mom.length / 2)

  return mom.slice(0, median) + dad.slice(median)
}

function generatePopulation (size, length) {
  const result = []
  let i

  for (i = 0; i < size; i++) {
    let member = ''
    let i

    for (i = 0; i < length; i++) member += randLetter()
    result.push(member)
  }

  return result
}

export default class WordEvolver {
  constructor (options) {
    const { goal, populationSize, mutationProbability } = Object.assign({
      goal: 'Darwin',
      populationSize: 150,
      mutationProbability: .1
    }, options)

    this.finished = false
    this.generations = 1
    this.goal = goal
    this.matingPool = []
    this.mutationProbability = mutationProbability
    this.population = generatePopulation(populationSize, goal.length)
    this.populationSize = populationSize
  }

  get fittestMember () {
    let highestFitness = 0
    let fittestMember

    this.population.forEach(member => {
      const fitness = calculateFitness(this.goal, member)

      if (fitness > highestFitness) {
        highestFitness = fitness
        fittestMember = member
      }
    })

    return { fitness: highestFitness, member: fittestMember }
  }

  // fill the mating pool
  naturalSelection () {
    const maxFitness = this.fittestMember.fitness

    this.population.forEach(member => {
      const fitness = calculateFitness(this.goal, member)

      if (fitness) {
        const additions = Math.pow(fitness / maxFitness * 10, 3)
        let i

        for (i = 0; i < additions; i++) {
          this.matingPool.push(member)
        }
      }
    })
  }

  // make new generation
  breed () {
    this.generations++
    this.matingPool = []
    this.naturalSelection()

    const matingPoolSize = this.matingPool.length
    let i

    for (i = 0; i < this.populationSize; i++) {
      const mom = this.matingPool[randInt(0, matingPoolSize - 1)]
      const dad = this.matingPool[randInt(0, matingPoolSize - 1)]
      const child = mutate(reproduce(mom, dad), this.mutationProbability)

      this.population[i] = child

      if (!this.finished && child === this.goal) {
        this.finished = true
      }
    }
  }
}
