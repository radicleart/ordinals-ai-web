import type { INoteSequence, MusicVAE } from '@magenta/music/es6';
import * as mm from '@magenta/music/es6';

/**
 * Data scraped from https://github.com/blockchainbrighton/audionals
 * 3/05/24
 * Purpose: some samples to experiment with ai mixer.
 */
export const BeBased_OB1 = [
    { image: true, oid: "e7d344ef3098d0889856978c4d2e81ccf2358f7f8b66feecc71e03036c59ad48i0" },
    { image: true, oid: "d030eb3d8bcd68b0ed02b0c67fdb981342eea40b0383814f179a48e76927db93i0" },
    { image: true, oid: "ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0" },
    { image: true, oid: "3b7482a832c4f27c32fc1da7cc4249bbbac1cbdfbdb8673079cad0c33486d233i0" },
    { image: true, oid: "5a42d7b2e2fe01e4f31cbad5dd671997f87339d970faaab37f6355c4a2f3be5ai0" },
    { image: true, oid: "1bda678460ef08fb64435b57c9b69fd78fd4556822ccd8e9839b4eb71b3621edi0" },
    { image: true, oid: "91f52a4ca00bb27383ae149f24b605d75ea99df033a6cbb6de2389455233bf51i0" },
    { image: true, oid: "ddc1838c1a6a3c45b2c6e19ff278c3b51b0797c3f1339c533370442d23687a68i0" },
    { image: true, oid: "1e3c2571e96729153e4b63e2b561d85aec7bc5ba372d293af469a525dfa3ed59i0" },
    { image: true, oid: "437868aecce108d49f9b29c2f477987cb5834ffdf639a650335af7f0fdd5e55bi0" },
    { image: true, oid: "3be1f8e37b718f5b9874aecad792504c5822dc8dfc727ad4928594f7725db987i0" },
    { image: false, oid: "bd02c39ac1adad2c4a5f79dd4a6a9f08549488348cdf7e669a397840eb2673e1i0" },
    { image: false, oid: "e070d07283f4a41a8a60fda4462814046ac5d342a4afac407e8b1f57f334fb52i0" },
    { image: false, oid: "f4161e0da85db42f30000e80f7923b4c59bcefd368c4c93a391efbac2c094b30i0" },
    { image: false, oid: "c511a6247dd207f6ebbf87090193d661f440a7f198c0009e49ed4c1b3541914fi0" },
    { image: false, oid: "bd02c39ac1adad2c4a5f79dd4a6a9f08549488348cdf7e669a397840eb2673e1i0" }
]

export const PreLoaded = [
    "e7d344ef3098d0889856978c4d2e81ccf2358f7f8b66feecc71e03036c59ad48i0",
    "ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0",
    "d030eb3d8bcd68b0ed02b0c67fdb981342eea40b0383814f179a48e76927db93i0",
    "3b7482a832c4f27c32fc1da7cc4249bbbac1cbdfbdb8673079cad0c33486d233i0",
    "5a42d7b2e2fe01e4f31cbad5dd671997f87339d970faaab37f6355c4a2f3be5ai0",
    "ddc1838c1a6a3c45b2c6e19ff278c3b51b0797c3f1339c533370442d23687a68i0",
    "1e3c2571e96729153e4b63e2b561d85aec7bc5ba372d293af469a525dfa3ed59i0",
    "91f52a4ca00bb27383ae149f24b605d75ea99df033a6cbb6de2389455233bf51i0",
    "437868aecce108d49f9b29c2f477987cb5834ffdf639a650335af7f0fdd5e55bi0",
    "3be1f8e37b718f5b9874aecad792504c5822dc8dfc727ad4928594f7725db987i0"
];

export async function extractAudio(inscription:string) {
    if (!inscription) return ''
    let str = inscription.split('audio')
    str = str[1].split('audio/wav')
    console.log(`Width: ${str[0]}`);
    const re = /^(audio)(.*)(audio)$/g;

    // check if the phone number is valid
    const match = inscription.match(re);
    if (match) console.log(`Width: ${match[1]}`);


    //let str1 = inscription.split('<source src="data:audio')
    //str1 = str1.split() 
  }
  
  
  export async function generateMusic(model:MusicVAE) {

    // Assuming you have an array of note sequences
    const notes:Array<INote> = [
        { pitch: 60, startTime: 0, endTime: 0.5 },
        { pitch: 64, startTime: 0.5, endTime: 1 },
        { pitch: 67, startTime: 1, endTime: 1.5 },
        { pitch: 72, startTime: 1.5, endTime: 2 }]
    const myMusicSamples:unknown = [
        { notes, totalTime: 2 }
    ];

    // Quantize the note sequence
    const quantizedSequence = mm.sequences.quantizeNoteSequence(myMusicSamples as INoteSequence, 4);  // 4 steps per quarter note

    // Generate new sequences based on the single input sequence
    const generatedSamples = await model.sample(5, quantizedSequence);
    playMusic(generatedSamples[0]);  // Play the first generated sequence
}

function playMusic(sample:any) {
    // Use Magenta's built-in player to play the generated music sequence
    const player = new mm.Player();
    player.start(sample);
}
