// @flow

const URL = require('url');
const {EventEmitter} = require('events');
const AsyncArray = require('../core/util/AsyncArray');

class GitHubIssue extends EventEmitter {

    title: string;
    body: string;
    id: number;

    static search(
            query: string,
            sort: "comments" | "created" | "updated",
            order: "asc" | "desc"
    ): AsyncArray<GitHubIssue> {
        return fetchIssues('search/issues', {q: query, sort: sort, order: order});
    }

    constructor(options: Serialized) {
        super();
        this.title = options.title;
        this.body = options.body;
        this.id = options.id;
    }

    get isRead(): boolean {
        return JSON.parse(localStorage.getItem(this.localStorageKey) || 'false');
    }

    set isRead(value: boolean) {
        this.emit('change');
        localStorage.setItem(this.localStorageKey, JSON.stringify(value));
    }

    get localStorageKey(): string {
        return JSON.stringify(['kallax', 'GitHubIssue', this.id]);
    }

}

module.exports = GitHubIssue;

type Serialized = {
    title: string;
    body: string;
    id: number;
}

const ISSUES_PER_PAGE = 100;

function fetchIssues(pathname, query): AsyncArray<GitHubIssue> {
    return new AsyncArray((callback) => {
        const pages = [fetchIssuesPage(0, pathname, query)];
        callback(null, (index, callback) => {
            const pageIndex = Math.floor(index / ISSUES_PER_PAGE);
            pages[pageIndex] = pages[pageIndex] || fetchIssuesPage(pageIndex, pathname, query);
            pages[pageIndex].then((page) => {
                callback(null, new GitHubIssue(page.items[index % ISSUES_PER_PAGE]));
            }, (error: Error) => callback(error, (null: any)));
        });
    });
}

function fetchIssuesPage(pageIndex, pathname, query) {
    const url = URL.format({
        protocol: 'https',
        hostname: 'api.github.com',
        pathname: pathname,
        query: Object.assign({}, {
            access_token: process.env['GITHUB_ACCESS_TOKEN'],
            page: pageIndex,
            per_page: ISSUES_PER_PAGE
        }, query)
    });

    return fetch(url, {headers: {'User-Agent': 'Fastidious'}}).then((response) => response.json());
}
