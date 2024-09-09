import React, { useEffect, useState } from "react";
import "./Main.css";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Stack } from "@mui/material";
import Cont from "./cont";
import Fajr from "../assets/sunrise.png";
import Dhuhr from "../assets/islamic.png";
import Asr from "../assets/asr.png";
import Maghrib from "../assets/sunset.png";
import Isha from "../assets/isha.png";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";

moment.locale("ar-dz");

export default function Main() {
  const [Today, setToday] = useState("");
  const [timer, setTimer] = useState("");
  const [nextprayerIndex, setNextprayerIndex] = useState(0);
  const [remainingTimer, setRemainingTimer] = useState("")

  const cities = [
    { displayName: "المدينة المنورة", apiName: "Madina" },
    { displayName: "مكة المكرمة", apiName: "Makkah" },
  ];

  const prayers = [
    {key: "Fajr", displayName: "الفجر"},
    {key: "Dhuhr", displayName: "الظهر"},
    {key: "Asr", displayName: "العصر"},
    {key: "Maghrib", displayName: "المغرب"},
    {key: "Isha", displayName: "العشاء"},
  ]

  const getTimings = async () => {
    const res = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${city.apiName}&country=SA&method=2`
    );
    setTimes(res.data.data.timings);
  };

  const [city, setCity] = React.useState({
    displayName: "المدينة المنورة",
    apiName: "Madina",
  });
  const [times, setTimes] = React.useState({
    Fajr: "04:44",
    Dhuhr: "12:21",
    Asr: "03:49",
    Maghrib: "06:38",
    Isha: "08:08",
  });

  useEffect(() => {
    getTimings();
  }, [city]);

  useEffect(() => {
    const day = moment();
    setToday(day.format("MMM Do | h:mm"));

    let interval = setInterval(() => {
      contDownTimer();
    }, 1000);

    const t = moment();
    setTimer(t.format("LTS"));

    return () => clearInterval(interval);
  }, []);

  const contDownTimer = () => {
    const now = moment();

    let nextPrayer = 0;

    if (
      now.isAfter(moment(times["Fajr"], "h:mm")) &&
      now.isBefore(moment(times["Dhuhr"], "h:mm"))
    ) {
      nextPrayer = 1;
    }else if(
      now.isAfter(moment(times["Dhuhr"], "h:mm")) &&
      now.isBefore(moment(times["Asr"], "h:mm"))
    ) {
      nextPrayer = 2;
    }else if(
      now.isAfter(moment(times["Asr"], "h:mm")) &&
      now.isBefore(moment(times["Maghrib"], "h:mm"))
    ) {
      nextPrayer = 3;
    }else if(
      now.isAfter(moment(times["Maghrib"], "h:mm")) &&
      now.isBefore(moment(times["Isha"], "h:mm"))
    ) {
      nextPrayer = 4;
    }else{
      nextPrayer = 0;
    }
    setNextprayerIndex(nextPrayer);

    const nextPrayerObject = prayers[nextPrayer];
    const nextPrayerTime = times[nextPrayerObject.key];
    const remainingPrayerTime = moment(nextPrayerTime, "hh:mm")
    
    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(now);


    if(remainingTime < 0){
      const midnight = moment("23:59:59", "hh:mm:ss").diff(now);
      const FajrTomMidnight = remainingPrayerTime.diff(moment("00:00:00", "hh:mm:ss"))
      const totalDiff = midnight + FajrTomMidnight;

      remainingTime = totalDiff;
      
    } 
       const durationTime = moment.duration(remainingTime);

       setRemainingTimer(
        `${durationTime.seconds()} : ${durationTime.minutes()} : ${durationTime.hours()}` 
       );

  };

  const handleChange = (e) => {
    const selectedCity = cities.find((city) => city.apiName === e.target.value);
    setCity(selectedCity);
  };
  return (
    <>
      <Grid container>
        <Grid>
          <div>
            <h2 className="cityName">{city.displayName}</h2>
            <h2 className="date">{Today}</h2>
          </div>
        </Grid>
        <Grid>
          <div>
            <h2 className="cityName">الوقت المتبقي لصلاة {prayers[nextprayerIndex].displayName}</h2>
            <h2 className="date">{remainingTimer}</h2>
          </div>
        </Grid>
      </Grid>
      <Divider
        style={{ borderColor: "white", marginTop: "30px" }}
        variant="middle"
      />
      <Stack>
        <Cont name={"الفجر"} img={Fajr} time={times.Fajr} />
        <Cont name={"الظهر"} img={Dhuhr} time={times.Dhuhr} />
        <Cont name={"العصر"} img={Asr} time={times.Asr} />
        <Cont name={"المغرب"} img={Maghrib} time={times.Maghrib} />
        <Cont name={"العشاء"} img={Isha} time={times.Isha} />
      </Stack>

      <Stack direction={"row"} justifyContent={"center"} marginTop={"20px"}>
        <FormControl style={{ width: "50%", color: "white" }}>
          <InputLabel style={{ color: "white", direction: "rtl" }}>
            المدينة
          </InputLabel>
          <Select
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "& .MuiSelect-icon": {
                color: "white", // Change arrow color to white
              },
            }}
            style={{ color: "white" }}
            label="city"
            onChange={handleChange}
          >
            {cities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
