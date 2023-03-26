// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import fs from "fs";
// import path from "path";
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

const fetchData = async (query, offset) => {
  const params = build({
    ...options,
    offset: String(offset),
    filters: query.filters,
  });

  const results = await fetch([baseUrl, params].join("?")).then((res) =>
    res.json()
  );

  // const dataPath = results.activeFilterOptions
  //   .map(
  //     ({ name, values }) => `${name}-${values.map(({ key }) => key).join(":")}`
  //   )
  //   .join("/");
  // const saveDir = path.join(__dirname, "../../../../", "data", dataPath);
  // const saveFile = `data-${offset}.json`;
  // const saveFilePath = path.join(saveDir, saveFile);
  // if (!fs.existsSync(saveFilePath) && results.suggests?._?.length > 0) {
  //   await fs.promises.mkdir(saveDir, {
  //     recursive: true,
  //   });
  //   await fs.promises.writeFile(
  //     path.join(saveDir, saveFile),
  //     JSON.stringify(results),
  //     "utf8"
  //   );
  // }

  return results;
};

export default async function handler(req, res) {
  const query = req.query;

  let offset = 48;
  let data = await fetchData(query, offset);

  const returnData = [...data.suggests._];
  while (data && data.totalResults && data.totalResults > offset) {
    offset = offset + 24;
    if (offset > data.totalResults) {
      offset = data.totalResults;
    }
    data = await fetchData(query, offset);
    if (data.suggests?._?.length > 0) {
      returnData.push(...data.suggests._);
    }
  }

  res.status(200).json(returnData);
}
