import { mount } from 'svelte';
import './styles/global.css';
import './styles/werkvormen.css';
import './styles/animaties.css';
import App from './App.svelte';

mount(App, { target: document.getElementById('app') });
