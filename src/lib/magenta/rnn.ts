import type { MusicRNN } from '@magenta/music/es6';
import * as mm from '@magenta/music/es6';

/**
 * Data scraped from https://github.com/blockchainbrighton/audionals
 * 3/05/24
 * Purpose: some samples to experiment with ai mixer.
 */
export const TWINKLE_TWINKLE = {
    notes: [
      {pitch: 60, startTime: 0.0, endTime: 0.5},
      {pitch: 60, startTime: 0.5, endTime: 1.0},
      {pitch: 67, startTime: 1.0, endTime: 1.5},
      {pitch: 67, startTime: 1.5, endTime: 2.0},
      {pitch: 69, startTime: 2.0, endTime: 2.5},
      {pitch: 69, startTime: 2.5, endTime: 3.0},
      {pitch: 67, startTime: 3.0, endTime: 4.0},
      {pitch: 65, startTime: 4.0, endTime: 4.5},
      {pitch: 65, startTime: 4.5, endTime: 5.0},
      {pitch: 64, startTime: 5.0, endTime: 5.5},
      {pitch: 64, startTime: 5.5, endTime: 6.0},
      {pitch: 62, startTime: 6.0, endTime: 6.5},
      {pitch: 62, startTime: 6.5, endTime: 7.0},
      {pitch: 60, startTime: 7.0, endTime: 8.0},  
    ],
    totalTime: 8
  };

export const DRUMS = {
    notes: [
      { pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 38, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 42, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 46, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true },
      { pitch: 42, quantizedStartStep: 2, quantizedEndStep: 3, isDrum: true },
      { pitch: 42, quantizedStartStep: 3, quantizedEndStep: 4, isDrum: true },
      { pitch: 42, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
      { pitch: 50, quantizedStartStep: 4, quantizedEndStep: 5, isDrum: true },
      { pitch: 36, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 38, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 42, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 45, quantizedStartStep: 6, quantizedEndStep: 7, isDrum: true },
      { pitch: 36, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
      { pitch: 42, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
      { pitch: 46, quantizedStartStep: 8, quantizedEndStep: 9, isDrum: true },
      { pitch: 42, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
      { pitch: 48, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
      { pitch: 50, quantizedStartStep: 10, quantizedEndStep: 11, isDrum: true },
    ],
    quantizationInfo: {stepsPerQuarter: 4},
    tempos: [{time: 0, qpm: 120}],
    totalQuantizedSteps: 11
  };

export async function initialise() {
    const music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn')
    await music_rnn.initialize()
    return music_rnn;
}

export function playOrPause(player:mm.Player) {

    if (player.isPlaying()) {
        player.stop();
        return;
    } else {
        player.start(TWINKLE_TWINKLE);
    }
}

export function getPlayer(soundFont:boolean) {

    let player:mm.Player|mm.SoundFontPlayer;
    //the basic player will play a synth sound by default
    if (soundFont) {
        //the SoundFont player will play any soundfont you want--this one in particular plays a piano sound.
        player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
    } else {
        player = new mm.Player()
    }
 
    return player
}
  
  
export async function generateMusic(model:MusicRNN, player:mm.Player|mm.SoundFontPlayer) {

    //const music_rnn = await initialise()
    //quantizing the former note sequence (the 4 referencing the stepsPerQuarter value)
    const qns = mm.sequences.quantizeNoteSequence(TWINKLE_TWINKLE, 4)
    //this number will determine the length of response, so I set it high to hear a longer continuation of the melody.
    const rnnSteps = 40
    //this controls how close to the original melody the response will be: a higher "temperature" means more randomness, a lower one means less.
    const rnnTemp = 1
    model.continueSequence(qns, rnnSteps, rnnTemp).then((sample) => player.start(sample));
}

function playMusic(sample:any) {
    // Use Magenta's built-in player to play the generated music sequence
    const player = new mm.Player();
    player.start(sample);
}
