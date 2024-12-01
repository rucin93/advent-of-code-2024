import fetch from 'node-fetch';
import fs from 'fs';

const createDirectory = async (day) => {
  const dir = `./src/${day.toString().padStart(2, '0')}`;

  if (!fs.existsSync(dir)) {
    const title = await fetch(`https://adventofcode.com/2024/day/${day}`);
    const data = await title.text();
    const titleMatch = data.match(/<h2>[-]{3}(.*)[-]{3}<\/h2>/);

    if (!titleMatch) {
      console.error(`
        Title not found!!!

        Probably wrong day number or day not published yet.
      `);

      throw new Error('Title not found');
    }

    fs.mkdirSync(dir);
    fs.writeFile(`${dir}/index.civet`, `// Path: src/${day
        .toString()
        .padStart(2, '0')}/index.civet\n\n`, (err) => {
        if (err) {
          console.log(err);
        }
    }); 

    fs.writeFile(`${dir}/story.md`, `## ${titleMatch[1]}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    console.log(`Created files for day ${day} - ${titleMatch[1]} 🌟🌟`);
  } else {
    console.error('Directory already exists');
  }

}

const createInputFile = async (day) => {
  if (fs.existsSync(`./src/${day.toString().padStart(2, '0')}/input.txt`)) {
    console.error('Input file already exists');
    return;
  }
  
  const input = await fetch(`https://adventofcode.com/2024/day/${day}/input`, {
    headers: {
      cookie: `session=${process.env.SESSION_COOKIE}`
    }
  });

  const data = await input.text();
  fs.writeFile(`./src/${day.toString().padStart(2, '0')}/input.txt`, data, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

const init = async (day) => {
  if(!process.env.SESSION_COOKIE) {
    console.error('Please provide SESSION_COOKIE env variable');
    return;
  }

  if (!day) {
    console.error(`
      Please provide day as argument. 
      Example:
      
      bun run init.js [day number]
    `);
    return;
  }

  if (day === '--help' || day === '-h') {
    console.log(`
    \x1b[31m\x1b[1m
     _____            _      ___ ____  
    |  __ \\          (_)    / _ \\___ \\ 
    | |__) |   _  ___ _ _ _| (_) |__) |
    |  _  / | | |/ __| | '_ \\__, |__ < 
    | | \\ \\ |_| | (__| | | | |/ /___) |
    |_|  \\_\\__,_|\\___|_|_| |_/_/|____/ 
    \x1b[0m
    and Argeento presents:

    \x1b[32m🎄🎅 Advent of Code 2024 🎅🎄\x1b[0m

    \x1b[1mUsage:\x1b[0m
    bun run init.js [day number]

    \x1b[1mOptions:\x1b[0m
    --help, -h    Show this help message

    \x1b[1mExample:\x1b[0m
    bun run init.js 1

    \x1b[33mHappy coding and good luck!\x1b[0m
    `);
    return;
  }

  console.log('Initializing...');

  createDirectory(day).then(() => {
    console.log('Creating input file...');
    createInputFile(day);
  }).catch((err) => {
    console.error(err);
  });
}

init(process.argv[2]);
