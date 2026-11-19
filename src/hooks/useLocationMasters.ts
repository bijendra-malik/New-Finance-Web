import { useEffect, useState } from "react";
import { fetchContinents, fetchCountriesByContinent } from "../api/masters";
import type { Continent, Country } from "../api/masters";

export const useLocationMasters = (continent: string) => {
  const [continents, setContinents] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countriesFor, setCountriesFor] = useState<{ continent: string; list: Country[] }>({
    continent: "",
    list: [],
  });

  useEffect(() => {
    let cancelled = false;
    fetchContinents()
      .then((list) => {
        if (!cancelled) setContinents(list);
      })
      .catch(() => {
        if (!cancelled) setContinents([]);
      })
      .finally(() => {
        if (!cancelled) setContinentsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!continent) return;
    const picked = continents.find((item) => item.name === continent);
    if (!picked) return;
    let cancelled = false;
    fetchCountriesByContinent(picked._id)
      .then((list) => {
        if (!cancelled) setCountriesFor({ continent, list });
      })
      .catch(() => {
        if (!cancelled) setCountriesFor({ continent, list: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [continents, continent]);

  return {
    continents,
    countries: countriesFor.continent === continent ? countriesFor.list : [],
    continentsLoading,
    countriesLoading: continent !== "" && countriesFor.continent !== continent,
  };
};
