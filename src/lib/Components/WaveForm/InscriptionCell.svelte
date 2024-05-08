
<script lang="ts">
	import { convertToMidi, fetchInscriptionMidiContent, fetchInscriptionWebContent } from '$lib/backend_api';
	import { CONFIG } from '$lib/config';
	import AudioHelperModal from './AudioHelperModal.svelte';
	import { parseHTML } from '$lib/utils';
	import HowlerAudioPlayer from './HowlerAudioPlayer.svelte';
	import { onMount } from 'svelte';
	import { noteSequenceToToneEvents, parseMidiData, playToneEvents } from '$lib/midi/convertor';

    export let inscriptionId:string;
    export let inscriptionIndex:number;
    let audioFile:string;
    let midiFileBuffer:ArrayBuffer|undefined;
    let audioSrc:string;
    let imageSrc:string;
    let audioName:string;
	let inited = false;

	const pullAudio = async () => {
        audioFile = await fetchInscriptionWebContent(inscriptionId);
        midiFileBuffer = await fetchInscriptionMidiContent(inscriptionId);
		if (midiFileBuffer) {
            const midiSequence = parseMidiData(midiFileBuffer);
			console.log(inscriptionIndex + ' : ' + midiSequence)
            const toneEvents = noteSequenceToToneEvents(midiSequence);
			playToneEvents(toneEvents);
		}
    }



	const parseAudio = () => {
		const audioFileHtml = parseHTML(audioFile);
		const sample = audioFileHtml.getElementById('sampleName')?.innerHTML
		audioName = sample || '' // tag[0].getAttribute('data-audionalSampleName')?.valueOf() || ''
		audioSrc = audioFileHtml.getElementById("audionalData")?.getElementsByTagName('source')[0].getAttribute('src') || ''
		imageSrc = audioFileHtml.getElementsByTagName("img")[0]?.getAttribute('src') || ''
		console.log(audioName);
	}

	const convert = async () => {
		const result = await convertToMidi(inscriptionId)
		console.log(result)
	}

    const getInscriptionUrl = () => {
        return `${CONFIG.VITE_API_INSCRIPTIONS1}/content/${inscriptionId}`;
    }

	onMount(async () => {
		await pullAudio()
		parseAudio()
		inited = true
	})
</script>

<div>
	{#if inited}
	<h1 class="text-xs overflow-hidden"><a href="/" on:click|preventDefault={() => convert()}>{inscriptionIndex + 1} {audioName}</a></h1>
	{#if audioSrc}
	<div class="border border-lightgray">
		<iframe src={getInscriptionUrl()} class="w-full h-auto" frameborder="0" title={'Inscription-' + inscriptionIndex}>
			Your browser does not support iframes.
		</iframe>
	</div>
	<HowlerAudioPlayer {audioSrc} {imageSrc} playerIndex={inscriptionIndex} {audioFile}/>
	<!--
	<img id={'audionalImageData-' + inscriptionIndex} src={imageSrc} alt="Inscription file"/>
	<audio controls class="" id={'audionalData-' + inscriptionIndex} loop data-audionalSampleName={audioName}>
		<source src={audioSrc} />
		Your browser does not support the audio element.
	</audio>
	-->
	{/if}
	<!--<button data-modal-target={'modal-' + inscriptionIndex} data-modal-toggle={'modal-' + inscriptionIndex} class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
		Toggle modal
	</button>
	-->
	{/if}
</div>
