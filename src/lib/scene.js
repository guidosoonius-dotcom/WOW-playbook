// Hulpjes voor de explainer-scènes. Elke scène bouwt stap voor stap op:
// wat bij de huidige stap hoort staat op volle sterkte, eerdere stappen worden gedimd,
// latere stappen zijn nog onzichtbaar. In de laatste stap ("alles samen") staat alles vol aan.
export function opbouw(step, laatste = Infinity) {
  const vis = (k) => (step < k ? 0 : step === k || step === laatste ? 1 : 0.4);
  return {
    g: (k) => `opacity: ${vis(k)}`,
    dr: (k) => `stroke-dashoffset: ${step < k ? 1 : 0}; opacity: ${step < k ? 0 : vis(k) === 0.4 ? 0.55 : 1}`,
    op: (aan) => `opacity: ${aan ? 1 : 0}`
  };
}
