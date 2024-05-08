
<script lang="ts">
	import { onMount } from 'svelte';
	import { Howl } from 'howler';
	import { ArrowDown, ArrowDownCircle, ArrowUp, ArrowUpCircle, Icon, Pause, Play } from 'svelte-hero-icons';
	import { ArrowDownOutline, ArrowUpOutline, VolumeDownSolid, VolumeUpSolid } from 'flowbite-svelte-icons';
	import AudioHelperModal from './AudioHelperModal.svelte';

	export let audioFile:string;
	export let playerIndex:number;
	export let audioSrc:string;
    export let imageSrc:string;

	let playing = false;
	let sound:any;
	let showImage = false;

	const togglePlaying = () => {
		if (playing) {
			playing = false
			sound.stop();
		} else {
			playing = true
			sound.play();
		}
	}

	const volumeUp = () => {
		const currentVolume = sound.volume()
		const step = (currentVolume + 0.05 < 0) ? currentVolume + 0.05 : 1
		sound.volume(currentVolume + 0.05)
	}

	const volumeDown = () => {
		const currentVolume = sound.volume()
		const step = (currentVolume - 0.05 > 0) ? currentVolume - 0.05 : 0
		sound.volume(step)
	}


	onMount(async () => {
		sound = new Howl({
			src: audioSrc,
			autoplay: false,
			loop: true,
			volume: 0.5,
			onend: function() {
				//console.log('Finished! -> ' + playerIndex);
			}
		});
		window.addEventListener('message', (event) => {

		})
	})
</script>

<div class="flex flex-col">
	{#if showImage}<img id={'audionalImageData-' + playerIndex} src={imageSrc} alt="Inscription file"/>{/if}
	<div class="flex justify-between">

	</div>
    <div class="py-2 flex flex-col  bg-blue-500">
		<div class="flex justify-between px-2">
			<audio id="audio" src={audioSrc}></audio>
			<div>
				<AudioHelperModal body={audioFile} title={'File ' + playerIndex} index={playerIndex}/>
				<button id="playBtn" on:click={togglePlaying}>
					<Icon src={(!playing) ? Play : Pause} mini class="inline shrink-0 h-5 w-5 text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50" aria-hidden="false" />
				</button>
			</div>
			<div>
				<button id="volumeUp" on:click={volumeUp}>
					<Icon src={ArrowUpCircle} class="mr-0 border-gray-600 border rounded-full inline shrink-0 h-5 w-5 text-gray-600 " aria-hidden="false" />
				</button>
				<button id="volumeDown" on:click={volumeDown}>
					<Icon src={ArrowDownCircle} class="border-gray-600 border rounded-full inline shrink-0 h-5 w-5 text-gray-600 " aria-hidden="false" />
				</button>
			</div>
		</div>
		<div class=" px-2">
			<div class="w-full ">
				<input class="w-[100%]" type="range" id="seekBar" max="100" min="0" value="50">
			</div>
		</div>
	</div>
</div>

<style>
#audio {
    width: 100%;
    margin-right: 10px;
}

</style>