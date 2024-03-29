<template>
  <h2>Next Hours</h2>
  <div class="hour-container">
    <div
      v-for="hourlyForecast in hourlyForecasts"
      :key="hourlyForecast.dt"
      class="hour-div">
      <span class="temp"> {{ roundTemp(hourlyForecast.main.temp) }}°C </span>
      <span class="precipitation">
        {{ (hourlyForecast.pop * 100).toFixed(0) }}%
      </span>
      <img
        class="weather-icon"
        :src="constructWeatherUrl(hourlyForecast.weather[0].icon)" />
      <span class="time">
        {{
          new Date(hourlyForecast.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
      </span>
    </div>
  </div>

  <h2>Next 5 Days</h2>
  <div class="fiveday-container">
    <div v-for="dailyForecast in dailyForecasts" :key="dailyForecast.date">
      <span>
        <img
          class="weather-icon"
          :src="constructWeatherUrl(dailyForecast.icon)" />
      </span>
      <span class="description">
        <span class="date">
          {{ dailyForecast.date }}
        </span>
        <span class="short-desc">
          {{ dailyForecast.description }}
        </span>
      </span>
      <span class="temp"
        >{{ dailyForecast.tempMin }}°C {{ dailyForecast.tempMax }}°C</span
      >
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  city: {
    type: String,
  },
});

const hourlyForecasts = ref([]);
const dailyForecasts = ref([]);

onMounted(async () => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=` +
      props.city +
      `&appid=482944e26d320a80bd5e4f23b3de7d1f&units=metric`
  );
  const data = await response.json();
  if (response.ok) {
    hourlyForecasts.value = filterHourlyForecasts(data.list);
    dailyForecasts.value = groupDailyForecasts(data.list);
  } else {
    throw new Error(data.message);
  }
});

const filterHourlyForecasts = (list) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const nextHourTimestamp = currentTimestamp + 3600;
  return list.filter(
    (item) =>
      item.dt >= currentTimestamp && item.dt < nextHourTimestamp + 24 * 3600
  );
};
const groupDailyForecasts = (list) => {
  const groupedForecasts = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    const dateKey = date.split("/").reverse().join("-");

    const adate = new Date(item.dt * 1000);
    const dayOfWeek = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(adate);
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      adate
    );
    const dayOfMonth = adate.getDate();
    const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}`;

    if (!groupedForecasts[dateKey]) {
      groupedForecasts[dateKey] = {
        date: formattedDate,
        weather: item.weather[0].main,
        temp: roundTemp(item.main.temp),
        tempMin: roundTemp(item.main.temp_min),
        tempMax: roundTemp(item.main.temp_max),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      };
    } else {
      if (item.main.temp_min < groupedForecasts[dateKey].tempMax) {
        groupedForecasts[dateKey].tempMin = roundTemp(item.main.temp_min);
      }
      if (item.main.temp_max > groupedForecasts[dateKey].tempMax) {
        groupedForecasts[dateKey].tempMax = roundTemp(item.main.temp_max);
      }
    }
  });
  return Object.values(groupedForecasts);
};

const constructWeatherUrl = (icon) => {
  return "https://openweathermap.org/img/wn/" + icon + "@2x.png";
};

const roundTemp = (temp) => {
  return Math.round(temp);
};
</script>

<style scoped lang="scss">
.weather-icon {
  width: 65px;
  height: 65px;
}
.hour-container {
  display: flex;
  justify-content: space-between;
  .hour-div {
    display: flex;
    flex-direction: column;
    padding-right: 11px;
    padding-left: 12px;
    border-right: 1px solid lightgray;
    align-items: center;
    .temp {
      font-weight: bold;
      padding-bottom: 10px;
    }
    .precipitation {
      color: deepskyblue;
    }
    .time {
      color: grey;
    }
  }
}

.fiveday-container {
  display: flex;
  flex-direction: column;

  div {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid lightgray;
  }

  .description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .date {
      font-weight: bold;
    }
    .short-desc {
      color: grey;
    }
  }
  .temp {
    font-weight: bold;
  }
}
</style>
