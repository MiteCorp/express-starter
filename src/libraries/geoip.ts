import axios from "axios";
import fs from "fs";

export interface IGeoIP {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
}

const geoIP = async (ip: string): Promise<IGeoIP> => {
  try {
    const { data } = await axios.get(
      `http://ip-api.com/json/${ip}?fields=49663&lang=en`,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Laravel-GeoIP",
        },
      }
    );

    return data;
  } catch (error) {
    fs.appendFileSync("logs/geoip.log", `Error: ${error}\n`);
    return {
      country: "Unknown",
      countryCode: "Unknown",
      region: "Unknown",
      regionName: "Unknown",
      city: "Unknown",
      zip: "Unknown",
      lat: 0,
      lon: 0,
      timezone: "Unknown",
    };
  }
};

export default geoIP;
