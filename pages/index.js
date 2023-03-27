import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { build } from "search-params";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { sortBy } from "lodash";

const inter = Inter({ subsets: ["latin"] });

const maleEngland = [
  { key: "fid#4", name: "gender", values: [{ name: "Male", key: "Male" }] },
  { key: "fid#12", name: "age", values: [{ name: "Any Age", key: "Any Age" }] },
  {
    key: "fid#16",
    name: "country",
    values: [{ name: "England", key: "England" }],
  },
];

const types = ["Individual", "Pairs", "Team"];

const fetcher = (offset, opts) => {
  const params = build({ offset, filters: JSON.stringify(opts) });
  return fetch(["/api/search", params].join("?")).then((r) => r.json());
};

const getPoint = (key, result, format = true) => {
  const point =
    result.dataPoints.find((point) => point.key === key)?.value ?? "";

  if (key === "Date" && point && format) {
    return new Date(point * 1000).toDateString();
  }
  return point;
};

const columns = [
  "Golf Club",
  "Type",
  "County",
  "Format",
  "Entry Fee",
  "Date",
  "Day",
  "Holes",
];

export default function Home() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentType, setCurrentType] = useState("Pairs");
  const hasResults = !isLoading && results && results.length > 0;

  const [sortedResults, setSortedResults] = useState([]);
  const [sort, setSort] = useState("Date:");
  useEffect(() => {
    const sorted = sortBy(results, (result) => getPoint(sort, result, false));
    setSortedResults(sorted);
  }, [results, sort]);

  useEffect(() => {
    setIsLoading(true);

    const getResults = async () => {
      const fetchOptions = [
        {
          key: "fid#5",
          name: "type",
          values: [{ name: currentType, key: currentType }],
        },
        ...maleEngland,
      ];

      let offset = 48;
      let data = await fetcher(offset, fetchOptions);

      const returnData = [...data.results];
      while (data && data.totalResults && data.totalResults > offset) {
        offset = offset + 24;
        if (offset > data.totalResults) {
          offset = data.totalResults;
        }
        data = await fetcher(offset, fetchOptions);
        if (data.results.length > 0) {
          returnData.push(...data.results);
        }
      }

      return returnData;
    };

    getResults().then((results) => {
      setResults(results);
      setIsLoading(false);
    });
  }, [currentType]);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classNames(styles.main, inter.className)}>
        <nav>
          {types.map((type) => (
            <button
              className={classNames({ active: type === currentType })}
              key={type}
              onClick={() => setCurrentType(type)}
            >
              {type}
            </button>
          ))}
        </nav>
        <h1>Results: {sortedResults.length}</h1>
        {isLoading && "Loading..."}
        {hasResults && (
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    className={classNames({ active: sort === col })}
                    key={col}
                    onClick={() => setSort(col)}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((result, resultIndex) => (
                <tr key={result.name + result.content + resultIndex}>
                  {columns.map((col) => (
                    <td key={col}>{getPoint(col, result)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}
