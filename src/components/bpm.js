import {$, $$} from '@/helpers/variables.js';
import * as Tone from 'tone';
import {html, render} from 'lit-html';
// let beatsPerMinute = 130;

// export const currentBPM = () => {

// }

export const setupBPM = (element, beatsPerMinute) => {
  const renderHTML = html`
    <button class="material-symbols-rounded" id='bpm-down'>remove</button>
    <span value="${beatsPerMinute}" id="bpm-counter">bpm is ${beatsPerMinute}</span>
    <button class="material-symbols-rounded" id='bpm-up'>add</button>
    `;
  // let beatsPerMinute = 130;
  // const state = beatsPerMinute;
  render(renderHTML, element);
  console.log(beatsPerMinute)
  
  const setCounter = (count) => {
    console.log(beatsPerMinute)
    Tone.Transport.bpm.value = beatsPerMinute;
    beatsPerMinute = count;
    bpmCounter.innerHTML = `bpm is ${beatsPerMinute}`
    bpmCounter.setAttribute("value",beatsPerMinute)
    
  };
  const pbmUp = $('#bpm-up');
  const pbmDown = $('#bpm-down');
  const bpmCounter = $('#bpm-counter');
  pbmUp.addEventListener("click", () => setCounter(beatsPerMinute + 5))
  pbmDown.addEventListener("click", () => setCounter(beatsPerMinute - 5));
  setCounter(beatsPerMinute);  
  
}

// setupBPM.state = {
//   currentBPM: 130,
//   increment: () => {
//     setState(() => setupBPM.state.currentBPM + 5 )
//   },
//   decrement: () => {
//     setState(() => setupBPM.state.currentBPM - 5 )
//   }
// }
// const setState = (callback) => {
//   callback();
//   updateTree(); // extracted function
// }

