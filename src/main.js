import '@/css/board.scss';
import '@/css/main.css';

import { customElement, property } from 'lit/decorators.js';
import { html, render } from 'lit-html';
import classNames from 'classnames';
import { setupBPM } from '@/components/bpm.js';
import '@/components/timeline.js';
import javascriptLogo from '@/client/javascript.svg';
import { $, $$, $name } from './helpers/variables';
import * as Tone from 'tone';
import { Timeline } from '@/components/timeline.js';

const notes = ['F4', 'Eb4', 'C4', 'Bb3', 'Ab3', 'F3'];
const numRows = notes.length;
const numCols = 8;
const noteInterval = `${numCols}n`;
let currentCol;

let currentNoteIndex = 0;

const state = {
  bpm: 130,
};

const music = {
  playing: false, // Whether the audio sequence is playing
  sequence: 0, // The current Tone.Sequence
  currentColumn: 0, // The currently playing column
  cancelRepeat: 0, // event thst drives the repeat and need to be reset to stop multi events from being made.
};

let currentColumn = 0;

const secondsPerBeat = 60 / state.bpm;
const secondsPerNote = Tone.Time(noteInterval).toSeconds();


const app = $('#app');
const appTemplate = html` <main>
  <div id="board">
    <div id="top-row">
      <div id="beats-per-minute"></div>
    </div>
    <div id="timeline"></div>
    <div id="sequencer"></div>
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

// const synth = new Tone.PolySynth(Tone.Synth).toDestination();
// repeated event every 8th note
// Tone.Transport.scheduleRepeat((time) => {
// 	// use the callback time to schedule events
// 	synth.start(time).stop(time + 0.1);
// }, "4n");
// transport must be started before it starts invoking events

// export const seq = new Tone.Sequence(
//   (time, note) => {
//     synth.triggerAttackRelease(note, 0.1, time);
//     console.log(time)
//     console.log(note)
//     // subdivisions are given as subarrays
//     console.log(seq.progress);
//     // console.log(Tone.Destination.blockTime);
//   },
//   [['E4', 'D4', 'E4'], ['E4'], 'G4', ['A4', 'G4']]
// ).start(0);

// console.log(seq)
// Tone.Transport.start();

const makeSynths = (count) => {
  // each synth can only play one note at a time.
  // for simplicity, we'll create one synth for each note available
  // this allows for easy polyphony (multiple notes playing at the same time)

  // Documentation for Tone.Synth can be found here:
  // https://tonejs.github.io/docs/r13/Synth
  //
  // Demo different oscillator settings here:
  // https://tonejs.github.io/examples/oscillator

  const synths = [];

  for (let i = 0; i < count; i++) {
    // I'm using an oscillator with a square wave and 8 partials
    // because I like how it sounds.
    //
    // You could simply write new Tone.Synth().toDestination() instead.
    // This would work just as well, but sound slightly different.
    //
    // Demo different oscillator settings here:
    // https://tonejs.github.io/examples/oscillator

    let synth = new Tone.Synth({
      oscillator: { type: 'square8' },
    }).toDestination();
    synths.push(synth);
  }

  return synths;
};

// an array of notes is passed in as the argument to allow for flexbility.
// const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];

const makeGrid = (notes) => {
  // our "notation" will consist of an array with 6 sub arrays
  // each sub array corresponds to one row of our sequencer

  // declare the parent array to hold each row subarray
  const rows = [];

  for (const note of notes) {
    // declare the subarray
    const row = [];
    // each subarray contains multiple objects that have an assigned note
    // and a boolean to flag whether they are active.
    // each element in the subarray corresponds to one eighth note.
    for (let i = 0; i < numCols; i++) {
      row.push({
        note: note,
        isActive: false,
        activeCol: false,
        index: i,
      });
    }
    rows.push(row);
  }

  // we now have 6 rows each containing 8 eighth notes
  return rows;
};

const synths = makeSynths(numRows);

// In React, I stored beat in the component's state.
// For the purpose of this demo it exists as a global variable.

let beat = 0;
// Similarly, the grid would be stored in the component's state
// Here I am leaving it as a global variable for demonstration purposes.

// const notes = ["F4", "Eb4", "C4", "Bb3", "Ab3", "F3"];
let grid = makeGrid(notes);
let playing = false;
let started = false;
const configLoop = () => {

  

  // This is our callback function. It will execute repeatedly
  const repeat = (time) => {
    const secondsElapsed = Tone.Transport.seconds - time;
  const currentNote = Math.floor(secondsElapsed / secondsPerNote);
  
  let getRows = $$('#rowIndex');
  const allButtons = $$('.note');

  allButtons.forEach(button => {
    const index = button.getAttribute('data-index');
    if (index === beat.toString()) {
      button.setAttribute('data-column-active', 'true');
    } else {
      button.setAttribute('data-column-active', 'false');
    }
  });

console.log(allButtons)



// console.log(getRows)
console.log(beat)

// getRows.forEach((row, index) => {
//   let note = row[beat];
//   // Select the first button in each row
//   const activeRow = row.querySelectorAll('.note');

  




// activeRow.forEach(element => {
//   // console.log(element)
// });


//     if (beat === index) {
//       // activeRow.setAttribute('data-column-active', 'true' );
      
//     } else {
//       // activeRow.setAttribute('data-column-active', 'false' );
//     }

//   // Do something with the first button
  
// });




    grid.forEach((row, index) => {
      // console.log(row)
      // console.log(`grid index ${index}`)
      // console.log(`grid row ${row}`)
      

      // console.log(row)
      // as the index increments we are moving *down* the rows
      // One note per row and one synth per note means that each row corresponds to a synth
      let synth = synths[index];
      // beat is used to keep track of what subdivision we are on
      // there are eight *beats* or subdivisions for this sequencer
      let note = row[beat];
      // console.log(note)






      
      // console.log(getRows)
      // rowPerNote.querySelectorAll('.note');



      handleActiveColumn(row);
      // console.log(note.index)
      // console.log(row[index].index)
      let rowPerNote = $name(note.note);
      // console.log(rowPerNote);
      // const gain = new Tone.Gain();
      // console.log(synth.toTicks(noteInterval));
      let noteIndexElement = rowPerNote[note.index];




      // console.log(rowPerNote)
  //     row.forEach((note, noteIndex) => {
      
  //       // console.log(`row note index ${noteIndex}`)
  //       // console.log(`row note ${note.index}`)
        
  //       // console.log(note);
  //       // console.log(noteIndex);

  //       if (note.index.toString() === row[index].index.toString()) {
  //         note.activeCol = !note.activeCol;
  //         // console.log(rowPerNote[index]);
  //         // noteIndexElement.forEach(element => {
  //         //   element.setAttribute('data-column-active', note.activeCol);
  //         // });  
  // // console.log(noteIndexElement)
  //         // $('.note').target.className = classNames(
  //         //   "note",
  //         //     { "note-col-is-active": !!note.activeCol },
  //         //     { "note-col-is-not-active": !note.activeCol }
  //         // )
  //       } else {
  //         // console.log('false');
  //         noteIndexElement.setAttribute('data-column-active', 'false' );
  //         // note.activeCol === false
  //       }



  //     });

    

      if (note.isActive) {
        // triggerAttackRelease() plays a specific pitch for a specific duration
        // documentation can be found here:
        // https://tonejs.github.io/docs/14.7.77/Synth#triggerAttackRelease

        synth.triggerAttackRelease(note.note, noteInterval, time);
        
      }
      
    });
    // increment the counter
    beat = (beat + 1) % 8;
    
    console.log(beat)
  };

  
  // set the tempo in beats per minute.
  // Tone.Transport.bpm.value = 120;
  // telling the transport to execute our callback function every eight note.
  Tone.Transport.scheduleRepeat(repeat, noteInterval);

  
  // console.log(Tone.Transport.toTicks(noteInterval) / 8);

};

const handleActiveColumn = (currentRowIndex, currentNote, button) => {
  grid.forEach((row, rowIndex) => {
    row.forEach((note, noteIndex) => {
      // console.log(`${currentRowIndex[noteIndex].note} & ${noteIndex}`);
      if (currentRowIndex === rowIndex || currentNote === noteIndex) {
        note.activeCol = !note.activeCol;
        // e.target.className = classNames(
        //   "note",
        //   { "note-col-is-active": !!note.activeCol },
        //   { "note-col-is-not-active": !note.activeCol }
        // );
      }
    });
  });
};

// grid is a global variable declared prior to the execution of makeSequencer()
//
// const grid = makeGrid()
const sequencer = document.getElementById('sequencer');
const makeSequencer = () => {
  // grab the top level div from the DOM

  // iterate through the grid
  grid.forEach((row, rowIndex) => {
    // create a parent div for each row
    const seqRow = document.createElement('div');
    seqRow.id = `rowIndex`;
    seqRow.className = 'sequencer-row';

    // iterate through each note in the row
    row.forEach((note, noteIndex) => {
      // console.log(noteIndex)

      // create a button for each note
      const button = document.createElement('button');
      button.className = 'note';
      button.setAttribute('name', note.note);
      button.setAttribute('data-index', note.index);
      button.classList.add(noteIndex);

      // if (noteIndex) {
      //   button.classList.add('activeCol')
      // } else {
      //   button.classList.remove('activeCol')
      // }
      // handleActiveColumn(rowIndex, note.note, button);
      // console.log(button)
      // button.addEventListener('trigger', () => {

      // })

      // handleNoteClick() to be defined in a little bit
      button.addEventListener('click', function (e) {
        handleNoteClick(rowIndex, noteIndex, e);
      });

      // append each note to the parent div
      seqRow.appendChild(button);
    });
    // append each row to the top level div
    sequencer.appendChild(seqRow);
  });
  // sequencer.addEventListener("trigger", ({ detail }) => {
  //   keys.player(detail.row).start(detail.time, 016t");
  // });
};

const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
  grid.forEach((row, rowIndex) => {
    row.forEach((note, noteIndex) => {
      if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
        note.isActive = !note.isActive;
        e.target.className = classNames(
          'note',
          { 'note-is-active': !!note.isActive },
          { 'note-not-active': !note.isActive }
        );
      }
    });
  });
};

const handleActiveNote = (clickedRowIndex, clickedNoteIndex, e) => {
  grid.forEach((row, rowIndex) => {
    row.forEach((note, noteIndex) => {
      if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
        note.isActive = !note.isActive;
        e.target.className = classNames(
          'note',
          { 'note-is-active': !!note.isActive },
          { 'note-not-active': !note.isActive }
        );
      }
    });
  });
};

const configPlayButton = () => {
  const playPause = $('#play-pause');

  playPause.addEventListener('click', (e) => {
    // Tone.Transport.toggle();
    const state = Tone.Transport.state;
    if (!started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001);
      configLoop();
      started = true;
    }

    if (playing) {
      e.target.innerText = 'play_arrow';
      Tone.Transport.stop();
      playing = false;
    } else {
      e.target.innerText = 'pause';
      Tone.Transport.start();
      playing = true;
    }

    // switch (state) {
    //   case 'started':
    //     Tone.Transport.pause();
    //     playPause.innerHTML = `play_arrow`;
    //     break;
    //   case 'stopped':
    //     Tone.Transport.start();
    //     playPause.innerHTML = `pause`;
    //     break;
    //   default:
    //     Tone.Transport.start();
    //     playPause.innerHTML = `pause`;
    //     break;
    // }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  setupBPM($('#beats-per-minute'), state.bpm);
  Timeline($('#timeline'));
  configPlayButton();
  makeSequencer();
});
