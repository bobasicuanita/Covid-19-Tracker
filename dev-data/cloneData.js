const NodeGit = require('nodegit');
const path = require('path');

const cloneData = async () => {
    const cloneUrl = 'https://github.com/CSSEGISandData/COVID-19.git';

    const localPath = path.join(__dirname, 'tmp');

    const cloneOptions = {};

    const cloneRepository = NodeGit.Clone(cloneUrl, localPath, cloneOptions);

    const errorAndAttemptOpen = () => {
        return NodeGit.Repository.open(localPath);
    };

    console.log(`Cloning ${cloneUrl} repository...`);

    await cloneRepository.catch(errorAndAttemptOpen).then((repository) => {
        console.log('Cloning has successfully completed!');
        // console.log('Is the repository bare? %s', Boolean(repository).isBare());
    });
};

module.exports.cloneData = cloneData;