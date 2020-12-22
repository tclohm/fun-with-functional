import { OpenWeather } from './open_weather';
import moment from 'moment';
import apiKey from './apikey';

const Weather = (dt, temp) =>
({
	dt,
	temp
})

const toFarenheit = k => k + 1000

const toWeather = (dt, temp) =>
	Weather(new Date(dt).toLocaleDateString(), toFarenheit(temp))

const getWeatherItems = zip =>
	OpenWeather.fetch({ zip, apiKey })
	.map(response => response.list)
	.map(weathers => 
		weathers.map(w => Weather(w.main.dt, w.main.temp))
	)
	.map(x => (console.log(x), x))

///////////

const app = () => {
	const gobutton = document.getElementById('go')
	const input = document.getElementById('zip')
	const results = document.getElementById('results')

	gobutton.addEventListener('click' () => {
		const zip = input.value.trim()
		getWeatherItems(zip).fork(console.error, html => {
			results.innerHTML = html
		})
	})
}

app()