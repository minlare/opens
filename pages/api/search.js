// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { build } from "search-params";

// function paramsToObject(entries) {
//   const result = {};
//   for (const [key, value] of entries) {
//     // each 'entry' is a [key, value] tupple
//     result[key] = value;
//   }
//   return result;
// }

const baseUrl = "https://global.sitesearch360.com/sites";
// const url = new URL(
//   "https://global.sitesearch360.com/sites?site=www.golfempire.co.uk&timeToAction=1679812127715&includeContent=true&limit=24&sort=Date&groupResults=false&highlightQueryTerms=true&filters=%5B%7B%22key%22%3A%22fid%235%22%2C%22name%22%3A%22type%22%2C%22values%22%3A%5B%7B%22name%22%3A%22Pairs%22%2C%22key%22%3A%22Pairs%22%7D%5D%7D%2C%7B%22key%22%3A%22fid%234%22%2C%22name%22%3A%22gender%22%2C%22values%22%3A%5B%7B%22name%22%3A%22Male%22%2C%22key%22%3A%22Male%22%7D%5D%7D%2C%7B%22key%22%3A%22fid%236%22%2C%22name%22%3A%22format%22%2C%22values%22%3A%5B%7B%22name%22%3A%224BBB%22%2C%22key%22%3A%224BBB%22%7D%2C%7B%22name%22%3A%22Combined%20Pairs%22%2C%22key%22%3A%22Combined%20Pairs%22%7D%2C%7B%22name%22%3A%22Foursomes%22%2C%22key%22%3A%22Foursomes%22%7D%2C%7B%22name%22%3A%22Greensomes%22%2C%22key%22%3A%22Greensomes%22%7D%2C%7B%22name%22%3A%222-Ball%20Texas%20Scramble%22%2C%22key%22%3A%222-Ball%20Texas%20Scramble%22%7D%2C%7B%22name%22%3A%22Other%22%2C%22key%22%3A%22Other%22%7D%5D%7D%2C%7B%22key%22%3A%22fid%2312%22%2C%22name%22%3A%22age%22%2C%22values%22%3A%5B%7B%22name%22%3A%22Any%20Age%22%2C%22key%22%3A%22Any%20Age%22%7D%5D%7D%2C%7B%22key%22%3A%22fid%2316%22%2C%22name%22%3A%22country%22%2C%22values%22%3A%5B%7B%22name%22%3A%22England%22%2C%22key%22%3A%22England%22%7D%5D%7D%5D&log=false&filterOptions=true&offset=48&query=*&plain=false&nameParsing=true&kvtable=false&complexFilterFormat=true"
// );
// const apiParams = paramsToObject(url.searchParams.entries());

const options = {
  site: "www.golfempire.co.uk",
  timeToAction: "1679812127715",
  includeContent: "true",
  limit: "24",
  sort: "Date",
  groupResults: "false",
  highlightQueryTerms: "true",
  log: "false",
  filterOptions: "true",
  offset: "48",
  query: "*",
  plain: "false",
  nameParsing: "true",
  kvtable: "false",
  complexFilterFormat: "true",
};

const fetchData = async (query) => {
  const params = build({
    ...options,
    offset: query.offset,
    filters: query.filters,
  });

  const fetchUrl = [baseUrl, params].join("?");
  const results = await fetch(fetchUrl).then((res) => res.json());

  // if (process.env.NODE_ENV === "development") {
  //   const fs = require("fs");
  //   const path = require("path");

  //   const dataPath = results.activeFilterOptions
  //     .map(
  //       ({ name, values }) =>
  //         `${name}-${values.map(({ key }) => key).join(":")}`
  //     )
  //     .join("/");
  //   const saveDir = path.join(__dirname, "../../../../", "data", dataPath);
  //   const saveFile = `data-${offset}.json`;
  //   const saveFilePath = path.join(saveDir, saveFile);
  //   if (!fs.existsSync(saveFilePath) && results.suggests?._?.length > 0) {
  //     await fs.promises.mkdir(saveDir, {
  //       recursive: true,
  //     });
  //     await fs.promises.writeFile(
  //       path.join(saveDir, saveFile),
  //       JSON.stringify(results),
  //       "utf8"
  //     );
  //   }
  // }

  return results;
};

export default async function handler(req, res) {
  try {
    const query = req.query;
    const data = await fetchData(query);

    res.status(200).json({
      results: data?.suggests?._ ?? [],
      totalResults: data.totalResults,
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
}
