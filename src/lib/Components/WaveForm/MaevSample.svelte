
<script lang="ts">
	import { CONFIG } from '$lib/config';
	import { BeBased_OB1, extractAudio, generateMusic } from '$lib/magenta/maev';
	import { onMount } from 'svelte';
	import Button from '$lib/ui/Button.svelte';
    import * as Tone from "tone";
    import * as mm from '@magenta/music/es6';
	import { fetchInscriptionWebContent } from '$lib/backend_api';
	import { sessionStore } from '../../../stores/stores';

    const player = new mm.Player();
    let model = $sessionStore.modelMaev;
    const mvae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');

    const samples:Array<any> = BeBased_OB1.filter((o) => o.image)
    const audios:Array<any> = []
	//$: getSamples = () => { return samples };
    let inited = false;

    const startMixing = () => {
        //mvae.initialize().then(() => {
        //    mvae.sample(1).then((samples:any) => player.start(audios[0]));
        //});
        generateMusic(model)
    }

    const pullAudio = async (oid:string) => {
        const webContent = await fetchInscriptionWebContent(oid);
        const audio = extractAudio(webContent)
        audios.push(audio)
    }

    const getPath = (oid:string) => {
        return `${CONFIG.VITE_API_INSCRIPTIONS1}/content/${oid}`;
    }

	onMount(async () => {
        // Initialize the MusicVAE model
        //if (!model) {
            const model = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
            await model.initialize();
            sessionStore.update((conf) => {
                conf.modelMaev = model
                return conf
            })
        //}
        for (const sample of samples) {
            pullAudio(sample.oid)
        }
        inited = true
	})
</script>

{#if inited}
<div>
    <p>Select the samples to play and the click the mix button</p>
    <Button label={'Mix'} on:clicked={() => startMixing()}></Button>
</div>
<div class="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 py-2 px-2 rounded-2xl lg:gap-4 ">
    {#each samples as sample, index}
    <iframe src={getPath(sample.oid)} class="w-full h-auto rounded-md" frameborder="0" title={'Inscription' + index}>
        Your browser does not support iframes.
    </iframe>
    <div>{audios[index]}</div>
    {/each}
</div>
{:else}
initializing model
{/if}