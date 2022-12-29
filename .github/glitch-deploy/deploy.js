const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/resolute-aback-delphinium|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/candy-season-reward|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/pinto-nickel-colt|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/desert-creative-measure|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/towering-pouncing-paperback|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/chill-odd-origami|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/phrygian-olivine-twist|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/polar-extreme-iron|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/pointy-shy-cyclamen|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/humane-volcano-steam|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/believed-jumbled-attic|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/rigorous-rough-squid|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/glossy-oceanic-ankle|https://b8c2fdf4-b5c7-4cba-a563-05b73bcf8e8d@api.glitch.com/git/shore-twilight-xenoposeidon`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();