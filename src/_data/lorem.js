/**
 * An example of how to fetch data during build time.
 */

const fetch = require('node-fetch');

async function fetchLoremIpsum(paragraphs, size) {
  // do some async things
  console.assert(Number.isInteger(paragraphs));
  console.assert(['medium','short','long'].includes(size));
  url = `https://loripsum.net/api/${paragraphs}/${size}`;
  return await fetch(url);
}
 
module.exports = async () => {
  const teaser = await fetchLoremIpsum(1, 'short')
    .then(res => res.text());
  const longTeaser = await fetchLoremIpsum(1, 'long')
    .then(res => res.text());
  const full = await fetchLoremIpsum(3, 'long')
    .then(res => res.text());
  const longFull = await fetchLoremIpsum(5, 'long')
    .then(res => res.text());
  return {
    teaser,
    longTeaser,
    full,
    longFull
  };
};
