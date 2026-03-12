#!/usr/bin/env node

const https = require('https');

const imageSources = [
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
  'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/025.png'
];

function testImage(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        url,
        status: response.statusCode,
        success: response.statusCode === 200,
        contentType: response.headers['content-type']
      });
    });

    request.on('error', () => {
      resolve({
        url,
        status: 0,
        success: false,
        contentType: null
      });
    });

    request.setTimeout(5000, () => {
      request.destroy();
      resolve({
        url,
        status: 0,
        success: false,
        contentType: null,
        timeout: true
      });
    });
  });
}

async function testAllImages() {
  console.log('🖼️ Testing Pokemon image sources...\n');
  
  const results = await Promise.all(imageSources.map(testImage));
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const source = ['GitHub Artwork', 'GitHub Sprites', 'Pokemon.com'][index];
    
    console.log(`${status} ${source}:`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Status: ${result.status || 'TIMEOUT'}`);
    console.log(`   Content-Type: ${result.contentType || 'N/A'}`);
    console.log('');
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`📊 Summary: ${successCount}/${results.length} sources working`);
  
  if (successCount === 0) {
    console.log('⚠️  All image sources failed! Check your network and DNS.');
    process.exit(1);
  } else if (successCount < results.length) {
    console.log('⚠️  Some image sources failed. Fallbacks will be used.');
  } else {
    console.log('✅ All image sources working correctly!');
  }
}

testAllImages().catch(console.error);
