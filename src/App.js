import { useState } from "react";
import Loader from "./Loader";

const weatherData = [
  {
    day: "Tomorrow",
    image: "img/shower.png",
    tempmax: "16℃",
    tempmin: "11℃",
  },

  {
    day: "Sun, 7 Jun",
    image: "img/shower.png",
    tempmax: "16℃",
    tempmin: "11℃",
  },
  {
    day: "Mon, 8 Jun",
    image: "img/thunderstorm.png",
    tempmax: "16℃",
    tempmin: "11℃",
  },
  {
    day: "Tue, 9 Jun",
    image: "img/lightcloud.png",
    tempmax: "16℃",
    tempmin: "11℃",
  },
  {
    day: "Wed, 10 Jun",
    image: "img/heavyrain.png",
    tempmax: "16℃",
    tempmin: "11℃",
  },
];

//const countryList = [
// 'United State',
// 'Canada',
// 'United Kingdom',
// 'Australia',
// 'Germany',
// 'Sweden',
// ]

const KEY = "180fb0fd70d54bc4980193359230409";

export default function App() {
  const [searchPlace, setSearchPlace] = useState(false);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // console.log(query)

  function handleClickSearch() {
    setSearchPlace((searchPlace) => (searchPlace = true));
  }

  function handleCloseSearch() {
    setSearchPlace((searchPlace) => (searchPlace = false));
  }

  //console.log(query);

  // current: { temp_c, temp_f, humidity, wind_dir, pressure_mb, wind_mph,  condition: icon, text, },
  // location: { name, },
  //  forecast: { forecastday: day },

  //const  {forecastday,} = query

  //console.log(name)

  async function fetchSearch() {
    if (!search.length) {
      setQuery({});
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${KEY}&q=${search}&days=5&aqi=no&alerts=no`
      );
      const data = await res.json();
      setQuery(data);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  // const fetchSearch = async () => {

  return (
    <div className="w-full h-screen antialiased flex flex-col sm:flex-row flex-shrink-0">
      <SearchLocation
        onClickSearch={handleClickSearch}
        searchPlace={searchPlace}
        onCloseSearch={handleCloseSearch}
        setSearch={setSearch}
        search={search}
        query={query}
      >
        {!searchPlace ? (
          <SearchData onClickSearch={handleClickSearch} query={query} />
        ) : (
          <Search
            onCloseSearch={handleCloseSearch}
            setSearch={setSearch}
            search={search}
            fetchSearch={fetchSearch}
            isLoading={isLoading}
          />
        )}
      </SearchLocation>

      {/* <Loader /> */}
      <DisplayWeather>
        <DegreeButton />

        <WeatherList query={query} />

        <TodayHighlight />
        <div className="flex justify-center items-center flex-col sm:flex-row gap-[26px] slide-bottom">
          <WindSpeed query={query} />
          <Humidity query={query} />
          <AirPressure query={query} />
        </div>
      </DisplayWeather>
    </div>
  );
}

//function Loading() {
// return (
//  <div className="flex justify-center w-full items-center h-screen bg-displayweather ">
//  <h4>Loading...</h4>
// </div>
//);
//}

function SearchLocation({ children }) {
  return (
    <div className="w-full sm:w-[459px] bg-searchlocation h-[810px] sm:h-screen">
      {children}
    </div>
  );
}

function SearchData({ onClickSearch, query }) {
  const { current, location } = query;
  const { name } = location || {};
  const { condition } = current || {};
  const { temp_c } = current || {};
  const { text } = condition || {};
  const { icon } = condition || {};

  return (
    <div>
      <div className=" pt-[18px] sm:pt-[42px] pb-16 sm:pb-0 px-[11px] sm:px-[46px] flex justify-center items-center">
        <button
          onClick={onClickSearch}
          className="w-[161px] h-10 bg-searchbutton px-[18px] py-2.5 text-searchtext1 text-sm font-medium box-shadow"
        >
          Search for places
        </button>
        <button className="w-10 h-10 rounded-full bg-searchbutton ml-auto box-shadow p-2">
          <img src="img/gps-fixed.png" alt="gps-fixed" />
        </button>
      </div>

      <div className="flex justify-center items-center pt-14  sm:pt-20">
        <img
          className="block w-[138px] h-[170px]"
          src={!icon ? "img/shower.png" : icon}
          alt="shower"
        />
      </div>
      <div className="flex justify-center items-center pt-10 font-medium leading-normal">
        <h2 className="text-7xl text-searchtext1">
          {!temp_c ? "15" : temp_c}
          <span className="text-4xl text-degree">℃</span>
        </h2>
      </div>

      <p className="text-center text-degree font-semibold leading-normal text-xl pt-10">
        {!text ? "Shower" : text}
      </p>
      <CurrentDate />
      <CurrentLocation name={name} />
    </div>
  );
}

function Search({ onCloseSearch, search, setSearch, fetchSearch, isLoading }) {
  return (
    <div className="px-3 sm:px-[42px] slide-bottom h-[672px] sm:h-screen">
      <span className="flex justify-end items-end">
        <button onClick={onCloseSearch} className="pt-3">
          <img src="img/cancel.png" alt="cancel" />
        </button>
      </span>
      <div className="flex gap-3 pt-[38px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 w-full text-searchtext1 placeholder-slate-400 h-12 border border-searchtext1 bg-searchlocation focus:outline-none focus:shadow-md focus:shadow-black focus:transition-transform focus:delay-1000"
          type="text"
          placeholder="search location"
        />
        <button
          disabled={isLoading}
          onClick={fetchSearch}
          className="w-[86px] h-12 bg-searchbutton2 focus:shadow-sm focus:shadow-black focus:transition-transform focus:delay-1000 text-searchtext1 text-sm font-semibold leading-normal focus:outline-none"
        >
          {isLoading ? <Loader /> : "Search"}
        </button>
      </div>

      {/* <div className="pt-12">
        <ul className="flex flex-col gap-10 text-xs text-searchtext1 leading-normal font-medium">
           {countryList.map((item, index) => (<li key={index}> {item}
            </li>))}
        </ul>
           </div> */}
    </div>
  );
}

function CurrentLocation({ name }) {
  return (
    <div className="flex justify-center items-center gap-1 pt-3">
      <img className="w-4 h-4" src="img/location.png" alt="location" />
      <p className="text-today text-sm leading-normal font-semibold">
        {!name ? "Heileski" : name}
      </p>
    </div>
  );
}

function CurrentDate() {
  const date = new Date().toDateString();
  console.log(date);

  return (
    <div className=" flex justify-center items-center pt-10 text-today font-medium leading-normal text-sm gap-4">
      <h5>Today</h5>
      <span>.</span>
      <h5>{date}</h5>
    </div>
  );
}

function DisplayWeather({ children }) {
  return (
    <div className="w-full sm:w-[981px] sm:h-screen bg-displayweather pl-[23px] sm:pl-[154px] pb-[155px] pt-[42px] pr-[23px] sm:pr-[123px] h-[1718px]">
      {children}
    </div>
  );
}

function WindSpeed({ query }) {
  const { current } = query;
  const { wind_mph } = current || {};
  const { wind_dir } = current || {};

  return (
    <div>
      <div className="w-[218px] h-[170px] bg-searchlocation pt-[22px]">
        <p className="text-center text-searchtext1 text-xs leading-normal font-medium">
          Wind status
        </p>
        <span className="text-searchtext1 leading-normal flex justify-center items-end pt-1.5">
          <h2 className="text-5xl font-bold">{!wind_mph ? "7" : wind_mph}</h2>
          <h4 className="text-2xl font-medium">mph</h4>
        </span>
        <div className="flex justify-center items-center gap-1.5 pt-7 ">
          <div className="w-6 h-6 rounded-full bg-searchbutton flex justify-center items-center">
            <img className="w-4 h-4 block " src="img/cursor.png" alt="cursor" />
          </div>
          <p className="font-medium text-sm leading-normal text-searchtext1">
            {!wind_dir ? "WSW" : wind_dir}
          </p>
        </div>
      </div>
    </div>
  );
}

function Humidity({ query }) {
  const { current } = query;

  const { humidity } = current || {};
  const { location } = query;

  const { tz_id } = location || {};

  return (
    <div>
      <div className="w-[218px] h-[170px] bg-searchlocation pt-[22px]">
        <p className="text-center text-searchtext1 text-xs leading-normal font-medium">
          Humidity
        </p>
        <span className="text-searchtext1 leading-normal flex justify-center items-end pt-[11px]">
          <h2 className="text-5xl font-bold">{!humidity ? "84" : humidity}</h2>
          <h4 className="text-2xl font-medium">%</h4>
        </span>
        <p className="text-center text-searchtext1 text-sm leading-normal font-medium pt-7">
          {!tz_id ? "Europe/Berlin" : tz_id}
        </p>
      </div>
    </div>
  );
}

function AirPressure({ query }) {
  const { current } = query;
  const { location } = query;
  const { pressure_mb } = current || {};
  const { lat } = location || {};
  const { lon } = location || {};

  return (
    <div>
      <div className="w-[218px] h-[170px] bg-searchlocation pt-[22px]">
        <p className="text-center text-searchtext1 text-xs leading-normal font-medium">
          Air Pressure
        </p>
        <span className="text-searchtext1 leading-normal flex justify-center items-end gap-1 pt-[11px]">
          <h2 className="text-5xl font-bold">
            {!pressure_mb ? "998" : pressure_mb}
          </h2>
          <h4 className="text-2xl font-medium">mb</h4>
        </span>
        <div className="flex justify-center items-center pt-7 text-searchtext1 text-sm leading-normal gap-6 text-center">
          <span className="flex gap-2">
            <h5>LAT-</h5>
            <h5>{!lat ? "50.10" : lat}</h5>
          </span>
          <span className="flex gap-2 ">
            <h5>LON-</h5>
            <h5>{!lon ? "13.4" : lon}</h5>
          </span>
        </div>
      </div>
    </div>
  );
}

function WeatherList({ query }) {
  const date = new Date();
  new Intl.DateTimeFormat("ar-EG").format(date);
  console.log();

  function formatDay(dateStr) {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
    }).format(new Date(dateStr));
  }

  const { forecast } = query;

  const { forecastday } = forecast || {};

  return (
    <ul className="flex justify-center items-center flex-wrap sm:flex-nowrap gap-[26px] pt-[52px] sm:pt-6 ">
      {/* weatherData.map((weather) => (
        <WeatherCard
          key={weather.day}
          day={weather.day}
          shower={weather.image}
          tempmin={weather.tempmin}
          tempmax={weather.tempmax}
        />
      )) */}
      {forecastday?.map((item, index) => (
        <WeatherCard
          key={index}
          day={item}
          shower={item.day.condition.icon}
          formatDay={formatDay}
          tempmin={item.day.mintemp_c}
          tempmax={item.day.maxtemp_c}
          isToday={index === 0}
        />
      ))}
    </ul>
  );
}

function WeatherCard({ day, shower, tempmax, tempmin, isToday, formatDay }) {
  return (
    <li className="slide-bottom flex flex-col justify-center items-center w-[120px] h-[177px] bg-searchlocation py-[18px] px-6 overflow-hidden">
      <p className="text-center text-searchtext1 text-[11px] leading-normal font-medium">
        {isToday ? "Tomorrow" : formatDay(day.date)}
      </p>
      <img
        className="pt-2.5"
        src={!shower ? "img/shower.png" : shower}
        alt="shower"
      />
      <span className="flex gap-3.5 justify-center items-center text-sm leading-normal font-medium pt-[31px]">
        <h5 className="text-searchtext1">
          <span>{!tempmax ? "16" : tempmax}</span>℃
        </h5>
        <h5 className="text-degree">
          <span>{!tempmin ? "11" : tempmin}</span>℃
        </h5>
      </span>
    </li>
  );
}

function DegreeButton() {
  //const [toggleDegree, setToggleButton] = useState(false)

  function handleFahrenheit() {
    //setToggleButton(toggleDegree => toggleDegree = true)
  }
  return (
    <div className="hidden sm:flex justify-end items-end gap-3">
      <button className="w-10 h-10 rounded-full bg-searchtext1 box-shadow p-2">
        <span className="text-textweather">℃</span>
      </button>
      <button
        onClick={handleFahrenheit}
        className="w-10 h-10 rounded-full bg-searchbutton box-shadow p-2"
      >
        <span className="text-searchtext1">℉</span>
      </button>
    </div>
  );
}

function TodayHighlight() {
  return (
    <p className="text-searchtext1 text-lg font-bold leading-normal pt-[52px] sm:pt-7 pb-8 sm:pb-16">
      Today's Highlights
    </p>
  );
}
