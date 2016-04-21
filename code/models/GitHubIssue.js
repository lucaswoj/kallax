// @flow

const querystring = require('querystring');
const fetch = require('node-fetch');

module.exports = class GitHubIssue {

    title: string;
    body: string;

    static search(
            query: string,
            sort: "comments" | "created" | "updated",
            order: "asc" | "desc"
    ): Promise<Array<GitHubIssue>> {

        const url = 'https://api.github.com/search/issues?' + querystring.stringify({
            access_token: process.env['GITHUB_ACCESS_TOKEN'],
            q: query,
            sort: sort,
            order: order
        });

        return (
            fetch(url, {
                headers: {
                    'User-Agent': 'Fastidious'
                }
            })
            .then((response) => response.json())
            .then((response) =>
                response.items.map((serialized: Serialized) =>
                    new GitHubIssue(serialized)
                )
            )
        );
    }

    constructor(options: Serialized) {
        this.title = options.title;
        this.body = options.body;
    }

};

type Serialized = {
    title: string;
    body: string;
}
