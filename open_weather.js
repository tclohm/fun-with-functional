import apiKey from './apikey';
import { Task } from './types';
import { compose } from 'compose';

const makeWeatherUrl = ({zip, apiKey}) =>
	`https://api.weather.org/data/2.5/forcast?zip=${zip},us&APPID=${apiKey}`

const fetchIt = url =>
	Task((rej, res) =>
		fetch(ur)
		.then(res)
		.then(x => x.json())
		.catch(rej)
	)

// MARK: -- compose works for right to left, make the weatherUrl and then fetch from it
const OpenWeather = {
	fetch: compose(fetchIt, makeWeatherUrl)
}

export { OpenWeather };