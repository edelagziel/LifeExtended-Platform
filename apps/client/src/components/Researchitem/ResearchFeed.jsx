import React, { useMemo } from "react";
import "./researchFeed.css";
import { useFetch } from "../../customHooks/useFetch";
import ResearchItem from "./ResearchItem";

function ResearchFeed() {
  const cleanText = (text) => {
    if (!text) return "";
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.textContent || "";
  };

  const bannedKeywords = [
    "rat","rats","mouse","mice","murine","drosophila","fly","flies",
    "worm","c. elegans","nematode","plant","seed","crop","wheat",
    "rice","cow","bovine","cattle","sheep","pig","porcine",
    "skin","cosmetic","dermatology","retraction","erratum","correction"
  ];

  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 3;

  const baseQuery =
    `(longevity OR "healthy aging" OR healthspan OR "cellular senescence" OR mitochondria OR "metabolic health" OR sirtuins OR rapamycin OR microbiome)
     AND (human OR clinical OR therapy OR medicine)`;

  const excludeQuery =
    `NOT (mouse OR mice OR rat OR drosophila OR worm OR elegans OR plant OR crop OR agriculture OR bovine OR veterinary OR seed OR wheat OR rice OR retraction OR erratum OR correction)`;

  const finalQuery = `${baseQuery} ${excludeQuery} AND PUB_YEAR:[${fromYear} TO ${currentYear}]`;

  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(
    finalQuery
  )}&resultType=core&format=json&pageSize=50`;

  const { data: rawData, loading, error, refetch } = useFetch(url);

  const filteredData = useMemo(() => {
    if (!rawData?.resultList?.result) return [];

    return rawData.resultList.result
      .filter((p) => {
        const title = cleanText(p.title || "").toLowerCase();
        const abstract = cleanText(p.abstractText || "").toLowerCase();

        if (!abstract || abstract === "abstract not available.") return false;

        return !bannedKeywords.some((keyword) =>
          new RegExp(`\\b${keyword}\\b`, "i").test(title + abstract)
        );
      })
      .slice(0, 10);
  }, [rawData]);

  return (
    <div className="research-wrapper">
      {loading && <h2>Loading…</h2>}

      {!loading && error && (
        <div>
          <h2>Error</h2>
          <button onClick={refetch}>נסה שוב</button>
        </div>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <>
          <div className="research-actions">
            <button onClick={refetch}>Refetch</button>
          </div>

          <div className="research-feed">
            {filteredData.map((item, index) => (
              <ResearchItem key={index} data={item} />
            ))}
          </div>
        </>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <h2>לא נמצאו מאמרים רלוונטיים</h2>
      )}
    </div>
  );
}

export default ResearchFeed;
