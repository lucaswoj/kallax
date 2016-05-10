// @flow

const fetch = require('node-fetch');
const _ = require('lodash');
const URL = require('url');

const PER_PAGE = 100;

module.exports = class GitHubIssue {

    title: string;
    body: string;

    static search(
            query: string,
            sort: "comments" | "created" | "updated",
            order: "asc" | "desc"
    ): Promise<Array<GitHubIssue>> {
        return this.fetch('search/issues', {q: query, sort: sort, order: order});
    }

    static fetch(pathname, query) {

        const firstPagePromise = this.fetchPage(0, pathname, query);

        return firstPagePromise.then((firstPage) => {

            const count = firstPage.total_count;
            const pageCount = Math.ceil(count / PER_PAGE);

            const pages = _.range(0, pageCount).map((i) => {
                return i === 0 ? firstPagePromise : this.fetchPage(i, pathname, query);
            });

            return _.range(0, count).map((i) => {
                return pages[Math.floor(i / PER_PAGE)].then((page) => {
                    return new GitHubIssue(page.items[i % PER_PAGE]);
                });
            });

        });
    }

    static fetchPage(page, pathname, query) {

        const url = URL.format({
            protocol: 'https',
            hostname: 'api.github.com',
            pathname: pathname,
            query: _.extend({
                access_token: process.env['GITHUB_ACCESS_TOKEN'],
                page: page,
                per_page: PER_PAGE
            }, query)
        });

        return fetch(url, {headers: {'User-Agent': 'Fastidious'}})
            .then((response) => response.json());

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
