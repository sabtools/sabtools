"use client";
import { useState, useMemo } from "react";

interface ZoneInfo { zone: string; states: string[]; }

const POSTAL_ZONES: Record<string, ZoneInfo> = {
  "1": { zone: "Delhi, Haryana, Punjab, Himachal Pradesh, J&K, Ladakh, Chandigarh", states: ["Delhi", "Haryana", "Punjab", "Himachal Pradesh", "Jammu & Kashmir", "Ladakh", "Chandigarh"] },
  "2": { zone: "Uttar Pradesh, Uttarakhand", states: ["Uttar Pradesh", "Uttarakhand"] },
  "3": { zone: "Rajasthan, Gujarat, Daman & Diu, Dadra & Nagar Haveli", states: ["Rajasthan", "Gujarat", "Daman & Diu", "Dadra & Nagar Haveli"] },
  "4": { zone: "Maharashtra, Goa, Madhya Pradesh, Chhattisgarh", states: ["Maharashtra", "Goa", "Madhya Pradesh", "Chhattisgarh"] },
  "5": { zone: "Andhra Pradesh, Telangana, Karnataka", states: ["Andhra Pradesh", "Telangana", "Karnataka"] },
  "6": { zone: "Tamil Nadu, Kerala, Puducherry, Lakshadweep", states: ["Tamil Nadu", "Kerala", "Puducherry", "Lakshadweep"] },
  "7": { zone: "West Bengal, Odisha, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, Meghalaya, Andaman & Nicobar, Assam, Sikkim", states: ["West Bengal", "Odisha", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Meghalaya", "Andaman & Nicobar", "Assam", "Sikkim"] },
  "8": { zone: "Bihar, Jharkhand", states: ["Bihar", "Jharkhand"] },
  "9": { zone: "Army Post Office (APO), Field Post Office (FPO)", states: ["Army Post Office", "Field Post Office"] },
};

const SUB_ZONES: Record<string, string> = {
  "11": "Delhi", "12": "Haryana", "13": "Punjab", "14": "Himachal Pradesh", "15": "J&K", "16": "Punjab (Jalandhar)", "17": "Himachal Pradesh (Shimla)", "18": "J&K (Srinagar)", "19": "Ladakh/J&K",
  "20": "UP (Agra)", "21": "UP (Lucknow)", "22": "UP (Lucknow)", "23": "UP (Kanpur)", "24": "UP (Lucknow Division)", "25": "UP (Bareilly)", "26": "Uttarakhand (Dehradun)", "27": "UP (Allahabad)", "28": "UP (Varanasi)",
  "30": "Rajasthan (Jaipur)", "31": "Rajasthan", "32": "Rajasthan (Jodhpur)", "33": "Rajasthan", "34": "Rajasthan (Bikaner)", "36": "Gujarat (Ahmedabad)", "37": "Gujarat", "38": "Gujarat (Vadodara)", "39": "Gujarat (Surat)",
  "40": "Maharashtra (Mumbai)", "41": "Maharashtra (Pune)", "42": "Maharashtra (Nashik)", "43": "Maharashtra (Aurangabad)", "44": "Maharashtra (Nagpur)", "45": "Madhya Pradesh (Bhopal)", "46": "MP", "47": "MP (Jabalpur)", "48": "MP (Indore)", "49": "Chhattisgarh",
  "50": "Telangana (Hyderabad)", "51": "Telangana/AP", "52": "AP (Vijayawada)", "53": "AP (Visakhapatnam)", "56": "Karnataka (Bangalore)", "57": "Karnataka", "58": "Karnataka (Hubli)", "59": "Karnataka (Belgaum)",
  "60": "Tamil Nadu (Chennai)", "61": "Tamil Nadu", "62": "Tamil Nadu (Madurai)", "63": "Tamil Nadu (Coimbatore)", "64": "Tamil Nadu (Salem)", "67": "Kerala (Kochi)", "68": "Kerala (Thiruvananthapuram)", "69": "Kerala (Kozhikode)",
  "70": "West Bengal (Kolkata)", "71": "West Bengal", "72": "West Bengal", "73": "West Bengal (Jalpaiguri)", "74": "West Bengal/Assam", "75": "Odisha (Bhubaneswar)", "76": "Odisha", "77": "NE (Guwahati)", "78": "Assam", "79": "NE States",
  "80": "Bihar (Patna)", "81": "Bihar", "82": "Bihar (Bhagalpur)", "83": "Jharkhand (Ranchi)", "84": "Bihar (Darbhanga)", "85": "Jharkhand",
};

const STATE_PIN_RANGES: { state: string; range: string }[] = [
  { state: "Delhi", range: "110001 - 110097" },
  { state: "Haryana", range: "121001 - 136156" },
  { state: "Punjab", range: "140001 - 160104" },
  { state: "Himachal Pradesh", range: "171001 - 177601" },
  { state: "Uttar Pradesh", range: "200001 - 285223" },
  { state: "Uttarakhand", range: "246001 - 263680" },
  { state: "Rajasthan", range: "301001 - 345034" },
  { state: "Gujarat", range: "360001 - 396590" },
  { state: "Maharashtra", range: "400001 - 445402" },
  { state: "Madhya Pradesh", range: "450001 - 488448" },
  { state: "Chhattisgarh", range: "490001 - 497778" },
  { state: "Telangana", range: "500001 - 509412" },
  { state: "Andhra Pradesh", range: "515001 - 535594" },
  { state: "Karnataka", range: "560001 - 591346" },
  { state: "Tamil Nadu", range: "600001 - 643253" },
  { state: "Kerala", range: "670001 - 695615" },
  { state: "West Bengal", range: "700001 - 743711" },
  { state: "Odisha", range: "751001 - 770076" },
  { state: "Assam", range: "781001 - 788931" },
  { state: "Bihar", range: "800001 - 855117" },
  { state: "Jharkhand", range: "825001 - 835325" },
  { state: "Goa", range: "403001 - 403806" },
];

export default function IndianPinCodeDirectory() {
  const [pinCode, setPinCode] = useState("");
  const [searchState, setSearchState] = useState("");

  const clean = pinCode.replace(/\D/g, "");

  const pinInfo = useMemo(() => {
    if (clean.length !== 6) return null;
    const first = clean[0];
    const firstTwo = clean.slice(0, 2);
    const zone = POSTAL_ZONES[first];
    const subZone = SUB_ZONES[firstTwo];
    return { zone: first, zoneInfo: zone, subZone: subZone || "Unknown sub-zone", firstTwo };
  }, [clean]);

  const filteredStates = useMemo(() => {
    if (!searchState) return STATE_PIN_RANGES;
    return STATE_PIN_RANGES.filter((s) => s.state.toLowerCase().includes(searchState.toLowerCase()));
  }, [searchState]);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">Enter 6-Digit PIN Code</label>
        <input className="calc-input" type="text" maxLength={6} placeholder="e.g. 110001" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
      </div>

      {pinInfo && (
        <div className="result-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500">Postal Zone</div>
              <div className="text-2xl font-extrabold text-indigo-600">{pinInfo.zone}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500">Sub-zone Code</div>
              <div className="text-2xl font-extrabold text-purple-600">{pinInfo.firstTwo}</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-xs text-gray-500">Region</div>
              <div className="text-sm font-bold text-gray-800">{pinInfo.subZone}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Zone {pinInfo.zone} covers:</span> {pinInfo.zoneInfo?.zone}
          </div>
        </div>
      )}

      {/* Postal Zones Reference */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">All 9 Postal Zones</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 text-gray-600">Zone</th>
                <th className="text-left p-2 text-gray-600">Region / States</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(POSTAL_ZONES).map(([zone, info]) => (
                <tr key={zone} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 font-bold text-indigo-600">{zone}</td>
                  <td className="p-2 text-gray-700 text-xs">{info.zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search by State */}
      <div className="result-card">
        <div className="text-sm font-semibold text-gray-700 mb-3">Search PIN Code Range by State</div>
        <input className="calc-input mb-3" placeholder="Type state name..." value={searchState} onChange={(e) => setSearchState(e.target.value)} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-2 text-gray-600">State</th>
                <th className="text-left p-2 text-gray-600">PIN Code Range</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((s, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-2 font-medium text-gray-800">{s.state}</td>
                  <td className="p-2 font-mono text-indigo-600">{s.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center">
        For full details, visit <span className="text-indigo-500">indiapost.gov.in</span>
      </div>
    </div>
  );
}
