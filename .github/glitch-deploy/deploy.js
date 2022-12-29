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


const listProject = `https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/jolly-river-echidna|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/loud-marmalade-line|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/amenable-gabby-muskmelon|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/holly-foggy-fibula|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/calico-reinvented-shadow|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/chalk-salt-verse|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/exultant-rare-fabrosaurus|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/tested-proximal-macaroon|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/flying-sumptuous-clave|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/miniature-bronze-visage|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/internal-gregarious-inch|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/patch-elderly-servant|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/raspy-balanced-windscreen|https://939862c9-7eed-4fc4-8d59-96f5db421e12@api.glitch.com/git/stone-tremendous-acoustic`.trim().split('|');

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