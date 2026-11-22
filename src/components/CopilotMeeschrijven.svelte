<script>
  // Op "Over dit playbook": de Copilot Cowork-skill downloaden, of de prompt voor Copilot Chat kopiëren.
  import skill from '../lib/skill.js';
  import content from '../lib/content.js';
  import { kopieer } from '../lib/werkvorm.svelte.js';

  const versie = content.changelog[0]?.versie;
  let melding = $state('');

  function download() {
    const blob = new Blob([skill.skill], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    melding = 'SKILL.md staat in je downloads.';
  }
  async function kopieerPrompt() {
    const tekst = skill.prompt.split('\n---\n')[1]?.trim() ?? skill.prompt;
    melding = (await kopieer(tekst)) ? 'De prompt is gekopieerd. Plak hem in Copilot Chat en voeg je bron toe.' : 'Kopiëren lukte niet in deze browser.';
  }
</script>

<section class="sectie" aria-labelledby="copilot-kop">
  <h2 id="copilot-kop">Meeschrijven met Copilot</h2>
  <p class="intro">Wil je het playbook aanvullen, bijvoorbeeld met een dilemma uit je eigen divisie of een rolbeschrijving uit Word? Copilot zet je bron om naar kant-en-klare playbook-inhoud. Het programmateam neemt de wijziging daarna over in het playbook.</p>
  <div class="kaarten">
    <article class="card">
      <h3>Copilot Cowork</h3>
      <p>Met de skill <b>Playbook-redacteur</b> kent Cowork alle onderdelen, regels en de toon van het playbook.</p>
      <ol>
        <li>Download de skill.</li>
        <li>Open Cowork, ga naar <i>Aanpassen</i> → <i>Skills</i> en voeg het bestand toe. Of zet het zelf in je OneDrive, in de map <code>Documenten/Cowork/skills/playbook-redacteur/</code> (maak die map aan als hij er niet is).</li>
        <li>Vraag bijvoorbeeld: <i>"Maak van deze notitie een dilemma voor het playbook."</i></li>
      </ol>
      <button class="btn btn--primary" onclick={download}>Download de skill (SKILL.md)</button>
    </article>
    <article class="card">
      <h3>Copilot Chat</h3>
      <p>Geen Cowork? De prompt werkt ook in Copilot Chat in Word, Teams of de Microsoft 365-app.</p>
      <ol>
        <li>Kopieer de prompt.</li>
        <li>Plak hem in Copilot Chat en voeg je bron toe: een bestand of geplakte tekst.</li>
        <li>Copilot levert de tekst; stuur die naar het programmateam of dien hem in via GitHub.</li>
      </ol>
      <button class="btn" onclick={kopieerPrompt}>Kopieer de prompt</button>
    </article>
  </div>
  <p class="meta" aria-live="polite">{melding || `De skill en de prompt horen bij playbook-versie ${versie} en worden bij elke nieuwe versie bijgewerkt.`}</p>
</section>

<style>
  h2 {
    margin-bottom: 8px;
  }
  .intro {
    margin: 0 0 16px;
    max-width: 72ch;
  }
  .kaarten {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    gap: 14px;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  h3 {
    font-size: 19px;
  }
  .card p {
    margin: 0;
  }
  ol {
    margin: 0;
    padding-left: 20px;
    font-size: 15px;
    line-height: 1.5;
  }
  li {
    margin-bottom: 4px;
  }
  code {
    font-size: 13px;
    background: var(--chip);
    padding: 1px 5px;
    border-radius: 4px;
  }
  .card .btn {
    margin-top: auto;
  }
  .meta {
    margin: 12px 0 0;
    font-size: 14px;
    color: var(--muted);
  }
</style>
