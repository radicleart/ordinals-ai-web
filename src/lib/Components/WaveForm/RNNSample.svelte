
<script lang="ts">
	import { CONFIG } from '$lib/config';
	import { onMount } from 'svelte';
	import Button from '$lib/ui/Button.svelte';
	import { BeBased_OB1 } from '$lib/magenta/maev';
	import { TWINKLE_TWINKLE, generateMusic, getPlayer, initialise } from '$lib/magenta/rnn';
	import InscriptionCell from './InscriptionCell.svelte';
	import { sessionStore } from '../../../stores/stores';

    let modelRnn = $sessionStore.modelRnn;

    const samples:Array<any> = BeBased_OB1.filter((o) => o.image)
    let inited = false;

    const startMixing = () => {
        const player = getPlayer(true)
        generateMusic($sessionStore.modelRnn, player)
    }

    const startPlaying = () => {
        const player = getPlayer(true)
        player.start(TWINKLE_TWINKLE);
    }

	onMount(async () => {
        // Initialize the MusicVAE model
        //if (!modelRnn) {
            const model = await initialise();
            await model.initialize();
            sessionStore.update((conf) => {
                conf.modelRnn = model
                return conf
            })
        //}
        inited = true
	})
</script>

<div>
    <p>Select the samples to play and the click the mix button</p>
    {#if inited}
    <Button label={'Mix'} on:clicked={() => startMixing()}></Button>
    <Button label={'Play'} on:clicked={() => startPlaying()}></Button>
    {:else}
    initializing model
    {/if}
    </div>
<div class="grid lg:grid-cols-6 md:grid-cols-6 grid-cols-3 gap-5 py-2 px-2 rounded-2xl lg:gap-4 ">
    {#each samples as sample, index}
    <InscriptionCell inscriptionId={sample.oid} inscriptionIndex={index}/>
    {/each}
</div>

  
