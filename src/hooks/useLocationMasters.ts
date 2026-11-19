import { useEffect, useState } from "react";
import { fetchContinents, fetchCountriesByContinent } from "../api/masters";
import type { Continent, Country } from "../api/masters";

export const useLocationMasters = (continent: string) => {
  const [continents, setContinents] = useState<Continent[]>([]);
  const [continentsLoading, setContinentsLoading] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

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
    if (!continent) {
      setCountries([]);
      setCountriesLoading(false);
      return;
    }
    const picked = continents.find((item) => item.name === continent);
    if (!picked) return;
    let cancelled = false;
    setCountries([]);
    setCountriesLoading(true);
    fetchCountriesByContinent(picked._id)
      .then((list) => {
        if (!cancelled) setCountries(list);
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      })
      .finally(() => {
        if (!cancelled) setCountriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [continents, continent]);

  return { continents, countries, continentsLoading, countriesLoading };
};
