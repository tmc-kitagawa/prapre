import axios from "axios";
import { useEffect, useState } from "react";
import { History } from "../global";

export const AllResults = () => {
  const [allResults, setAllResults] = useState<History[]>();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get("/api/presentations");
      setAllResults(data);
    })();
  }, []);

  return (
    <>
      <h1>all results</h1>
      <ul>
        {allResults &&
          allResults.map((result, i) => (
            <li key={i}>
              {result.title} {JSON.stringify(new Date(result.startTime))}
            </li>
          ))}
      </ul>
    </>
  );
};
