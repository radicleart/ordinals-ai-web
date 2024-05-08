<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
	import { createEventDispatcher } from "svelte";
	import { afterNavigate, goto } from "$app/navigation";
	import { initApplication, loginStacks } from '$lib/stacks_connect'
	import { logUserOut, loggedIn } from '$lib/stacks_connect'
	import AccountDropdown from './AccountDropdown.svelte'
	import { CONFIG, setConfigByUrl } from '$lib/config';
	import gramaphone from '$lib/assets/gramaphone.webp'

	const dispatch = createEventDispatcher();

	const doLogin = async () => {
		if (loggedIn()) doLogout()
		else {
			await loginStacks(loginCallback);
		}
	}

	const switchNetwork = async () => {
		let net = CONFIG.VITE_NETWORK;
		if (net === 'devnet') return
		if (net === 'mainnet') net = 'testnet';
		else net = 'mainnet'
		setConfigByUrl();
		const url = new URL(location.href);
		if (import.meta.env.MODE === 'simnet') {
			url.searchParams.set('chain', 'testnet');
		} else {
			url.searchParams.set('chain', net);
		}
		//await dispatch('network_switch_event')
		window.location.href = url.origin + '?chain=' + net //.assign(url.search);
	}

	let componentKey = 0;
	afterNavigate((nav) => {
		componentKey++;
	})

	const loginCallback = async () => {
		await initApplication()
		setTimeout(function() {
			dispatch('login_event');
			componentKey++;
		}, 500)
	}

	const doLogout = async () => {
		logUserOut();
		dispatch('login_event');
		setTimeout(function() {
			componentKey++;
			goto('/')
		}, 100)
	}

	const getNavActiveClass = (item:string) => {
		if (location.pathname.indexOf(item) > -1) return ' text-base text-primary-500 !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
		return ' text-base !px-4 !py-2 rounded-lg hover:bg-white/[8%] focus:bg-white/[16%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50'
	}

</script>

<Navbar
	class="relative mx-auto flex max-w-7xl items-center !px-6 lg:px-8 !bg-transparent"
	let:hidden
	let:toggle
	fluid={true}
>
  <NavBrand href="/">
		<!--<Brand />-->
		<img width={'80px'} height={'auto'}  src={gramaphone} alt="logo"  />
  </NavBrand>

	{#key componentKey}
  	<div class="hidden md:flex md:gap-2 md:order-3">
			{#if loggedIn()}
				<AccountDropdown on:init_logout={() => doLogout()}/>
			{:else}
				<button class="font-mono lowercase inline-flex items-center px-4 py-2 text-sm  text-black rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500/50 shrink-0" on:keydown on:click={doLogin}>
					Connect &nbsp;<span class="text-black/[0.64]">-&gt;</span>
				</button>
			{/if}
		</div>

		<NavHamburger class="text-black hover:bg-sand-900 hover:text-white" on:click={toggle} />

		<NavUl
			{hidden}
			class="order-1 md:flex-0"
			ulClass="dark:bg-white dark:md:bg-white md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4 sm:justify-end md:text-sand-700 py-2.5 px-2"
		>
			<div class="flex">
				<!--
				<NavLi nonActiveClass={getNavActiveClass('/results')}><a href={'/results?method=1'}>Results</a></NavLi>
				-->
			</div>
			</NavUl>
			<NavUl
			{hidden}
			class="order-1 md:flex-1"
			ulClass="dark:bg-white dark:md:bg-white md:border-0 border border-black flex flex-col p-2 md:p-4 mt-4 md:flex-row md:mt-0 md:text-sm md:!md:space-x-4 sm:justify-end md:text-sand-700 py-2.5 px-2"
		>

			<NavLi nonActiveClass="md:hidden" class="-ml-2 -mr-3">
				{#if loggedIn()}
					<AccountDropdown on:init_logout={() => doLogout()}/>
				{:else}
					<button id="connect-wallet" class="block w-full items-center gap-x-1.5 px-4 py-2 text-black rounded-lg border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#131416]" on:keydown on:click={doLogin}>
						connect
					</button>
				{/if}
			</NavLi>
		</NavUl>
	{/key}
</Navbar>
