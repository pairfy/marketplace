import {
  uniqueNamesGenerator,
  Config,
  colors,
  animals,
} from "unique-names-generator";
import { customAlphabet } from "nanoid";


const getUsername = () => {
  const customConfig: Config = {
    dictionaries: [colors, animals],
    separator: "_",
    length: 2,
    style: "capital",
  };

  const nickname: string = uniqueNamesGenerator(customConfig);

  let nid: string = customAlphabet("0123456789", 5)();

  return nickname + nid;
};

export { getUsername };
