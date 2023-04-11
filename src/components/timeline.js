// import { seq } from '@/main';
import {$, $$} from '@/helpers/variables.js';
import * as Tone from 'tone';
import {html, render} from 'lit-html';
// export const setupTimeline = (element) => { 
  


//   console.log(Tone.Transport.progress)
//   element.innerHTML = /*html*/`
  
//     `;

// }

// import { LitElement, html, css } from 'lit';
// import {customElement, property} from 'lit/decorators.js';

export const Timeline = (element) => {
    const renderHTML = html`
    <div class="panel">
      hi
    </div>`;

    render(renderHTML, element)
  }


