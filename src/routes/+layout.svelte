<script lang="ts">
	//import '../app.postcss';
	import "../app.css";
	import Header from "$lib/header/Header.svelte";
	import Footer from "$lib/header/Footer.svelte";
	import { isLegal, loginStacksFromHeader } from "$lib/stacks_connect";
	import { CONFIG, setConfigByUrl } from '$lib/config';
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '../stores/stores'
	import { COMMS_ERROR, tsToTime } from '$lib/utils.js'

	const unsubscribe1 = sessionStore.subscribe(() => {});
	onDestroy(async () => {
		unsubscribe1()
	})

	let componentKey = 0;
	let componentKey1 = 0;
	if (!$page.url.searchParams.has('chain')) $page.url.searchParams.set('chain', 'mainnet')
	setConfigByUrl();
	if (!isLegal(location.href)) {
		goto('/' + '?chain=mainnet')
	}
	beforeNavigate((nav) => {
		if (!isLegal(nav.to?.route.id || '')) {
			nav.cancel();
			login()
			return;
		}
		if (!nav.to?.url.searchParams?.has('chain') && $page.url.hostname === 'localhost') {
			nav.to?.url.searchParams.set('chain', CONFIG.VITE_NETWORK)
		}
		console.debug('beforeNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	afterNavigate((nav) => {
		//componentKey++;
		console.debug('afterNavigate: ' + nav.to?.route.id + ' : ' + tsToTime(new Date().getTime()))
	})
	let inited = false;
	let errorReason:string|undefined;

	const login = async () => {
		const res = await loginStacksFromHeader(document)
	}

	const loginEvent = () => {
		componentKey++;
		componentKey1++;
	}

	const networkSwitchEvent = async () => {
		await initApp()
		componentKey++;
		componentKey1++;
	}

	const initApp = async () => {
		const name = 'runes-web';

		sessionStore.update((conf) => {
			conf.name = name;
			return conf;
		});

		inited = true;

	}

	let timer:any;

	onDestroy(() => {
		clearInterval(timer)
	})

	onMount(async () => {
		try {
			//initFlowbite();
			await initApp();
			inited = true;
		} catch (err) {
			errorReason = COMMS_ERROR
			console.log(err)
		}
	})
</script>

<div class="min-h-screen relative">
	{#if inited}
	<div class="flex flex-col h-screen">
		<div class="px-16 mx-auto w-full">
			<Header on:login_event={loginEvent} on:network_switch_event={networkSwitchEvent}/>
		</div>
		<div class="mx-auto px-6 flex-1">
			<div class="py-1 rounded-2xl sm:rounded-none">
				<div class="py-4 mx-auto max-w-7xl md:px-6">
					<div class="relative">
						<slot></slot>
					</div>
				</div>
			</div>
		</div>
		<div class="px-16 mx-auto w-full">
			<Footer />
		</div>
	</div>
	{/if}
</div>
