

import { adjectives, starWars, uniqueNamesGenerator } from "unique-names-generator";



// #### Generate random name
export const randomNameGenerator = (): string => {

  return uniqueNamesGenerator({
    dictionaries: [adjectives, starWars],
    separator: " ",
    length: 2
  });

}
