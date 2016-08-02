// @flow

const fetch = require('node-fetch');

module.exports = class GithubNotification {

    static getAll(): Promise<Array<GithubNotification>> {
        return fetch(`https://api.github.com/notifications?access_token=${process.env.GITHUB_TOKEN}`)
            .then((response) => response.json());
    }

};
