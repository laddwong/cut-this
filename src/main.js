import {
	createSSRApp
} from "vue";
import { log } from './utils/log'
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	app.config.globalProperties.$log = log
	return {
		app,
	};
}
