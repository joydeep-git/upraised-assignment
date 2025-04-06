

// third party
import { adjectives, starWars, uniqueNamesGenerator } from "unique-names-generator";


const randomNameGenerator = (): string => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, starWars],
    separator: " ",
    length: 2
  })
}

export default randomNameGenerator;