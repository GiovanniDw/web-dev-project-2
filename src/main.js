import '@/css/main.css';
import '@/css/board.scss';

import { customElement, property } from 'lit/decorators.js';
import { html, render } from 'lit-html';
import { setupBPM } from '@/components/bpm.js';
import '@/components/timeline.js';
import javascriptLogo from '@/client/javascript.svg';
import { $ } from './helpers/variables';
import * as Tone from 'tone';
import { Timeline } from '@/components/timeline.js';


const state = {
  bpm: 130,
};

const app = $('#app');
const appTemplate = html`
<main>
  <div id="board">
    <div id="top-row">
      <div id="beats-per-minute"></div>
    </div>
    <div id="timeline"></div>
    <div id="bottom-row">
      <button class="play-pause material-symbols-rounded" id="play-pause">
        play_arrow
      </button>
    </div>
  </div>
</main>`;

render(appTemplate, app);

// document.querySelector('#app').innerHTML = /*html*/ `
//   <main>
//   <div id="board">
//     <div id="top-row">
//       <div id="beats-per-minute"></div>
//     </div>
//     <div id="timeline">
//     </div>
//     <div id="bottom-row">
//     <button class="play-pause material-symbols-rounded" id="play-pause">play_arrow</button>
//     </div>
//   </div>
// </main>
// `;

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
// repeated event every 8th note
// Tone.Transport.scheduleRepeat((time) => {
// 	// use the callback time to schedule events
// 	synth.start(time).stop(time + 0.1);
// }, "4n");
// transport must be started before it starts invoking events

const now = Tone.now();

export const seq = new Tone.Sequence(
  (time, note) => {
    synth.triggerAttackRelease(note, 0.1, time);
    console.log(time)
    console.log(note)
    // subdivisions are given as subarrays
    console.log(seq.progress);
    // console.log(Tone.Destination.blockTime);
  },
  [['E4', 'D4', 'E4'], ['E4'], 'G4', ['A4', 'G4']]
).start(0);


console.log(seq)
// Tone.Transport.start();

const playPause = $('#play-pause');

playPause.addEventListener('click', () => {
  console.log(now)
  // Tone.Transport.toggle();
  const state = Tone.Transport.state;
  switch (state) {
    case 'started':
      Tone.Transport.pause();
      playPause.innerHTML = `play_arrow`;
      console.log(state);
      break;
    case 'stopped':
      Tone.Transport.start();
      playPause.innerHTML = `pause`;
      console.log(state);
      break;
    default:
      Tone.Transport.start();
      playPause.innerHTML = `pause`;
      console.log(state);
      break;
  }
});

setupBPM($('#beats-per-minute'), state.bpm);
Timeline($('#timeline'));
