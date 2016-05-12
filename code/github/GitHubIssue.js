// @flow

const _ = require('lodash');
const URL = require('url');

class GitHubIssue {

    title: string;
    body: string;

    static search(
            query: string,
            sort: "comments" | "created" | "updated",
            order: "asc" | "desc"
    ): AsyncIterator<GitHubIssue> {
        return fetchIssues('search/issues', {q: query, sort: sort, order: order});
    }

    constructor(options: Serialized) {
        this.title = options.title;
        this.body = options.body;
    }

}

module.exports = GitHubIssue;

type Serialized = {
    title: string;
    body: string;
}

function fetchIssues(pathname, query): AsyncIterator<GitHubIssue> {
    const pages = [];

    function fetchIssue(index, pathname, query) {
        const pageIndex = Math.floor(index / ISSUES_PER_PAGE);
        pages[pageIndex] = pages[pageIndex] || fetchIssuesPage(pageIndex, pathname, query);

        return pages[pageIndex].then((page) => {
            if (index < page.total_count) {
                return {
                    value: new GitHubIssue(page.items[index % ISSUES_PER_PAGE]),
                    done: false,
                    next: () => fetchIssue(index + 1, pathname, query)
                };

            } else {
                return {
                    value: null,
                    done: true,
                    next: () => fetchIssue(index, pathname, query)
                };
            }
        });
    }

    return {
        next: () => fetchIssue(0, pathname, query),
        done: false,
        value: null
    };

}

const ISSUES_PER_PAGE = 100;

function fetchIssuesPage(pageIndex, pathname, query) {
    const url = URL.format({
        protocol: 'https',
        hostname: 'api.github.com',
        pathname: pathname,
        query: _.extend({
            access_token: process.env['GITHUB_ACCESS_TOKEN'],
            page: pageIndex,
            per_page: ISSUES_PER_PAGE
        }, query)
    });

    return fetch(url, {headers: {'User-Agent': 'Fastidious'}}).then((response) => response.json());
}
